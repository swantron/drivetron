import type { StateRules } from "./types";

/**
 * Sources: Tennessee Department of Safety and Homeland Security "Teen/Graduated Driver License" and
 * "Types of Issued Licenses" pages, and the Certification of 50 Hours Behind the Wheel Driving Experience.
 */
export const tennessee: StateRules = {
  code: "TN",
  slug: "tennessee",
  name: "Tennessee",
  program: "Graduated Driver License (GDL)",
  permitName: "learner permit",
  // Certification: "fifty (50) hours of behind the wheel driving including a minimum of ten (10) hours of driving at night"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // Department of Safety: "You must hold a learner permit for 180 days" — counted in days, not months
  holdMonths: 0,
  holdExtraDays: 180,
  permitValidMonths: null,
  // Department of Safety: "a licensed driver 21 years or older who is riding in the front seat"
  supervisor: "a licensed driver 21 or older, riding in the front seat",
  // The certification doesn't say when "night" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Tennessee's 50 hours include 10 at night, and learners can't drive from 10 p.m. to 6 a.m.",
  certification: {
    label: "the Certification of 50 Hours Behind the Wheel Driving Experience",
    url: "https://www.tn.gov/content/dam/tn/safety/documents/gdl50hrcertificate.pdf",
  },
  logAtTest:
    "Tennessee doesn't ask for the log itself. A parent, guardian, or licensed driving instructor signs the Certification of 50 Hours Behind the Wheel Driving Experience, with their driver license number. Keep the printed log as the record behind that signature.",
  formGuide: {
    form: { label: "Tennessee 50-hour certification (PDF)", url: "https://www.tn.gov/content/dam/tn/safety/documents/gdl50hrcertificate.pdf" },
    title: "How to fill in Tennessee's Certification of 50 Hours Behind the Wheel Driving Experience",
    steps: [
      "The form asks for the permit holder's name, Tennessee permit number, and address, and the certifying parent's, guardian's, or licensed instructor's name, driver license number, and address.",
      "The signer affirms the teen has completed 50 hours of behind-the-wheel driving, at least 10 at night, and gives their relationship to the teen. Drivetron's printed log shows both totals.",
      "Bring it when the teen applies for the Intermediate Restricted License and takes the road skills test.",
    ],
  },
  notAffiliatedWith: "the State of Tennessee or the Tennessee Department of Safety and Homeland Security",
  defaultLocation: { lat: 36.1627, lng: -86.7816 },
  stages: [
    {
      title: "Level 1: Learner permit",
      points: [
        "From 15, after the knowledge test and vision screening; a parent or guardian signs the teenage affidavit and financial responsibility form.",
        "Drive only with a licensed driver 21 or older in the front seat.",
        "No driving from 10 p.m. to 6 a.m.",
        "Hold it at least 180 days.",
      ],
    },
    {
      title: "Level 2: Intermediate Restricted License",
      points: [
        "From 16, after 180 days on the permit, the road skills test, and the 50-hour certification (10 at night).",
        "No more than six points on the record in the 180 days before applying.",
        "One passenger only, and no driving from 11 p.m. to 6 a.m.",
      ],
    },
    {
      title: "Level 3: Intermediate Unrestricted License",
      points: ["From 17, after a year at Level 2 without six or more points, an at-fault crash, or a second seat belt violation."],
    },
  ],
  sources: [
    { label: "Tennessee Department of Safety: Teen/Graduated Driver License", url: "https://www.tn.gov/safety/driver-services/classd/teengdl.html" },
    { label: "Tennessee Department of Safety: Types of Issued Licenses", url: "https://www.tn.gov/safety/driver-services/helpful-information/dlinfo.html" },
    {
      label: "Certification of 50 Hours Behind the Wheel Driving Experience",
      url: "https://www.tn.gov/content/dam/tn/safety/documents/gdl50hrcertificate.pdf",
    },
  ],
  verified: "2026-11-19",
};
