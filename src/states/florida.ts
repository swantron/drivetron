import type { StateRules } from "./types";

/**
 * Sources: FLHSMV "Licensing Requirements for Teens, Graduated Driver License Laws and Driving
 * Curfews", the Certification of Driving Experience of a Minor (HSMV 71143, rev. 01/11), and the
 * Learner's License Driving Log.
 */
export const florida: StateRules = {
  code: "FL",
  slug: "florida",
  name: "Florida",
  program: "Graduated Driver License",
  permitName: "learner's license",
  // HSMV 71143: "has driven a minimum of 50 hours during the past 12 months, of which 10 hours of driving were at night"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // FLHSMV: "Must hold for a minimum of 12 months or until 18th birthday, whichever comes first."
  holdMonths: 12,
  holdExtraDays: 0,
  // FLHSMV gives the learner's license no term of its own
  permitValidMonths: null,
  // FLHSMV: "ALWAYS accompanied by a licensed driver 21+"
  supervisor: "a licensed driver 21 or older, at all times",
  // Neither the FLHSMV page nor HSMV 71143 says when night starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Florida's practice log asks for the traffic and weather on each drive, and the skills practiced.",
  certification: {
    label: "the Certification of Driving Experience of a Minor (HSMV 71143)",
    url: "https://www.flhsmv.gov/pdf/forms/71143.pdf",
  },
  formName: "form HSMV 71143",
  // Its columns (date, day or night, traffic, weather, time, skills) are what the printed log shows.
  practiceLog: {
    label: "FLHSMV Learner's License Driving Log",
    url: "https://www.flhsmv.gov/pdf/teen/drivinglog.pdf",
  },
  logAtTest:
    "Florida's driving log is for keeping track. What FLHSMV asks for is the Certification of Driving Experience of a Minor (HSMV 71143): a parent, legal guardian, or responsible adult 21 or older signs that the teen has driven at least 50 hours in the past 12 months, 10 at night, in front of a notary or the driver license examiner.",
  formGuide: {
    form: { label: "FLHSMV HSMV 71143 (PDF)", url: "https://www.flhsmv.gov/pdf/forms/71143.pdf" },
    title: "How to fill in Florida's HSMV 71143",
    steps: [
      "HSMV 71143 certifies that the teen has driven at least 50 hours in the past 12 months, 10 of them at night.",
      "A parent, legal guardian, or responsible adult 21 or older signs it in front of a notary or a driver license examiner.",
      "FLHSMV's Learner's License Driving Log (date, day or night, traffic, weather, time, skills) is for keeping track and isn't required. Drivetron's printed log covers the same columns; tag the traffic and weather on each drive.",
    ],
  },
  notAffiliatedWith: "the State of Florida or the Florida Department of Highway Safety and Motor Vehicles (FLHSMV)",
  defaultLocation: { lat: 30.4383, lng: -84.2807 },
  stages: [
    {
      title: "Step 1: Learner's license",
      points: [
        "From age 15, after the Driver Education Traffic Safety (DETS) course, a vision and hearing test, and the Class E knowledge exam (80% to pass).",
        "Under 18, a parent signs a notarized Parental Consent Form.",
        "Always with a licensed driver 21 or older.",
        "Daylight hours only for the first three months, then until 10 p.m.",
        "Hold it at least 12 months, or until the 18th birthday if that comes first.",
      ],
    },
    {
      title: "Step 2: Class E license (under 18)",
      points: [
        "From age 16, after holding the learner's license 12 months (or reaching 18) with no moving violation convictions in that year.",
        "50 hours of driving, 10 at night, certified by a parent, legal guardian, or responsible adult 21 or older on HSMV 71143.",
        "Pass the Class E driving skills test.",
        "At 16: drive only from 6 a.m. to 11 p.m., unless going to or from work or with a licensed driver 21 or older.",
        "At 17: drive only from 5 a.m. to 1 a.m., with the same exceptions.",
      ],
    },
  ],
  sources: [
    {
      label: "FLHSMV: Licensing Requirements for Teens, Graduated Driver License Laws and Driving Curfews",
      url: "https://flhsmv.gov/driver-licenses-id-cards/licensing-requirements-teens-graduated-driver-license-laws-driving-curfews/",
    },
    {
      label: "FLHSMV HSMV 71143: Certification of Driving Experience of a Minor",
      url: "https://www.flhsmv.gov/pdf/forms/71143.pdf",
    },
    { label: "FLHSMV: Learner's License Driving Log", url: "https://www.flhsmv.gov/pdf/teen/drivinglog.pdf" },
  ],
  verified: "2026-11-18",
};
