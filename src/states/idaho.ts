import type { StateRules } from "./types";

/**
 * Sources: Idaho Code 49-307 (driver's training and the supervised instruction permit) and ITD's
 * Parent-Student On-Road Driver's Training checklist.
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
  certification: {
    label: "the supervised driving period required by Idaho Code 49-307",
    url: "https://legislature.idaho.gov/statutesrules/idstat/title49/t49ch3/sect49-307/",
  },
  logAtTest:
    "Idaho requires a supervised driving period of 50 hours, 10 in darkness, over at least six months after driver's training, supervised by a licensed driver 21 or older. Keep the printed log as the record of those hours.",
  formGuide: {
    title: "Idaho's 50-hour supervised driving period",
    steps: [
      "After driver's training, the teen drives at least 50 hours, 10 in darkness, over at least six months, with a licensed driver 21 or older beside them. Drivetron's printed log shows the total, the night hours, and the dates.",
      "A parent or guardian takes responsibility for the supervised instruction permit, and signs as the liability signer when the teen applies.",
      "With parent-student training, ITD also asks for a completed official drive log of the 6 behind-the-wheel and 6 observation hours of training.",
    ],
  },
  notAffiliatedWith: "the State of Idaho or the Idaho Transportation Department (ITD)",
  defaultLocation: { lat: 43.615, lng: -116.2023 },
  stages: [
    {
      title: "Step 1: Driver's training and supervised instruction permit",
      points: [
        "Driver's training: 30 hours of classroom instruction, 6 behind the wheel, and 6 observing (or the parent-student on-road program).",
        "Drive only with a licensed driver 21 or older beside you, and no one else in the front.",
        "No moving violations or suspensions during the supervised period.",
      ],
    },
    {
      title: "Step 2: Class D license",
      points: ["From 15, at least six months after driver's training, with the 50 supervised hours (10 in darkness) and a passed skills test."],
    },
  ],
  sources: [
    {
      label: "Idaho Code 49-307: Driver's training and supervised instruction permit",
      url: "https://legislature.idaho.gov/statutesrules/idstat/title49/t49ch3/sect49-307/",
    },
    {
      label: "ITD: Parent-Student On-Road Driver's Training checklist",
      url: "https://itd.idaho.gov/wp-content/uploads/2026/03/PLORDT-checklist-1.pdf",
    },
  ],
  verified: "2026-11-19",
};
