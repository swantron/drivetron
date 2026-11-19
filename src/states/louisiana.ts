import type { StateRules } from "./types";

/** Sources: Louisiana OMV "Graduated Licensing Program" and "Class E – Intermediate License" sheets. */
export const louisiana: StateRules = {
  code: "LA",
  slug: "louisiana",
  name: "Louisiana",
  program: "Graduated Licensing Program",
  permitName: "learner's permit",
  // OMV: "a minimum of fifty (50) hours ... At least fifteen (15) of these hours must be night time driving"
  totalMinutes: 50 * 60,
  nightMinutes: 15 * 60,
  // OMV: "shall maintain the learner's permit for a minimum of 180 days"
  holdMonths: 0,
  holdExtraDays: 180,
  permitValidMonths: null,
  // OMV: learner's permit holders "shall drive with a licensed parent, guardian, or adult at least 21 years old, or a licensed sibling at least 18"
  supervisor:
    "a licensed parent or guardian, a licensed adult 21 or older, or a licensed brother or sister 18 or older; the 50 hours with a parent, guardian, or adult 21 or older",
  // OMV doesn't say when "night time driving" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Louisiana's 50 hours include 15 at night.",
  certification: {
    label: "the parent's attestation for the intermediate license",
    url: "https://expresslane.dps.louisiana.gov/CDLForms/Upgrade%20to%20Intermediate%20License.pdf",
  },
  logAtTest:
    "Louisiana doesn't ask for the log itself. A parent or legal guardian attests that the teen completed 50 hours, 15 at night, with a licensed parent, guardian, or adult 21 or older, when the teen upgrades to the intermediate license. Keep the printed log as the record behind that attestation.",
  formGuide: {
    title: "Louisiana's parent attestation for the intermediate license",
    steps: [
      "When the teen upgrades to the intermediate license, a parent or legal guardian attests to at least 50 hours of behind-the-wheel driving, 15 at night, with a licensed parent, guardian, or adult 21 or older.",
      "A custodial parent signs the upgrade; with joint custody, only the domiciliary parent may sign.",
      "Check Drivetron's total and night hours before signing.",
    ],
  },
  notAffiliatedWith: "the State of Louisiana or the Louisiana Office of Motor Vehicles (OMV)",
  defaultLocation: { lat: 30.4515, lng: -91.1871 },
  stages: [
    {
      title: "Stage 1: Learner's permit",
      points: [
        "From 15, after a 38-hour driver education course (30 classroom, 8 behind the wheel), the knowledge test, and a vision screening.",
        "Drive with a licensed parent or guardian, a licensed adult 21 or older, or a licensed sibling 18 or older.",
        "Hold it at least 180 days.",
      ],
    },
    {
      title: "Stage 2: Intermediate license",
      points: [
        "From 16, after 180 days on the permit, 50 supervised hours (15 at night), and the road skills test.",
        "No driving from 11 p.m. to 5 a.m. unless with a licensed parent or guardian, adult 21 or older, or sibling 18 or older.",
        "From 6 p.m. to 5 a.m., no more than one passenger under 21 outside the immediate family unless a licensed adult 21 or older is along.",
      ],
    },
    {
      title: "Stage 3: Full license",
      points: ["From 17, with no at-fault crashes or moving, seat belt, or curfew convictions at Stage 2."],
    },
  ],
  sources: [
    {
      label: "Louisiana OMV: Graduated Licensing Program",
      url: "https://expresslane.dps.louisiana.gov/CDLForms/Graduated%20Licensing%20program.pdf",
    },
    {
      label: "Louisiana OMV: Class E Intermediate License",
      url: "https://expresslane.dps.louisiana.gov/CDLForms/Upgrade%20to%20Intermediate%20License.pdf",
    },
  ],
  verified: "2026-11-19",
};
