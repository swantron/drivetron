import type { Drive } from "@/types";

/** Conditions to tag on a drive; common to every state. */
export const CONDITIONS = {
  weather: ["Clear", "Rain", "Snow", "Ice", "Fog", "Wind"],
  road: ["Residential", "City traffic", "Rural", "Highway", "Interstate", "Gravel", "Mountain pass", "Parking lot"],
} as const;

/** Weather tags that count as bad weather, for states that require bad-weather hours (Pennsylvania). */
export const BAD_WEATHER: readonly string[] = CONDITIONS.weather.filter((w) => w !== "Clear");

/** A drive counts toward bad-weather hours, whole, when tagged with any weather but Clear. */
export const isBadWeather = (d: Pick<Drive, "conditions">) => d.conditions.some((c) => BAD_WEATHER.includes(c));

/** Starts with the examples on Montana's practice log: intersections, full stops, yields, scanning for hazards. */
export const SKILLS = [
  "Intersections",
  "Full stops",
  "Yielding",
  "Scanning for hazards",
  "Left turns",
  "Lane changes",
  "Merging",
  "Following distance",
  "Roundabouts",
  "Backing up",
  "Parking",
  "Parallel parking",
  "Wildlife awareness",
] as const;
