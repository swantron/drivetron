import type { StateRules } from "./types";

/** Sources: Massachusetts RMV "Junior Operator License (JOL) requirements" and its Supervised Driving Log. */
export const massachusetts: StateRules = {
  code: "MA",
  slug: "massachusetts",
  name: "Massachusetts",
  program: "Junior Operator License (JOL)",
  permitName: "learner's permit",
  // RMV: "at least an additional 40 hours of supervised, behind-the-wheel driving as shown by a certified statement by a parent or guardian"
  totalMinutes: 40 * 60,
  // Massachusetts sets no night-hours requirement
  nightMinutes: 0,
  // RMV: "Have a valid learner's permit for at least 6 consecutive months before taking the road test."
  holdMonths: 6,
  holdExtraDays: 0,
  permitValidMonths: null,
  // RMV: "licensed, who is at least 21 years of age, who has at least one year of driving experience, and who is occupying a seat beside the driver"
  supervisor: "a licensed driver 21 or older with at least a year of driving experience, in the seat beside the driver",
  nightDefinition:
    "Massachusetts doesn't require night hours. Drivetron still splits each drive into day and night (sunset to sunrise), since the state's log asks for day or night on every drive.",
  nightOffsetMinutes: 0,
  practiceNote: "Massachusetts's log asks for the driving environment, weather, and skills practiced on each drive, for a varied 40 hours.",
  certification: {
    label: "the parent's certified statement of 40 supervised hours",
    url: "https://www.mass.gov/info-details/junior-operator-license-jol-requirements",
  },
  // Its columns (date and time, driving time, day or night, environment, weather, skills) match the printed log.
  practiceLog: {
    label: "RMV Supervised Driving Log",
    url: "https://www.mass.gov/doc/supervised-driving-log/download",
  },
  logAtTest:
    "Massachusetts asks a parent or guardian for a certified statement of at least 40 hours of supervised driving (30 with a driver skills development program). The RMV's own log, or the RoadReady app, is for keeping track.",
  formGuide: {
    form: { label: "RMV Supervised Driving Log (PDF)", url: "https://www.mass.gov/doc/supervised-driving-log/download" },
    title: "Massachusetts's 40-hour parent certification and Supervised Driving Log",
    steps: [
      "A parent or guardian certifies at least 40 hours of supervised, behind-the-wheel driving, on top of driver education. It's 30 hours if the teen completes a driver skills development program.",
      "The RMV's Supervised Driving Log tracks the date and time, driving time, day or night, driving environment, weather, and skills practiced. Drivetron's printed log has the same columns; tag the road type and weather on each drive.",
      "A parent or guardian also takes 2 hours of instruction in the driver education course, unless they've done one in the past 5 years.",
    ],
  },
  notAffiliatedWith: "the Commonwealth of Massachusetts or the Massachusetts Registry of Motor Vehicles (RMV)",
  defaultLocation: { lat: 42.3601, lng: -71.0589 },
  stages: [
    {
      title: "Step 1: Learner's permit",
      points: [
        "Drive only with a licensed driver 21 or older, with at least a year of experience, in the seat beside you.",
        "Under 18: no driving from midnight to 5 a.m. unless with a licensed parent or legal guardian.",
        "Hold it at least 6 consecutive months with a clean record before the road test; a suspension restarts the 6 months.",
      ],
    },
    {
      title: "Step 2: Junior Operator License",
      points: [
        "From 16½, after six months on the permit with a clean record.",
        "Driver education: 30 hours in the classroom, 12 behind the wheel, and 6 observing.",
        "40 hours of supervised driving certified by a parent or guardian (30 with a driver skills development program), plus 2 hours of instruction for the parent or guardian.",
        "Pass the road test.",
      ],
    },
  ],
  sources: [
    {
      label: "Massachusetts RMV: Junior Operator License (JOL) requirements",
      url: "https://www.mass.gov/info-details/junior-operator-license-jol-requirements",
    },
    { label: "Massachusetts RMV: Supervised Driving Log", url: "https://www.mass.gov/doc/supervised-driving-log/download" },
  ],
  verified: "2026-11-19",
};
