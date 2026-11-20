/** Date helpers with no app imports, safe for small client bundles. Re-exported from "@/utils/progress". */

/**
 * YYYY-MM-DD as a local date. Learner entries aren't shape-checked by the rules, so a missing or
 * malformed value falls back to today rather than an Invalid Date that breaks every calculation.
 */
export function parseLocalDate(ymd: string | undefined | null): Date {
  const m = typeof ymd === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd) : null;
  if (!m) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function addMonths(date: Date, months: number): Date {
  const out = new Date(date);
  const day = out.getDate();
  out.setDate(1);
  out.setMonth(out.getMonth() + months);
  // Clamp Aug 31 + 6 months to Feb 28/29 rather than rolling into March
  const lastDay = new Date(out.getFullYear(), out.getMonth() + 1, 0).getDate();
  out.setDate(Math.min(day, lastDay));
  return out;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
