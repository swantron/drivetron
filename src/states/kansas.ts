import type { StateRules } from "./types";

/**
 * Sources: Kansas Department of Revenue "Frequently Asked Questions About Teen Driving" and the
 * Permission Affidavit for Kansas Credential (DE-98, rev. 8/21).
 */
export const kansas: StateRules = {
  code: "KS",
  slug: "kansas",
  name: "Kansas",
  program: "Graduated Driver's License",
  permitName: "instruction permit",
  // DE-98: "at least 50 hours of supervised driving (with at least 10 of those hours at night)"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // KDOR FAQ: under 17, "hold their instructional permit for 1 year from the date it was issued or until their 17th birthday"
  holdMonths: 12,
  holdExtraDays: 0,
  permitValidMonths: null,
  // KDOR FAQ: "the adult accompanying the holder of an instruction permit ... must be 21 years of age or older"
  supervisor: "a licensed adult 21 or older",
  // DE-98 doesn't say when "night" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Kansas's 50 hours include 10 at night, with a licensed adult 21 or older.",
  certification: {
    label: "the Driving Time Certification on form DE-98",
    url: "https://www.ksrevenue.gov/pdf/de98.pdf",
  },
  formName: "form DE-98",
  logAtTest:
    "Kansas doesn't require a log, though the Department of Revenue encourages one. A parent or guardian signs the Driving Time Certification on form DE-98 for 50 hours, 10 at night. Without it, the license stays restricted until 17.",
  formGuide: {
    form: { label: "Kansas DE-98 (PDF)", url: "https://www.ksrevenue.gov/pdf/de98.pdf" },
    title: "How to fill in Kansas's DE-98 Driving Time Certification",
    steps: [
      "In the Driving Time Certification on DE-98, a parent or guardian certifies the teen has completed at least 50 hours of supervised driving, 10 at night, with a licensed adult 21 or older, and adds their driver's license number.",
      "The licensing office doesn't require the log itself, but encourages keeping one. Drivetron's printed log shows the total and night hours.",
      "Without the certification, the license restrictions continue until 17.",
    ],
  },
  notAffiliatedWith: "the State of Kansas or the Kansas Department of Revenue Division of Vehicles",
  defaultLocation: { lat: 39.0473, lng: -95.6752 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "Drive only with a licensed adult 21 or older.",
        "Under 17: hold it one year from the date it was issued, or until 17, whichever comes first.",
      ],
    },
    {
      title: "Step 2: Less restricted license at 16",
      points: [
        "After a year on the permit, the parent's DE-98 certification of 50 hours (10 at night).",
        "Two or more moving violations before 16 keep the license restricted until 17.",
      ],
    },
  ],
  sources: [
    { label: "Kansas KDOR: Frequently Asked Questions About Teen Driving", url: "https://ksrevenue.gov/dovteenfaq.html" },
    { label: "Kansas KDOR DE-98: Permission Affidavit for Kansas Credential", url: "https://www.ksrevenue.gov/pdf/de98.pdf" },
  ],
  verified: "2026-11-19",
};
