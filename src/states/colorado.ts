import type { StateRules } from "./types";

/**
 * Sources: Colorado DMV Drive Time Log Sheet (DR 2324, 02/11/22) and CDOT's "Colorado Graduated
 * Driver Licensing Laws" resource guide.
 */
export const colorado: StateRules = {
  code: "CO",
  slug: "colorado",
  name: "Colorado",
  program: "Graduated Driver Licensing (GDL)",
  permitName: "instruction permit",
  // CDOT: "50 hours of logged driving time (10 of the 50 hours must be at night)"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // DR 2324: "hold your first instruction permit for at least twelve months"
  holdMonths: 12,
  holdExtraDays: 0,
  permitValidMonths: null,
  // CDOT: "the Colorado-licensed parent or legal guardian who signed the Affidavit of Liability, or a Colorado-licensed alternate permit supervisor"
  supervisor:
    "the Colorado-licensed parent or legal guardian who signed the Affidavit of Liability and Guardianship, or a Colorado-licensed alternate permit supervisor they appoint",
  // Neither DR 2324 nor CDOT's guide says when "night" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Colorado's 50 hours include 10 at night, logged on DR 2324.",
  certification: {
    label: "the Drive Time Log Sheet (DR 2324)",
    url: "https://dmv.colorado.gov/sites/dmv/files/documents/DR2324_2022.pdf",
  },
  formName: "form DR 2324",
  // DR 2324 columns: date, verifier's initials, driving time, night driving time, comments.
  practiceLog: {
    label: "Colorado DMV Drive Time Log Sheet (DR 2324)",
    url: "https://dmv.colorado.gov/sites/dmv/files/documents/DR2324_2022.pdf",
  },
  logAtTest:
    "Colorado requires the Drive Time Log Sheet (DR 2324) when the teen applies for the license: a line for each drive and totals signed by the parent, guardian, or responsible adult. Drivetron's printed log has the same columns, so copying it over is quick.",
  formGuide: {
    form: { label: "Colorado DMV DR 2324 (PDF)", url: "https://dmv.colorado.gov/sites/dmv/files/documents/DR2324_2022.pdf" },
    title: "How to fill in Colorado's DR 2324 (Drive Time Log Sheet)",
    steps: [
      "Each line on DR 2324 has the date, the verifier's initials, the driving time, the night driving time, and comments. Drivetron's printed log has the same columns; copy each drive across.",
      "Enter the totals on the back of the last sheet. The parent, guardian, or responsible adult signs and dates only that last sheet.",
      "If a parent, guardian, or alternate supervisor gave the behind-the-wheel training, include those hours in the total.",
      "Submit the completed log when the teen applies for the license, after 12 full months on the permit.",
    ],
  },
  notAffiliatedWith: "the State of Colorado, the Colorado Department of Revenue Division of Motor Vehicles, or the Colorado Department of Transportation (CDOT)",
  defaultLocation: { lat: 39.7392, lng: -104.9903 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "From 15 with a 30-hour driver education course, from 15½ with a 4-hour driver awareness program, or from 16.",
        "A parent or legal guardian signs the Affidavit of Liability and Guardianship.",
        "Drive with the signing parent or guardian, or an alternate permit supervisor they appoint.",
        "Hold it 12 full months. A teen under 16½ when applying for the license also needs 6 hours of behind-the-wheel training with an instructor.",
      ],
    },
    {
      title: "Step 2: Restricted license",
      points: [
        "From 16, after 12 months on the permit, 50 logged hours (10 at night), and the road test.",
        "No driving from midnight to 5 a.m. for the first year, unless with a parent or guardian, or a licensed adult 21 or older.",
        "No passengers under 21 for the first 6 months, and no more than one for the next 6, unless a parent, guardian, or licensed adult 21 or older is along, or for family.",
        "After 12 months, or at 18, the restrictions end.",
      ],
    },
  ],
  sources: [
    { label: "Colorado DMV DR 2324: Drive Time Log Sheet", url: "https://dmv.colorado.gov/sites/dmv/files/documents/DR2324_2022.pdf" },
    {
      label: "CDOT: Colorado Graduated Driver Licensing Laws",
      url: "https://www.codot.gov/safety/colorado-teen-drivers/assets/2025-assets/teendriving_gdlresourceguide_cdotreview_ada-1.pdf",
    },
  ],
  verified: "2026-11-19",
};
