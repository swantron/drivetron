import type { StateRules } from "./types";

/** Source: Kentucky Revised Statutes 186.452 (intermediate license), effective March 25, 2025. */
export const kentucky: StateRules = {
  code: "KY",
  slug: "kentucky",
  name: "Kentucky",
  program: "Graduated Licensing",
  permitName: "instruction permit",
  // KRS 186.452(1)(c): "at least sixty (60) hours of supervised driving experience, including at least ten (10) hours at night"
  totalMinutes: 60 * 60,
  nightMinutes: 10 * 60,
  // KRS 186.452(1)(b): "Held an instruction permit a minimum of one hundred eighty (180) days"
  holdMonths: 0,
  holdExtraDays: 180,
  permitValidMonths: null,
  // KRS 186.452(1)(c): "a person who has attained the age of twenty-one (21) years and holds a valid operator's license occupying the seat beside the applicant"
  supervisor: "a licensed driver 21 or older, in the seat beside the driver",
  // KRS 186.452 doesn't say when "night" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "Kentucky's 60 hours include 10 at night.",
  certification: {
    label: "the parent's signed statement of 60 hours (KRS 186.452)",
    url: "https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=55914",
  },
  logAtTest:
    "Kentucky doesn't ask for the log itself. A parent or guardian signs a statement to the Kentucky State Police that the teen completed 60 hours, 10 at night, with a licensed driver 21 or older beside them. Keep the printed log as the record behind that signature.",
  formGuide: {
    title: "Kentucky's parent statement for the intermediate license",
    steps: [
      "A parent or guardian signs a statement attesting that the teen completed at least 60 hours of supervised driving, 10 at night, with a licensed driver 21 or older in the seat beside them.",
      "It's presented to the Kentucky State Police with the intermediate license road test.",
      "Check Drivetron's total and night hours before signing.",
    ],
  },
  notAffiliatedWith: "the Commonwealth of Kentucky, the Kentucky Transportation Cabinet, or the Kentucky State Police",
  defaultLocation: { lat: 38.2009, lng: -84.8733 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: ["Hold it at least 180 days with no permit violations or moving-violation convictions."],
    },
    {
      title: "Step 2: Intermediate license",
      points: [
        "From 16, after 180 days on the permit, 60 supervised hours (10 at night), and the driving test.",
        "Under 18: no driving from midnight to 6 a.m. without good cause, such as emergencies, school, or work.",
        "Under 18: no more than one unrelated passenger under 20, unless with a driving instructor.",
        "A violation adds at least 180 days before the full license.",
      ],
    },
  ],
  sources: [
    { label: "KRS 186.452: Intermediate license", url: "https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=55914" },
  ],
  verified: "2026-11-19",
};
