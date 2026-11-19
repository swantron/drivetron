import type { StateRules } from "./types";

/** Sources: Utah Code 53-3-210.5 (learner permit) and 53-3-211 (minor's application and the 40 hours). */
export const utah: StateRules = {
  code: "UT",
  slug: "utah",
  name: "Utah",
  program: "Graduated Driver Licensing",
  permitName: "learner permit",
  // 53-3-211(7)(a): "at least 40 hours of driving a motor vehicle, of which at least 10 hours shall be during night hours after sunset"
  totalMinutes: 40 * 60,
  nightMinutes: 10 * 60,
  // 53-3-210.5(7)(b): 17 or younger "shall hold a learner permit for six months"
  holdMonths: 6,
  holdExtraDays: 0,
  // 53-3-210.5(2): "a learner permit effective for 18 months"
  permitValidMonths: 18,
  // 53-3-210.5(3)(b)
  supervisor:
    "an approved driving instructor, a licensed parent or legal guardian, or the licensed adult who signed the application, in the seat beside the driver (or, if the parent isn't licensed, a licensed adult 21 or older they authorize)",
  nightDefinition:
    "Utah counts night hours as “after sunset”. Drivetron counts from sunset to sunrise at the drive's location.",
  nightOffsetMinutes: 0,
  practiceNote: "Utah's 40 hours include 10 after sunset; driver education hours count toward them.",
  certification: {
    label: "the parent's certification of 40 hours (Utah Code 53-3-211)",
    url: "https://le.utah.gov/xcode/Title53/Chapter3/53-3-S211.html",
  },
  logAtTest:
    "Utah doesn't ask for the log itself. The parent or guardian who signed the teen's application certifies the 40 hours, 10 after sunset, for the provisional license. Keep the printed log as the record behind that certification.",
  formGuide: {
    title: "Utah's 40-hour parent certification",
    steps: [
      "The person who signed the teen's application (usually a parent or guardian) certifies at least 40 hours of driving, 10 after sunset, on the provisional license application.",
      "Hours in the driver education course count, plus up to 5 hours on an approved driving simulator.",
      "Check Drivetron's total and night hours before signing.",
    ],
  },
  notAffiliatedWith: "the State of Utah or the Utah Driver License Division",
  defaultLocation: { lat: 40.7608, lng: -111.891 },
  stages: [
    {
      title: "Step 1: Learner permit",
      points: [
        "From 15, after the knowledge test and fitness tests; a parent or guardian signs the application and takes on liability.",
        "Valid 18 months. Drive only with an approved instructor, a licensed parent or guardian, or the licensed adult who signed, beside you.",
        "Hold it at least six months.",
      ],
    },
    {
      title: "Step 2: Provisional license",
      points: ["From 16, after six months on the permit, driver education, the knowledge and skills tests, and the 40-hour certification (10 at night)."],
    },
  ],
  sources: [
    { label: "Utah Code 53-3-210.5: Learner permit", url: "https://le.utah.gov/xcode/Title53/Chapter3/53-3-S210.5.html" },
    { label: "Utah Code 53-3-211: Minor's application; 40 hours", url: "https://le.utah.gov/xcode/Title53/Chapter3/53-3-S211.html" },
  ],
  verified: "2026-11-19",
};
