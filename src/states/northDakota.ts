import type { StateRules } from "./types";

/** Source: North Dakota DOT "How to Apply for a Learner's Permit" (licensing requirements by age). */
export const northDakota: StateRules = {
  code: "ND",
  slug: "north-dakota",
  name: "North Dakota",
  program: "teen driver licensing",
  permitName: "learner's permit",
  // NDDOT, ages 14-15: "Must complete 50 hours of practice driving in variable conditions."
  totalMinutes: 50 * 60,
  // North Dakota sets no separate night-hours requirement
  nightMinutes: 0,
  // NDDOT, ages 14-15: "Must hold a valid learner's permit for at least one year"
  holdMonths: 12,
  holdExtraDays: 0,
  permitValidMonths: null,
  supervisor: "a supervising driver in the front seat",
  nightDefinition:
    "North Dakota doesn't set a night-hours requirement, but asks for practice “in variable conditions”. Drivetron still splits each drive into day and night (sunset to sunrise).",
  nightOffsetMinutes: 0,
  practiceNote: "North Dakota asks for 50 hours in variable conditions: day and night, different roads and weather.",
  certification: {
    label: "the 50 hours of practice driving (NDDOT)",
    url: "https://www.dot.nd.gov/node/5507",
  },
  logAtTest:
    "For teens who start at 14 or 15, North Dakota requires 50 hours of practice driving in variable conditions before the restricted license. Keep the printed log as the record of those hours.",
  formGuide: {
    title: "North Dakota's 50 hours for teens who start at 14 or 15",
    steps: [
      "Teens who get the permit at 14 or 15 need 50 hours of practice in variable conditions, a driver's education course, and a year on the permit. Drivetron's printed log shows the hours and the conditions tagged on each drive.",
      "Teens who get the permit at 16 or 17 need six months on the permit and the road test, without the 50-hour requirement.",
      "A parent or guardian signs the sponsorship (SFN 62123) before the permit is issued, taking on financial liability.",
    ],
  },
  notAffiliatedWith: "the State of North Dakota or the North Dakota Department of Transportation (NDDOT)",
  defaultLocation: { lat: 46.8083, lng: -100.7837 },
  stages: [
    {
      title: "Step 1: Learner's permit",
      points: [
        "After the knowledge test and vision screening, with a sponsor's signature for teens under 18.",
        "A supervising driver in the front seat; no electronic devices while driving.",
        "Starting at 14 or 15: only in a vehicle owned by a parent, guardian, grandparent, sibling, aunt, or uncle (or a dual-control driver training car).",
      ],
    },
    {
      title: "Step 2: License",
      points: [
        "Starting at 14 or 15: a year on the permit, driver's education, 50 hours of practice, and the road test. The restricted license bars driving from sunset or 9 p.m. (whichever is later) to 5 a.m. unless with a licensed driver or to or from work, school, or religious activities.",
        "Starting at 16 or 17: six months on the permit and the road test.",
      ],
    },
  ],
  sources: [
    { label: "NDDOT: How to Apply for a Learner's Permit", url: "https://www.dot.nd.gov/node/5507" },
    { label: "NDDOT SFN 62123: Application for Minor Sponsorship", url: "https://www.dot.nd.gov/forms/sfn62123.pdf" },
  ],
  verified: "2026-11-19",
};
