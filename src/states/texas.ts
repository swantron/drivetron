import type { StateRules } from "./types";

/**
 * Sources: DPS "Graduated Driver License (GDL) Program", "Teen Drivers Phase I - Texas Learner License"
 * and "Texas Provisional License as a Teen"; TDLR's parent-taught "Behind the Wheel" page, its
 * 30-Hour Behind-the-Wheel Log (Form DES150N, rev. December 2024) and Behind-the-Wheel Instruction Guide;
 * and Transportation Code 521.222 (who may supervise).
 */
export const texas: StateRules = {
  code: "TX",
  slug: "texas",
  name: "Texas",
  program: "Graduated Driver License (GDL)",
  permitName: "learner license",
  // DES150N: "30 hours of guided practice which includes at least 10 hours at nighttime"
  totalMinutes: 30 * 60,
  nightMinutes: 10 * 60,
  // DPS GDL: "must hold a learner license or MRDL for six months before they can get a provisional license"
  holdMonths: 6,
  holdExtraDays: 0,
  // DPS Phase I: the learner license "will expire on your 18th birthday", not a term from its issue date
  permitValidMonths: null,
  // Transportation Code 521.222(d)(2), quoted in the TDLR guide; DPS Phase I: in the front passenger seat
  supervisor: "a licensed driver 21 or older with at least one year of driving experience, in the front passenger seat",
  // TDLR Behind-the-Wheel Instruction Guide: "Nighttime means the period beginning one-half hour after
  // sunset and ending one-half hour before sunrise."
  nightDefinition:
    "Texas's Behind-the-Wheel Instruction Guide defines nighttime as from half an hour after sunset to half an hour before sunrise. Drivetron uses those times at the drive's location.",
  nightOffsetMinutes: 30,
  // DES150N: "Only two (2) hours of behind-the-wheel instruction per day will count towards the 30 hours"
  dailyCountMinutes: 2 * 60,
  practiceNote:
    "Texas's 30-hour log works through lessons from starting and stopping, backing and parking up to city and expressway driving.",
  certification: {
    label: "the 30-Hour Behind-the-Wheel Log (TDLR Form DES150N)",
    url: "https://www.tdlr.texas.gov/driver/files/DES150N-Texas-30-Hour-Behind-the-Wheel-Log.pdf",
  },
  // No practiceLog: DES150N asks for each supervising adult's signature and driver license number on
  // every session, which Drivetron doesn't keep, so the printed log isn't "laid out like" it.
  logAtTest:
    "Texas's 30-hour log (TDLR Form DES150N) has a line for each session, with the date, daytime and nighttime hours, and the supervising adult's signature and driver license number, and a parent or guardian signs it at the bottom. Only 2 hours a day count, however long the drive. Keep the drives in Drivetron, with day and night already split, then copy them onto the form and bring it to DPS with the driver education certificate.",
  notAffiliatedWith:
    "the State of Texas, the Texas Department of Public Safety (DPS), or the Texas Department of Licensing and Regulation (TDLR)",
  defaultLocation: { lat: 30.2672, lng: -97.7431 },
  stages: [
    {
      title: "Step 1: Learner license",
      points: [
        "From age 15, after the classroom hours of a state-approved driver education course (6 hours in a concurrent course, or 24 in a block course) and the knowledge test.",
        "Bring a high school diploma, GED, or a Verification of Enrollment and Attendance (VOE) form from school.",
        "Drive only with a licensed driver 21 or older, with at least a year of driving experience, in the front passenger seat.",
        "No phone use while driving, even hands-free, except in an emergency.",
        "Hold it at least six months before the provisional license; a suspension adds its length to that. It expires on the 18th birthday.",
      ],
    },
    {
      title: "Step 2: Provisional license",
      points: [
        "From age 16, after holding the learner license at least six months and finishing driver education, including its behind-the-wheel lessons.",
        "30 hours of supervised practice, at least 10 at night (half an hour after sunset to half an hour before sunrise), logged on TDLR Form DES150N and certified by a parent or guardian.",
        "Only 2 hours of practice a day count toward the 30.",
        "Complete the Impact Texas Teen Driver (ITTD) program within 90 days before the driving test, then pass the test.",
        "For the first 12 months: no more than one passenger under 21 outside the family, and no driving from midnight to 5 a.m. except for work, school activities, or an emergency.",
        "No phone use while driving, even hands-free, except in an emergency, until 18.",
      ],
    },
  ],
  sources: [
    {
      label: "DPS: Graduated Driver License (GDL) Program",
      url: "https://www.dps.texas.gov/section/driver-license/graduated-driver-license-gdl-program",
    },
    { label: "DPS: Teen Drivers Phase I – Texas Learner License", url: "https://www.dps.texas.gov/node/856" },
    {
      label: "DPS: Texas Provisional License as a Teen",
      url: "https://www.dps.texas.gov/section/driver-license/texas-provisional-license-teen",
    },
    {
      label: "TDLR Form DES150N: Driver Education 30 Hour Behind the Wheel Log (rev. December 2024)",
      url: "https://www.tdlr.texas.gov/driver/files/DES150N-Texas-30-Hour-Behind-the-Wheel-Log.pdf",
    },
    {
      label: "TDLR: Texas 30-Hour Behind-the-Wheel Instruction Guide",
      url: "https://www.tdlr.texas.gov/driver/files/Texas%2030-Hour%20Behind-the-Wheel%20Guide.pdf",
    },
    {
      label: "TDLR: Parent-taught driver education, behind the wheel",
      url: "https://www.tdlr.texas.gov/driver/education/parent-taught/behind-the-wheel.htm",
    },
    {
      label: "Texas Transportation Code 521.222 (learner license)",
      url: "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.521.htm#521.222",
    },
  ],
  verified: "2026-11-18",
};
