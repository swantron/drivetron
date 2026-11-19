import type { StateRules } from "./types";

/**
 * Sources: Georgia DDS Drivers Manual, "Section 6: Teen Driving Laws", and the DDS 40-Hour
 * Parent/Teen Driving Guide (which names the Driving Experience Affidavit, DDS-7).
 */
export const georgia: StateRules = {
  code: "GA",
  slug: "georgia",
  name: "Georgia",
  program: "Teenage and Adult Driver Responsibility Act (TADRA)",
  permitName: "instructional permit",
  // DDS guide: "a minimum of 40 hours of driving experience, 6 hours of which must be at night"
  totalMinutes: 40 * 60,
  nightMinutes: 6 * 60,
  // DDS Section 6: Class D "after having held a valid instructional permit for one year and one day"
  holdMonths: 12,
  holdExtraDays: 1,
  // DDS Section 6: the Class CP permit is valid for 2 years
  permitValidMonths: 24,
  // DDS Section 6: "a person at least 21 years of age who is licensed to drive a Class C vehicle ...
  // occupying a seat beside the driver"
  supervisor: "a licensed driver 21 or older, fit and capable of taking control, in the seat beside the driver",
  // DDS doesn't say when "night" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Georgia's 40-Hour Parent/Teen Driving Guide works through sessions from the basics up to highway and night driving.",
  certification: {
    label: "the Driving Experience Affidavit (DDS-7), signed at DDS",
    url: "https://dds.georgia.gov/book/export/html/34836",
  },
  // No practiceLog: DDS-7 is signed at DDS, with no log form of its own to mirror.
  logAtTest:
    "Georgia doesn't ask for a log. A parent or guardian signs the Driving Experience Affidavit (DDS-7) at DDS, swearing to at least 40 hours of driving, 6 at night, and teens without the 40 hours aren't tested. Keep the printed log as the record behind that signature.",
  formGuide: {
    title: "Georgia's Driving Experience Affidavit (DDS-7)",
    steps: [
      "DDS provides the DDS-7 when the teen applies for the Class D license; the parent or guardian signs it there, swearing to at least 40 hours of driving, 6 at night.",
      "Teens without the 40 hours aren't tested, so check Drivetron's total and night hours before the visit.",
      "There's no log to turn in. Keep Drivetron's printed log as the record behind the signature.",
    ],
  },
  notAffiliatedWith: "the State of Georgia or the Georgia Department of Driver Services (DDS)",
  defaultLocation: { lat: 33.749, lng: -84.388 },
  stages: [
    {
      title: "Step 1: Instructional permit (Class CP)",
      points: [
        "From age 15.",
        "Drive only with a licensed driver 21 or older in the seat beside you.",
        "Valid for two years.",
      ],
    },
    {
      title: "Step 2: Provisional license (Class D)",
      points: [
        "From age 16, after holding the permit one year and one day, and passing the road test.",
        "Joshua's Law: a DDS-approved driver education course (30 hours of classroom or virtual instruction, plus 6 hours with a certified instructor or the 40-Hour Parent/Teen Driving Guide).",
        "40 hours of supervised driving, 6 at night, sworn to by a parent or guardian on the DDS-7 affidavit at DDS.",
        "The Alcohol and Drug Awareness Program (ADAP), and proof of school enrollment.",
        "No driving from midnight to 5 a.m., with no exceptions.",
        "Passengers: immediate family only for the first six months; then one non-family passenger under 21; after 12 months, up to three.",
      ],
    },
  ],
  sources: [
    { label: "Georgia DDS Drivers Manual: Section 6, Teen Driving Laws", url: "https://dds.georgia.gov/book/export/html/33676" },
    { label: "Georgia DDS: 40-Hour Parent/Teen Driving Guide", url: "https://dds.georgia.gov/book/export/html/34836" },
  ],
  verified: "2026-11-18",
};
