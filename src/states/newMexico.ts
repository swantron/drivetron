import type { StateRules } from "./types";

/** Source: New Mexico MVD "Apply for a Learner's Permit" (the Graduated Driver Licensing stages). */
export const newMexico: StateRules = {
  code: "NM",
  slug: "new-mexico",
  name: "New Mexico",
  program: "Graduated Driver's License",
  permitName: "instructional permit",
  // MVD: "Complete 50 hours of supervised driving practice, including 10 hours at night"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // MVD: "Hold the instructional permit for at least six months"
  holdMonths: 6,
  holdExtraDays: 0,
  permitValidMonths: null,
  // MVD: "Drive with an adult 21 or older who has been licensed for a minimum of 3 years"
  supervisor: "a licensed adult 21 or older who has been licensed at least 3 years",
  // MVD doesn't say when "night" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "New Mexico's 50 hours include 10 at night.",
  certification: {
    label: "the GDL driving log, signed by a parent or guardian",
    url: "https://www.mvd.newmexico.gov/nm-drivers-licenses-ids/drivers-license/apply-for-a-learners-permit/",
  },
  logAtTest:
    "New Mexico accepts any handwritten or typed document that records the driving as the GDL driving log, as long as it shows 50 hours, 10 at night, and a parent or guardian signs it. Drivetron's printed log, signed, is that document.",
  formGuide: {
    title: "New Mexico's GDL driving log for the provisional license",
    steps: [
      "MVD accepts any handwritten or typed document that records the driving as the GDL driving log. Print Drivetron's log: it lists every drive with its day and night minutes and totals.",
      "It must show at least 50 hours behind the wheel, 10 at night, and be signed by a parent or guardian.",
      "Bring it with the driver education Certificate of Completion (including the 3-hour DWI component) when applying for the provisional license.",
    ],
  },
  notAffiliatedWith: "the State of New Mexico or the New Mexico Motor Vehicle Division (MVD)",
  defaultLocation: { lat: 35.687, lng: -105.9378 },
  stages: [
    {
      title: "Stage 1: Instructional permit",
      points: [
        "With a state-approved driver education program (including a 3-hour DWI component) completed or underway; a parent or guardian signs the application.",
        "Drive with an adult 21 or older licensed at least 3 years.",
        "Hold it at least six months, with a clean record for the 90 days before Stage 2.",
      ],
    },
    {
      title: "Stage 2: Provisional license",
      points: [
        "From 15½, after Stage 1, driver education, the signed 50-hour log (10 at night), and the road skills exam.",
        "Hold it at least 12 months.",
        "No more than one passenger under 21 outside the immediate family unless a licensed driver 21 or older is along.",
        "No driving from midnight to 5 a.m. unless with a licensed driver 21 or older.",
      ],
    },
  ],
  sources: [
    {
      label: "New Mexico MVD: Apply for a Learner's Permit",
      url: "https://www.mvd.newmexico.gov/nm-drivers-licenses-ids/drivers-license/apply-for-a-learners-permit/",
    },
  ],
  verified: "2026-11-19",
};
