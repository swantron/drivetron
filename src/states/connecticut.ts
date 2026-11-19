import type { StateRules } from "./types";

/** Source: Connecticut DMV "Driving school requirements for teenagers in CT". */
export const connecticut: StateRules = {
  code: "CT",
  slug: "connecticut",
  name: "Connecticut",
  program: "teen driver licensing",
  permitName: "learner's permit",
  // DMV: "40 hours of practice driving", in any combination of commercial, secondary, or parent instruction
  totalMinutes: 40 * 60,
  // Connecticut sets no night-hours requirement
  nightMinutes: 0,
  // DMV: "at least 120 (driving school) or 180 (home training) days". Drivetron uses the home-training 180.
  holdMonths: 0,
  holdExtraDays: 180,
  permitValidMonths: null,
  // DMV home training: qualified trainers are 20 or older, licensed at least four years with no suspensions
  supervisor:
    "for home training, a qualified trainer 20 or older licensed at least four years with no suspensions: a parent, grandparent, foster parent, legal guardian, or spouse (or, if none is available, a stepparent, sibling, aunt, or uncle)",
  nightDefinition: "Connecticut doesn't require night hours. Drivetron still splits each drive into day and night (sunset to sunrise).",
  nightOffsetMinutes: 0,
  practiceNote: "Connecticut asks for 40 hours of behind-the-wheel practice, in any mix of driving school and parent instruction.",
  certification: {
    label: "the qualified trainer's signed form attesting to the driver education requirements",
    url: "https://portal.ct.gov/dmv/licenses-permits-ids/teen-drivers-license/driver-training-for-teens",
  },
  logAtTest:
    "Connecticut doesn't ask for the log itself. A qualified trainer signs a form, under penalty of false statement, attesting the teen met the driver education requirements, including the 40 practice hours. Keep the printed log as the record behind that signature.",
  formGuide: {
    title: "Connecticut's 40 practice hours and the trainer's attestation",
    steps: [
      "The teen needs 40 hours of behind-the-wheel practice, in any combination of driving school, high school, and parent instruction.",
      "With home training, a qualified trainer signs a form under penalty of false statement attesting the requirements were met. Drivetron's printed log shows the hours.",
      "One parent or guardian also takes a 2-hour parent training class at a driving school.",
      "The permit must be held 120 days with a driving school (30 classroom and 8 behind-the-wheel hours), or 180 days with home training.",
    ],
  },
  notAffiliatedWith: "the State of Connecticut or the Connecticut Department of Motor Vehicles (DMV)",
  defaultLocation: { lat: 41.7658, lng: -72.6734 },
  stages: [
    {
      title: "Step 1: Learner's permit",
      points: [
        "From 16, with driver's education: a driving school's 30 classroom hours, or home training with 22 classroom hours and the 8-hour safe driving practices course.",
        "Practice with a qualified trainer.",
        "Hold it at least 120 days (driving school) or 180 days (home training).",
      ],
    },
    {
      title: "Step 2: Driver's license",
      points: [
        "After the permit period, 40 hours of practice, the parent's 2-hour training class, and the road test.",
      ],
    },
  ],
  sources: [
    {
      label: "Connecticut DMV: Driving school requirements for teenagers",
      url: "https://portal.ct.gov/dmv/licenses-permits-ids/teen-drivers-license/driver-training-for-teens",
    },
  ],
  verified: "2026-11-19",
};
