import type { StateRules } from "./types";

/**
 * Sources: Michigan Vehicle Code, MCL 257.310e (graduated licensing); the Secretary of State's
 * "Drivers under 18" FAQ; and the Michigan Supervised Driving Log (rev. 08/2019).
 */
export const michigan: StateRules = {
  code: "MI",
  slug: "michigan",
  name: "Michigan",
  program: "Graduated Driver Licensing (GDL)",
  permitName: "Level 1 learner's license",
  // MCL 257.310e(5) and the SOS log: "no less than 50 hours of supervised driving, with 10 of those hours completed at night"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // MCL 257.310e(5) and the SOS FAQ: Level 1 held at least six months
  holdMonths: 6,
  holdExtraDays: 0,
  permitValidMonths: null,
  // SOS log: "a licensed parent or legal guardian, any licensed driver 21 years of age or older designated by the
  // parent or legal guardian, or a teen certified driver education provider"
  supervisor: "a licensed parent or legal guardian, or a licensed driver 21 or older the parent or guardian designates",
  // SOS log: "Nighttime Hours: Driving time that is 30 minutes after sunset to 30 minutes before sunrise."
  nightDefinition:
    "Michigan's Supervised Driving Log defines nighttime hours as from 30 minutes after sunset to 30 minutes before sunrise. Drivetron uses those times at the drive's location.",
  nightOffsetMinutes: 30,
  practiceNote: "Michigan's log suggests hours by lesson, from parking and backing up to city, multi-lane, and freeway driving, plus winter driving.",
  certification: {
    label: "the Michigan Supervised Driving Log",
    url: "https://www.michigan.gov/documents/sos/Michigan_supervised_driving_log_572744_7.pdf",
  },
  // Its columns (date, day and night hours, weather, supervisor's initials, notes) match the printed log.
  practiceLog: {
    label: "Michigan Supervised Driving Log",
    url: "https://www.michigan.gov/documents/sos/Michigan_supervised_driving_log_572744_7.pdf",
  },
  logAtTest:
    "Michigan's log is shown twice: to the Segment 2 driver education instructor (at least 30 hours, 2 at night) and to the driving test examiner (at least 50, 10 at night). The state's own log and the RoadReady app are preferred, but other log formats are accepted.",
  formGuide: {
    form: {
      label: "Michigan Supervised Driving Log (PDF)",
      url: "https://www.michigan.gov/documents/sos/Michigan_supervised_driving_log_572744_7.pdf",
    },
    title: "Michigan's Supervised Driving Log: what to show and when",
    steps: [
      "Before Segment 2 of driver education, show the instructor a log with at least 30 hours, 2 of them at night.",
      "Before the driving skills test, show the examiner a log with at least 50 hours, 10 at night (30 minutes after sunset to 30 minutes before sunrise).",
      "The state prefers its own log or the RoadReady app, but accepts other formats. Drivetron's printed log has the same columns: date, day and night hours, weather, the supervising adult's initials, and notes.",
      "A parent or guardian certifies the hours and signs the Level 2 application.",
    ],
  },
  notAffiliatedWith: "the State of Michigan or the Michigan Department of State (Secretary of State)",
  defaultLocation: { lat: 42.7325, lng: -84.5555 },
  stages: [
    {
      title: "Level 1: Learner's license",
      points: [
        "From 14 years 9 months, after Segment 1 of driver education (including 6 hours on the road with the instructor), a vision test, and a parent's or guardian's approval.",
        "Drive only with a licensed parent or legal guardian, or a licensed driver 21 or older they designate.",
        "Log at least 30 hours, 2 at night, before Segment 2 of driver education.",
        "Hold it at least six months.",
      ],
    },
    {
      title: "Level 2: Intermediate license",
      points: [
        "From 16, after six months at Level 1, Segment 2, 50 hours of supervised driving (10 at night) certified by a parent or guardian, the driving skills test, and 90 days with no violations or at-fault crashes.",
        "No driving from 10 p.m. to 5 a.m. unless with a parent, guardian, or designated licensed driver 21 or older, or driving for work or an authorized activity.",
        "No more than one passenger under 21, with exceptions for immediate family, a supervising adult, and work or authorized activities.",
      ],
    },
    {
      title: "Level 3: Full license",
      points: ["From 17, after time at Level 2 without moving violations, at-fault crashes, suspensions, or restricted-hour violations."],
    },
  ],
  sources: [
    { label: "Michigan Vehicle Code, MCL 257.310e (graduated licensing)", url: "https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-257-310e" },
    { label: "Michigan SOS: Drivers under 18", url: "https://www.michigan.gov/sos/faqs/license-and-id/drivers-under-18" },
    {
      label: "Michigan SOS: Supervised Driving Log (rev. 08/2019)",
      url: "https://www.michigan.gov/documents/sos/Michigan_supervised_driving_log_572744_7.pdf",
    },
  ],
  verified: "2026-11-18",
};
