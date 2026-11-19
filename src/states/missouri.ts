import type { StateRules } from "./types";

/** Source: Missouri Department of Revenue "Missouri Graduated Driver License Law". */
export const missouri: StateRules = {
  code: "MO",
  slug: "missouri",
  name: "Missouri",
  program: "Graduated Driver License (GDL)",
  permitName: "instruction permit",
  // DOR: "40 hours of driving instruction, including a minimum of 10 hours of nighttime driving instruction between sunset and sunrise"
  totalMinutes: 40 * 60,
  nightMinutes: 10 * 60,
  // DOR: "an instruction permit for a minimum of 182 days (beginning the day after issuance)"
  holdMonths: 0,
  holdExtraDays: 182,
  // DOR: instruction permit "Valid for: 0-12 Months"
  permitValidMonths: 12,
  // DOR: the hours are with "a qualified person, grandparent, or qualified driving instructor"
  supervisor:
    "for the 40 hours, a parent, legal guardian, grandparent, or qualified driving instructor; from 16, any licensed driver 21 or older may also ride along, in the front seat",
  nightDefinition:
    "Missouri counts nighttime driving instruction as “between sunset and sunrise”. Drivetron uses those times at the drive's location.",
  nightOffsetMinutes: 0,
  practiceNote: "Missouri's 40 hours include 10 between sunset and sunrise.",
  certification: {
    label: "the parent's in-person verification of 40 hours at the license office",
    url: "https://dor.mo.gov/driver-license/issuance/graduated-driver-license/details.html",
  },
  logAtTest:
    "Missouri doesn't ask for a log. A parent, legal guardian, or grandparent comes to the license office with the teen to verify the 40 hours, 10 at night. Keep the printed log as the record behind that verification.",
  formGuide: {
    title: "Verifying Missouri's 40 hours for the intermediate license",
    steps: [
      "There's no form to mail. A qualified person (parent or legal guardian) or grandparent goes to the license office with the teen and verifies at least 40 hours of driving instruction, 10 at night between sunset and sunrise.",
      "Check Drivetron's total and night hours before the visit.",
      "The teen also needs 182 days on the permit, no traffic convictions in the past 6 months, no alcohol-related convictions in the past 12, and a passed driving test.",
    ],
  },
  notAffiliatedWith: "the State of Missouri or the Missouri Department of Revenue",
  defaultLocation: { lat: 38.5767, lng: -92.1735 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "From 15, after the vision, road sign, and written tests; a parent or guardian signs a permission statement at the license office.",
        "Under 16: drive only with a parent, legal guardian, grandparent, qualified driving instructor, or a driver 25 or older licensed 3 years with the parent's written permission, in the front seat.",
        "From 16: with any licensed driver 21 or older in the front seat.",
        "Hold it at least 182 days, starting the day after it's issued.",
      ],
    },
    {
      title: "Step 2: Intermediate license",
      points: [
        "From 16, after 182 days on the permit, 40 hours of driving instruction (10 at night), and the driving test.",
        "First 6 months: no more than one passenger under 19 outside the immediate family; after that, no more than three.",
        "No driving alone from 1 to 5 a.m. except to or from school activities, a job, or an emergency, unless with a licensed driver 21 or older.",
      ],
    },
    {
      title: "Step 3: Under-21 full license",
      points: ["At 18 (or within 30 days before), with no alcohol-related offenses or traffic convictions in the last 12 months."],
    },
  ],
  sources: [
    {
      label: "Missouri DOR: Graduated Driver License Law",
      url: "https://dor.mo.gov/driver-license/issuance/graduated-driver-license/details.html",
    },
  ],
  verified: "2026-11-19",
};
