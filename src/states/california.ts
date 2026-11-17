import type { StateRules } from "./types";

/**
 * Sources: DMV California Driver Handbook ("Special Section – Minors"), the Teen Driver Roadmap page,
 * the California Parent-Teen Training Guide (DL 603), and DMV's Supervised Driving Log.
 */
export const california: StateRules = {
  code: "CA",
  slug: "california",
  name: "California",
  program: "Provisional Licensing",
  permitName: "instruction permit",
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // Handbook: "an instruction permit ... for at least 6 months"
  holdMonths: 6,
  holdExtraDays: 0,
  // DMV gives the permit no term of its own: the application "is valid for 12 months after you
  // apply", and it predates the permit, so a date counted from the permit would run late.
  permitValidMonths: null,
  // Handbook, "Minors' Permit Restrictions"; VC 12814.6(a)(1) adds that the 25+ driver can't be on probation
  supervisor: "a licensed California driver: a parent, guardian, driving instructor, spouse, or adult 25 years old or older",
  // VC 12814.6(a)(4): night practice is "driving during darkness, as defined in Section 280"
  nightDefinition:
    "California counts driving \u201cduring darkness\u201d, which the Vehicle Code defines as from half an hour after sunset to half an hour before sunrise. Drivetron uses those times at the drive's location.",
  nightOffsetMinutes: 30,
  practiceNote:
    "California's Parent-Teen Training Guide works through skills in levels, from starting and stopping up to freeway and night driving.",
  certification: {
    label: "the instruction permit",
    url: "https://www.dmv.ca.gov/portal/uploads/2020/06/dl603_compressed.pdf",
  },
  practiceLog: {
    label: "DMV Supervised Driving Log",
    url: "https://www.dmv.ca.gov/portal/file/supervised-driving-log-pdf/",
  },
  // Supervised Driving Log: "The use of this log is optional"; the handbook asks for parent signatures on the permit.
  logAtTest:
    "California's own practice log is optional. What DMV asks for is a parent or guardian's signature on the instruction permit, certifying the 50 hours.",
  notAffiliatedWith: "the State of California or the California Department of Motor Vehicles (DMV)",
  defaultLocation: { lat: 38.5767, lng: -121.4934 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "From age 15½, after completing driver education (or while enrolled in an approved integrated program).",
        "A parent or guardian signs the application; with joint custody, both sign.",
        "Not valid until behind-the-wheel training with an instructor begins, or age 17½.",
        "Practice only with a licensed California driver: a parent, guardian, driving instructor, spouse, or adult 25 or older, seated close enough to take control.",
        "Never alone, not even to a DMV office for the drive test.",
        "The application is good for 12 months after applying. If it runs out before the license, reapply; time already held on the permit still counts.",
      ],
    },
    {
      title: "Step 2: Provisional driver's license",
      points: [
        "From age 16, after holding the permit at least six months and completing driver education and driver training.",
        "50 hours of supervised practice, 10 of them in darkness (half an hour after sunset to half an hour before sunrise), in addition to driver training.",
        "A parent, guardian, or spouse signs the instruction permit to certify the 50 hours (a teen without one may have a licensed driver 25 or older, or a driving instructor, sign).",
        "For the first 12 months: no driving from 11 p.m. to 5 a.m., and no passengers under 20, unless a licensed parent or guardian, a licensed driver 25 or older, or a driving instructor is along.",
        "Exceptions for medical need, school, work, or driving an immediate family member, each with a signed note.",
      ],
    },
    {
      title: "At 18",
      points: ["The “provisional” part of the license ends."],
    },
  ],
  sources: [
    {
      label: "DMV: California Driver Handbook, Section 2 (instruction permits and licenses)",
      url: "https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/getting-an-instruction-permit-and-drivers-license/",
    },
    { label: "DMV: California Driver Handbook (DL 600), Special Section – Minors", url: "https://www.dmv.ca.gov/web/eng_pdf/dl600.pdf" },
    { label: "DMV: Teen Driver Roadmap", url: "https://www.dmv.ca.gov/portal/teen-drivers/" },
    { label: "DMV: Instruction and learner's permits", url: "https://www.dmv.ca.gov/portal/driver-licenses-identification-cards/instruction-permits/" },
    {
      label: "Vehicle Code 12814.6 (provisional licensing)",
      url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=12814.6.&lawCode=VEH",
    },
    {
      label: "Vehicle Code 280 (\u201cdarkness\u201d)",
      url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=280.&lawCode=VEH",
    },
    {
      label: "DMV: California Parent-Teen Training Guide (DL 603)",
      url: "https://www.dmv.ca.gov/portal/uploads/2020/06/dl603_compressed.pdf",
    },
  ],
  verified: "2026-11-16",
};
