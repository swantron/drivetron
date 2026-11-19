import type { StateRules } from "./types";

/**
 * Sources: Mississippi DPS Driver Service Bureau "Regular Learner's Permit", the Driver's Manual
 * (revised Jan. 15, 2025), and the Affidavit for Road Test Waiver (§63-1-33).
 */
export const mississippi: StateRules = {
  code: "MS",
  slug: "mississippi",
  name: "Mississippi",
  program: "Regular Learner's Permit and Class R license",
  permitName: "learner's permit",
  // Affidavit for Road Test Waiver: a parent, teacher or guardian attests the permit holder "has been given
  // a minimum of 50 hours of driving instruction"; the manual requires it for applicants under 17
  totalMinutes: 50 * 60,
  // Mississippi sets no night-hours requirement
  nightMinutes: 0,
  // DPS: "You must hold the permit for at least twelve (12) months before you will be allowed to obtain your driver's license"
  holdMonths: 12,
  holdExtraDays: 0,
  // DPS: "The learner's permit is valid for only two (2) years."
  permitValidMonths: 24,
  // Manual: "accompanied by a licensed driver aged twenty-one years or older who is physically occupying the seat next to you"
  supervisor: "a licensed driver 21 or older, in the seat next to the driver",
  nightDefinition:
    "Mississippi doesn't require night hours. Drivetron still splits each drive into day and night (sunset to sunrise); the state's Mentor Guide suggests plenty of night practice.",
  nightOffsetMinutes: 0,
  practiceNote:
    "Mississippi's Mentor Guide plans about 60 hours across light, moderate and expressway traffic, by day and at night, plus bad weather.",
  certification: {
    label: "the Affidavit for Road Test Waiver",
    url: "https://www.driverservicebureau.dps.ms.gov/sites/default/files/2023.10%20Road%20Test%20Waiver_2.pdf",
  },
  logAtTest:
    "Mississippi asks applicants under 17 for an Affidavit for Road Test Waiver, in which a parent, teacher or guardian swears the teen held the permit at least a year and was given at least 50 hours of driving instruction. Drivetron's printed log backs up the 50 hours.",
  formGuide: {
    form: {
      label: "MDPS Affidavit for Road Test Waiver (PDF)",
      url: "https://www.driverservicebureau.dps.ms.gov/sites/default/files/2023.10%20Road%20Test%20Waiver_2.pdf",
    },
    title: "How to fill in Mississippi's Affidavit for Road Test Waiver",
    steps: [
      "Fill in the applicant's name, address, date of birth and age at the top.",
      "A parent, teacher or guardian attests that the teen has held the permit at least a year and has been given at least 50 hours of driving instruction. Drivetron's printed log shows the hours.",
      "They also attest to the teen's proficiency in the safe operation of a motor vehicle, then sign, date and add their title.",
      "Bring it with the learner's permit and an up-to-date school attendance form when applying for the license.",
    ],
  },
  notAffiliatedWith: "the State of Mississippi or the Mississippi Department of Public Safety (MDPS)",
  defaultLocation: { lat: 32.2988, lng: -90.1848 },
  stages: [
    {
      title: "Step 1: Learner's permit",
      points: [
        "From 15, with proof of school enrollment, after the knowledge and eye exams.",
        "Drive with a licensed driver 21 or older in the seat next to you.",
        "Valid two years. Hold it at least 12 months (unless you turn 17 first).",
      ],
    },
    {
      title: "Step 2: Driver's license (Class R)",
      points: [
        "From 16, after a year on the permit: bring the permit, a school attendance form, and the signed Affidavit for Road Test Waiver (50 hours).",
        "From July 1, 2027, applicants also need proof of driver's education.",
      ],
    },
  ],
  sources: [
    { label: "MDPS: Regular Learner's Permit", url: "https://www.driverservicebureau.dps.ms.gov/Drivers/Learners_Permit" },
    {
      label: "MDPS Driver's Manual (revised Jan. 2025)",
      url: "https://www.driverservicebureau.dps.ms.gov/sites/default/files/2025-02/1.15.2025%20Revised%20MDPS%20Driver%27s%20Manual.pdf",
    },
    { label: "MDPS Mentor Guide", url: "https://www.driverservicebureau.dps.ms.gov/sites/default/files/2025-10/10.31.2025_MentorGuide.pdf" },
  ],
  verified: "2026-11-19",
};
