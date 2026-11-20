import { arizona } from "./arizona";
import { california } from "./california";
import { colorado } from "./colorado";
import { montana } from "./montana";
import { ohio } from "./ohio";
import { florida } from "./florida";
import { georgia } from "./georgia";
import { illinois } from "./illinois";
import { indiana } from "./indiana";
import { maryland } from "./maryland";
import { massachusetts } from "./massachusetts";
import { michigan } from "./michigan";
import { minnesota } from "./minnesota";
import { missouri } from "./missouri";
import { newJersey } from "./newJersey";
import { newYork } from "./newYork";
import { northCarolina } from "./northCarolina";
import { pennsylvania } from "./pennsylvania";
import { southCarolina } from "./southCarolina";
import { tennessee } from "./tennessee";
import { texas } from "./texas";
import { virginia } from "./virginia";
import { washington } from "./washington";
import { wisconsin } from "./wisconsin";
import { alabama } from "./alabama";
import { louisiana } from "./louisiana";
import { kentucky } from "./kentucky";
import { oregon } from "./oregon";
import { oklahoma } from "./oklahoma";
import { connecticut } from "./connecticut";
import { utah } from "./utah";
import { iowa } from "./iowa";
import { nevada } from "./nevada";
import { kansas } from "./kansas";
import { newMexico } from "./newMexico";
import { nebraska } from "./nebraska";
import { idaho } from "./idaho";
import { westVirginia } from "./westVirginia";
import { maine } from "./maine";
import { rhodeIsland } from "./rhodeIsland";
import { delaware } from "./delaware";
import { southDakota } from "./southDakota";
import { northDakota } from "./northDakota";
import { vermont } from "./vermont";
import { wyoming } from "./wyoming";
import { districtOfColumbia } from "./districtOfColumbia";
import { newHampshire } from "./newHampshire";
import { alaska } from "./alaska";
import { mississippi } from "./mississippi";
import { arkansas } from "./arkansas";
import { hawaii } from "./hawaii";
import type { StateRules } from "./types";

export type { StateRules, Link } from "./types";
export { holdText, upperFirst, hoursText, requirementText } from "./text";

/** Every supported state. Adding one here adds its public page and makes it selectable. */
export const STATES: StateRules[] = [montana, california, ohio, texas, pennsylvania, florida, georgia, northCarolina, illinois, newYork, michigan, virginia,
  newJersey, washington, arizona, tennessee, massachusetts, indiana, missouri, maryland,
  wisconsin, colorado, minnesota, southCarolina,
  alabama, louisiana, kentucky, oregon,
  oklahoma, connecticut, utah, iowa,
  nevada, kansas,
  newMexico, nebraska, idaho, westVirginia,
  maine, rhodeIsland,
  delaware, southDakota, northDakota,
  vermont, wyoming, districtOfColumbia,
  newHampshire, alaska,
  mississippi, arkansas, hawaii];

/** Every state, alphabetical, for pickers and lists people scan by name. */
export const STATES_BY_NAME: StateRules[] = [...STATES].sort((a, b) => a.name.localeCompare(b.name));

/** Logs created before multi-state support have no `state`; they're all Montana. */
export const DEFAULT_STATE = "MT";

export function getState(code: string | undefined | null): StateRules {
  return STATES.find((s) => s.code === code) ?? STATES.find((s) => s.code === DEFAULT_STATE)!;
}

export function getStateBySlug(slug: string): StateRules | undefined {
  return STATES.find((s) => s.slug === slug);
}


/** Roughly how many days the hold lasts, for comparing states. */
export const holdDays = (r: StateRules) => Math.round(r.holdMonths * 30.44) + r.holdExtraDays;

/** How the app counts night for this state, for footnotes: "sunset to sunrise". */
export function nightRangeText(r: StateRules): string {
  const m = r.nightOffsetMinutes;
  if (m > 0) return `${m} minutes after sunset to ${m} minutes before sunrise`;
  // A negative offset widens night (Maryland: 30 minutes before sunset to 30 minutes after sunrise)
  if (m < 0) return `${-m} minutes before sunset to ${-m} minutes after sunrise`;
  return "sunset to sunrise";
}

/**
 * Every official link for a state, for "sources" lists: the sources first, so a link they share with
 * the certification form or practice log keeps the source's descriptive label, then no duplicates.
 */
export function sourceLinks(r: StateRules): { label: string; url: string }[] {
  return [...r.sources, ...(r.certification ? [r.certification] : []), ...(r.practiceLog ? [r.practiceLog] : [])].filter(
    (l, i, all) => all.findIndex((x) => x.url === l.url) === i
  );
}

/** "2h a day", for the state's limit on practice that counts; null when it has none. */
export function countLimitText(r: StateRules): string | null {
  if (!r.countLimit) return null;
  const { minutes, per } = r.countLimit;
  const h = minutes / 60;
  return `${Number.isInteger(h) ? `${h}h` : `${minutes}m`} a ${per}`;
}

