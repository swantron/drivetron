import type { StateRules } from "./types";

/** Sources: South Dakota Codified Laws 32-12-11 (instruction permit) and 32-12-12 (restricted minor's permit). */
export const southDakota: StateRules = {
  code: "SD",
  slug: "south-dakota",
  name: "South Dakota",
  program: "graduated licensing",
  permitName: "instruction permit",
  // 32-12-11: "a minimum of fifty hours ... Ten of the mandated hours must be in inclement weather and no less than ten hours must be during night time hours"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  weatherMinutes: 10 * 60,
  // 32-12-11: "at least two hundred seventy-five days if issued after July 1, 2020"; 180 days with driver education (32-12-12)
  holdMonths: 0,
  holdExtraDays: 275,
  permitValidMonths: null,
  // 32-12-11: a parent, legal guardian, or licensed driver over 18 with at least one year of driving experience
  supervisor:
    "a parent, legal guardian, or licensed driver over 18 with at least a year of driving experience, beside the driver; from 10 p.m. to 6 a.m., only a parent or guardian",
  // 32-12-11 says "night time hours" without defining them.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote:
    "South Dakota's 50 hours include 10 at night and 10 in inclement weather. Tag a drive Rain, Snow, Ice, Fog or Wind and its time counts toward the weather hours.",
  certification: {
    label: "the parent's written attestation (SDCL 32-12-11)",
    url: "https://sdlegislature.gov/Statutes/32-12-11",
  },
  logAtTest:
    "South Dakota doesn't ask for the log itself. A parent or legal guardian attests in writing that the teen met the instruction permit requirements, including 50 hours with 10 at night and 10 in inclement weather, before the restricted minor's permit. Keep the printed log as the record behind that attestation.",
  formGuide: {
    title: "South Dakota's 50 hours and the parent's attestation",
    steps: [
      "The teen drives at least 50 hours with a parent, legal guardian, or licensed driver over 18 with a year of experience: 10 at night and 10 in inclement weather. Drivetron's printed log shows all three totals.",
      "A parent or legal guardian attests in writing that the requirements are met before the teen applies for the restricted minor's permit.",
      "The permit must be held 275 days, or 180 days after an approved driver education course, with no traffic convictions in the last six months.",
    ],
  },
  notAffiliatedWith: "the State of South Dakota or the South Dakota Department of Public Safety",
  defaultLocation: { lat: 44.3683, lng: -100.351 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "From 14, after the written exam.",
        "From 6 a.m. to 10 p.m. with a licensed driver 18 or older with a year of experience beside you; from 10 p.m. to 6 a.m. only with a parent or guardian beside you.",
        "No wireless devices while driving.",
        "Hold it 275 days (180 with approved driver education).",
      ],
    },
    {
      title: "Step 2: Restricted minor's permit",
      points: [
        "After the permit period, the 50 hours (10 at night, 10 in inclement weather), the parent's written attestation, the tests, and six months with no traffic convictions.",
        "From 6 a.m. to 10 p.m. with the parent's or guardian's permission; from 10 p.m. to 6 a.m. only under the parent's or guardian's direction.",
      ],
    },
  ],
  sources: [
    { label: "SDCL 32-12-11: Instruction permit", url: "https://sdlegislature.gov/Statutes/32-12-11" },
    { label: "SDCL 32-12-12: Restricted minor's permit", url: "https://sdlegislature.gov/Statutes/32-12-12" },
  ],
  verified: "2026-11-19",
};
