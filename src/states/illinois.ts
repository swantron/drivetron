import type { StateRules } from "./types";

/**
 * Sources: the Illinois Vehicle Code, 625 ILCS 5/6-103 (who may get a permit), 6-107 (graduated
 * license) and 6-107.1 (instruction permit for a minor).
 */
export const illinois: StateRules = {
  code: "IL",
  slug: "illinois",
  name: "Illinois",
  program: "Graduated Driver Licensing (GDL)",
  permitName: "instruction permit",
  // 6-107(b)(3): "a minimum of 50 hours of behind-the-wheel practice time, at least 10 hours of which have been at night"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // 6-107(b)(1): "Held a valid instruction permit for a minimum of 9 months"
  holdMonths: 9,
  holdExtraDays: 0,
  // 6-107.1(a)(1): "valid for a period of 24 months after the date of its issuance"
  permitValidMonths: 24,
  // 6-107.1(a)(1)
  supervisor:
    "a parent, legal guardian, family member, or person in loco parentis, 21 or older with at least a year of driving experience, in the seat beside the driver",
  // The Vehicle Code doesn't say when "night" starts for the 10 hours.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Illinois asks the parent to certify the teen is prepared to drive safely, so mix in highway, city, and bad-weather driving.",
  certification: {
    label: "the parent's 50-hour certification (625 ILCS 5/6-107)",
    url: "https://ilga.gov/documents/legislation/ilcs/documents/062500050K6-107.htm",
  },
  logAtTest:
    "Illinois doesn't ask for the log itself. A parent, legal guardian, or responsible adult certifies that the teen has had at least 50 hours of practice, 10 at night, and is ready to drive safely. Keep the printed log as the record behind that signature.",
  formGuide: {
    title: "Illinois's 50-hour parent certification",
    steps: [
      "Illinois doesn't ask for a log. A parent, legal guardian, or responsible adult certifies that the teen has had at least 50 hours of practice, 10 at night, and is ready to drive safely.",
      "Keep Drivetron's printed log as the record behind that certification.",
    ],
  },
  notAffiliatedWith: "the State of Illinois or the Illinois Secretary of State",
  defaultLocation: { lat: 39.7817, lng: -89.6501 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "From age 15 when enrolled in an approved driver education course (or later, under the other routes the Vehicle Code allows).",
        "Drive only with a parent, legal guardian, family member, or person in loco parentis who is 21 or older, licensed, with at least a year of driving experience, beside you.",
        "Not valid from 10 p.m. to 6 a.m. Sunday through Thursday nights, or 11 p.m. to 6 a.m. Friday and Saturday nights, with exceptions such as a parent along, work, or school events.",
        "Valid for 24 months. Hold it at least nine months.",
      ],
    },
    {
      title: "Step 2: Graduated license",
      points: [
        "From age 16, after nine months on the permit and an approved driver education course.",
        "50 hours of practice, 10 at night, certified by a parent, legal guardian, or responsible adult, who also certifies the teen is ready to drive safely.",
        "For the first 12 months (or until 18): no more than one passenger under 20, with exceptions for family.",
        "Under 18: no more than one passenger in the front seat, and no more in the back than there are seat belts.",
      ],
    },
  ],
  sources: [
    {
      label: "625 ILCS 5/6-107: Graduated license",
      url: "https://ilga.gov/documents/legislation/ilcs/documents/062500050K6-107.htm",
    },
    {
      label: "625 ILCS 5/6-107.1: Instruction permit for a minor",
      url: "https://ilga.gov/documents/legislation/ilcs/documents/062500050K6-107.1.htm",
    },
    {
      label: "625 ILCS 5/6-103: Who may not be licensed (permit ages)",
      url: "https://ilga.gov/documents/legislation/ilcs/documents/062500050K6-103.htm",
    },
  ],
  verified: "2026-11-18",
};
