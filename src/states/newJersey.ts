import type { StateRules } from "./types";

/**
 * Sources: NJ MVC "Young Adult" licensing page, the MVC news release of January 31, 2025 (the 50-hour
 * law), the Certification of Supervised Driving (BA-CSD, rev. 1/25), and the Share the Keys resource guide.
 */
export const newJersey: StateRules = {
  code: "NJ",
  slug: "new-jersey",
  name: "New Jersey",
  program: "Graduated Driver License (GDL)",
  permitName: "learner's permit",
  // BA-CSD: "a minimum of 50 hours with supervision, including 10 hours during darkness"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // MVC news release: "must wait at least six months from the permit issuance date before they can take a road test"
  holdMonths: 6,
  holdExtraDays: 0,
  permitValidMonths: null,
  // MVC Young Adult: "at least 21 years of age ... a valid New Jersey driver's license, and has a minimum of three years driving experience"
  supervisor:
    "a licensed New Jersey driver 21 or older with at least three years of driving experience, in the front seat",
  // BA-CSD says "during darkness" without defining it.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "New Jersey's 50 hours include 10 during darkness.",
  certification: {
    label: "the Certification of Supervised Driving (BA-CSD)",
    url: "https://www.nj.gov/mvc/pdf/license/BA-CSD.pdf",
  },
  logAtTest:
    "New Jersey doesn't ask for the log. Only the signed Certification of Supervised Driving (BA-CSD) meets the requirement; the MVC suggests keeping a log to track the hours. Keep the printed log as the record behind that signature.",
  formGuide: {
    form: { label: "NJ MVC BA-CSD (PDF)", url: "https://www.nj.gov/mvc/pdf/license/BA-CSD.pdf" },
    title: "How to fill in New Jersey's BA-CSD (Certification of Supervised Driving)",
    steps: [
      "BA-CSD certifies at least 50 hours of supervised driving, 10 during darkness, all with a licensed New Jersey driver 21 or older. Drivetron's printed log shows the total and the night hours.",
      "The parent, guardian, or supervising driver prints it and signs it by hand before the visit.",
      "Bring it when the teen applies for the probationary license, after passing the road test. A fraudulent certification suspends the teen's driving privileges for six months.",
      "It applies to permits issued on or after February 1, 2025, to teens under 21.",
    ],
  },
  notAffiliatedWith: "the State of New Jersey or the New Jersey Motor Vehicle Commission (MVC)",
  defaultLocation: { lat: 40.2206, lng: -74.7597 },
  stages: [
    {
      title: "Step 1: Learner's permit",
      points: [
        "From 16 with a special learner's permit through a high school program or licensed driving school (including 6 hours of behind-the-wheel instruction), or from 17 with an examination permit.",
        "A parent or guardian consents, and the teen passes the knowledge and vision tests.",
        "Drive only with a licensed New Jersey driver 21 or older with at least three years of experience, in the front seat.",
        "No more than one other passenger unless a parent or guardian is along; no phones or other wireless devices, even hands-free.",
        "Practice at least six months before the road test.",
      ],
    },
    {
      title: "Step 2: Probationary license",
      points: [
        "From 17, after passing the road test and presenting BA-CSD for 50 hours of supervised driving, 10 during darkness.",
        "No driving from 11:01 p.m. to 5 a.m., except for work or religious reasons with a certification on letterhead.",
        "One passenger only, unless a parent or guardian is along or the passengers are the driver's dependents.",
        "No phones or wireless devices, even hands-free; GDL decals on the license plates.",
        "After a year of unsupervised driving, and at 18, upgrade to a basic license.",
      ],
    },
  ],
  sources: [
    { label: "NJ MVC: Young Adult licensing", url: "https://www.nj.gov/mvc/license/youngadult.htm" },
    {
      label: "NJ MVC news release: 50 hours of practice driving for under-21 permit holders (Jan. 31, 2025)",
      url: "https://www.nj.gov/mvc/press/archives/2025/01312025.htm",
    },
    { label: "NJ MVC BA-CSD: Certification of Supervised Driving (rev. 1/25)", url: "https://www.nj.gov/mvc/pdf/license/BA-CSD.pdf" },
    { label: "NJ MVC: Share the Keys resource guide", url: "https://www.nj.gov/mvc/pdf/license/STKResourceGuide2025.pdf" },
  ],
  verified: "2026-11-19",
};
