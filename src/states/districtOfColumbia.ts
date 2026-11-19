import type { StateRules } from "./types";

/**
 * Sources: DC DMV "GRAD License Program", "Learner Permits and Provisional Licenses", "Provisional
 * License", and "DMV Road Skills Test Requirements".
 */
export const districtOfColumbia: StateRules = {
  code: "DC",
  slug: "washington-dc",
  name: "Washington, D.C.",
  program: "GRAD",
  permitName: "learner permit",
  // DMV road test requirements: the "40-hour Certification of Eligibility for Provisional License", under 21
  totalMinutes: 40 * 60,
  // DC's 10 night hours come later, with the provisional license, before the full license
  nightMinutes: 0,
  // DMV: 6 months driving with a learner permit before the provisional license
  holdMonths: 6,
  holdExtraDays: 0,
  permitValidMonths: null,
  supervisor: "a licensed driver 21 or older, in the passenger seat beside you",
  nightDefinition:
    "D.C. asks for 10 hours of night driving later, while the teen holds the provisional license, for the full license. Drivetron still splits each drive into day and night (sunset to sunrise).",
  nightOffsetMinutes: 0,
  practiceNote: "D.C. asks for 40 hours on the learner permit, then 10 hours of night driving on the provisional license.",
  certification: {
    label: "the 40-hour Certification of Eligibility for Provisional License",
    url: "https://dmv.dc.gov/service/dmv-road-skills-test-requirements",
  },
  logAtTest:
    "D.C. asks drivers under 21 to bring the 40-hour Certification of Eligibility for Provisional License to the road skills test. For the full license, a second form certifies 10 hours of night driving with a fully licensed driver 21 or older, with a copy of that driver's license.",
  formGuide: {
    title: "Washington, D.C.'s two certifications: 40 hours, then 10 at night",
    steps: [
      "Before the road skills test, bring the 40-hour Certification of Eligibility for Provisional License (drivers under 21).",
      "With the provisional license, practice at least 10 hours of night driving with a driver 21 or older who has a full license.",
      "For the full license (from 17, after six months on the provisional license), submit the signed Certification of Eligibility for Full License with Conditions and a copy of the accompanying driver's license.",
      "Drivetron's printed log shows the total and the night hours for both.",
    ],
  },
  notAffiliatedWith: "the District of Columbia or the DC Department of Motor Vehicles (DMV)",
  defaultLocation: { lat: 38.9072, lng: -77.0369 },
  stages: [
    {
      title: "Step 1: Learner permit",
      points: [
        "From 16, after vision and knowledge tests.",
        "Drive only from 6 a.m. to 9 p.m.",
        "Hold it six months; bring the 40-hour certification to the road skills test.",
      ],
    },
    {
      title: "Step 2: Provisional license",
      points: [
        "September to June: drive 6 a.m. to 10:59 p.m. Sunday to Thursday, and to 11:59 p.m. Friday and Saturday; July and August: 6 a.m. to 11:59 p.m. every day.",
        "Exceptions for work, school, religious or athletic events, or with a licensed driver 21 or older beside you.",
      ],
    },
    {
      title: "Step 3: Full license with conditions",
      points: [
        "From 17, after six months on the provisional license, 12 months without points, and 10 certified hours of night driving.",
        "The same hours limits apply until 18.",
      ],
    },
  ],
  sources: [
    { label: "DC DMV: GRAD License Program", url: "https://dmv.dc.gov/service/graduated-license-program" },
    { label: "DC DMV: Provisional License", url: "https://dmv.dc.gov/service/provisional-license" },
    { label: "DC DMV: Road Skills Test Requirements", url: "https://dmv.dc.gov/service/dmv-road-skills-test-requirements" },
  ],
  verified: "2026-11-19",
};
