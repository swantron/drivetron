import type { StateRules } from "./types";

/**
 * Sources: Idaho Code 49-307 (driver's training and the supervised instruction permit), ITD's GDL
 * fact sheet (ITD 3506) and ITD's Parent-Student On-Road Driver's Training checklist.
 */
export const idaho: StateRules = {
  code: "ID",
  slug: "idaho",
  name: "Idaho",
  program: "Graduated Driver Licensing",
  permitName: "supervised instruction permit",
  // 49-307(8)(b): "at least fifty (50) hours of supervised driving time, ten (10) hours of which shall be during hours of darkness"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // 49-307(8): "Over a period of time not less than six (6) months"; no license sooner than six months after the driver's training course
  holdMonths: 6,
  holdExtraDays: 0,
  permitValidMonths: null,
  // 49-307(8)(a): "a valid driver's license, is twenty-one (21) years of age or older, and is actually occupying a seat beside the permittee"
  supervisor: "a licensed driver 21 or older in the seat beside the driver; only the two of them in the front",
  // Idaho Code 49-307 says "hours of darkness" without defining them here.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Idaho's 50 hours include 10 in darkness, over at least six months.",
  // ITD 3506: "a parent or legal guardian must sign and date a statement on the GDL Requirements
  // Verification: Certifying that fifty (50) hours of driving were completed (10 of which were at night)"
  certification: {
    label: "the parent's GDL Requirements Verification",
    url: "https://itd.idaho.gov/wp-content/uploads/2025/04/3506_gdlfactsheet.pdf",
  },
  logAtTest:
    "Idaho has no official log for the 50 hours. Before the license is issued, a parent or legal guardian signs the GDL Requirements Verification, certifying that the teen drove 50 hours, 10 of them at night, and giving permission to issue the license. Keep the printed log as the record behind that signature.",
  formGuide: {
    title: "Idaho's 50-hour log and the GDL Requirements Verification",
    steps: [
      "After driver's training, the teen drives at least 50 hours, 10 at night, over at least six months, with a licensed driver 21 or older beside them. Idaho doesn't publish a log for these hours; Drivetron's printed log shows the total, the night hours, and the dates.",
      "Before the license is issued, a parent or legal guardian signs the GDL Requirements Verification, certifying the 50 hours (10 at night) and giving permission to issue the license. Check Drivetron's total and night hours before signing.",
      "ITD's Drive Log Template is a different log: with parent-student training, it records the 6 behind-the-wheel and 6 observation hours of training, and it's submitted before the 50 supervised hours begin.",
    ],
  },
  notAffiliatedWith: "the State of Idaho or the Idaho Transportation Department (ITD)",
  defaultLocation: { lat: 43.615, lng: -116.2023 },
  stages: [
    {
      title: "Step 1: Driver's training and supervised instruction permit",
      points: [
        "Driver's training: 30 hours of classroom instruction, 6 behind the wheel, and 6 observing (or the parent-student on-road program). The driver training permit then becomes the supervised instruction permit.",
        "Drive only with a licensed driver 21 or older beside you, and no one else in the front. Carry the permit, and everyone wears a seat belt.",
        "A traffic conviction or a broken permit rule cancels the permit, and the six months start over with a new one.",
      ],
    },
    {
      title: "Step 2: Class D license",
      points: [
        "From 15, after at least six months of supervised driving with the 50 hours (10 at night), the knowledge and skills tests, and a parent's GDL Requirements Verification.",
        "Under 16: daylight only, unless a licensed driver 21 or older is beside you, with no one else in the front.",
        "Under 17, for the first six months: no more than one passenger under 17, unless related by blood, adoption, or marriage.",
      ],
    },
  ],
  sources: [
    { label: "ITD: Idaho's Graduated Driver's Licensing Program (ITD 3506)", url: "https://itd.idaho.gov/wp-content/uploads/2025/04/3506_gdlfactsheet.pdf" },
    {
      label: "Idaho Code 49-307: Driver's training and supervised instruction permit",
      url: "https://legislature.idaho.gov/statutesrules/idstat/title49/t49ch3/sect49-307/",
    },
    {
      label: "ITD: Parent-Student On-Road Driver's Training checklist",
      url: "https://itd.idaho.gov/wp-content/uploads/2026/03/PLORDT-checklist-1.pdf",
    },
  ],
  verified: "2026-11-26",
};
