import type { StateRules } from "./types";

/**
 * Sources: Maryland MVA "Learner's Permit" and "Provisional Driver's License" pages, and the Rookie
 * Driver Manual (practice guide with the skills log and certification page).
 */
export const maryland: StateRules = {
  code: "MD",
  slug: "maryland",
  name: "Maryland",
  program: "Rookie Driver",
  permitName: "learner's permit",
  // MVA: "60 supervised practice driving hours, including at least 10 nighttime hours"
  totalMinutes: 60 * 60,
  nightMinutes: 10 * 60,
  // MVA: 16 to 18, "Hold a learner's permit for at least 9 months"
  holdMonths: 9,
  holdExtraDays: 0,
  permitValidMonths: null,
  // Rookie Driver Manual: "at least twenty-one (21) years of age and must have had a driver's license for at least three (3) years"
  supervisor: "a driver 21 or older who has held a license at least three years",
  // Rookie Driver Manual: "Nighttime practice hours are 30 minutes before sunset until 30 minutes after sunrise."
  nightDefinition:
    "Maryland's Rookie Driver Manual counts nighttime practice from 30 minutes before sunset until 30 minutes after sunrise, a wider window than sunset to sunrise. Drivetron uses those times at the drive's location.",
  nightOffsetMinutes: -30,
  practiceNote: "Maryland's Rookie Driver Manual works through practice lessons, from basic control up to highway and night driving.",
  certification: {
    label: "the Rookie Driver Manual's skills log and certification page",
    url: "https://mva.maryland.gov/media/152",
  },
  logAtTest:
    "Maryland's Rookie Driver Manual, issued with every learner's permit, has a practice skills log and a certification page. Bring both, signed, with the learner's permit when the teen takes the driving test.",
  formGuide: {
    form: { label: "MVA Rookie Driver Manual (PDF)", url: "https://mva.maryland.gov/media/152" },
    title: "Maryland's Rookie Driver skills log and certification page",
    steps: [
      "The Rookie Driver Manual comes with every learner's permit. Its log tracks the 60 practice hours, 10 at night; copy each drive from Drivetron.",
      "Nighttime in Maryland is 30 minutes before sunset until 30 minutes after sunrise, so Drivetron counts a wider night window for Maryland than for most states.",
      "The supervising driver (21 or older, licensed at least three years) signs the log certifying the practice requirements were met.",
      "Bring the completed log, the certification page, and the learner's permit to the driving test.",
    ],
  },
  notAffiliatedWith: "the State of Maryland or the Maryland Motor Vehicle Administration (MVA)",
  defaultLocation: { lat: 38.9784, lng: -76.4922 },
  stages: [
    {
      title: "Step 1: Learner's permit",
      points: [
        "From 15 years 9 months, after a vision screening and knowledge test; under 16, a school attendance form is also needed.",
        "Practice with a supervising driver 21 or older who has held a license at least three years.",
        "Under 18: hold it at least 9 months, and complete driver education (30 hours of classroom, 6 behind the wheel).",
      ],
    },
    {
      title: "Step 2: Provisional license",
      points: [
        "After 9 months on the permit, driver education, 60 supervised hours (10 at night), no moving violations in the past 9 months, and the driving test.",
        "Under 18, for the first 151 days: no passengers under 18 outside the immediate family unless a qualified supervising driver is along.",
        "Under 18: no driving from midnight to 5 a.m. unless with a licensed driver 21 or older (3 years' experience), or to or from work, school activities, volunteer programs, or athletics.",
        "Under 18: no wireless devices, even hands-free.",
      ],
    },
  ],
  sources: [
    { label: "Maryland MVA: Learner's Permit", url: "https://mva.maryland.gov/your-mva-guide/teens-new-drivers/learners-permit" },
    {
      label: "Maryland MVA: Provisional Driver's License",
      url: "https://mva.maryland.gov/your-mva-guide/teens-new-drivers/provisional-license",
    },
    { label: "Maryland MVA: Rookie Driver Manual", url: "https://mva.maryland.gov/media/152" },
  ],
  verified: "2026-11-19",
};
