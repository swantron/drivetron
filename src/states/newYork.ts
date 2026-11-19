import type { StateRules } from "./types";

/**
 * Sources: NY DMV "Complete Pre-Licensing Requirements", "Information for Parents", "Younger Driver
 * Resources" (learner permit restrictions) and "The Graduated License Law and Restrictions for
 * Drivers Under 18"; the Certification of Supervised Driving, MV-262.
 */
export const newYork: StateRules = {
  code: "NY",
  slug: "new-york",
  name: "New York",
  program: "Graduated Driver License (GDL)",
  permitName: "learner permit",
  // DMV: "a minimum of 50 hours of supervised practice driving that includes at least 15 hours of driving after sunset"
  totalMinutes: 50 * 60,
  nightMinutes: 15 * 60,
  // DMV: under 18, "you must wait at least six months from the date you received your learner permit to schedule your road test"
  holdMonths: 6,
  holdExtraDays: 0,
  // DMV gives the junior permit no term in these pages
  permitValidMonths: null,
  // DMV: "accompanied by a driver age 21 or older who has a valid license to operate the vehicle you are driving"
  supervisor: "a licensed driver 21 or older, with a license valid for the vehicle",
  // DMV counts night hours as "after sunset"
  nightDefinition:
    "New York counts the 15 night hours as driving “after sunset”. Drivetron counts from sunset to sunrise at the drive's location.",
  nightOffsetMinutes: 0,
  practiceNote: "New York requires a lot of night driving: 15 of the 50 hours after sunset.",
  certification: {
    label: "the Certification of Supervised Driving (MV-262)",
    url: "https://dmv.ny.gov/document/mv-262",
  },
  logAtTest:
    "New York doesn't ask for the log itself. A parent or guardian signs the Certification of Supervised Driving (MV-262), and the teen hands it to the license examiner at every road test, including retests. Keep the printed log as the record behind that signature.",
  formGuide: {
    form: { label: "NY DMV MV-262 (PDF)", url: "https://dmv.ny.gov/document/mv-262" },
    title: "New York's Certification of Supervised Driving (MV-262)",
    steps: [
      "MV-262 certifies at least 50 hours of supervised practice, 15 of them after sunset. Drivetron's printed log shows the total and the night hours.",
      "A parent or guardian signs it.",
      "Bring it to the road test and give it to the license examiner, every time the teen takes the test.",
    ],
  },
  notAffiliatedWith: "the State of New York or the New York State Department of Motor Vehicles (DMV)",
  defaultLocation: { lat: 42.6526, lng: -73.7562 },
  stages: [
    {
      title: "Step 1: Junior learner permit (Class DJ)",
      points: [
        "From age 16.",
        "Always with a licensed driver 21 or older; where and when a permit holder may drive differs in upstate New York, New York City, and Long Island.",
        "Hold it at least six months before scheduling the road test.",
        "Take the 5-hour Pre-Licensing Course (or a 48-hour high school or college driver education program) before the road test.",
      ],
    },
    {
      title: "Step 2: Junior license (Class DJ)",
      points: [
        "After 50 hours of supervised practice, 15 after sunset, certified by a parent or guardian on MV-262, and passing the road test.",
        "Upstate: unsupervised driving from 5 a.m. to 9 p.m.; from 9 p.m. to 5 a.m. only directly to or from work or a school course, or with a parent, guardian, or driving instructor.",
        "No more than one passenger under 21 outside the immediate family, unless supervised by a parent, guardian, or driving instructor.",
        "New York City: no driving in the five boroughs on a junior license. Long Island: only with a supervising driver, with narrow exceptions.",
        "At 17, a teen who completes a state-approved driver education course can get a senior (Class D) license.",
      ],
    },
  ],
  sources: [
    {
      label: "NY DMV: Complete Pre-Licensing Requirements",
      url: "https://dmv.ny.gov/driver-license/complete-pre-licensing-requirements",
    },
    {
      label: "NY DMV: Information for Parents",
      url: "https://dmv.ny.gov/driver-license/younger-driver/information-for-parents",
    },
    { label: "NY DMV: Younger Driver Resources", url: "https://dmv.ny.gov/driver-license/younger-driver" },
    {
      label: "NY DMV: The Graduated License Law and Restrictions for Drivers Under 18",
      url: "https://dmv.ny.gov/driver-license/younger-driver/the-graduated-license-law",
    },
    { label: "NY DMV MV-262: Certification of Supervised Driving", url: "https://dmv.ny.gov/document/mv-262" },
  ],
  verified: "2026-11-18",
};
