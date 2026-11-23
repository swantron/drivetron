import type { StateRules } from "./types";

/** Sources: ALEA "Graduated Driver License" page and the Graduated Driver License Form (DL-31, rev. 09/21). */
export const alabama: StateRules = {
  code: "AL",
  slug: "alabama",
  name: "Alabama",
  program: "Graduated Driver License",
  permitName: "Stage I learner's license",
  // DL-31: "a minimum of 50 hours of behind-the-wheel driving practice", unless the applicant completed driver education
  totalMinutes: 50 * 60,
  // Alabama sets no night-hours requirement
  nightMinutes: 0,
  // ALEA: under 18, "must have a Stage I license for at least 6 months before applying for a Stage II license"
  holdMonths: 6,
  holdExtraDays: 0,
  permitValidMonths: null,
  // ALEA: "a parent, legal guardian or licensed driver who is age 21 or older and occupying the front seat"
  supervisor: "a parent, legal guardian, or licensed driver 21 or older, or a licensed driving instructor, in the front seat",
  nightDefinition: "Alabama doesn't require night hours. Drivetron still splits each drive into day and night (sunset to sunrise).",
  nightOffsetMinutes: 0,
  practiceNote: "Alabama asks for 50 hours of behind-the-wheel practice, unless the teen completes an approved driver education course.",
  certification: {
    label: "the Behind the Wheel Verification on ALEA form DL-31",
    url: "https://ALEA.gov/sites/default/files/inline-files/DL-31.pdf",
  },
  formName: "form DL-31",
  logAtTest:
    "Alabama doesn't ask for the log itself. A parent or legal guardian signs the Behind the Wheel Verification on form DL-31, certifying 50 hours; a driver education completion certificate takes its place. Keep the printed log as the record behind that signature.",
  formGuide: {
    form: { label: "ALEA DL-31 (PDF)", url: "https://ALEA.gov/sites/default/files/inline-files/DL-31.pdf" },
    title: "How to fill in Alabama's DL-31 (Graduated Driver License Form)",
    steps: [
      "DL-31 has three parts. In the Behind the Wheel Verification, a parent or legal guardian certifies the teen has completed at least 50 hours of driving practice. Drivetron's printed log shows the total.",
      "If the teen completed an Alabama Department of Education driver education course, the Certificate of Completion part is used instead of the 50 hours.",
      "The parent also signs the Permission to Drive Without Supervision part, which the Stage II license needs.",
    ],
  },
  notAffiliatedWith: "the State of Alabama or the Alabama Law Enforcement Agency (ALEA)",
  defaultLocation: { lat: 32.3668, lng: -86.3 },
  stages: [
    {
      title: "Stage I: Learner's license",
      points: [
        "From 15, after the written exam.",
        "Drive only with a parent, legal guardian, or licensed driver 21 or older, or a licensed driving instructor, in the front seat beside you.",
        "Under 18, hold it at least six months.",
      ],
    },
    {
      title: "Stage II: Restricted license",
      points: [
        "From 16, after six months at Stage I, a parent's permission, 50 hours of practice or driver education, and the road skills exam.",
        "No driving from midnight to 6 a.m. unless with a parent or guardian (or a licensed adult 21 or older with their consent), or for school or religious events, work, or emergencies.",
        "No more than one passenger besides parents, guardians, or family, and no handheld devices.",
      ],
    },
    {
      title: "Stage III: Unrestricted license",
      points: ["At 17 after six months at Stage II, or at 18."],
    },
  ],
  sources: [
    { label: "ALEA: Graduated Driver License", url: "https://www.alea.gov/dps/driver-license/license-and-id-cards/graduated-driver-license" },
    { label: "ALEA DL-31: Graduated Driver License Form", url: "https://ALEA.gov/sites/default/files/inline-files/DL-31.pdf" },
  ],
  verified: "2026-11-19",
};
