import type { Family } from "@/types";

/**
 * "Free to start": each learner gets FREE_MINUTES of logged driving free, then a one-time unlock.
 * The unlock is a Stripe Payment Link carrying `${familyId}-${learnerId}`; the stripeWebhook
 * function (functions/src) writes families/{fid}/unlocks/{learnerId} when it's paid.
 *
 * Nothing is charged until NEXT_PUBLIC_STRIPE_PAYMENT_LINK is set at build time.
 */
export const PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "";
export const PAYWALL_ON = PAYMENT_LINK.startsWith("https://");

export const FREE_MINUTES = 10 * 60;
/** "10 hours", for prose */
export const FREE_HOURS_TEXT = `${FREE_MINUTES / 60} hours`;
/** Shown in the app; the charged amount is set on the Payment Link (and checked by the function) */
export const PRICE_LABEL = "$9.99";

/** Logs created before paid unlocks launched (Nov 17, 2026) stay free for good. Never move this later. */
export const FREE_FOREVER_BEFORE = Date.UTC(2026, 10, 18);

export function unlockUrl(familyId: string, learnerId: string): string {
  const url = new URL(PAYMENT_LINK);
  url.searchParams.set("client_reference_id", `${familyId}-${learnerId}`);
  return url.toString();
}

/**
 * Whether this learner needs the unlock before logging more. Enforced in the app, not the rules
 * (rules can't add up drives); it's a fair-use gate for families, not DRM. Logged hours always
 * stay visible and printable.
 */
export function needsUnlock(
  family: Pick<Family, "createdAt">,
  learnerId: string,
  loggedMinutes: number,
  unlocked: ReadonlySet<string>,
  paywallOn = PAYWALL_ON
): boolean {
  if (!paywallOn) return false;
  if (family.createdAt < FREE_FOREVER_BEFORE) return false;
  if (unlocked.has(learnerId)) return false;
  return loggedMinutes >= FREE_MINUTES;
}
