export interface Link {
  label: string;
  url: string;
}

/**
 * One state's supervised-practice rules for teen drivers. Everything the app shows or computes
 * for a log comes from here, and every figure must be traceable to an entry in `sources`.
 */
export interface StateRules {
  /** USPS code, stored on the family: "MT" */
  code: string;
  /** Public page path: drivetron.app/montana */
  slug: string;
  name: string;
  /** What the state calls the program: "Graduated Driver Licensing (GDL)" */
  program: string;
  /** What the state calls the permit stage: "learner license" */
  permitName: string;
  totalMinutes: number;
  nightMinutes: number;
  /** Minimum time the permit must be held before the next stage: holdMonths, plus holdExtraDays */
  holdMonths: number;
  /** Days on top of holdMonths, for states that say e.g. "6 months + 1 day" (otherwise 0) */
  holdExtraDays: number;
  /** How long the permit is valid */
  permitValidMonths: number;
  /** Who may supervise, in the state's words */
  supervisor: string;
  /** How the state defines "night", or null when its materials don't */
  nightDefinition: string | null;
  /** What the state asks to practice, shown above the conditions checklist */
  practiceNote: string;
  /** The parent's certification of the hours */
  certification: Link;
  /** The state's own paper log, which the printed log mirrors */
  practiceLog?: Link;
  /** What the state says about bringing the log to the license test, in its words */
  logAtTest?: string;
  /** Agencies named in the "not affiliated with" disclaimer */
  notAffiliatedWith: string;
  /** Fallback for night calculations with no GPS fix: the capital */
  defaultLocation: { lat: number; lng: number };
  /** Plain-language facts for the public page, each from `sources` */
  stages: { title: string; points: string[] }[];
  sources: Link[];
  /** When the figures above were last checked against the sources (YYYY-MM-DD) */
  verified: string;
}
