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
  /** Days on top of holdMonths, for states that say e.g. "6 months + 1 day" (otherwise 0); with holdMonths 0, the whole hold in days (Tennessee: 180) */
  holdExtraDays: number;
  /** How long the permit is valid, or null when the state doesn't give the permit its own term */
  permitValidMonths: number | null;
  /** Who may supervise, in the state's words */
  supervisor: string;
  /** How the state defines "night", or null when its materials don't */
  nightDefinition: string | null;
  /**
   * Night starts this many minutes after sunset and ends this many before sunrise (0 = sunset to
   * sunrise). Negative widens it: Maryland's -30 is 30 minutes before sunset to 30 after sunrise.
   */
  nightOffsetMinutes: number;
  /**
   * Most practice that counts toward the hours per calendar day (Texas: 2 hours a day) or per
   * Sunday-to-Saturday week (North Carolina: 10 hours a week); unset = no limit
   */
  countLimit?: { minutes: number; per: "day" | "week" };
  /** Bad-weather minutes required, counted from drives tagged with bad weather (Pennsylvania: 5 hours); unset = none */
  weatherMinutes?: number;
  /**
   * Minutes required in "challenging" conditions, night or bad weather (Alaska: 10 hours): a drive
   * tagged with bad weather counts whole, any other drive counts its night minutes; unset = none
   */
  challengingMinutes?: number;
  /**
   * No learner's permit (New Hampshire: teens practice from 15½ without one). The log's permit date
   * is then the day practice started, and holdMonths and holdExtraDays are 0.
   */
  noPermit?: boolean;
  /** What the state asks to practice, shown above the conditions checklist */
  practiceNote: string;
  /** The parent's certification of the hours; unset only with noHours */
  certification?: Link;
  /**
   * The state requires no supervised hours (Arkansas, Hawaii): totalMinutes and nightMinutes are 0,
   * there's no certification, and the log is the family's own record of practice. Progress shows
   * what's been driven and the hold, never a target.
   */
  noHours?: boolean;
  /** The state's own paper log, which the printed log mirrors */
  practiceLog?: Link;
  /** What the state says about bringing the log to the license test, in its words */
  logAtTest?: string;
  /**
   * How to fill in the state's form from Drivetron's log, for the public page: a heading that names
   * the form (people search by form number) and steps, each from `sources`
   */
  formGuide?: {
    title: string;
    steps: string[];
    /** The fillable form itself, when the state publishes one (not, say, a guide or a statute) */
    form?: Link;
  };
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
