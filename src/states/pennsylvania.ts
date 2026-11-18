import type { StateRules } from "./types";

/**
 * Sources: PennDOT "Young Driver" page (the Graduated Driver Licensing law), its fact sheet "What You Need
 * To Know About Pennsylvania's Young Driver Law", the Parent or Guardian Certification Form (DL-180C,
 * rev. 6-25) and the Non-Commercial Learner's Permit Application (DL-180).
 */
export const pennsylvania: StateRules = {
  code: "PA",
  slug: "pennsylvania",
  name: "Pennsylvania",
  program: "Graduated Driver Licensing",
  permitName: "learner's permit",
  // DL-180C: "at least 65 hours of supervised practical driving experience, including ... 10 hours of
  // nighttime driving and 5 hours of inclement weather driving"
  totalMinutes: 65 * 60,
  nightMinutes: 10 * 60,
  weatherMinutes: 5 * 60,
  // Young Driver: "A six-month skill-building period ... is required before a young driver may take the road test"
  holdMonths: 6,
  holdExtraDays: 0,
  // Young Driver: "The learner's permit will be valid for one year with extensions for those requiring more practice time."
  permitValidMonths: 12,
  // DL-180C: the 65 hours were "given by a licensed driver(s) 21 years of age or older"
  supervisor: "a licensed driver 21 or older, for the 65 hours a parent certifies",
  // Neither PennDOT's young driver pages nor DL-180C say when "nighttime" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote:
    "Pennsylvania's 65 hours include 5 in bad weather. Tag a drive Rain, Snow, Ice, Fog or Wind and its time counts toward them.",
  certification: {
    label: "the Parent or Guardian Certification Form (DL-180C)",
    url: "https://www.pa.gov/content/dam/copapwp-pagov/en/penndot/documents/public/dvspubsforms/bdl/bdl-form/dl-180c.pdf",
  },
  // No practiceLog: PennDOT has no log form of its own; DL-180C certifies the totals.
  logAtTest:
    "Pennsylvania doesn't ask for the log itself. A parent or guardian signs the DL-180C certifying the 65 hours, 10 at night and 5 in bad weather, in front of the driver license examiner at the road test, or before a notary if they won't be there. Keep the printed log as the record behind that signature.",
  notAffiliatedWith: "the Commonwealth of Pennsylvania or the Pennsylvania Department of Transportation (PennDOT)",
  defaultLocation: { lat: 40.2732, lng: -76.8867 },
  stages: [
    {
      title: "Step 1: Learner's permit",
      points: [
        "From age 16, after a physical examination, vision screening, and knowledge test.",
        "An experienced, licensed driver 21 or older rides along at all times.",
        "Valid for one year, with extensions for teens who need more practice time.",
        "No driving from 11 p.m. to 5 a.m., except for work or volunteer or charitable service, with documentation.",
        "Six points or a single violation of 26 mph or more over the limit suspends the permit for 90 days.",
      ],
    },
    {
      title: "Step 2: Junior license",
      points: [
        "After at least six months on the permit and passing the road test.",
        "65 hours of adult-supervised driving, at least 10 at night and 5 in bad weather, certified by a parent or guardian on form DL-180C.",
        "The DL-180C is signed before the examiner at the road test, or before a notary if the parent or guardian isn't coming.",
        "No driving from 11 p.m. to 5 a.m., except for work or volunteer or charitable service, with documentation.",
        "One passenger under 18 outside the immediate family, or three after the first six months, unless a parent or guardian is along. A crash the teen caused or any conviction keeps the one-passenger limit until 18.",
        "No more passengers than seat belts, and everyone under 18 buckles up.",
      ],
    },
    {
      title: "Unrestricted license",
      points: [
        "Usually at 18. Earlier only after 12 months with no crashes or convictions, an approved driver's education course, and form DL-59 with a parent's consent.",
      ],
    },
  ],
  sources: [
    {
      label: "PennDOT: Young Driver (Graduated Driver Licensing)",
      url: "https://www.pa.gov/agencies/penndot/traveling-in-pa/safety/traffic-safety-driver-topics/young-driver.html",
    },
    {
      label: "PennDOT fact sheet: What You Need To Know About Pennsylvania's Young Driver Law",
      url: "https://www.pa.gov/content/dam/copapwp-pagov/en/penndot/documents/public/dvspubsforms/bdl/bdl-fact-sheets/fs-wy.pdf",
    },
    {
      label: "PennDOT DL-180C: Parent or Guardian Certification Form (rev. 6-25)",
      url: "https://www.pa.gov/content/dam/copapwp-pagov/en/penndot/documents/public/dvspubsforms/bdl/bdl-form/dl-180c.pdf",
    },
    {
      label: "PennDOT DL-180: Non-Commercial Learner's Permit Application",
      url: "https://www.pa.gov/content/dam/copapwp-pagov/en/penndot/documents/public/dvspubsforms/bdl/bdl-form/dl-180.pdf",
    },
  ],
  verified: "2026-11-18",
};
