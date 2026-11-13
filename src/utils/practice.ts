/** Conditions to tag on a drive; common to every state. */
export const CONDITIONS = {
  weather: ["Clear", "Rain", "Snow", "Ice", "Fog", "Wind"],
  road: ["Residential", "City traffic", "Rural", "Highway", "Interstate", "Gravel", "Mountain pass", "Parking lot"],
} as const;

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
