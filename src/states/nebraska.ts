import type { StateRules } from "./types";

/**
 * Sources: Nebraska DMV "Provisional Operator's Permit (POP)" and the School Permit/Provisional
 * Operator's Permit 50 Hour Certification (DMV 06-91).
 */
export const nebraska: StateRules = {
  code: "NE",
  slug: "nebraska",
  name: "Nebraska",
  program: "Graduated Driver Licensing",
  permitName: "learner's permit (LPD)",
  // 50 Hour Certification: "a minimum of 50 hours ... including at least 10 hours between sunset and sunrise"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // DMV: "held a School Learner's Permit (LPE), School Permit (SCP) or Learner's Permit (LPD) for at least six months"
  holdMonths: 6,
  holdExtraDays: 0,
  permitValidMonths: null,
  // 50 Hour Certification: "a parent, guardian, or adult at least twenty-one years of age" who is licensed
  supervisor: "a licensed parent, guardian, or adult 21 or older",
  nightDefinition:
    "Nebraska's 50 Hour Certification counts night hours “between sunset and sunrise”. Drivetron uses those times at the drive's location.",
  nightOffsetMinutes: 0,
  practiceNote: "Nebraska's 50 hours include 10 between sunset and sunrise, unless the teen takes a DMV-approved driver safety course.",
  certification: {
    label: "the 50 Hour Certification (DMV 06-91)",
    url: "https://dmv.nebraska.gov/sites/dmv.nebraska.gov/files/doc/dls/forms/pop50hrcert.pdf",
  },
  formName: "form DMV 06-91",
  logAtTest:
    "Nebraska doesn't ask for the log itself. A parent, guardian, or licensed driver 21 or older signs the 50 Hour Certification and returns it to the examiner. A DMV-approved driver safety course replaces it.",
  formGuide: {
    form: {
      label: "Nebraska DMV 50 Hour Certification (PDF)",
      url: "https://dmv.nebraska.gov/sites/dmv.nebraska.gov/files/doc/dls/forms/pop50hrcert.pdf",
    },
    title: "How to fill in Nebraska's 50 Hour Certification for the POP",
    steps: [
      "Fill in the applicant's name and permit number.",
      "The signer certifies at least 50 hours of behind-the-wheel driving, 10 between sunset and sunrise, all with a licensed parent, guardian, or adult 21 or older, and that the teen can drive safely. Drivetron's printed log shows both totals.",
      "A parent, guardian, or licensed driver 21 or older signs and dates it. Give it to the driver license examiner.",
      "Teens who complete a DMV-approved driver safety course don't need the certification.",
    ],
  },
  notAffiliatedWith: "the State of Nebraska or the Nebraska Department of Motor Vehicles (DMV)",
  defaultLocation: { lat: 40.8136, lng: -96.7026 },
  stages: [
    {
      title: "Step 1: Learner's permit (LPD) or school permit",
      points: ["Hold it at least six months, with fewer than three points in the six months before applying for the POP."],
    },
    {
      title: "Step 2: Provisional Operator's Permit (POP)",
      points: [
        "From 16, after six months on the permit and either a DMV-approved driver safety course or the 50 Hour Certification (10 hours between sunset and sunrise).",
        "Unsupervised from 6 a.m. to midnight; from midnight to 6 a.m. only to or from work or a school activity, unless with a parent, guardian, or licensed driver 21 or older.",
        "First six months: no more than one passenger under 19 outside the immediate family.",
      ],
    },
  ],
  sources: [
    { label: "Nebraska DMV: Provisional Operator's Permit (POP)", url: "https://dmv.nebraska.gov/dl/pop" },
    {
      label: "Nebraska DMV: 50 Hour Certification",
      url: "https://dmv.nebraska.gov/sites/dmv.nebraska.gov/files/doc/dls/forms/pop50hrcert.pdf",
    },
  ],
  verified: "2026-11-19",
};
