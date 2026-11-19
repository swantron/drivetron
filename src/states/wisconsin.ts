import type { StateRules } from "./types";

/**
 * Sources: Wisconsin DMV "Probationary driver license requirements"; Wis. Stat. 343.06(1)(cm) (the
 * 50 hours, since 2021 Act 64) and 340.01(23) ("hours of darkness").
 */
export const wisconsin: StateRules = {
  code: "WI",
  slug: "wisconsin",
  name: "Wisconsin",
  program: "Graduated Driver Licensing (GDL)",
  permitName: "instruction permit",
  // 343.06(1)(cm): "at least 50 hours of behind-the-wheel driving experience, at least 10 hours of which were during hours of darkness"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // DMV: "Have held an Instruction Permit for at least six months."
  holdMonths: 6,
  holdExtraDays: 0,
  permitValidMonths: null,
  // 343.07(1g)(a): at least 2 years licensed, in the seat beside: a qualified instructor 19+, a parent,
  // guardian or spouse 19+, or (under 18) a person 21+ designated in writing by the parent or guardian
  supervisor:
    "a driver licensed at least 2 years, in the seat beside: a qualified instructor or parent, guardian, or spouse 19 or older, or someone 21 or older the parent designates in writing",
  // 340.01(23): "from one-half hour after sunset to one-half hour before sunrise"
  nightDefinition:
    "Wisconsin law defines “hours of darkness” as from half an hour after sunset to half an hour before sunrise. Drivetron uses those times at the drive's location.",
  nightOffsetMinutes: 30,
  practiceNote: "Wisconsin's 50 hours include 10 during hours of darkness, from half an hour after sunset.",
  certification: {
    label: "the 50 hours of driving experience required by Wis. Stat. 343.06",
    url: "https://docs.legis.wisconsin.gov/statutes/statutes/343/II/06",
  },
  logAtTest:
    "Wisconsin requires 50 hours of behind-the-wheel experience, 10 during hours of darkness, before the road test, and an adult sponsor signs for the teen's license. Keep the printed log as the record of those hours.",
  formGuide: {
    title: "Counting Wisconsin's 50 hours",
    steps: [
      "The teen needs 50 hours of behind-the-wheel experience, 10 during hours of darkness (half an hour after sunset to half an hour before sunrise), before the road test.",
      "Each hour with a qualified driving instructor counts as 2 hours, for up to 5 instructor hours (10 hours of credit). Drivetron counts drives with family supervisors; add any instructor credit yourself.",
      "Permits issued before July 11, 2021 needed only 30 hours, 10 at night.",
      "An adult sponsor (usually a parent or guardian) signs the license application.",
    ],
  },
  notAffiliatedWith: "the State of Wisconsin or the Wisconsin Department of Transportation Division of Motor Vehicles (DMV)",
  defaultLocation: { lat: 43.0731, lng: -89.4012 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "From 15, after the knowledge test.",
        "Drive with someone licensed at least 2 years in the seat beside you: a qualified instructor or parent, guardian, or spouse 19 or older, or an adult 21 or older your parent designates in writing.",
        "No other passengers except immediate family when a parent, guardian, or spouse is supervising (and, from 16, one more licensed adult 25 or older).",
        "Hold it at least six months, violation-free, before the probationary license.",
      ],
    },
    {
      title: "Step 2: Probationary license",
      points: [
        "From 16, after an approved driver education course and behind-the-wheel training, six violation-free months on the permit, and an adult sponsor.",
        "50 hours of driving experience, 10 at night; then the driving skills test.",
        "First nine months (can be extended to 18): one passenger only besides immediate family or a qualified adult, and no driving from midnight to 5 a.m. except between home and school or work.",
        "Absolute sobriety and seat belts always.",
      ],
    },
  ],
  sources: [
    {
      label: "Wisconsin DMV: Probationary driver license requirements",
      url: "https://wisconsindot.gov/pages/dmv/teen-driver/yr-frst-lcns/drivrlic.aspx",
    },
    { label: "Wis. Stat. 343.06: Restrictions on issuance of license", url: "https://docs.legis.wisconsin.gov/statutes/statutes/343/II/06" },
    { label: "Wis. Stat. 343.07: Instruction permits", url: "https://docs.legis.wisconsin.gov/statutes/statutes/343/II/07" },
    { label: "Wis. Stat. 340.01(23): Hours of darkness", url: "https://docs.legis.wisconsin.gov/statutes/statutes/340/01/23" },
  ],
  verified: "2026-11-19",
};
