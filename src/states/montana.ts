import type { StateRules } from "./types";

/** Source: OPI "GDL: Graduated Driver Licensing in Montana" fact sheet and practice log, rev. June 2024. */
export const montana: StateRules = {
  code: "MT",
  slug: "montana",
  name: "Montana",
  program: "Graduated Driver Licensing (GDL)",
  permitName: "learner license",
  totalMinutes: 50 * 60,
  nightMinutes: 10 * 60,
  holdMonths: 6,
  permitValidMonths: 12,
  supervisor: "a licensed parent or guardian, or a licensed adult the parent or guardian authorizes",
  nightDefinition: null,
  practiceNote: "Montana asks for practice in varied weather, traffic, and road conditions.",
  certification: {
    label: "MVD form 21-1600",
    url: "https://mvdmt.gov/wp-content/uploads/2023/10/21-1600-Graduated-Driver-Licensing-Certification.pdf",
  },
  practiceLog: {
    label: "OPI GDL fact sheet & practice driving log",
    url: "https://opi.mt.gov/Portals/182/Page%20Files/Driver%20Education/TE%20Resources/MT-GDL-Factsheet-Log-2024.pdf",
  },
  notAffiliatedWith: "the State of Montana, the Motor Vehicle Division (MVD), or the Office of Public Instruction (OPI)",
  defaultLocation: { lat: 46.5891, lng: -112.0391 },
  stages: [
    {
      title: "Step 1: Learner license",
      points: [
        "From age 14½ through a state-approved driver education program, or from 15 without driver education.",
        "Valid for one year.",
        "At least six months and 50 hours of supervised driving, 10 of them at night.",
        "Supervised only by a licensed parent or guardian, or a licensed adult they authorize.",
        "Practice in varied weather, traffic, and road conditions.",
        "Everyone in the car wears a seat belt, and the driver stays free of traffic violations and alcohol or drug offenses.",
      ],
    },
    {
      title: "Step 2: GDL restricted license",
      points: [
        "After Step 1, with a parent or guardian certifying the 50 hours of supervised practice.",
        "For one year or until age 18.",
        "No driving from 11 p.m. to 5 a.m., except for school, church, work, or farm-related activities.",
        "One passenger for the first six months, then up to three. Family members don't count, and the limit doesn't apply when a licensed adult is supervising.",
      ],
    },
    {
      title: "Step 3: Full privilege license",
      points: ["After Steps 1 and 2, or at age 18."],
    },
  ],
  sources: [
    {
      label: "OPI: GDL fact sheet and practice driving log (rev. June 2024)",
      url: "https://opi.mt.gov/Portals/182/Page%20Files/Driver%20Education/TE%20Resources/MT-GDL-Factsheet-Log-2024.pdf",
    },
    { label: "MVD: Drivers under 18", url: "https://mvdmt.gov/new-driver-license/drivers-under-18/" },
    { label: "MCA 61-5-132", url: "https://mca.legmt.gov/bills/2023/mca/61/5/61-5-132.htm" },
  ],
  verified: "2026-11-12",
};
