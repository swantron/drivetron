import type { StateRules } from "./types";

/** Sources: Service Oklahoma "Learner Permit" and "Intermediate License" pages. */
export const oklahoma: StateRules = {
  code: "OK",
  slug: "oklahoma",
  name: "Oklahoma",
  program: "Graduated Driver License (GDL)",
  permitName: "learner permit",
  // Service Oklahoma: "at least 50 hours (including 10 hours at night) of behind-the-wheel training"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // Service Oklahoma: "Have held a Learner Permit for at least 180 days"
  holdMonths: 0,
  holdExtraDays: 180,
  permitValidMonths: null,
  // Service Oklahoma: "a licensed driver that is at least 21 years old and has been licensed for at least 2 years"
  supervisor: "a licensed driver 21 or older who has been licensed at least 2 years",
  // Service Oklahoma doesn't say when "night" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Oklahoma's 50 hours include 10 at night, with a driver licensed at least 2 years.",
  certification: {
    label: "the parent's Affidavit of Driver Training",
    url: "https://oklahoma.gov/service/all-pages/learner-permit.html",
  },
  logAtTest:
    "Service Oklahoma doesn't accept driving logs. A parent verifies the 50 hours, 10 at night, on the Affidavit of Driver Training. Keep the printed log as the record behind that affidavit.",
  formGuide: {
    title: "Oklahoma's Affidavit of Driver Training",
    steps: [
      "Service Oklahoma doesn't accept driving logs. Instead, a parent signs the Affidavit of Driver Training verifying at least 50 hours of behind-the-wheel training, 10 at night.",
      "The hours count with a licensed driver 21 or older who has been licensed at least 2 years.",
      "The teen also needs the free Oklahoma WorkZone Safe course certificate for the intermediate license.",
    ],
  },
  notAffiliatedWith: "the State of Oklahoma or Service Oklahoma",
  defaultLocation: { lat: 35.4676, lng: -97.5164 },
  stages: [
    {
      title: "Step 1: Learner permit",
      points: [
        "From 15, after the written and vision tests.",
        "Practice with a licensed driver 21 or older who has been licensed at least 2 years.",
        "Hold it at least 180 days.",
      ],
    },
    {
      title: "Step 2: Intermediate license",
      points: [
        "From 16, after 180 days on the permit, 50 hours (10 at night), no traffic convictions, the WorkZone Safe course, and the drive test. Under 16½, driver education is also required.",
        "Drive from 5 a.m. to 10 p.m., or any time for school, church, or work, or with a licensed driver 21 or older in the front seat.",
        "One passenger, or only household members, unless a licensed driver 21 or older is in the front seat.",
      ],
    },
  ],
  sources: [
    { label: "Service Oklahoma: Learner Permit", url: "https://oklahoma.gov/service/all-pages/learner-permit.html" },
    { label: "Service Oklahoma: Intermediate License", url: "https://oklahoma.gov/service/all-pages/intermediate-license.html" },
  ],
  verified: "2026-11-19",
};
