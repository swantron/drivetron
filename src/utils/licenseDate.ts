import type { StateRules } from "@/states/types";
import { addMonths } from "@/utils/dates";

/** The fields the calculator needs, so a page can hand them to the client without every state's full rules */
export type CalcRules = Pick<
  StateRules,
  | "code" | "slug" | "name" | "permitName" | "noPermit" | "noHours" | "holdMonths" | "holdExtraDays" | "permitValidMonths"
  | "totalMinutes" | "nightMinutes" | "weatherMinutes" | "challengingMinutes"
>;

export const calcRules = (s: StateRules): CalcRules => ({
  code: s.code,
  slug: s.slug,
  name: s.name,
  permitName: s.permitName,
  noPermit: s.noPermit,
  noHours: s.noHours,
  holdMonths: s.holdMonths,
  holdExtraDays: s.holdExtraDays,
  permitValidMonths: s.permitValidMonths,
  totalMinutes: s.totalMinutes,
  nightMinutes: s.nightMinutes,
  weatherMinutes: s.weatherMinutes,
  challengingMinutes: s.challengingMinutes,
});

export interface LicenseDateResult {
  /** Earliest date the permit has been held long enough (the permit date itself with no hold) */
  holdDate: Date;
  /** When the supervised hours are done at this pace; null with no hours to do or no pace */
  hoursDate: Date | null;
  /** Hours still to drive (0 in a state with no hours requirement) */
  hoursLeft: number;
  /** The later of the two: the earliest the teen can move up; null when the pace is 0 and hours remain */
  earliest: Date | null;
  /** When the permit runs out, or null when the state gives it no term of its own */
  expiry: Date | null;
  /** The earliest date falls after the permit expires */
  afterExpiry: boolean;
}

/**
 * The earliest date a teen can move to the next license: the state's hold period from the permit
 * date, or the day the supervised hours are done at the given weekly pace, whichever is later.
 * Age minimums aren't in the rules data, so they aren't considered.
 */
export function licenseDate(
  rules: CalcRules,
  permitDate: Date,
  hoursDone: number,
  hoursPerWeek: number,
  today: Date = startOfToday()
): LicenseDateResult {
  const holdDate = addMonths(permitDate, rules.holdMonths);
  holdDate.setDate(holdDate.getDate() + rules.holdExtraDays);
  const expiry = rules.permitValidMonths === null ? null : addMonths(permitDate, rules.permitValidMonths);

  const hoursLeft = rules.noHours ? 0 : Math.max(0, rules.totalMinutes / 60 - Math.max(0, hoursDone || 0));
  // Hours can't be done before the permit, so the clock starts at the later of the two
  const start = new Date(Math.max(permitDate.getTime(), today.getTime()));
  let hoursDate: Date | null = null;
  if (hoursLeft === 0) hoursDate = start;
  else if (hoursPerWeek > 0) {
    hoursDate = new Date(start);
    hoursDate.setDate(hoursDate.getDate() + Math.ceil((hoursLeft / hoursPerWeek) * 7));
  }

  const earliest = hoursDate === null ? null : hoursDate > holdDate ? hoursDate : holdDate;
  return { holdDate, hoursDate, hoursLeft, earliest, expiry, afterExpiry: !!(earliest && expiry && earliest > expiry) };
}

function startOfToday(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
