import type { StateRules } from "./types";

/** Source: Minnesota Statutes 171.055 (provisional license). */
export const minnesota: StateRules = {
  code: "MN",
  slug: "minnesota",
  name: "Minnesota",
  program: "Graduated Driver Licensing (GDL)",
  permitName: "instruction permit",
  // 171.055(1)(a)(5)-(6): at least 40 hours, 15 at night, plus 10 more hours unless the primary supervisor
  // completed the supplemental parent curriculum. Drivetron tracks the 50-hour route.
  totalMinutes: 50 * 60,
  nightMinutes: 15 * 60,
  // 171.055(1)(a)(2): "during the six months immediately preceding the application ... has possessed an instruction permit"
  holdMonths: 6,
  holdExtraDays: 0,
  permitValidMonths: null,
  // 171.055(1)(a)(5)(i)
  supervisor: "a licensed driver 21 or older",
  // The statute counts "nighttime hours" without defining them.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote:
    "Minnesota asks for 50 hours, 15 at night, or 40 hours if the primary driving supervisor took the supplemental parent class.",
  certification: {
    label: "the supervised driving log signed by the primary driving supervisor (Minn. Stat. 171.055)",
    url: "https://www.revisor.mn.gov/statutes/cite/171.055",
  },
  logAtTest:
    "Minnesota requires a supervised driving log with the provisional license application: the date and length of every supervised drive, signed by the primary driving supervisor. Drivetron's printed log lists both for every drive.",
  formGuide: {
    title: "Minnesota's supervised driving log for the provisional license",
    steps: [
      "The log has to show the date and length of every supervised drive, with a licensed driver 21 or older. Drivetron's printed log lists both.",
      "It has to total at least 50 hours, 15 at night. It's 40 hours (still 15 at night) if the primary driving supervisor completed the supplemental parent class when the teen applied for the permit.",
      "The primary driving supervisor signs it, attesting the hours were met. Submit it with the provisional license application.",
    ],
  },
  notAffiliatedWith: "the State of Minnesota or the Minnesota Department of Public Safety Driver and Vehicle Services (DVS)",
  defaultLocation: { lat: 44.9537, lng: -93.09 },
  stages: [
    {
      title: "Step 1: Instruction permit",
      points: ["Hold it six months, with no moving-violation or alcohol-related convictions, before the provisional license."],
    },
    {
      title: "Step 2: Provisional license",
      points: [
        "From 16, after six months on the permit, driver education, a parent's approval, and the supervised driving log.",
        "No phone use while driving, even hands-free, except to get emergency help.",
        "First six months: no more than one passenger under 20 outside the immediate family, and no driving from midnight to 5 a.m. except to work, school events, or with a licensed driver 25 or older.",
        "Second six months: no more than three passengers under 20 outside the family, unless a parent or guardian is along.",
      ],
    },
  ],
  sources: [{ label: "Minnesota Statutes 171.055: Provisional license", url: "https://www.revisor.mn.gov/statutes/cite/171.055" }],
  verified: "2026-11-19",
};
