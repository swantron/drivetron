/**
 * Montana GDL learner-stage requirements (MCA 61-5-132; OPI GDL fact sheet, rev. June 2024):
 * hold the learner license at least 6 months, and log 50 supervised hours, 10 of them at night.
 * The parent certifies this on MVD form 21-1600 at the exam station, and the examiner may ask
 * to see the log.
 */
export const REQUIRED_TOTAL_MINUTES = 50 * 60;
export const REQUIRED_NIGHT_MINUTES = 10 * 60;
export const REQUIRED_HOLD_MONTHS = 6;
/** A learner license is valid for one year */
export const PERMIT_VALID_MONTHS = 12;

/** Fallback when there's no GPS fix and no previous drive location: Helena */
export const DEFAULT_LAT = 46.5891;
export const DEFAULT_LNG = -112.0391;

export const FORM_21_1600_URL =
  "https://mvdmt.gov/wp-content/uploads/2023/10/21-1600-Graduated-Driver-Licensing-Certification.pdf";
export const OPI_LOG_URL =
  "https://opi.mt.gov/Portals/182/Page%20Files/Driver%20Education/TE%20Resources/MT-GDL-Factsheet-Log-2024.pdf";

/** The fact sheet asks for practice "in varied weather, traffic, and road conditions". */
export const CONDITIONS = {
  weather: ["Clear", "Rain", "Snow", "Ice", "Fog", "Wind"],
  road: ["Residential", "City traffic", "Rural", "Highway", "Interstate", "Gravel", "Mountain pass", "Parking lot"],
} as const;

/** Starts with the OPI log's own examples: intersections, full stops, yields, scanning for hazards. */
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
