import { parseCheckout, verifyStripeSignature, type CheckoutSession, type Expected } from "./checkout.js";

/**
 * The Stripe webhook's logic, apart from Firebase so it's unit-tested from the root
 * (src/utils/__tests__/webhook.test.ts). index.ts adapts Firestore and the logger to these interfaces.
 */

export interface FamilySnapshot {
  exists: boolean;
  learners?: Record<string, unknown>;
  /** Set on families from before multi-learner support, whose learner is "primary" */
  learnerName?: unknown;
}

export interface PaymentRecord {
  familyId: string;
  learnerId: string;
  amount: number;
  currency: string;
  livemode: boolean;
  eventId: string;
  matched: boolean;
}

export interface UnlockStore {
  getFamily(familyId: string): Promise<FamilySnapshot>;
  /** Writes payments/{sessionId}, and families/{fid}/unlocks/{learnerId} when unlock is true, atomically */
  record(sessionId: string, payment: PaymentRecord, unlock: boolean): Promise<void>;
}

export interface Log {
  info(msg: string, data?: object): void;
  warn(msg: string, data?: object): void;
  error(msg: string, data?: object): void;
}

/**
 * The message logged when someone paid but the log is gone. A Cloud Monitoring alert matches this
 * text (see README "Payments"), so change both together.
 */
export const MISSING_LOG_MESSAGE = "Paid checkout for a missing family or learner";

const HANDLED = new Set(["checkout.session.completed", "checkout.session.async_payment_succeeded"]);

/**
 * Replies 2xx to anything it deliberately ignores so Stripe doesn't retry it; 400 to a bad
 * signature; 500 when the store fails, so Stripe retries later. Writes are keyed by the session id,
 * so a retried or duplicate event rewrites the same documents.
 */
export async function handleWebhook(
  req: { method: string; rawBody: string; signature: string | undefined },
  config: { secret: string; nowS: number; expected: Expected },
  store: UnlockStore,
  log: Log
): Promise<{ status: number; body: string }> {
  if (req.method !== "POST") return { status: 405, body: "POST only" };
  if (!verifyStripeSignature(req.rawBody, req.signature, config.secret, config.nowS)) {
    log.warn("Rejected webhook: bad signature");
    return { status: 400, body: "Bad signature" };
  }

  const event = JSON.parse(req.rawBody) as { id: string; type: string; data: { object: CheckoutSession } };
  if (!HANDLED.has(event.type)) return { status: 200, body: "Ignored event type" };

  const session = event.data.object;
  const result = parseCheckout(session, config.expected);
  if (!result.ok) {
    log.info("Ignored checkout", { session: session.id, reason: result.reason });
    return { status: 200, body: "Ignored" };
  }

  try {
    const family = await store.getFamily(result.familyId);
    const learners = family.learners ?? {};
    // Families from before multi-learner support keep their learner as "primary" until migrated
    const learnerExists = result.learnerId in learners || (result.learnerId === "primary" && !!family.learnerName);
    const matched = family.exists && learnerExists;
    await store.record(
      session.id,
      {
        familyId: result.familyId,
        learnerId: result.learnerId,
        amount: result.amount,
        currency: result.currency,
        livemode: session.livemode ?? false,
        eventId: event.id,
        matched,
      },
      matched
    );
    if (!matched) {
      // Paid for a log that's gone (deleted before paying?). Recorded above; refund from the Stripe dashboard.
      log.error(MISSING_LOG_MESSAGE, { session: session.id, familyId: result.familyId, learnerId: result.learnerId });
    }
    return { status: 200, body: "OK" };
  } catch (e) {
    log.error("Failed to record unlock", { session: session.id, error: String(e) });
    return { status: 500, body: "Retry" };
  }
}
