import type { StateRules } from "./types";

/**
 * Sources: Indiana BMV "Driver Education" page and FAQs, and the Log of Supervised Driving Practice
 * (State Form 54706, R5 / 8-24), required by IC 9-24-3-2.5.
 */
export const indiana: StateRules = {
  code: "IN",
  slug: "indiana",
  name: "Indiana",
  program: "Graduated Driver Licensing",
  permitName: "learner's permit",
  // State Form 54706: "fifty (50) hours of supervised driving practice, ten (10) of which included nighttime driving practice"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // BMV: "You must have a valid learner's permit for 180 days."
  holdMonths: 0,
  holdExtraDays: 180,
  permitValidMonths: null,
  // BMV and State Form 54706, for applicants under 18
  supervisor:
    "a licensed driver 25 or older related to the teen by blood, marriage, or legal status, a licensed spouse 21 or older, or a licensed driver education instructor",
  // State Form 54706 doesn't say when "nighttime" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Indiana's 50 hours include 10 at night, logged on State Form 54706 even after driver education.",
  certification: {
    label: "the Log of Supervised Driving Practice (State Form 54706)",
    url: "https://forms.in.gov/Download.aspx?id=9758",
  },
  // Its columns (date, day and night drive time) are in the printed log.
  practiceLog: {
    label: "BMV Log of Supervised Driving Practice (State Form 54706)",
    url: "https://forms.in.gov/Download.aspx?id=9758",
  },
  logAtTest:
    "Indiana's log (State Form 54706) is required: it lists each drive's date with day and night time, and a parent or guardian signs the affirmation under penalty of perjury. Present it when the teen applies for the license. Every new driver needs it, even after driver education.",
  formGuide: {
    form: { label: "Indiana State Form 54706 (PDF)", url: "https://forms.in.gov/Download.aspx?id=9758" },
    title: "How to fill in Indiana State Form 54706 (Log of Supervised Driving Practice)",
    steps: [
      "Enter each drive's date and its day and night drive time in hours and minutes. Copy them from Drivetron's printed log, where day and night are already split. More than one log sheet can be attached.",
      "The affirmation certifies 50 hours, 10 at night, with a qualifying supervisor: a licensed driver 25 or older related to the teen, a licensed spouse 21 or older, or a driver education instructor.",
      "For a teen under 18, a parent or guardian signs it, under penalty of perjury. Present the log when applying for the license.",
    ],
  },
  notAffiliatedWith: "the State of Indiana or the Indiana Bureau of Motor Vehicles (BMV)",
  defaultLocation: { lat: 39.7684, lng: -86.1581 },
  stages: [
    {
      title: "Step 1: Learner's permit",
      points: [
        "From 15 with driver education: 30 hours of classroom or online instruction done and enrolled in a BMV-licensed behind-the-wheel program.",
        "Drive only with a licensed driver education instructor, a licensed relative 25 or older, or a licensed spouse 21 or older.",
        "Hold it at least 180 days.",
      ],
    },
    {
      title: "Step 2: Probationary license",
      points: [
        "From 16 years 90 days with driver education, or 16 years 270 days without it, after 180 days on the permit.",
        "50 hours of logged supervised driving, 10 at night, on State Form 54706, signed by a parent or guardian.",
        "Pass the driving skills test (BMV-licensed driver training schools can give it).",
      ],
    },
  ],
  sources: [
    { label: "Indiana BMV: Driver Education", url: "https://www.in.gov/bmv/licenses-permits-ids/driver-education/" },
    { label: "Indiana BMV State Form 54706: Log of Supervised Driving Practice", url: "https://forms.in.gov/Download.aspx?id=9758" },
  ],
  verified: "2026-11-19",
};
