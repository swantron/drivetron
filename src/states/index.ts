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
