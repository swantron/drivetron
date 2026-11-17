import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Pure pieces of the Stripe webhook, kept free of Firebase so they're unit-tested from the root
 * (src/utils/__tests__/checkout.test.ts).
 */

/** Stripe's default tolerance for a signed webhook's timestamp. */
const TOLERANCE_S = 300;

/**
 * Checks a `Stripe-Signature` header (`t=…,v1=…[,v1=…]`) against the raw body, as Stripe documents
 * for verifying signatures by hand: HMAC-SHA256 of `${t}.${body}` with the endpoint's signing secret.
 */
export function verifyStripeSignature(rawBody: string, header: string | undefined, secret: string, nowS: number): boolean {
  if (!header || !secret) return false;
  const parts = header.split(",").map((p) => p.split("=") as [string, string]);
  const t = Number(parts.find(([k]) => k === "t")?.[1]);
  const sigs = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!Number.isFinite(t) || sigs.length === 0 || Math.abs(nowS - t) > TOLERANCE_S) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`, "utf8").digest();
  return sigs.some((s) => {
    const got = Buffer.from(s, "hex");
    return got.length === expected.length && timingSafeEqual(got, expected);
  });
}

/** The fields of a Checkout Session this function reads. */
export interface CheckoutSession {
  id: string;
  mode?: string;
  payment_status?: string;
  payment_link?: string | null;
  client_reference_id?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  /** Set when Adaptive Pricing charged the customer in their own currency; amounts here are in ours */
  currency_conversion?: { amount_total?: number | null; source_currency?: string | null } | null;
  livemode?: boolean;
}

export interface Expected {
  paymentLinkId: string;
  priceCents: number;
}

export type CheckoutResult =
  | { ok: true; familyId: string; learnerId: string; amount: number; currency: string }
  | { ok: false; reason: string };

/** `${familyId}-${learnerId}`: Firestore auto-ids and learner ids (base 36) never contain "-". */
const REF = /^([A-Za-z0-9]{1,40})-([A-Za-z0-9]{1,40})$/;

export function clientReference(familyId: string, learnerId: string): string {
  return `${familyId}-${learnerId}`;
}

/** Decides whether a completed Checkout Session pays for a learner's unlock, and whose. */
export function parseCheckout(s: CheckoutSession, expected: Expected): CheckoutResult {
  if (s.payment_link !== expected.paymentLinkId) return { ok: false, reason: "not the unlock payment link" };
  if (s.mode !== "payment") return { ok: false, reason: `mode ${s.mode}` };
  if (s.payment_status !== "paid") return { ok: false, reason: `payment_status ${s.payment_status}` };
  // With Adaptive Pricing the session is in the customer's currency; compare in USD.
  const amount = s.currency_conversion ? s.currency_conversion.amount_total : s.amount_total;
  const currency = s.currency_conversion ? s.currency_conversion.source_currency : s.currency;
  if (currency !== "usd" || typeof amount !== "number" || amount < expected.priceCents) {
    return { ok: false, reason: `amount ${amount} ${currency}` };
  }
  const m = REF.exec(s.client_reference_id ?? "");
  if (!m) return { ok: false, reason: `client_reference_id ${s.client_reference_id}` };
  return { ok: true, familyId: m[1], learnerId: m[2], amount, currency };
}
