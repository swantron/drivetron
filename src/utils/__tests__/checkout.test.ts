import { createHmac } from "node:crypto";
import { clientReference, parseCheckout, verifyStripeSignature, type CheckoutSession } from "../../../functions/src/checkout";

const SECRET = "whsec_test";
const sign = (body: string, t: number, secret = SECRET) =>
  `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")}`;

describe("verifyStripeSignature", () => {
  const body = '{"id":"evt_1"}';
  const now = 1_800_000_000;

  it("accepts a fresh, correctly signed body", () => {
    expect(verifyStripeSignature(body, sign(body, now), SECRET, now + 10)).toBe(true);
  });

  it("accepts when any of several v1 signatures matches (secret rotation)", () => {
    const header = `t=${now},v1=${"0".repeat(64)},${sign(body, now).split(",")[1]}`;
    expect(verifyStripeSignature(body, header, SECRET, now)).toBe(true);
  });

  it("rejects a tampered body, the wrong secret, a stale timestamp, or no header", () => {
    expect(verifyStripeSignature('{"id":"evt_2"}', sign(body, now), SECRET, now)).toBe(false);
    expect(verifyStripeSignature(body, sign(body, now, "whsec_other"), SECRET, now)).toBe(false);
    expect(verifyStripeSignature(body, sign(body, now), SECRET, now + 301)).toBe(false);
    expect(verifyStripeSignature(body, undefined, SECRET, now)).toBe(false);
    expect(verifyStripeSignature(body, "garbage", SECRET, now)).toBe(false);
    expect(verifyStripeSignature(body, sign(body, now), "", now)).toBe(false);
  });
});

describe("parseCheckout", () => {
  const expected = { paymentLinkId: "plink_unlock", priceCents: 999 };
  const paid: CheckoutSession = {
    id: "cs_1",
    mode: "payment",
    payment_status: "paid",
    payment_link: "plink_unlock",
    client_reference_id: clientReference("Fam1lyId", "k3x9a0"),
    amount_total: 999,
    currency: "usd",
  };

  it("unlocks the learner named in the reference", () => {
    expect(parseCheckout(paid, expected)).toEqual({ ok: true, familyId: "Fam1lyId", learnerId: "k3x9a0", amount: 999, currency: "usd" });
    expect(parseCheckout({ ...paid, client_reference_id: "abc-primary" }, expected)).toMatchObject({ ok: true, learnerId: "primary" });
  });

  it("compares in USD when Adaptive Pricing charged another currency", () => {
    const cad = { ...paid, currency: "cad", amount_total: 1399 };
    expect(parseCheckout({ ...cad, currency_conversion: { amount_total: 999, source_currency: "usd" } }, expected)).toMatchObject({
      ok: true,
      amount: 999,
      currency: "usd",
    });
    expect(parseCheckout({ ...cad, currency_conversion: { amount_total: 500, source_currency: "usd" } }, expected).ok).toBe(false);
    expect(parseCheckout(cad, expected).ok).toBe(false);
  });

  it("ignores other sales, unpaid sessions, short amounts and bad references", () => {
    expect(parseCheckout({ ...paid, payment_link: "plink_other" }, expected).ok).toBe(false);
    expect(parseCheckout({ ...paid, payment_link: null }, expected).ok).toBe(false);
    expect(parseCheckout({ ...paid, payment_status: "unpaid" }, expected).ok).toBe(false);
    expect(parseCheckout({ ...paid, mode: "subscription" }, expected).ok).toBe(false);
    expect(parseCheckout({ ...paid, amount_total: 500 }, expected).ok).toBe(false);
    expect(parseCheckout({ ...paid, currency: "eur" }, expected).ok).toBe(false);
    for (const ref of [null, "", "nodash", "a-b-c", "../x-y", "fam-lea/rner", `${"a".repeat(41)}-x`]) {
      expect(parseCheckout({ ...paid, client_reference_id: ref }, expected).ok).toBe(false);
    }
  });
});
