import type { StateRules } from "./types";

/**
 * Sources: Hawaii County Vehicle Registration & Licensing "Graduated License (15½ - 17 Years)" and
 * HRS §286-102.6. Neither sets a number of supervised hours; the "50 hours, 10 at night" on
 * third-party sites isn't in either.
 */
export const hawaii: StateRules = {
  code: "HI",
  slug: "hawaii",
  name: "Hawaii",
  program: "graduated licensing",
  permitName: "instruction permit",
  // No supervised-hours requirement; the provisional license asks for driver's education instead
  noHours: true,
  totalMinutes: 0,
  nightMinutes: 0,
  // County: "has held that permit for at least 180 days"
  holdMonths: 0,
  holdExtraDays: 180,
  // County: "The permit is valid for one (1) year from date of issuance"
  permitValidMonths: 12,
  // County: "seated next to a person who is at least 21 years of age and licensed to operate the same type of motor vehicle"
  supervisor:
    "a licensed driver 21 or older, seated next to the driver; from 11 p.m. to 5 a.m., a licensed parent or guardian",
  nightDefinition:
    "Hawaii doesn't require night hours. Drivetron splits each drive into day and night (sunset to sunrise) so you can see how much night practice your teen has had.",
  nightOffsetMinutes: 0,
  practiceNote:
    "Hawaii doesn't set a number of practice hours; driver's education covers the behind-the-wheel training. Practice at home adds the variety: night, rain, highways and town.",
  logAtTest:
    "Hawaii doesn't ask for a log or a certification of hours; the provisional license asks for the driver's education classroom and behind-the-wheel certificates. Drivetron's printed log is your family's own record of the practice.",
  formGuide: {
    title: "What Hawaii asks for instead of logged hours",
    steps: [
      "There's no supervised-hours requirement and no hours form.",
      "For the provisional license, bring the state-certified driver's education classroom and behind-the-wheel certificates, after holding the instruction permit at least 180 days, from 16.",
      "Then pass the road test.",
      "Drivetron's log keeps a record of the practice at home, day and night, if you want one.",
    ],
  },
  notAffiliatedWith: "the State of Hawaii or any county driver licensing office",
  defaultLocation: { lat: 21.3069, lng: -157.8583 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "From 15½. Valid one year.",
        "Drive seated next to a licensed driver 21 or older; from 11 p.m. to 5 a.m., it must be a parent or guardian.",
      ],
    },
    {
      title: "Step 2: Provisional license",
      points: [
        "From 16, after 180 days on the permit, state-certified driver's education (classroom and behind-the-wheel), and the road test.",
        "No driving 11 p.m. to 5 a.m. without a licensed parent or guardian, except for work or school activities; no more than one passenger under 18 unless a parent or guardian is along (household members excepted).",
      ],
    },
    {
      title: "Step 3: Full license",
      points: ["From 17, after six months on the provisional license with no pending violation."],
    },
  ],
  sources: [
    {
      label: "Hawaii County VRL: Graduated License (15½ - 17 Years)",
      url: "https://www.vrl.hawaiicounty.gov/driver-s-licensing/new-license-instruction-permit/minors-special-requirements/graduated-license-minors",
    },
    { label: "HRS §286-102.6", url: "https://www.capitol.hawaii.gov/hrscurrent/Vol05_Ch0261-0319/HRS0286/HRS_0286-0102_0006.htm" },
  ],
  verified: "2026-11-19",
};
