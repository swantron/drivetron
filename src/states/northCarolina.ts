import type { StateRules } from "./types";

/**
 * Sources: N.C. General Statute 20-11 (graduated licensing), NCDMV's Level 2 Limited Provisional
 * License and learner permit pages, and the driving log, Form DL-4A.
 */
export const northCarolina: StateRules = {
  code: "NC",
  slug: "north-carolina",
  name: "North Carolina",
  program: "Graduated Licensing",
  permitName: "limited learner permit",
  // G.S. 20-11(d)(5) and DL-4A: "a minimum of 60 hours", "At least 10 of the 60 hours must be at night"
  totalMinutes: 60 * 60,
  nightMinutes: 10 * 60,
  // NCDMV Level 2: "Have a Level 1 Limited Learner Permit for 9 months"
  holdMonths: 9,
  holdExtraDays: 0,
  // G.S. 20-11: the permit runs until the 18th birthday, not a term from its issue date
  permitValidMonths: null,
  // G.S. 20-11(b) and DL-4A: licensed for at least five years, seated beside the driver in the front seat
  supervisor:
    "a parent, grandparent, or guardian, or a responsible adult they approve, licensed at least five years and seated beside the teen in the front seat",
  // Neither G.S. 20-11 nor DL-4A says when "night" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  // DL-4A: "No more than 10 hours per week may count toward the 60 hours."
  countLimit: { minutes: 10 * 60, per: "week" },
  practiceNote: "North Carolina's log only counts up to 10 hours a week, so steady practice gets there sooner than long weekends.",
  certification: {
    label: "the driving log (Form DL-4A), signed by the supervising driver",
    url: "https://www.ncdot.gov/dmv/downloads/Documents/DL-4A.pdf",
  },
  formName: "form DL-4A",
  // No practiceLog: DL-4A asks for each supervising driver's license number and state, which Drivetron doesn't keep.
  logAtTest:
    "North Carolina's driving log (Form DL-4A) lists each drive's date, day and night time, and the supervising driver's name and license number, and the supervising driver signs it. NCDMV takes digital or printed logs when the teen applies for the Level 2 license. Only 10 hours a week count. Keep the drives in Drivetron, with day and night already split, then copy them onto the form.",
  formGuide: {
    form: { label: "NCDMV Form DL-4A (PDF)", url: "https://www.ncdot.gov/dmv/downloads/Documents/DL-4A.pdf" },
    title: "How to fill in North Carolina Form DL-4A (driving log)",
    steps: [
      "DL-4A has a line for each drive: the date, time of day or night, the amount of driving time, and the supervising driver's printed name and license number and state. Copy the date and day and night time from Drivetron; add the license numbers yourself (Drivetron doesn't keep them).",
      "Only 10 hours a week count toward the 60. Drivetron's “counts toward the 60 hours” total already applies the limit.",
      "The supervising driver signs the certification, and the log is turned in when the teen applies for the Level 2 license. NCDMV accepts digital or printed copies.",
    ],
  },
  notAffiliatedWith: "the State of North Carolina, the N.C. Department of Transportation, or the Division of Motor Vehicles (NCDMV)",
  defaultLocation: { lat: 35.7796, lng: -78.6382 },
  stages: [
    {
      title: "Level 1: Limited learner permit",
      points: [
        "From age 15, with a driver education certificate.",
        "Drive only with a parent, grandparent, or guardian, or an adult they approve, who has been licensed at least five years and sits beside you in the front seat.",
        "For the first six months, only from 5 a.m. to 9 p.m. After that, at any time with the supervising driver.",
        "No mobile phone use while driving.",
        "Hold it at least nine months before Level 2.",
      ],
    },
    {
      title: "Level 2: Limited provisional license",
      points: [
        "From age 16, after nine months on the permit and passing the road test.",
        "A driving log (Form DL-4A) of at least 60 hours, 10 at night, signed by the supervising driver. Only 10 hours a week count toward the 60.",
        "Unsupervised driving from 5 a.m. to 9 p.m., and to or from work or volunteer fire, rescue, or EMS service; with a supervising driver at other times.",
        "Driving unsupervised, no more than one passenger under 21 outside the household.",
      ],
    },
    {
      title: "Level 3: Full provisional license",
      points: ["After at least six months at Level 2. The time and passenger limits end; the mobile phone ban still applies."],
    },
  ],
  sources: [
    {
      label: "N.C. General Statute 20-11 (graduated licensing)",
      url: "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_20/GS_20-11.html",
    },
    {
      label: "NCDMV: Level 2 Limited Provisional License",
      url: "https://www.ncdot.gov/dmv/license-id/driver-licenses/new-drivers/Pages/level2.aspx",
    },
    {
      label: "NCDMV: Limited learner permit (Level 1)",
      url: "https://www.ncdot.gov/dmv/license-id/driver-licenses/new-drivers/Pages/level1.aspx",
    },
    { label: "NCDMV Form DL-4A: Driving Log to Advance to Level 2", url: "https://www.ncdot.gov/dmv/downloads/Documents/DL-4A.pdf" },
  ],
  verified: "2026-11-18",
};
