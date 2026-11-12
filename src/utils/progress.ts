import type { Drive } from "@/types";
import { REQUIRED_HOLD_MONTHS, REQUIRED_NIGHT_MINUTES, REQUIRED_TOTAL_MINUTES, PERMIT_VALID_MONTHS } from "./montana";

/** Parses YYYY-MM-DD as a local date (not UTC midnight, which is the previous evening in Montana). */
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

export interface Progress {
  totalMinutes: number;
  nightMinutes: number;
  totalRemaining: number;
  nightRemaining: number;
  driveCount: number;
  /** Earliest date the 6-month hold is satisfied */
  holdDate: Date;
  /** Learner license expiry */
  expiryDate: Date;
  /** When the hours will be done at the current pace; null if not enough history */
  projectedHoursDate: Date | null;
  /** Average logged minutes per week since the permit date */
  minutesPerWeek: number;
  hoursDone: boolean;
  /** Hours done and hold passed: ready to take form 21-1600 to the exam station */
  eligible: boolean;
  conditionCounts: Record<string, number>;
  skillCounts: Record<string, number>;
}

export function computeProgress(drives: Drive[], permitDate: string, now: Date = new Date()): Progress {
  const done = drives.filter((d) => d.endedAt !== null);
  const totalMinutes = done.reduce((s, d) => s + d.dayMinutes + d.nightMinutes, 0);
  const nightMinutes = done.reduce((s, d) => s + d.nightMinutes, 0);
  const totalRemaining = Math.max(0, REQUIRED_TOTAL_MINUTES - totalMinutes);
  const nightRemaining = Math.max(0, REQUIRED_NIGHT_MINUTES - nightMinutes);

  const permit = parseLocalDate(permitDate);
  const holdDate = addMonths(permit, REQUIRED_HOLD_MONTHS);
  const expiryDate = addMonths(permit, PERMIT_VALID_MONTHS);

  // Pace from the permit date (or first drive, if logging started later), at least one week.
  const firstDrive = done.reduce((min, d) => Math.min(min, d.startedAt), Infinity);
  const paceStart = Math.max(permit.getTime(), Number.isFinite(firstDrive) ? Math.min(firstDrive, now.getTime()) : now.getTime());
  const weeks = Math.max(1, (now.getTime() - paceStart) / (7 * 86400000));
  const minutesPerWeek = totalMinutes / weeks;

  const hoursDone = totalRemaining === 0 && nightRemaining === 0;
  let projectedHoursDate: Date | null = null;
  if (hoursDone) {
    projectedHoursDate = now;
  } else if (minutesPerWeek > 0 && done.length >= 2) {
    // Night hours can lag behind total; project whichever finishes last at the overall rate,
    // scaling night by the share of driving that has been at night so far.
    const nightShare = totalMinutes > 0 ? nightMinutes / totalMinutes : 0;
    const weeksForTotal = totalRemaining / minutesPerWeek;
    const weeksForNight = nightRemaining === 0 ? 0 : nightShare > 0 ? nightRemaining / (minutesPerWeek * nightShare) : Infinity;
    const weeksNeeded = Math.max(weeksForTotal, weeksForNight);
    if (Number.isFinite(weeksNeeded)) {
      projectedHoursDate = new Date(now.getTime() + weeksNeeded * 7 * 86400000);
    }
  }

  const conditionCounts: Record<string, number> = {};
  const skillCounts: Record<string, number> = {};
  for (const d of done) {
    for (const c of d.conditions) conditionCounts[c] = (conditionCounts[c] ?? 0) + 1;
    for (const s of d.skills) skillCounts[s] = (skillCounts[s] ?? 0) + 1;
  }

  return {
    totalMinutes,
    nightMinutes,
    totalRemaining,
    nightRemaining,
    driveCount: done.length,
    holdDate,
    expiryDate,
    projectedHoursDate,
    minutesPerWeek,
    hoursDone,
    eligible: hoursDone && now.getTime() >= holdDate.getTime(),
    conditionCounts,
    skillCounts,
  };
}

export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase())
    .slice(0, 3)
    .join("");
}
