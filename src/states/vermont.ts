import type { StateRules } from "./types";

/** Source: 23 V.S.A. §607 (junior operator's license). */
export const vermont: StateRules = {
  code: "VT",
  slug: "vermont",
  name: "Vermont",
  program: "junior operator licensing",
  permitName: "learner's permit",
  // §607(a)(3)(B): "at least 40 hours of practice behind the wheel, at least 10 of which was nighttime driving"
  totalMinutes: 40 * 60,
  nightMinutes: 10 * 60,
  // §607(a)(3)(A): "possessed a learner's permit for not less than one year"
  holdMonths: 12,
  holdExtraDays: 0,
  permitValidMonths: null,
  // §607(a)(3)(B): a licensed parent or guardian, a driver education instructor, or a licensed person 25 or older, in the front passenger seat
  supervisor:
    "a licensed parent or guardian, a licensed or certified driver education instructor, or another licensed driver 25 or older, in the front passenger seat",
  // §607 doesn't say when "nighttime" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Vermont's 40 hours include 10 at night, over at least a year on the permit.",
  certification: {
    label: "the DMV's 40-hour practice certification (23 V.S.A. §607)",
    url: "https://legislature.vermont.gov/statutes/section/23/009/00607",
  },
  logAtTest:
    "Vermont requires a DMV form, certified by the teen's licensed parent or guardian, a driver education instructor, or a licensed person 25 or older, showing at least 40 hours of practice, 10 at night. Copy the totals from Drivetron's printed log.",
  formGuide: {
    title: "Vermont's 40-hour practice certification for the junior license",
    steps: [
      "On the DMV's form, a licensed parent or guardian, a driver education instructor, or a licensed person 25 or older certifies at least 40 hours of practice, 10 at night.",
      "All the hours must be with one of those people riding in the front passenger seat. Drivetron's printed log shows who supervised each drive.",
      "The teen also needs a year on the permit and six months with no permit suspension, revocation, or recall.",
    ],
  },
  notAffiliatedWith: "the State of Vermont or the Vermont Department of Motor Vehicles (DMV)",
  defaultLocation: { lat: 44.2601, lng: -72.5754 },
  stages: [
    {
      title: "Step 1: Learner's permit",
      points: [
        "Drive with a licensed parent or guardian, a driver education instructor, or a licensed driver 25 or older in the front passenger seat.",
        "Hold it at least a year.",
      ],
    },
    {
      title: "Step 2: Junior operator's license",
      points: [
        "At 16 or 17, after a year on the permit, a driver education and training course, the driver examination, the 40-hour certification (10 at night), and a parent's written consent.",
        "No permit suspension, revocation, or recall in the six months before licensure.",
      ],
    },
  ],
  sources: [{ label: "23 V.S.A. §607: Junior operator's license", url: "https://legislature.vermont.gov/statutes/section/23/009/00607" }],
  verified: "2026-11-19",
};
