/**
 * Message for a failed write. Writes are queued while offline rather than failing, so an error
 * that does arrive almost always means the server refused it — saying "check your connection"
 * would send people looking in the wrong place.
 */
export function writeErrorMessage(e: unknown, fallback = "Couldn't save. Try again."): string {
  const code = (e as { code?: string } | null)?.code;
  if (code === "permission-denied") return "That change wasn't allowed. Reload the app and try again.";
  if (code === "unavailable" || (typeof navigator !== "undefined" && !navigator.onLine)) {
    return "You're offline. Try again when you have signal.";
  }
  return fallback;
}
