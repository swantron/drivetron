import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { handleWebhook, MISSING_LOG_MESSAGE, type FamilySnapshot, type PaymentRecord } from "../../../functions/src/webhook";

const SECRET = "whsec_test";
const NOW = 1_800_000_000;
const config = { secret: SECRET, nowS: NOW, expected: { paymentLinkId: "plink_unlock", priceCents: 999 } };

function signed(event: object) {
  const rawBody = JSON.stringify(event);
  const sig = createHmac("sha256", SECRET).update(`${NOW}.${rawBody}`).digest("hex");
  return { method: "POST", rawBody, signature: `t=${NOW},v1=${sig}` };
}

function paidEvent(ref = "fam1-k3x9a0", type = "checkout.session.completed", id = "evt_1") {
  return {
    id,
    type,
    data: {
      object: {
        id: "cs_1",
        mode: "payment",
        payment_status: "paid",
        payment_link: "plink_unlock",
        client_reference_id: ref,
        amount_total: 999,
        currency: "usd",
        livemode: true,
      },
    },
  };
}

/** An in-memory stand-in for Firestore: documents keyed by path, like the real store writes them */
function fakeStore(families: Record<string, FamilySnapshot>, opts: { failWrites?: boolean } = {}) {
  const docs = new Map<string, unknown>();
  return {
    docs,
    async getFamily(id: string) {
      return families[id] ?? { exists: false };
    },
    async record(sessionId: string, payment: PaymentRecord, unlock: boolean) {
      if (opts.failWrites) throw new Error("unavailable");
      docs.set(`payments/${sessionId}`, payment);
      if (unlock) docs.set(`families/${payment.familyId}/unlocks/${payment.learnerId}`, { sessionId });
    },
  };
}

function fakeLog() {
  const lines: { level: string; msg: string }[] = [];
  const at = (level: string) => (msg: string) => lines.push({ level, msg });
  return { lines, info: at("info"), warn: at("warn"), error: at("error") };
}

const family: FamilySnapshot = { exists: true, learners: { k3x9a0: { name: "Maya" } } };

describe("handleWebhook", () => {
  it("unlocks the learner and records the payment", async () => {
    const store = fakeStore({ fam1: family });
    const res = await handleWebhook(signed(paidEvent()), config, store, fakeLog());
    expect(res.status).toBe(200);
    expect(store.docs.get("families/fam1/unlocks/k3x9a0")).toEqual({ sessionId: "cs_1" });
    expect(store.docs.get("payments/cs_1")).toMatchObject({ familyId: "fam1", learnerId: "k3x9a0", amount: 999, matched: true, livemode: true });
  });

  it("unlocks a legacy family's primary learner", async () => {
    const store = fakeStore({ fam1: { exists: true, learnerName: "Maya" } });
    await handleWebhook(signed(paidEvent("fam1-primary")), config, store, fakeLog());
    expect(store.docs.has("families/fam1/unlocks/primary")).toBe(true);
  });

  it("is idempotent when Stripe delivers the same payment twice, or both completion events", async () => {
    const store = fakeStore({ fam1: family });
    await handleWebhook(signed(paidEvent()), config, store, fakeLog());
    await handleWebhook(signed(paidEvent()), config, store, fakeLog());
    const again = await handleWebhook(signed(paidEvent(undefined, "checkout.session.async_payment_succeeded", "evt_2")), config, store, fakeLog());
    expect(again.status).toBe(200);
    expect([...store.docs.keys()].sort()).toEqual(["families/fam1/unlocks/k3x9a0", "payments/cs_1"]);
  });

  it("records but doesn't unlock when the family or learner is gone, and logs the alert message", async () => {
    const cases: Record<string, FamilySnapshot>[] = [{}, { fam1: { exists: true, learners: { other: {} } } }];
    for (const families of cases) {
      const store = fakeStore(families);
      const log = fakeLog();
      const res = await handleWebhook(signed(paidEvent()), config, store, log);
      expect(res.status).toBe(200);
      expect(store.docs.get("payments/cs_1")).toMatchObject({ matched: false });
      expect([...store.docs.keys()]).toEqual(["payments/cs_1"]);
      expect(log.lines).toContainEqual({ level: "error", msg: MISSING_LOG_MESSAGE });
    }
  });

  it("acknowledges events it ignores without writing", async () => {
    const store = fakeStore({ fam1: family });
    const other = await handleWebhook(signed({ id: "evt_3", type: "charge.refunded", data: { object: { id: "ch_1" } } }), config, store, fakeLog());
    const otherLink = paidEvent();
    otherLink.data.object.payment_link = "plink_other";
    const ignored = await handleWebhook(signed(otherLink), config, store, fakeLog());
    expect([other.status, ignored.status]).toEqual([200, 200]);
    expect(store.docs.size).toBe(0);
  });

  it("rejects bad signatures and non-POSTs", async () => {
    const store = fakeStore({ fam1: family });
    const req = signed(paidEvent());
    expect((await handleWebhook({ ...req, rawBody: req.rawBody.replace("999", "1") }, config, store, fakeLog())).status).toBe(400);
    expect((await handleWebhook({ ...req, method: "GET" }, config, store, fakeLog())).status).toBe(405);
    expect(store.docs.size).toBe(0);
  });

  it("asks Stripe to retry when the write fails", async () => {
    const res = await handleWebhook(signed(paidEvent()), config, fakeStore({ fam1: family }, { failWrites: true }), fakeLog());
    expect(res.status).toBe(500);
  });
});
