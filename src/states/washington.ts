import type { StateRules } from "./types";

/** Sources: Revised Code of Washington 46.20.055 (instruction permit) and 46.20.075 (intermediate license). */
export const washington: StateRules = {
  code: "WA",
  slug: "washington",
  name: "Washington",
  program: "intermediate license",
  permitName: "instruction permit",
  // RCW 46.20.075(1)(e): "at least 50 hours of driving experience, 10 of which were at night"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // RCW 46.20.075(1)(a): "a valid instruction permit for a period of not less than six months"
  holdMonths: 6,
  holdExtraDays: 0,
  // RCW 46.20.055(4): "valid for one year from the date of issue"
  permitValidMonths: 12,
  // RCW 46.20.055(3)(c) (who rides along) and 46.20.075(1)(e) (who supervises the 50 hours)
  supervisor:
    "a licensed driver with at least five years of driving experience (or a driver training instructor) in the seat beside the driver; the 50 certified hours must be supervised by someone 21 or older licensed at least three years",
  // RCW 46.20.075 doesn't say when "night" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Washington's 50 hours include 10 at night, with a supervisor licensed at least three years.",
  certification: {
    label: "the parent's certification of 50 hours (RCW 46.20.075)",
    url: "https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2046%20%20TITLE/RCW%20%2046%20.%2020%20%20CHAPTER/RCW%20%2046%20.%2020%20.075.pdf",
  },
  logAtTest:
    "Washington doesn't ask for the log itself. A parent, guardian, employer, or responsible adult certifies to the Department of Licensing that the teen has had at least 50 hours, 10 at night, and has no pending traffic citations. Keep the printed log as the record behind that certification.",
  formGuide: {
    title: "Washington's 50-hour certification for the intermediate license",
    steps: [
      "A parent, guardian, employer, or responsible adult certifies that the teen has had at least 50 hours of driving experience, 10 at night, supervised by someone 21 or older who has been licensed at least three years.",
      "The same certification states the teen has no traffic citation pending.",
      "Drivetron's printed log shows the total and night hours, and who supervised each drive, to check before certifying.",
    ],
  },
  notAffiliatedWith: "the State of Washington or the Washington State Department of Licensing (DOL)",
  defaultLocation: { lat: 47.0379, lng: -122.9007 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "From 15½, or from 15 when enrolled in an approved driver training course, after the knowledge test.",
        "A driver training instructor, or a licensed driver with at least five years of experience, sits beside the driver.",
        "No phone use while driving, except to report an emergency or illegal activity.",
        "Valid for one year (one more year can be issued). Hold it at least six months.",
      ],
    },
    {
      title: "Step 2: Intermediate license",
      points: [
        "From 16, after six months on the permit, driver's education, and the licensing exam.",
        "50 hours of driving, 10 at night, certified by a parent, guardian, employer, or responsible adult.",
        "No traffic violations in the six months before applying.",
        "No passengers under 20 outside the immediate family for the first six months; then no more than three.",
        "No driving from 1 to 5 a.m. unless with a licensed driver 25 or older, or for school, religious, or work activities.",
      ],
    },
  ],
  sources: [
    {
      label: "RCW 46.20.055: Instruction permit",
      url: "https://app.leg.wa.gov/RCW/default.aspx?cite=46.20.055",
    },
    {
      label: "RCW 46.20.075: Intermediate license",
      url: "https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2046%20%20TITLE/RCW%20%2046%20.%2020%20%20CHAPTER/RCW%20%2046%20.%2020%20.075.pdf",
    },
  ],
  verified: "2026-11-19",
};
