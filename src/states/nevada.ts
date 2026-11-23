import type { StateRules } from "./types";

/**
 * Sources: NRS 483.2521 (drivers 16 or 17), Nevada DMV "Step 3: Driver Education", and the Beginning
 * Driver Experience Log (DLD 130, 1/2023).
 */
export const nevada: StateRules = {
  code: "NV",
  slug: "nevada",
  name: "Nevada",
  program: "teen driver licensing",
  permitName: "instruction permit",
  // NRS 483.2521(1)(b): "at least 50 hours of supervised experience ... including ... at least 10 hours ... during darkness"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // NRS 483.2521(1)(g): "an instruction permit for not less than 6 months"
  holdMonths: 6,
  holdExtraDays: 0,
  permitValidMonths: null,
  // DMV: "A licensed driver (21 or older) with at least 1 year of driving experience must be seated next to you"
  supervisor: "a licensed driver 21 or older with at least a year of driving experience, seated next to the driver",
  // NRS 483.2521 says "darkness" without defining it here.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Nevada's 50 hours include 10 in darkness, logged on DLD 130 or the RoadReady app.",
  certification: {
    label: "the Beginning Driver Experience Log (DLD 130)",
    url: "https://dmv.nv.gov/pdfforms/dld130.pdf",
  },
  formName: "form DLD 130",
  logAtTest:
    "Nevada requires its own log: the Beginning Driver Experience Log (DLD 130) or the RoadReady app, with the dates and times of each session; other logs aren't accepted. A parent or guardian signs the first page of DLD 130 in front of a notary or DMV representative, even with the app.",
  formGuide: {
    form: { label: "Nevada DMV DLD 130 (PDF)", url: "https://dmv.nv.gov/pdfforms/dld130.pdf" },
    title: "How to fill in Nevada's DLD 130 (Beginning Driver Experience Log)",
    steps: [
      "Log the date and times of each supervised session on the back of DLD 130 in blue or black ink (no pencil or gel pens). Copy them from Drivetron's printed log; Nevada doesn't accept other log formats, only DLD 130 or the RoadReady app.",
      "The total must reach 50 hours (3,000 minutes), 10 hours (600 minutes) in darkness. Without driver education (only where no course is offered within 30 miles), it's 100 hours.",
      "A parent or legal guardian signs the certification on the first page, with their license or ID number, in front of a notary or a DMV representative. It's required even when the hours were logged in the app.",
      "Bring the completed log and the driver education certificate before the driving skills test.",
    ],
  },
  notAffiliatedWith: "the State of Nevada or the Nevada Department of Motor Vehicles (DMV)",
  defaultLocation: { lat: 39.1638, lng: -119.7674 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "Practice with a licensed driver 21 or older, with at least a year's experience, seated next to you.",
        "Driver education can start at 15½, after the written test.",
        "Hold it at least six months.",
      ],
    },
    {
      title: "Step 2: Driver's license",
      points: [
        "At 16 or 17, after six months on the permit, driver education (30 classroom hours or an approved online course), and 50 supervised hours (10 in darkness) on DLD 130.",
        "No at-fault crashes, moving violations, or alcohol or drug convictions in the six months before applying.",
      ],
    },
  ],
  sources: [
    { label: "NRS 483.2521: Drivers who are 16 or 17 years of age", url: "https://www.leg.state.nv.us/NRS/NRS-483.html" },
    { label: "Nevada DMV: Driver Education for Teens", url: "https://dmv.nv.gov/driveeduteens.htm" },
    { label: "Nevada DMV DLD 130: Beginning Driver Experience Log", url: "https://dmv.nv.gov/pdfforms/dld130.pdf" },
  ],
  verified: "2026-11-19",
};
