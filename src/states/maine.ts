import type { StateRules } from "./types";

/** Sources: Maine Revised Statutes Title 29-A §1304 (learner's permits) and §1311 (intermediate license). */
export const maine: StateRules = {
  code: "ME",
  slug: "maine",
  name: "Maine",
  program: "graduated licensing",
  permitName: "learner's permit",
  // §1304(1)(H)(2): "a minimum of 70 hours of driving, including 10 hours of night driving"
  totalMinutes: 70 * 60,
  nightMinutes: 10 * 60,
  // §1304(1)(H)(1): "A period of 6 months has passed from the date the person was issued a learner's permit"
  holdMonths: 6,
  holdExtraDays: 0,
  // §1304(1)(D): "The learner's permit is valid for a period of 2 years."
  permitValidMonths: 24,
  // §1304(1)(E): licensed at least 2 years, 20 or older, in the seat beside the driver
  supervisor: "a licensed driver 20 or older who has held a license at least 2 years, in the seat beside the driver",
  // §1304 doesn't say when "night driving" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Maine asks for 70 hours, including 10 at night.",
  certification: {
    label: "the parent's driving log certification (29-A §1304)",
    url: "https://legislature.maine.gov/statutes/29-A/title29-Asec1304.html",
  },
  logAtTest:
    "Maine requires a parent, stepparent, or guardian to certify the 70 hours, 10 at night, on a form prescribed by the Secretary of State. If the certifier wasn't the main supervising driver, they also give the name and address of the licensed driver who rode along for most of the 70 hours.",
  formGuide: {
    title: "Maine's 70-hour driving log certification",
    steps: [
      "A parent, stepparent, or guardian certifies on the Secretary of State's form that the teen drove at least 70 hours, 10 at night, with a parent, guardian, or licensed driver 20 or older.",
      "If the person certifying wasn't the main supervising driver, they add the name and address of the licensed driver who accompanied the teen for most of the 70 hours. Drivetron's printed log shows who supervised each drive.",
      "The teen can apply for the license six months after the permit was issued.",
    ],
  },
  notAffiliatedWith: "the State of Maine or the Maine Bureau of Motor Vehicles (BMV)",
  defaultLocation: { lat: 44.3106, lng: -69.7795 },
  stages: [
    {
      title: "Step 1: Learner's permit",
      points: [
        "From 15, after driver education and the written exam.",
        "Drive with a licensed driver 20 or older, licensed at least 2 years, beside you.",
        "No handheld phones, even when stopped in traffic.",
        "Valid for 2 years; apply for the license after 6 months.",
      ],
    },
    {
      title: "Step 2: Intermediate license",
      points: [
        "After 6 months on the permit and 70 hours of driving (10 at night).",
        "For 270 days: passengers only from the immediate family unless accompanied by a qualified licensed driver, and no driving from midnight to 5 a.m.",
        "No handheld phones while driving.",
      ],
    },
  ],
  sources: [
    { label: "Maine 29-A §1304: Learner's permits", url: "https://legislature.maine.gov/statutes/29-A/title29-Asec1304.html" },
    { label: "Maine 29-A §1311: Intermediate license", url: "https://legislature.maine.gov/statutes/29-A/title29-Asec1311.html" },
  ],
  verified: "2026-11-19",
};
