import type { Drive } from "@/types";
import { getState, type StateRules } from "@/states";
import { isBadWeather } from "@/utils/practice";

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

/**
 * Minutes that count toward the state's hours. With a daily limit (Texas: 2 hours a day), each
 * calendar day, by the drive's local start date, counts up to the limit; night counts first within
 * it, since the parent fills in the state's log and would put the night time on it.
 */
export function countedMinutes(
  done: Drive[],
  dailyLimit?: number
): { totalMinutes: number; nightMinutes: number; weatherMinutes: number } {
  const len = (d: Drive) => d.dayMinutes + d.nightMinutes;
  if (!dailyLimit) {
    return {
      totalMinutes: done.reduce((s, d) => s + len(d), 0),
      nightMinutes: done.reduce((s, d) => s + d.nightMinutes, 0),
      weatherMinutes: done.reduce((s, d) => s + (isBadWeather(d) ? len(d) : 0), 0),
    };
  }
  const days = new Map<string, { total: number; night: number; weather: number }>();
  for (const d of done) {
    const s = new Date(d.startedAt);
    const key = `${s.getFullYear()}-${s.getMonth()}-${s.getDate()}`;
    const day = days.get(key) ?? { total: 0, night: 0, weather: 0 };
    day.total += len(d);
    day.night += d.nightMinutes;
    if (isBadWeather(d)) day.weather += len(d);
    days.set(key, day);
  }
  let totalMinutes = 0;
  let nightMinutes = 0;
  let weatherMinutes = 0;
  for (const day of days.values()) {
    totalMinutes += Math.min(day.total, dailyLimit);
    nightMinutes += Math.min(day.night, dailyLimit);
    weatherMinutes += Math.min(day.weather, dailyLimit);
  }
  return { totalMinutes, nightMinutes, weatherMinutes };
}

export interface Progress {
  /** Minutes that count toward the state's hours (after any daily limit) */
  totalMinutes: number;
  nightMinutes: number;
  /** Driving logged beyond the state's daily limit, which doesn't count (0 without a limit) */
  overDailyLimitMinutes: number;
  totalRemaining: number;
  nightRemaining: number;
  /** Minutes on drives tagged with bad weather, for states that require some (else 0) */
  weatherMinutes: number;
  weatherRemaining: number;
  driveCount: number;
  /** Earliest date the permit has been held long enough (the state's hold period) */
  holdDate: Date;
  /** Learner license expiry */
  /** null when the state gives the permit no term of its own */
  expiryDate: Date | null;
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

export function computeProgress(
  drives: Drive[],
  permitDate: string,
  now: Date = new Date(),
  rules: StateRules = getState(null)
): Progress {
  const REQUIRED_TOTAL_MINUTES = rules.totalMinutes;
  const REQUIRED_NIGHT_MINUTES = rules.nightMinutes;
  const done = drives.filter((d) => d.endedAt !== null);
  const loggedMinutes = done.reduce((s, d) => s + d.dayMinutes + d.nightMinutes, 0);
  const counted = countedMinutes(done, rules.dailyCountMinutes);
  const { totalMinutes, nightMinutes } = counted;
  const weatherMinutes = rules.weatherMinutes ? counted.weatherMinutes : 0;
  const totalRemaining = Math.max(0, REQUIRED_TOTAL_MINUTES - totalMinutes);
  const nightRemaining = Math.max(0, REQUIRED_NIGHT_MINUTES - nightMinutes);
  const weatherRemaining = Math.max(0, (rules.weatherMinutes ?? 0) - weatherMinutes);

  const permit = parseLocalDate(permitDate);
  const holdDate = addMonths(permit, rules.holdMonths);
  holdDate.setDate(holdDate.getDate() + (rules.holdExtraDays ?? 0));
  const expiryDate = rules.permitValidMonths === null ? null : addMonths(permit, rules.permitValidMonths);

  // Pace from the permit date (or first drive, if logging started later), at least one week.
  const firstDrive = done.reduce((min, d) => Math.min(min, d.startedAt), Infinity);
  const paceStart = Math.max(permit.getTime(), Number.isFinite(firstDrive) ? Math.min(firstDrive, now.getTime()) : now.getTime());
  const weeks = Math.max(1, (now.getTime() - paceStart) / (7 * 86400000));
  const minutesPerWeek = totalMinutes / weeks;

  const hoursDone = totalRemaining === 0 && nightRemaining === 0 && weatherRemaining === 0;
  let projectedHoursDate: Date | null = null;
  if (hoursDone) {
    projectedHoursDate = now;
  } else if (minutesPerWeek > 0 && done.length >= 2) {
    // Night hours can lag behind total; project whichever finishes last at the overall rate,
    // scaling night by the share of driving that has been at night so far.
    const nightShare = totalMinutes > 0 ? nightMinutes / totalMinutes : 0;
    const weeksForTotal = totalRemaining / minutesPerWeek;
    const weeksForNight = nightRemaining === 0 ? 0 : nightShare > 0 ? nightRemaining / (minutesPerWeek * nightShare) : Infinity;
    // Bad-weather hours the same way, from the share of driving in bad weather so far.
    const weatherShare = totalMinutes > 0 ? weatherMinutes / totalMinutes : 0;
    const weeksForWeather =
      weatherRemaining === 0 ? 0 : weatherShare > 0 ? weatherRemaining / (minutesPerWeek * weatherShare) : Infinity;
    const weeksNeeded = Math.max(weeksForTotal, weeksForNight, weeksForWeather);
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
    overDailyLimitMinutes: loggedMinutes - totalMinutes,
    totalRemaining,
    nightRemaining,
    weatherMinutes,
    weatherRemaining,
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
