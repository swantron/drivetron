import type { StateRules } from "./types";

/** Source: WYDOT "Learner Permits" (regular learner's permit and the intermediate permit). */
export const wyoming: StateRules = {
  code: "WY",
  slug: "wyoming",
  name: "Wyoming",
  program: "graduated driver licensing",
  permitName: "learner's permit",
  // WYDOT: "50 actual driving hours behind the wheel of a vehicle, including 10 hours of night driving"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // WYDOT: "You have held a learner's permit for at least 10 days"
  holdMonths: 0,
  holdExtraDays: 10,
  // WYDOT: "A learner's permit is valid for one year, and may be renewed"
  permitValidMonths: 12,
  // WYDOT: "a person over the age of 18 who holds a valid license ... occupies the front passenger seat"
  supervisor: "a licensed driver over 18, in the front passenger seat",
  // WYDOT doesn't say when "night driving" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Wyoming's 50 hours include 10 at night; the permit only has to be held 10 days, so the hours set the pace.",
  certification: {
    label: "WYDOT's 50-hour certification form",
    url: "https://dot.state.wy.us/home/driver_license_records/driver-license/learner-permits.html",
  },
  logAtTest:
    "Wyoming asks for proof of the 50 hours, 10 at night, on WYDOT's certification form when the teen applies for the intermediate permit; WYDOT's log is optional. Drivetron's printed log has the totals to copy.",
  formGuide: {
    title: "Wyoming's 50-hour certification for the intermediate permit",
    steps: [
      "WYDOT's certification form (on its Forms page) shows the teen has completed 50 hours behind the wheel, 10 at night. Its log is optional; Drivetron's printed log can stand in as the record.",
      "A parent or guardian signs the intermediate permit application.",
      "The teen needs to be 16, have held the learner's permit at least 10 days, and pass a driving skills test.",
    ],
  },
  notAffiliatedWith: "the State of Wyoming or the Wyoming Department of Transportation (WYDOT)",
  defaultLocation: { lat: 41.14, lng: -104.8202 },
  stages: [
    {
      title: "Step 1: Learner's permit",
      points: [
        "Usually from 15, after the written exam and vision screening; a parent or guardian signs.",
        "Drive only with a licensed driver over 18 in the front passenger seat.",
        "Valid one year (renewable). Hold it at least 10 days before the intermediate permit.",
      ],
    },
    {
      title: "Step 2: Intermediate permit",
      points: [
        "From 16, after the 50 hours (10 at night), a driving skills test, and a parent's signature.",
        "Drive only from 5 a.m. to 11 p.m. (exception forms for medical, work, school, sports, or religious trips).",
        "No more than one passenger under 18 outside the immediate family.",
        "Hold it six months, or until 17; with driver education, full privileges after six months.",
      ],
    },
  ],
  sources: [
    {
      label: "WYDOT: Learner Permits",
      url: "https://dot.state.wy.us/home/driver_license_records/driver-license/learner-permits.html",
    },
  ],
  verified: "2026-11-19",
};
