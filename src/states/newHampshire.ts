import type { StateRules } from "./types";

/**
 * Sources: NH DMV "Driver Licensing Requirements for Minors" and the Certification of Additional
 * Supervised Driving (DSMV 509).
 */
export const newHampshire: StateRules = {
  code: "NH",
  slug: "new-hampshire",
  name: "New Hampshire",
  program: "Youth Operator licensing",
  permitName: "practice period",
  // There's no learner's permit: teens practice from 15½ with a qualified supervisor
  noPermit: true,
  // DSMV 509: "minimum of 40 hours of practice driving ... at least 10 hours ... from ½ hour after sunset to ½ hour before sunrise"
  totalMinutes: 40 * 60,
  nightMinutes: 10 * 60,
  holdMonths: 0,
  holdExtraDays: 0,
  permitValidMonths: null,
  // DSMV 509: "a licensed parent, guardian, or a licensed adult over the age of 25"
  supervisor: "a licensed parent or guardian, or a licensed adult over 25",
  nightDefinition:
    "New Hampshire's certification counts night hours from half an hour after sunset to half an hour before sunrise. Drivetron uses those times at the drive's location.",
  nightOffsetMinutes: 30,
  practiceNote: "New Hampshire has no learner's permit: teens practice from 15½ with a licensed parent or guardian, or a licensed adult over 25.",
  certification: {
    label: "the Certification of Additional Supervised Driving (DSMV 509)",
    url: "https://www.dmv.nh.gov/sites/g/files/ehbemt416/files/inline-documents/dsmv509.pdf",
  },
  // Its columns (date, start and end time, day and night hours, skill practiced, parent's initials) match the printed log.
  practiceLog: {
    label: "NH DMV Certification of Additional Supervised Driving (DSMV 509)",
    url: "https://www.dmv.nh.gov/sites/g/files/ehbemt416/files/inline-documents/dsmv509.pdf",
  },
  logAtTest:
    "New Hampshire asks for the driver's out-of-class log, signed by a parent or guardian, when the teen applies for the license: the DSMV 509 log or the Parent's Supervised Driving Program's resources. Drivetron's printed log has the same columns as DSMV 509.",
  formGuide: {
    form: {
      label: "NH DMV DSMV 509 (PDF)",
      url: "https://www.dmv.nh.gov/sites/g/files/ehbemt416/files/inline-documents/dsmv509.pdf",
    },
    title: "How to fill in New Hampshire's DSMV 509 (Certification of Additional Supervised Driving)",
    steps: [
      "The log has a line for each drive: the date, start and end time, cumulative daytime and nighttime hours, the skill practiced, and a parent's or guardian's initials. Drivetron's printed log has the same columns.",
      "It needs at least 40 hours on top of driver education, 10 of them from half an hour after sunset to half an hour before sunrise.",
      "Practice can start at 15½, before driver education, with a licensed driver 25 or older.",
      "The driver and a parent or guardian sign the certifications. Bring it with the driver education completion certificate and the parent's authorization when applying for the license.",
    ],
  },
  notAffiliatedWith: "the State of New Hampshire or the New Hampshire Division of Motor Vehicles (DMV)",
  defaultLocation: { lat: 43.2081, lng: -71.5376 },
  stages: [
    {
      title: "Practice (no permit)",
      points: [
        "From 15½, drive with a licensed parent or guardian, or a licensed adult over 25.",
        "Complete an approved driver education program, plus 40 hours of supervised driving (10 at night) on top of it.",
      ],
    },
    {
      title: "Youth Operator License",
      points: [
        "From 16, with the driver education certificate, a parent's authorization, and the signed out-of-class log; then the vision, knowledge, and road tests.",
        "Youth Operator Licenses carry extra restrictions until 21.",
      ],
    },
  ],
  sources: [
    {
      label: "NH DMV: Driver Licensing Requirements for Minors",
      url: "https://www.dmv.nh.gov/drivers-licensenon-driver-ids/driver-licensing-requirements-minors",
    },
    {
      label: "NH DMV DSMV 509: Certification of Additional Supervised Driving",
      url: "https://www.dmv.nh.gov/sites/g/files/ehbemt416/files/inline-documents/dsmv509.pdf",
    },
  ],
  verified: "2026-11-19",
};
