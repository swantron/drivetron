import type { StateRules } from "./types";

/** Source: Rhode Island DMV "New License Permits" (graduated licensing for persons under 18). */
export const rhodeIsland: StateRules = {
  code: "RI",
  slug: "rhode-island",
  name: "Rhode Island",
  program: "graduated licensing",
  permitName: "limited instruction permit",
  // DMV: "a minimum of 50 hours of driving experience with a supervising driver with 10 of those hours at night"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // DMV: "A road test may not be given until the permit is held for six months"
  holdMonths: 6,
  holdExtraDays: 0,
  // DMV: "valid for one year or until the applicant turns 18, whichever is greater" — not a fixed term
  permitValidMonths: null,
  supervisor: "a licensed supervising driver, seated beside the teen in the front seat",
  // DMV doesn't say when "night" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Rhode Island's 50 hours include 10 at night.",
  certification: {
    label: "the parent's 50-hour affidavit",
    url: "https://www.dmv.ri.gov/licenses-permits-ids/permits-tests/new-license-permits",
  },
  logAtTest:
    "Rhode Island doesn't ask for the log itself. A parent or guardian signs an affidavit that the teen completed at least 50 hours with a supervising driver, 10 at night, for the limited provisional license. Keep the printed log as the record behind that affidavit.",
  formGuide: {
    title: "Rhode Island's 50-hour parent affidavit",
    steps: [
      "A parent or guardian signs an affidavit that the teen completed at least 50 hours of driving with a supervising driver, 10 at night.",
      "It's presented for the limited provisional license, with the road test, after six months on the permit with no motor vehicle violations.",
      "Check Drivetron's total and night hours before signing.",
    ],
  },
  // Search Console, Nov 2026: "provisional license ri", "ri provisional license rules" and the like
  nextLicense: {
    name: "provisional license",
    stage: 1,
    summary: "Unsupervised 5 a.m. to 1 a.m., one passenger under 21 for the first year; after 6 months on the permit and 50 hours, 10 at night.",
  },
  notAffiliatedWith: "the State of Rhode Island or the Rhode Island Division of Motor Vehicles (DMV)",
  defaultLocation: { lat: 41.824, lng: -71.4128 },
  stages: [
    {
      title: "Step 1: Limited instruction permit",
      points: [
        "From 16, after the 33-hour driver education course (online courses aren't accepted) and the knowledge exam; a parent or guardian signs the application.",
        "Hold it at least six months before the road test.",
      ],
    },
    {
      title: "Step 2: Limited provisional license",
      points: [
        "After six violation-free months on the permit, the road test, and the 50-hour affidavit (10 at night).",
        "Unsupervised from 5 a.m. to 1 a.m. Outside those hours, only to or from work, a volunteer fire, rescue or EMS activity (members only), or, from 4 to 5 a.m., between home and a school sports activity the school doesn't provide transportation for.",
        "Any time with a supervising driver seated beside the teen in the front seat.",
        "First 12 months: no more than one passenger under 21, not counting immediate family or household members.",
        "Everyone in the car wears a seat belt (or the right child restraint), and the teen carries the license.",
      ],
    },
    {
      title: "Step 3: Full license",
      points: ["At 18, or from 17 after 12 months on the provisional license with no violations in the last 6."],
    },
  ],
  sources: [
    { label: "Rhode Island DMV: New License Permits", url: "https://www.dmv.ri.gov/licenses-permits-ids/permits-tests/new-license-permits" },
  ],
  verified: "2026-11-24",
};
