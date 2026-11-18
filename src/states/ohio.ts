import type { StateRules } from "./types";

/**
 * Sources: BMV "Temporary Permit / Probationary Driver Licensing – Under Age 18" (dl-gdl.aspx), the
 * Fifty Hour Affidavit (BMV 5791, rev. 9/25) with its Supervised Driving Log, and Ohio Revised Code
 * 4507.05 (permit), 4507.071 (probationary license) and 4507.21 (the 50-hour affidavit).
 */
export const ohio: StateRules = {
  code: "OH",
  slug: "ohio",
  name: "Ohio",
  program: "Probationary Driver Licensing",
  permitName: "temporary instruction permit",
  // ORC 4507.21(B)(2): "at least fifty hours of actual driving experience, with at least ten of those hours being at night"
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  // ORC 4507.071(A): "has held a temporary instruction permit for a period of at least six months"
  holdMonths: 6,
  holdExtraDays: 0,
  // ORC 4507.05(C): the permit "shall be valid for a period of one year"
  permitValidMonths: 12,
  // BMV, "TIPIC Restrictions for Minors" (ORC 4507.05(A)); the midnight–6 a.m. rule is in the stages below
  supervisor:
    "under 16, a parent, guardian, or licensed driving instructor; from 16, any licensed driver 21 or older, in the passenger seat",
  // BMV 5791: "nighttime hours, defined as the period commencing one-half hour after sunset and concluding
  // one-half hour before the following sunrise"
  nightDefinition:
    "Ohio's Fifty-Hour Affidavit defines nighttime as from half an hour after sunset to half an hour before the following sunrise. Drivetron uses those times at the drive's location.",
  nightOffsetMinutes: 30,
  // BMV 5791 log page: "40 hours of day time driving and 10 hours of night time"
  practiceNote: "Ohio's affidavit asks for 50 hours of actual driving: 40 in daytime and 10 at night.",
  certification: {
    label: "the Fifty-Hour Affidavit (BMV 5791)",
    url: "https://dam.assets.ohio.gov/image/upload/publicsafety.ohio.gov/bmv5791.pdf",
  },
  // No practiceLog: the affidavit's own Supervised Driving Log section also asks for each supervisor's
  // Ohio driver license number, which Drivetron doesn't keep, so the printed log isn't "laid out like" it.
  // BMV 5791: hours "may be documented manually by filling in the log included or by using the RoadReady Ohio App".
  logAtTest:
    "Ohio's Fifty-Hour Affidavit (BMV 5791) has its own Supervised Driving Log, filled in by hand or with the state's RoadReady Ohio app, and asks for each supervising adult's Ohio driver license number. A parent or guardian signs it in front of a notary. Keep the drives in Drivetron, with day and night already split, then copy them onto the form.",
  notAffiliatedWith: "the State of Ohio, the Ohio Department of Public Safety, or the Bureau of Motor Vehicles (BMV)",
  defaultLocation: { lat: 39.9612, lng: -82.9988 },
  stages: [
    {
      title: "Step 1: Temporary instruction permit (TIPIC)",
      points: [
        "From age 15½, after passing the knowledge test and vision screening.",
        "A parent or other responsible adult co-signs when it's issued.",
        "Valid for one year. Carry it whenever driving.",
        "Under 16: drive only with a parent, guardian, or licensed driving instructor in the passenger seat.",
        "From 16: with any licensed driver 21 or older in the passenger seat. From midnight to 6 a.m., only with a parent, guardian, custodian, or a licensed driver 21 or older named on a notarized BMV 2438.",
        "The supervising adult must not be intoxicated, and everyone wears a seat belt.",
      ],
    },
    {
      title: "Step 2: Probationary driver license",
      points: [
        "From age 16, after holding the permit at least six months.",
        "Driver education at a licensed driver training school: 24 hours of classroom or online instruction and 8 hours of driving.",
        "50 hours of driving, at least 10 at night (half an hour after sunset to half an hour before sunrise), on top of driver education.",
        "A parent, guardian, or custodian (or an adult over 21 acting in their place) signs the Fifty-Hour Affidavit in front of a notary; bring it to the driving test.",
        "For the first 12 months: no driving from midnight to 6 a.m. unless with a parent, guardian, custodian, or a licensed driver 21 or older named on a notarized BMV 2438, or to or from work, a school event, or a religious event with written documentation.",
        "Also for the first 12 months: no more than one passenger outside the family unless a parent or guardian is along.",
        "No phones or other mobile devices while driving, and everyone wears a seat belt.",
      ],
    },
    {
      title: "After 12 months, until 18",
      points: ["No driving from 1 to 5 a.m., with the same exceptions: the same accompanying adults, or work, school, and religious events with documentation."],
    },
  ],
  sources: [
    {
      label: "BMV: Temporary Permit / Probationary Driver Licensing – Under Age 18",
      url: "https://www.bmv.ohio.gov/dl-gdl.aspx",
    },
    {
      label: "BMV 5791: Fifty Hour Affidavit and Supervised Driving Log (rev. 9/25)",
      url: "https://dam.assets.ohio.gov/image/upload/publicsafety.ohio.gov/bmv5791.pdf",
    },
    { label: "Ohio Revised Code 4507.05 (temporary instruction permit)", url: "https://codes.ohio.gov/ohio-revised-code/section-4507.05" },
    { label: "Ohio Revised Code 4507.071 (probationary license)", url: "https://codes.ohio.gov/ohio-revised-code/section-4507.071" },
    { label: "Ohio Revised Code 4507.21 (50-hour affidavit)", url: "https://codes.ohio.gov/ohio-revised-code/section-4507.21" },
  ],
  verified: "2026-11-17",
};
