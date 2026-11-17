/**
 * Remembers, on this device, which learner a supervisor just went to Stripe to unlock, so that when
 * Stripe sends them back to /home?unlocked=1 the app can show that learner and wait for their unlock.
 * Best effort: a payment finished on another device just gets the generic message.
 */
const KEY = "drivetron.pendingUnlock";
/** Older than this, a remembered checkout is stale (abandoned and tried again later, say). */
const MAX_AGE_MS = 6 * 60 * 60 * 1000;

export interface PendingUnlock {
  familyId: string;
  learnerId: string;
  at: number;
}

export function rememberPendingUnlock(familyId: string, learnerId: string, now: number): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ familyId, learnerId, at: now }));
  } catch {
    // Private mode or storage blocked: the return page falls back to the generic message
  }
}

export function readPendingUnlock(now: number): PendingUnlock | null {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? "null") as PendingUnlock | null;
    if (!p || typeof p.familyId !== "string" || typeof p.learnerId !== "string" || now - p.at > MAX_AGE_MS) return null;
    return p;
  } catch {
    return null;
  }
}

export function clearPendingUnlock(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
}
