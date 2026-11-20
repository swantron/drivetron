import type { StateRules } from "./types";

/**
 * Wording helpers that don't need the state list, so client components can use them without bundling
 * every state's rules. Re-exported from "@/states".
 */

type HoldFields = Pick<StateRules, "holdMonths" | "holdExtraDays">;
type HoursFields = Pick<StateRules, "totalMinutes" | "nightMinutes" | "weatherMinutes" | "challengingMinutes">;

/** "6 months", or "6 months + 1 day" for a state that adds days. */
export function holdText(r: HoldFields): string {
  // New Hampshire has no permit, so no hold
  if (!r.holdMonths && !r.holdExtraDays) return "none";
  const days = `${r.holdExtraDays} day${r.holdExtraDays === 1 ? "" : "s"}`;
  // A hold counted only in days (Tennessee: 180 days)
  if (!r.holdMonths) return days;
  const months = `${r.holdMonths} month${r.holdMonths === 1 ? "" : "s"}`;
  return r.holdExtraDays ? `${months} + ${days}` : months;
}

export const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "50 hours" rather than "50h", for page titles and prose. */
export const hoursText = (minutes: number) => `${minutes / 60} hour${minutes === 60 ? "" : "s"}`;

/** "50 hours, 10 hours at night": everything the state requires, for titles and the printed sheet. */
export function requirementText(s: HoursFields): string {
  return `${hoursText(s.totalMinutes)}${s.nightMinutes ? `, ${hoursText(s.nightMinutes)} at night` : ""}${s.weatherMinutes ? `, ${hoursText(s.weatherMinutes)} in bad weather` : ""}${s.challengingMinutes ? `, ${hoursText(s.challengingMinutes)} at night or in bad weather` : ""}`;
}
