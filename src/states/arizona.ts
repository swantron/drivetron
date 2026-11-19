import type { StateRules } from "./types";

/**
 * Sources: ADOT MVD "Teen Driver Guide to Class G Permit and License" and Arizona Revised Statutes
 * 28-3174 (Class G licenses).
 */
export const arizona: StateRules = {
  code: "AZ",
  slug: "arizona",
  name: "Arizona",
  program: "Class G graduated license",
  permitName: "graduated instruction permit",
  // A.R.S. 28-3174(A)(3)(c): "at least thirty hours of supervised driving practice and that at least ten ... were at night"
  totalMinutes: 30 * 60,
  nightMinutes: 10 * 60,
  // A.R.S. 28-3174(A)(2) and MVD: "you must hold it for 6 months or until you turn 18"
  holdMonths: 6,
  holdExtraDays: 0,
  // MVD: "The instruction permit is valid for 12 months."
  permitValidMonths: 12,
  // MVD: "You must have a licensed driver 21 years or older in the seat beside you."
  supervisor: "a licensed driver 21 or older, in the seat beside the driver",
  // Neither MVD nor the statute says when "night" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote:
    "Arizona's 30 hours (10 at night) are one of three routes: 20 hours (6 at night) with a defensive driving or traffic survival school course, or an approved driver education program instead of the hours and road test.",
  certification: {
    label: "the parent's written certification of 30 hours (A.R.S. 28-3174)",
    url: "https://www.azleg.gov/ars/28/03174.htm",
  },
  logAtTest:
    "Arizona doesn't ask for the log itself. A custodial parent or guardian certifies the 30 hours, 10 at night, in writing to MVD with the license application. Teens who finish an approved driver education program skip the hours and the road test. Keep the printed log as the record behind the certification.",
  formGuide: {
    title: "Arizona's supervised driving certification for the Class G license",
    steps: [
      "Without a driver education program, a custodial parent or guardian certifies in writing at least 30 hours of supervised practice, 10 at night, and the teen takes the road test.",
      "With a course from a defensive driving school or traffic survival school, the certification is for 20 hours, 6 at night, and the road test is still required.",
      "An MVD-approved driver education program (high school or private) replaces both the hours and the road test.",
      "Parent signatures on the application are witnessed by an MVD agent or a notary, and are required again for the license.",
    ],
  },
  notAffiliatedWith: "the State of Arizona or the Arizona Department of Transportation Motor Vehicle Division (MVD)",
  defaultLocation: { lat: 33.4484, lng: -112.074 },
  stages: [
    {
      title: "Step 1: Graduated instruction permit (Class G)",
      points: [
        "From 15 years 6 months, after the knowledge test (in an office or at home), the vision test, and a parent's or guardian's signed approval.",
        "Drive only with a licensed driver 21 or older beside you.",
        "Valid for 12 months. Hold it six months (from the day it's issued in an office), or until 18.",
      ],
    },
    {
      title: "Step 2: Graduated license (Class G)",
      points: [
        "From 16, after six months on the permit and one of: 30 supervised hours (10 at night) plus the road test; 20 hours (6 at night) with an approved defensive driving or traffic survival course plus the road test; or an approved driver education program.",
        "For the first six months: no driving from midnight to 5 a.m. unless a licensed parent or guardian is beside you, or for school activities, work, religious activities, or a family emergency.",
        "Also for six months: no more than one passenger under 18 unless they're siblings or a licensed parent or guardian is beside you.",
        "Also for six months: no phone use while driving, except emergencies and hands-free navigation.",
      ],
    },
  ],
  sources: [
    {
      label: "ADOT MVD: Teen Driver Guide to Class G Permit and License",
      url: "https://azdot.gov/mvd/services/driver-services/teen-drivers/permit-and-license-requirements",
    },
    { label: "A.R.S. 28-3174: Class G driver licenses; restrictions", url: "https://www.azleg.gov/ars/28/03174.htm" },
  ],
  verified: "2026-11-19",
};
