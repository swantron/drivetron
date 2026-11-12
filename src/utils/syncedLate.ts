import type { Drive } from "@/types";

/**
 * A timed drive whose first save reached the server this long after its start. Usually the phone
 * was offline when the timer started (common on rural roads), but it is also what a backdated
 * start looks like, so the parent certifying the hours should see it.
 */
export const LATE_SYNC_MS = 15 * 60 * 1000;

export function syncedLate(d: Drive): boolean {
  const synced = d.syncedAt?.toMillis();
  return !d.manual && synced !== undefined && synced - d.startedAt > LATE_SYNC_MS;
}
