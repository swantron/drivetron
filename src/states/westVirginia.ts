import type { StateRules } from "./types";

/** Source: West Virginia DMV "Graduated Driver's Licensing (GDL)". */
export const westVirginia: StateRules = {
  code: "WV",
  slug: "west-virginia",
  name: "West Virginia",
  program: "Graduated Driver's Licensing (GDL)",
  permitName: "Level 1 instruction permit",
  // DMV: "50 hour certification form completed, with 10 of the hours being at night"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // DMV: "Held a Level I permit for six (6) months"
  holdMonths: 6,
  holdExtraDays: 0,
  // DMV: Level 1 expires on the 18th birthday (with a 30-day grace period), not a term from its issue date
  permitValidMonths: null,
  // DMV Level 1: "Must have a licensed driver 21 or over in front seat"
  supervisor: "a licensed driver 21 or older, in the front seat",
  // DMV doesn't say when "night" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "West Virginia's 50 hours include 10 at night, and Level 1 driving is only from 5 a.m. to 10 p.m.",
  certification: {
    label: "the 50-hour certification form (or a Driver Education Card)",
    url: "https://dmv.wv.gov/graduated-drivers-licensing-gdl",
  },
  logAtTest:
    "West Virginia doesn't ask for the log itself. A parent or legal guardian certifies the 50 hours, 10 at night, on the 50-hour certification form for the Level 2 license; a Driver Education Card can take its place.",
  formGuide: {
    title: "West Virginia's 50-hour certification for the Level 2 license",
    steps: [
      "A parent or legal guardian completes the 50-hour certification form for 50 hours of driving, 10 at night. A Driver Education Card can certify it instead.",
      "Check Drivetron's total and night hours before signing.",
      "The teen also needs six months on the Level 1 permit, infraction-free, and the road skills test.",
    ],
  },
  notAffiliatedWith: "the State of West Virginia or the West Virginia Division of Motor Vehicles (DMV)",
  defaultLocation: { lat: 38.3498, lng: -81.6326 },
  stages: [
    {
      title: "Level 1: Instruction permit",
      points: [
        "From 15, after the knowledge test, with a parent's or guardian's signature.",
        "A licensed driver 21 or older in the front seat; driving only from 5 a.m. to 10 p.m.",
        "No more than two non-family passengers besides the supervising adult; no phone use.",
        "Hold it six months, infraction-free.",
      ],
    },
    {
      title: "Level 2: Intermediate license",
      points: [
        "From 16, after six infraction-free months at Level 1, the 50-hour certification (10 at night), and the road skills test.",
        "First six months: no non-family passengers under 20; second six months: no more than one.",
        "Unsupervised from 5 a.m. to 10 p.m.; from 10 p.m. to 5 a.m. only with a supervising adult, or for work, school or religious activities, or emergencies.",
      ],
    },
  ],
  sources: [{ label: "West Virginia DMV: Graduated Driver's Licensing (GDL)", url: "https://dmv.wv.gov/graduated-drivers-licensing-gdl" }],
  verified: "2026-11-19",
};
