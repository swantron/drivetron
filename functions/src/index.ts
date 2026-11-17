import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { defineInt, defineSecret, defineString } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";
import { handleWebhook, type UnlockStore } from "./webhook.js";

initializeApp();

const webhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
/** The Payment Link's id (plink_…), so other sales on the Stripe account are ignored */
const paymentLinkId = defineString("STRIPE_PAYMENT_LINK_ID");
const priceCents = defineInt("UNLOCK_PRICE_CENTS");

/** Firestore behind the webhook's store interface */
const firestoreStore: UnlockStore = {
  async getFamily(familyId) {
    const snap = await getFirestore().doc(`families/${familyId}`).get();
    return { exists: snap.exists, learners: snap.get("learners"), learnerName: snap.get("learnerName") };
  },
  async record(sessionId, payment, unlock) {
    const db = getFirestore();
    const batch = db.batch();
    batch.set(db.doc(`payments/${sessionId}`), { ...payment, at: FieldValue.serverTimestamp() });
    if (unlock) {
      batch.set(db.doc(`families/${payment.familyId}/unlocks/${payment.learnerId}`), {
        sessionId,
        at: FieldValue.serverTimestamp(),
      });
    }
    await batch.commit();
  },
};

/**
 * Stripe → unlock. On a paid Checkout Session from the unlock Payment Link, writes
 * families/{fid}/unlocks/{learnerId}, which only this function can write (see firestore.rules).
 * Every session it acts on is also recorded in payments/{sessionId} for reconciliation and refunds.
 * The logic is in webhook.ts.
 */
export const stripeWebhook = onRequest(
  { secrets: [webhookSecret], region: "us-central1", maxInstances: 2, memory: "256MiB", invoker: "public" },
  async (req, res) => {
    const { status, body } = await handleWebhook(
      { method: req.method, rawBody: req.rawBody?.toString("utf8") ?? "", signature: req.get("stripe-signature") },
      {
        secret: webhookSecret.value(),
        nowS: Math.floor(Date.now() / 1000),
        expected: { paymentLinkId: paymentLinkId.value(), priceCents: priceCents.value() },
      },
      firestoreStore,
      logger
    );
    res.status(status).send(body);
  }
);
