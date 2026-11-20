import type { Drive } from "@/types";
import { getState, type StateRules } from "@/states";
import { isBadWeather } from "@/utils/practice";
import { addMonths, parseLocalDate } from "@/utils/dates";

export { addMonths, formatDate, parseLocalDate } from "@/utils/dates";



/**
 * Minutes that count toward the state's hours. With a limit (Texas: 2 hours a day; North Carolina:
 * 10 hours a week), each calendar day or Sunday-to-Saturday week, by the drive's local start date,
 * counts up to it; night counts first within it, since the parent fills in the state's log and
 * would put the night time on it.
 */
export function countedMinutes(
  done: Drive[],
  limit?: StateRules["countLimit"]
): { totalMinutes: number; nightMinutes: number; weatherMinutes: number; challengingMinutes: number } {
  const len = (d: Drive) => d.dayMinutes + d.nightMinutes;
  // Night or bad weather (Alaska): a bad-weather drive counts whole, any other its night minutes
  const challenging = (d: Drive) => (isBadWeather(d) ? len(d) : d.nightMinutes);
  if (!limit) {
    return {
      totalMinutes: done.reduce((s, d) => s + len(d), 0),
      nightMinutes: done.reduce((s, d) => s + d.nightMinutes, 0),
      weatherMinutes: done.reduce((s, d) => s + (isBadWeather(d) ? len(d) : 0), 0),
      challengingMinutes: done.reduce((s, d) => s + challenging(d), 0),
    };
  }
  const days = new Map<string, { total: number; night: number; weather: number; challenging: number }>();
  for (const d of done) {
    const s = new Date(d.startedAt);
    // A week is keyed by its Sunday
    if (limit.per === "week") s.setDate(s.getDate() - s.getDay());
    const key = `${s.getFullYear()}-${s.getMonth()}-${s.getDate()}`;
    const day = days.get(key) ?? { total: 0, night: 0, weather: 0, challenging: 0 };
    day.total += len(d);
    day.night += d.nightMinutes;
    if (isBadWeather(d)) day.weather += len(d);
    day.challenging += challenging(d);
    days.set(key, day);
  }
  let totalMinutes = 0;
  let nightMinutes = 0;
  let weatherMinutes = 0;
  let challengingMinutes = 0;
  for (const day of days.values()) {
    totalMinutes += Math.min(day.total, limit.minutes);
    nightMinutes += Math.min(day.night, limit.minutes);
    weatherMinutes += Math.min(day.weather, limit.minutes);
    challengingMinutes += Math.min(day.challenging, limit.minutes);
  }
  return { totalMinutes, nightMinutes, weatherMinutes, challengingMinutes };
}

export interface Progress {
  /** Minutes that count toward the state's hours (after any daily or weekly limit) */
  totalMinutes: number;
  nightMinutes: number;
  /** Driving logged beyond the state's daily or weekly limit, which doesn't count (0 without one) */
  overLimitMinutes: number;
  totalRemaining: number;
  nightRemaining: number;
  /** Minutes on drives tagged with bad weather, for states that require some (else 0) */
  weatherMinutes: number;
  weatherRemaining: number;
  /** Minutes at night or in bad weather, for states that require some (Alaska; else 0) */
  challengingMinutes: number;
  challengingRemaining: number;
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
  const counted = countedMinutes(done, rules.countLimit);
  const { totalMinutes, nightMinutes } = counted;
  const weatherMinutes = rules.weatherMinutes ? counted.weatherMinutes : 0;
  const totalRemaining = Math.max(0, REQUIRED_TOTAL_MINUTES - totalMinutes);
  const nightRemaining = Math.max(0, REQUIRED_NIGHT_MINUTES - nightMinutes);
  const weatherRemaining = Math.max(0, (rules.weatherMinutes ?? 0) - weatherMinutes);
  const challengingMinutes = rules.challengingMinutes ? counted.challengingMinutes : 0;
  const challengingRemaining = Math.max(0, (rules.challengingMinutes ?? 0) - challengingMinutes);

  const permit = parseLocalDate(permitDate);
  const holdDate = addMonths(permit, rules.holdMonths);
  holdDate.setDate(holdDate.getDate() + (rules.holdExtraDays ?? 0));
  const expiryDate = rules.permitValidMonths === null ? null : addMonths(permit, rules.permitValidMonths);

  // Pace from the permit date (or first drive, if logging started later), at least one week.
  const firstDrive = done.reduce((min, d) => Math.min(min, d.startedAt), Infinity);
  const paceStart = Math.max(permit.getTime(), Number.isFinite(firstDrive) ? Math.min(firstDrive, now.getTime()) : now.getTime());
  const weeks = Math.max(1, (now.getTime() - paceStart) / (7 * 86400000));
  const minutesPerWeek = totalMinutes / weeks;

  const hoursDone = totalRemaining === 0 && nightRemaining === 0 && weatherRemaining === 0 && challengingRemaining === 0;
  let projectedHoursDate: Date | null = null;
  if (hoursDone) {
    projectedHoursDate = now;
  } else if (minutesPerWeek > 0 && done.length >= 2) {
    // Night hours can lag behind total; project whichever finishes last at the overall rate,
    // scaling night by the share of driving that has been at night so far.
    const nightShare = totalMinutes > 0 ? nightMinutes / totalMinutes : 0;
    const weeksForTotal = totalRemaining / minutesPerWeek;
    const weeksForNight = nightRemaining === 0 ? 0 : nightShare > 0 ? nightRemaining / (minutesPerWeek * nightShare) : Infinity;
    // Bad-weather hours aren't projected: they wait on the weather, not the pace. The card notes them.
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
    overLimitMinutes: loggedMinutes - totalMinutes,
    totalRemaining,
    nightRemaining,
    weatherMinutes,
    weatherRemaining,
    challengingMinutes,
    challengingRemaining,
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


export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase())
    .slice(0, 3)
    .join("");
}

/**
 * With a daily or weekly limit (Texas, North Carolina), how many of each drive's minutes count.
 * Each day's or week's allowance goes to its drives in the order they were driven. Drives with no
 * limit, or under it, aren't in the map.
 */
export function countedPerDrive(done: Drive[], limit?: StateRules["countLimit"]): Map<string, number> {
  const out = new Map<string, number>();
  if (!limit) return out;
  const used = new Map<string, number>();
  for (const d of [...done].filter((x) => x.endedAt !== null).sort((a, b) => a.startedAt - b.startedAt)) {
    const s = new Date(d.startedAt);
    if (limit.per === "week") s.setDate(s.getDate() - s.getDay());
    const key = `${s.getFullYear()}-${s.getMonth()}-${s.getDate()}`;
    const len = d.dayMinutes + d.nightMinutes;
    const before = used.get(key) ?? 0;
    const counts = Math.max(0, Math.min(len, limit.minutes - before));
    used.set(key, before + len);
    if (counts < len) out.set(d.id, counts);
  }
  return out;
}
