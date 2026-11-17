import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { defineInt, defineSecret, defineString } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";
import { parseCheckout, verifyStripeSignature, type CheckoutSession } from "./checkout.js";

initializeApp();

const webhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
/** The Payment Link's id (plink_…), so other sales on the Stripe account are ignored */
const paymentLinkId = defineString("STRIPE_PAYMENT_LINK_ID");
const priceCents = defineInt("UNLOCK_PRICE_CENTS");

/**
 * Stripe → unlock. On a paid Checkout Session from the unlock Payment Link, writes
 * families/{fid}/unlocks/{learnerId}, which only this function can write (see firestore.rules).
 * Every session it acts on is also recorded in payments/{sessionId} for reconciliation and refunds.
 *
 * Replies 2xx to anything it deliberately ignores so Stripe doesn't retry it; 400 to a bad
 * signature; 500 when Firestore fails, so Stripe retries later.
 */
export const stripeWebhook = onRequest(
  { secrets: [webhookSecret], region: "us-central1", maxInstances: 2, memory: "256MiB", invoker: "public" },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("POST only");
      return;
    }
    const raw = req.rawBody?.toString("utf8") ?? "";
    if (!verifyStripeSignature(raw, req.get("stripe-signature"), webhookSecret.value(), Math.floor(Date.now() / 1000))) {
      logger.warn("Rejected webhook: bad signature");
      res.status(400).send("Bad signature");
      return;
    }

    const event = JSON.parse(raw) as { id: string; type: string; data: { object: CheckoutSession } };
    if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
      res.status(200).send("Ignored event type");
      return;
    }

    const session = event.data.object;
    const result = parseCheckout(session, { paymentLinkId: paymentLinkId.value(), priceCents: priceCents.value() });
    if (!result.ok) {
      logger.info("Ignored checkout", { session: session.id, reason: result.reason });
      res.status(200).send("Ignored");
      return;
    }

    const db = getFirestore();
    const familyRef = db.doc(`families/${result.familyId}`);
    try {
      const family = await familyRef.get();
      const learners = (family.get("learners") as Record<string, unknown> | undefined) ?? {};
      // Families from before multi-learner support keep their learner as "primary" until migrated
      const learnerExists = result.learnerId in learners || (result.learnerId === "primary" && !!family.get("learnerName"));
      const record = {
        familyId: result.familyId,
        learnerId: result.learnerId,
        amount: result.amount,
        currency: result.currency,
        livemode: session.livemode ?? false,
        eventId: event.id,
        at: FieldValue.serverTimestamp(),
      };

      const batch = db.batch();
      batch.set(db.doc(`payments/${session.id}`), { ...record, matched: family.exists && learnerExists });
      if (family.exists && learnerExists) {
        batch.set(familyRef.collection("unlocks").doc(result.learnerId), { sessionId: session.id, at: FieldValue.serverTimestamp() });
      } else {
        // Paid for a log that's gone (deleted before paying?). Recorded above; refund from the Stripe dashboard.
        logger.error("Paid checkout for a missing family or learner", { session: session.id, ...result });
      }
      await batch.commit();
      res.status(200).send("OK");
    } catch (e) {
      logger.error("Failed to record unlock", { session: session.id, error: String(e) });
      res.status(500).send("Retry");
    }
  }
);
