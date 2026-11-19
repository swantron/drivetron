import type { StateRules } from "./types";

/**
 * Sources: Oregon DMV "Get an Instruction Permit - Under 18" and "Get a Driver License - Under 18",
 * and ORS 807.065 (provisional driver license).
 */
export const oregon: StateRules = {
  code: "OR",
  slug: "oregon",
  name: "Oregon",
  program: "provisional licensing",
  permitName: "provisional instruction permit",
  // DMV: "100 hours supervised driving experience, or 50 hours if you have taken and passed an approved Driver Ed course".
  // Drivetron tracks the 100-hour route.
  totalMinutes: 100 * 60,
  // Oregon sets no night-hours requirement
  nightMinutes: 0,
  // ORS 807.065(1)(b) and DMV: an instruction permit "for 6 months"
  holdMonths: 6,
  holdExtraDays: 0,
  permitValidMonths: null,
  // DMV: licensed, 21 or older, beside you; "must have had their license for at least 3 years for the driving practice to count"
  supervisor:
    "a licensed driver 21 or older, sitting beside you, who has held a license at least 3 years for the hours to count",
  nightDefinition: "Oregon doesn't require night hours. Drivetron still splits each drive into day and night (sunset to sunrise).",
  nightOffsetMinutes: 0,
  practiceNote: "Oregon asks for 100 supervised hours, or 50 after an approved driver education course.",
  certification: {
    label: "the supervised driving certification (ORS 807.065)",
    url: "https://oregonlaws.org/ors/ors_807.065",
  },
  logAtTest:
    "Oregon doesn't ask for a log. The applicant certifies to DMV the supervised hours: 100, or 50 after an approved driver education course, with a supervisor 21 or older licensed at least 3 years. Keep the printed log as the record behind that certification.",
  formGuide: {
    title: "Oregon's supervised driving certification",
    steps: [
      "At the provisional license, the teen certifies to DMV at least 100 hours of supervised driving, or 50 after an approved driver education course.",
      "Only hours with a supervisor 21 or older who has held a license at least 3 years count. Drivetron's printed log shows who supervised each drive.",
      "A passed ODOT-approved driver education course (within the past 2 years) can also replace the DMV drive test.",
    ],
  },
  notAffiliatedWith: "the State of Oregon or the Oregon Department of Transportation Driver and Motor Vehicle Services (DMV)",
  defaultLocation: { lat: 44.9429, lng: -123.0351 },
  stages: [
    {
      title: "Step 1: Provisional instruction permit",
      points: [
        "From 15, after the knowledge test and vision test, with a parent's or guardian's signature.",
        "Drive only with a licensed driver 21 or older beside you (licensed at least 3 years for the hours to count).",
        "No phone use while driving, even hands-free.",
        "Hold it at least six months.",
      ],
    },
    {
      title: "Step 2: Provisional driver license",
      points: [
        "From 16, after six months on the permit and 100 supervised hours (50 with approved driver education), and the drive test.",
        "First 6 months: no passengers under 20 outside the immediate family; second 6 months: no more than three.",
        "First year: no driving from midnight to 5 a.m. except between home and work or a school event, for work, or with a licensed driver 25 or older.",
        "No phone use while driving until 18.",
      ],
    },
  ],
  sources: [
    { label: "Oregon DMV: Get an Instruction Permit - Under 18", url: "https://www.oregon.gov/odot/DMV/Teen/pages/permit.aspx" },
    { label: "Oregon DMV: Get a Driver License - Under 18", url: "https://www.oregon.gov/odot/DMV/Teen/pages/license.aspx" },
    { label: "ORS 807.065: Provisional driver license", url: "https://oregonlaws.org/ors/ors_807.065" },
  ],
  verified: "2026-11-19",
};
