import { california } from "./california";
import { montana } from "./montana";
import { ohio } from "./ohio";
import type { StateRules } from "./types";

export type { StateRules, Link } from "./types";

/** Every supported state. Adding one here adds its public page and makes it selectable. */
export const STATES: StateRules[] = [montana, california, ohio];

/** Logs created before multi-state support have no `state`; they're all Montana. */
export const DEFAULT_STATE = "MT";

export function getState(code: string | undefined | null): StateRules {
  return STATES.find((s) => s.code === code) ?? STATES.find((s) => s.code === DEFAULT_STATE)!;
}

export function getStateBySlug(slug: string): StateRules | undefined {
  return STATES.find((s) => s.slug === slug);
}

/** "6 months", or "6 months + 1 day" for a state that adds days. */
export function holdText(r: StateRules): string {
  const months = `${r.holdMonths} month${r.holdMonths === 1 ? "" : "s"}`;
  return r.holdExtraDays ? `${months} + ${r.holdExtraDays} day${r.holdExtraDays === 1 ? "" : "s"}` : months;
}

/** How the app counts night for this state, for footnotes: "sunset to sunrise". */
export function nightRangeText(r: StateRules): string {
  const m = r.nightOffsetMinutes;
  return m ? `${m} minutes after sunset to ${m} minutes before sunrise` : "sunset to sunrise";
}

/**
 * Every official link for a state, for "sources" lists: the sources first, so a link they share with
 * the certification form or practice log keeps the source's descriptive label, then no duplicates.
 */
export function sourceLinks(r: StateRules): { label: string; url: string }[] {
  return [...r.sources, r.certification, ...(r.practiceLog ? [r.practiceLog] : [])].filter(
    (l, i, all) => all.findIndex((x) => x.url === l.url) === i
  );
}

export const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
