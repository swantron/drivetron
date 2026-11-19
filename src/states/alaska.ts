import type { StateRules } from "./types";

/** Sources: Alaska Statutes 28.15.051 (instruction permits), 28.15.055 (provisional license) and 28.15.057. */
export const alaska: StateRules = {
  code: "AK",
  slug: "alaska",
  name: "Alaska",
  program: "provisional licensing",
  permitName: "instruction permit",
  // AS 28.15.055(2): "at least 40 hours of driving experience, including at least 10 hours of driving in
  // progressively challenging circumstances, such as driving in inclement weather and nighttime driving"
  totalMinutes: 40 * 60,
  nightMinutes: 0,
  challengingMinutes: 10 * 60,
  // AS 28.15.055(1): an instruction permit "for at least six months"
  holdMonths: 6,
  holdExtraDays: 0,
  // AS 28.15.051(a): the permit allows driving "for a period not to exceed two years"
  permitValidMonths: 24,
  // AS 28.15.051(a): "a person at least 21 years of age who has been licensed at least one year"
  supervisor: "a licensed driver 21 or older who has been licensed at least a year and can take control of the vehicle",
  nightDefinition:
    "Alaska asks for 10 hours in “progressively challenging circumstances, such as driving in inclement weather and nighttime driving”. Drivetron counts night minutes (sunset to sunrise) plus whole drives tagged with bad weather.",
  nightOffsetMinutes: 0,
  practiceNote:
    "Alaska's 40 hours include 10 in challenging conditions: at night, or in bad weather. Tag a drive Rain, Snow, Ice, Fog or Wind and all of it counts.",
  certification: {
    label: "the parent's proof of 40 hours (AS 28.15.055)",
    url: "https://www.akleg.gov/basis/statutes.asp#28.15.055",
  },
  logAtTest:
    "Alaska asks a parent, legal guardian, or employer to give DMV proof of at least 40 hours of driving, including 10 in challenging conditions such as bad weather and night driving. Drivetron's printed log shows both totals.",
  formGuide: {
    title: "Alaska's 40-hour proof for the provisional license",
    steps: [
      "A parent, legal guardian, or employer provides DMV proof that the teen has at least 40 hours of driving experience.",
      "At least 10 of them must be in progressively challenging conditions, such as bad weather and night driving. Drivetron counts night minutes plus whole drives tagged with bad weather toward them.",
      "The teen also needs six months on the instruction permit and no traffic convictions in the six months before applying.",
    ],
  },
  notAffiliatedWith: "the State of Alaska or the Alaska Division of Motor Vehicles (DMV)",
  defaultLocation: { lat: 58.3019, lng: -134.4197 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "From 14, after the written exam.",
        "Drive with a licensed driver 21 or older, licensed at least a year, who can take control of the vehicle.",
        "Valid up to two years. Hold it at least six months.",
      ],
    },
    {
      title: "Step 2: Provisional license",
      points: [
        "From 16, after six months on the permit, the 40-hour proof (10 in challenging conditions), and no traffic convictions in the last six months.",
        "Passenger limits apply, with exceptions for a parent, legal guardian, sibling, or an adult 21 or older.",
      ],
    },
    {
      title: "Step 3: Driver's license",
      points: ["Before 18: after six months on the provisional license with no traffic convictions in the last six months."],
    },
  ],
  sources: [
    { label: "Alaska Statutes 28.15.051, 28.15.055 and 28.15.057", url: "https://www.akleg.gov/basis/statutes.asp#28.15.055" },
  ],
  verified: "2026-11-19",
};
