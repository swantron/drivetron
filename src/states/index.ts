import { montana } from "./montana";
import type { StateRules } from "./types";

export type { StateRules, Link } from "./types";

/** Every supported state. Adding one here adds its public page and makes it selectable. */
export const STATES: StateRules[] = [montana];

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

export const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
