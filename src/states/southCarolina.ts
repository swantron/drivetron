import type { StateRules } from "./types";

/** Sources: SCDMV "Getting Your First SC Driver's License" and "Beginner's Permit" pages. */
export const southCarolina: StateRules = {
  code: "SC",
  slug: "south-carolina",
  name: "South Carolina",
  program: "graduated licensing",
  permitName: "beginner's permit",
  // SCDMV: "at least 40 hours, including ten hours of night driving"
  totalMinutes: 40 * 60,
  nightMinutes: 10 * 60,
  // SCDMV: under 18, "you must hold the beginner's permit for 180 days"
  holdMonths: 0,
  holdExtraDays: 180,
  permitValidMonths: null,
  // SCDMV: "a licensed driver, who is at least 21 and has at least one year of experience, in the front seat"
  supervisor: "a licensed driver 21 or older with at least a year of experience, in the front seat",
  // SCDMV doesn't say when "night driving" starts.
  nightDefinition: null,
  nightOffsetMinutes: 0,
  practiceNote: "South Carolina's 40 hours include 10 at night.",
  certification: {
    label: "the Certification of School Attendance, Driver's Education, and Driving Practice (Form PDLA)",
    url: "https://dmv.sc.gov/Driver-Services/Drivers-License/Teenage-drivers",
  },
  formName: "form PDLA",
  logAtTest:
    "South Carolina doesn't ask for the log itself. The driving practice is certified on Form PDLA, which comes only from driver training schools and high schools; SCDMV doesn't accept downloaded copies. Keep the printed log as the record behind it.",
  formGuide: {
    title: "South Carolina's Form PDLA (driving practice certification)",
    steps: [
      "Form PDLA certifies school attendance, driver's education (8 hours in the classroom, 6 driving), and at least 40 hours of practice, 10 at night.",
      "Get it from the teen's driver training school or high school. SCDMV only accepts forms from those issuers, never a copy downloaded online.",
      "Check Drivetron's total and night hours before it's completed.",
    ],
  },
  notAffiliatedWith: "the State of South Carolina or the South Carolina Department of Motor Vehicles (SCDMV)",
  defaultLocation: { lat: 34.0007, lng: -81.0348 },
  stages: [
    {
      title: "Step 1: Beginner's permit",
      points: [
        "From 15, after the vision and knowledge tests; a parent or guardian consents in person.",
        "From 6 a.m. to midnight, with a licensed driver 21 or older (a year's experience) in the front seat; from midnight to 6 a.m., only with a parent or guardian.",
        "Hold it at least 180 days.",
      ],
    },
    {
      title: "Step 2: Conditional or special restricted license",
      points: [
        "From 15½ (conditional) or 16 (special restricted), after 180 days on the permit, driver's education, 40 hours of practice (10 at night), Form PDLA, and the road test.",
        "Alone only from 6 a.m. to 6 p.m. (8 p.m. in daylight saving time); with a licensed driver 21 or older until midnight; with a parent or guardian after midnight.",
        "No more than two passengers under 21 unless a licensed adult 21 or older is along, or for family or school.",
      ],
    },
  ],
  sources: [
    { label: "SCDMV: Getting Your First SC Driver's License", url: "https://dmv.sc.gov/Driver-Services/Drivers-License/Teenage-drivers" },
    { label: "SCDMV: Beginner's Permit", url: "https://dmv.sc.gov/driver-services/drivers-license/beginners-permit" },
  ],
  verified: "2026-11-19",
};
