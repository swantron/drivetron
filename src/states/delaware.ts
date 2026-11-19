import type { StateRules } from "./types";

/** Source: Delaware Code Title 21 §2710 (Level 1 Learner's Permit and Class D license under 18). */
export const delaware: StateRules = {
  code: "DE",
  slug: "delaware",
  name: "Delaware",
  program: "Graduated Driver Licensing",
  permitName: "Level 1 Learner's Permit",
  // §2710(c)(3): "50 hours of driving time, which shall include 10 hours of nighttime driving"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // §2710(c)(3): supervised only for the first 6 months; the 50 hours are certified at the end of that period
  holdMonths: 6,
  holdExtraDays: 0,
  // §2710(c): the permit authorizes driving "for 12 months"
  permitValidMonths: 12,
  // §2710(c)(2): "a properly licensed parent, guardian or a licensed driver at least 25 years of age who has held a Class D license for at least 5 years"
  supervisor:
    "a licensed parent or guardian, or a licensed driver 25 or older who has held a Class D license at least 5 years, beside the driver; no one else in the front",
  // §2710 doesn't say when "nighttime" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Delaware's 50 hours, 10 at night, come in the first six months on the Level 1 permit.",
  certification: {
    label: "the parent's 50-hour certification (21 Del. C. §2710)",
    url: "https://delcode.delaware.gov/title21/c027/sc01/index.html",
  },
  logAtTest:
    "Delaware doesn't ask for the log itself. At the end of the first six months on the Level 1 permit, a parent or guardian signs the state's certification of 50 hours, 10 at night, and submits it to the driver education program; then the teen may drive unsupervised during the day.",
  formGuide: {
    title: "Delaware's 50-hour certification at six months",
    steps: [
      "For the first six months on the Level 1 Learner's Permit, the teen drives only supervised.",
      "At the end of that period, a parent or guardian signs the certification that the teen completed 50 hours, 10 at night, and submits it to the Department of Education-approved driver education program.",
      "Check Drivetron's total and night hours before signing.",
    ],
  },
  notAffiliatedWith: "the State of Delaware or the Delaware Division of Motor Vehicles (DMV)",
  defaultLocation: { lat: 39.1582, lng: -75.5244 },
  stages: [
    {
      title: "Level 1 Learner's Permit: first six months",
      points: [
        "From 16, after an approved driver education course, the written and road tests, and a sponsor's signature.",
        "Supervised only, by a licensed parent or guardian or a licensed driver 25 or older with 5 years on a Class D license, beside you.",
        "No passengers besides the supervisor and one other (with exceptions), for the first 12 months.",
      ],
    },
    {
      title: "Level 1 Learner's Permit: months 7 to 12",
      points: [
        "After the parent's 50-hour certification (10 at night): unsupervised from 6 a.m. to 10 p.m., and supervised from 10 p.m. to 6 a.m. except to and from church, work, or school.",
      ],
    },
    {
      title: "Class D license",
      points: ["After 12 months of driving experience on the permit, if the sponsor doesn't withdraw."],
    },
  ],
  sources: [{ label: "Delaware Code Title 21 §2710", url: "https://delcode.delaware.gov/title21/c027/sc01/index.html" }],
  verified: "2026-11-19",
};
