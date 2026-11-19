import type { StateRules } from "./types";

/**
 * Sources: Code of Virginia § 46.2-335 (learner's permits and the 45-hour certification), Virginia DMV
 * "Apply for a Learner's Permit", and DMV's "Parents in the Driver's Seat" (DMV 16).
 */
export const virginia: StateRules = {
  code: "VA",
  slug: "virginia",
  name: "Virginia",
  program: "juvenile licensing",
  permitName: "learner's permit",
  // § 46.2-335(B): "at least 45 hours, at least 15 of which were after sunset"
  totalMinutes: 45 * 60,
  nightMinutes: 15 * 60,
  // DMV: under 18, "Hold a learner's permit for at least nine months before you can receive a driver's license"
  holdMonths: 9,
  holdExtraDays: 0,
  // § 46.2-335(A): valid until a license is issued or the holder no longer qualifies
  permitValidMonths: null,
  // § 46.2-335(A) and DMV
  supervisor:
    "a licensed driver 21 or older, or a licensed parent, legal guardian, or brother or sister 18 or older, alert and in the seat beside the driver",
  // § 46.2-335(B) counts hours "after sunset"
  nightDefinition:
    "Virginia counts the 15 night hours as driving “after sunset”. Drivetron counts from sunset to sunrise at the drive's location.",
  nightOffsetMinutes: 0,
  practiceNote: "Virginia asks for 15 of the 45 hours after sunset.",
  certification: {
    label: "the 45-hour certification on the driver education completion certificate",
    url: "https://law.lis.virginia.gov/vacode/46.2-335/",
  },
  logAtTest:
    "Virginia doesn't ask for the log itself. A parent, foster parent, or legal guardian certifies the 45 hours, 15 after sunset, on the driver education completion certificate, with their own driver's license or DMV ID number. Keep the printed log as the record behind that signature.",
  formGuide: {
    title: "Virginia's 45-hour parent certification",
    steps: [
      "A parent, foster parent, or legal guardian certifies that the teen drove at least 45 hours, 15 after sunset, while holding the learner's permit.",
      "The certification is on the driver education completion certificate, and it includes the certifying parent's driver's license or DMV ID card number. Under the law, a false certification can be prosecuted.",
      "Drivetron's printed log shows the total and the after-sunset hours to check before signing.",
    ],
  },
  notAffiliatedWith: "the Commonwealth of Virginia or the Virginia Department of Motor Vehicles (DMV)",
  defaultLocation: { lat: 37.5407, lng: -77.436 },
  stages: [
    {
      title: "Step 1: Learner's permit",
      points: [
        "From 15 years 6 months, after a vision screening and the two-part knowledge exam; a parent or guardian signs the application.",
        "Drive only with a licensed driver 21 or older, or a licensed parent, legal guardian, or brother or sister 18 or older, beside you.",
        "No more than one passenger under 21 outside the family, and no driving from midnight to 4 a.m.",
        "Under 18: complete a state-approved driver education program and hold the permit at least nine months.",
      ],
    },
    {
      title: "Step 2: Driver's license",
      points: [
        "From 16 years 3 months, after nine months on the permit and driver education.",
        "45 hours of driving, 15 after sunset, certified by a parent or guardian with their license or DMV ID number.",
      ],
    },
  ],
  sources: [
    { label: "Code of Virginia § 46.2-335: Learner's permits; certification required", url: "https://law.lis.virginia.gov/vacode/46.2-335/" },
    { label: "Virginia DMV: Apply for a Learner's Permit", url: "https://www.dmv.virginia.gov/licenses-ids/learners/apply" },
    { label: "Virginia DMV 16: Parents in the Driver's Seat", url: "https://www.dmv.virginia.gov/sites/default/files/dmv16.pdf" },
  ],
  verified: "2026-11-18",
};
