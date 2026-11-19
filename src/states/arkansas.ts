import type { StateRules } from "./types";

/**
 * Sources: Arkansas DFA Office of Driver Services "Learner's and Intermediate License", and the Arkansas
 * State Police Driver License Study Guide (July 2023), "Types of Graduated Driver's Licenses".
 * Neither sets a number of supervised hours.
 */
export const arkansas: StateRules = {
  code: "AR",
  slug: "arkansas",
  name: "Arkansas",
  program: "graduated driver licensing",
  permitName: "instruction permit",
  // No supervised-hours requirement in the DFA's graduated-license page or the State Police study guide
  noHours: true,
  totalMinutes: 0,
  nightMinutes: 0,
  // Study guide: restricted "for six (6) months from the date of permit issuance or until the applicant's sixteenth (16th) birthday"
  holdMonths: 6,
  holdExtraDays: 0,
  // Study guide: "The permit will be issued for 2 (two) years from the date of the passed knowledge exam."
  permitValidMonths: 24,
  // Study guide: "a licensed driver twenty-one (21) years of age or older, who is occupying a seat beside the driver"
  supervisor: "a licensed driver 21 or older, in the seat beside the driver",
  nightDefinition:
    "Arkansas doesn't require night hours. Drivetron splits each drive into day and night (sunset to sunrise) so you can see how much night practice your teen has had.",
  nightOffsetMinutes: 0,
  practiceNote:
    "Arkansas doesn't set a number of practice hours, so vary the practice: day and night, rain, highways and town, before the six months of restricted driving end.",
  logAtTest:
    "Arkansas doesn't ask for a log or a certification of hours. Drivetron's printed log is your family's own record of the practice.",
  formGuide: {
    title: "What Arkansas asks for instead of logged hours",
    steps: [
      "There's no supervised-hours requirement and no hours form: Arkansas counts six months of restricted driving instead.",
      "The instruction permit (from 14, after the knowledge and vision tests) lets the teen drive with a licensed driver 21 or older beside them.",
      "After the skills test, the learner's or intermediate license stays restricted until the six months from the permit date, and 16, are reached, with no crash or serious violation in the six months before applying.",
      "Drivetron's log keeps a record of what was practiced, day and night, if you want one.",
    ],
  },
  notAffiliatedWith: "the State of Arkansas, the Arkansas Department of Finance and Administration (DFA), or the Arkansas State Police",
  defaultLocation: { lat: 34.7465, lng: -92.2896 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: [
        "From 14, after the knowledge exam and vision test. Valid two years.",
        "Drive with a licensed driver 21 or older in the seat beside you; everyone wears a seat belt.",
      ],
    },
    {
      title: "Step 2: Learner's license (14 to 16) or intermediate license (16 to 18)",
      points: [
        "After the skills test. Restricted to driving with a licensed driver 21 or older until six months from the permit date (and, for a learner's license, until 16).",
        "No crash or serious traffic violation in the six months before applying. No phone use while driving.",
        "Intermediate: no more than one unrelated minor passenger, and no driving 11 p.m. to 4 a.m., unless a licensed driver 21 or older is along (with exceptions for school, church, work and emergencies).",
      ],
    },
    {
      title: "Step 3: Unrestricted license",
      points: ["At 18, with a clean driving record for the previous year."],
    },
  ],
  sources: [
    {
      label: "Arkansas DFA: Learner's and Intermediate License",
      url: "https://www.dfa.arkansas.gov/office/driver-services/licenses-ids-permits/graduated-licenses/learners-and-intermediate-license/",
    },
    {
      label: "Arkansas State Police: Driver License Study Guide (July 2023)",
      url: "https://www.dps.arkansas.gov/wp-content/uploads/Arkansas-DL-Manual-English_July2023_042524.pdf",
    },
  ],
  verified: "2026-11-19",
};
