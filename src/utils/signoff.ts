import type { Drive, SignOff } from "@/types";

/**
 * Parent sign-off. A drive is vouched for when the supervising adult named on it logged it
 * themselves, or when a supervising adult confirmed it afterward. Everything else (mostly a teen
 * timing drives on their own phone) waits for a confirmation, and the printed log marks it.
 */
export type Confirmation =
  /** Logged by the supervising adult named on it */
  | "self"
  /** Confirmed by a supervising adult, and unchanged since */
  | "confirmed"
  /** Confirmed, but its times or supervisor changed afterward */
  | "changed"
  /** Not confirmed yet */
  | "pending";

/** The fields a sign-off vouches for. */
function sameAsSigned(d: Drive, s: SignOff): boolean {
  return (
    s.startedAt === d.startedAt &&
    s.endedAt === d.endedAt &&
    s.dayMinutes === d.dayMinutes &&
    s.nightMinutes === d.nightMinutes &&
    s.supervisorUid === d.supervisorUid
  );
}

export function confirmationOf(d: Drive): Confirmation {
  if (d.createdBy === d.supervisorUid) return "self";
  if (!d.signedOff) return "pending";
  return sameAsSigned(d, d.signedOff) ? "confirmed" : "changed";
}

/** A finished drive that a supervising adult still needs to confirm. */
export function needsConfirming(d: Drive): boolean {
  if (d.endedAt === null) return false;
  const c = confirmationOf(d);
  return c === "pending" || c === "changed";
}

/** What a supervising adult writes to confirm a finished drive as it stands now. */
export function signOffFor(d: Drive, by: { uid: string; name: string; initials: string }, at: number): SignOff {
  if (d.endedAt === null) throw new Error("Only a finished drive can be confirmed");
  return {
    uid: by.uid,
    name: by.name,
    initials: by.initials,
    at,
    startedAt: d.startedAt,
    endedAt: d.endedAt,
    dayMinutes: d.dayMinutes,
    nightMinutes: d.nightMinutes,
    supervisorUid: d.supervisorUid,
  };
}
