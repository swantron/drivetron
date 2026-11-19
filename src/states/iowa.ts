import type { StateRules } from "./types";

/** Source: Iowa Code 321.180B (graduated driver's licenses). */
export const iowa: StateRules = {
  code: "IA",
  slug: "iowa",
  name: "Iowa",
  program: "Graduated Driver's License",
  permitName: "instruction permit",
  // 321.180B(2)(a): "a total of twenty hours of street or highway driving of which two hours were conducted after sunset and before sunrise"
  totalMinutes: 20 * 60,
  nightMinutes: 2 * 60,
  // 321.180B(2)(a): an instruction permit "for a minimum of twelve months immediately preceding application"
  holdMonths: 12,
  holdExtraDays: 0,
  permitValidMonths: null,
  // 321.180B(1)(c)(1)
  supervisor:
    "a licensed parent, guardian, or custodian, an immediate family member 21 or older, a driver education instructor, or a person 25 or older with the parent's written permission, in the seat beside the driver",
  nightDefinition:
    "Iowa counts night driving as “after sunset and before sunrise”. Drivetron uses those times at the drive's location.",
  nightOffsetMinutes: 0,
  practiceNote: "Iowa asks for 20 hours with the permit, 2 of them after sunset.",
  certification: {
    label: "the parent's affidavit of 20 hours (Iowa Code 321.180B)",
    url: "https://www.legis.iowa.gov/docs/code/321.180B.pdf",
  },
  logAtTest:
    "Iowa doesn't ask for the log itself. A parent, guardian, or custodian signs an affidavit on a DOT form that the teen drove 20 hours, 2 after sunset, with a qualifying supervisor. Keep the printed log as the record behind that affidavit.",
  formGuide: {
    title: "Iowa's 20-hour affidavit for the intermediate license",
    steps: [
      "A parent, guardian, or custodian signs the DOT's affidavit that the teen has driven at least 20 hours on streets or highways, 2 of them after sunset and before sunrise.",
      "The hours count with a parent, guardian, custodian, instructor, a person certified by the DOT, or a person 25 or older with written parent permission.",
      "The teen must also have been crash- and violation-free for the six months before applying, and have finished driver education.",
    ],
  },
  notAffiliatedWith: "the State of Iowa or the Iowa Department of Transportation (DOT)",
  defaultLocation: { lat: 41.5868, lng: -93.625 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "From 14, with a parent's or guardian's signed consent.",
        "Drive only with a licensed parent, guardian, or custodian, an immediate family member 21 or older, a driver education instructor, or someone 25 or older with written parent permission, beside you.",
        "Hold it at least 12 months.",
      ],
    },
    {
      title: "Step 2: Intermediate license",
      points: [
        "At 16 or 17, after 12 months on the permit, driver education, the 20-hour affidavit, and six months crash- and violation-free.",
        "No driving from 12:30 to 5 a.m. unless with a qualifying supervisor, or with a waiver for school activities and work.",
        "First six months: one unrelated passenger under 18, unless the parent waives it.",
      ],
    },
  ],
  sources: [{ label: "Iowa Code 321.180B: Graduated driver's licenses", url: "https://www.legis.iowa.gov/docs/code/321.180B.pdf" }],
  verified: "2026-11-19",
};
