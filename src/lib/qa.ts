/**
 * Made-up QA families for the local emulators: one or more per state, each set up to show that
 * state's edge cases. `npm run seed:qa` creates them (scripts/seed-qa.mjs), and the login page lists
 * their people as one-tap sign-ins when running against the emulators. Never used in production.
 *
 * Plain data with no imports, so the seed script can load this file directly with Node.
 */
export interface QaPerson {
  email: string;
  name: string;
  role: "supervisor" | "learner";
}

export interface QaFamily {
  id: string;
  state: string;
  /** What this family is set up to show, for the person doing QA */
  checks: string;
  people: QaPerson[];
}

const trio = (id: string, last: string, parent: string, parent2: string, teen: string): QaPerson[] => [
  { email: `${id}-parent@qa.test`, name: `${parent} ${last}`, role: "supervisor" },
  { email: `${id}-parent2@qa.test`, name: `${parent2} ${last}`, role: "supervisor" },
  { email: `${id}-teen@qa.test`, name: `${teen} ${last}`, role: "learner" },
];

export const QA_FAMILIES: QaFamily[] = [
  {
    id: "qa-mt",
    state: "MT",
    checks: "Hold of 6 months + 1 day ends tomorrow; hours nearly done; a teen-timed drive to confirm.",
    people: trio("mt", "Montana", "Molly", "Mark", "Max"),
  },
  {
    id: "qa-ca",
    state: "CA",
    checks: "Two learners; no permit expiry shown; a drive ending 20 minutes after sunset counts no night (30-minute offset).",
    people: [
      ...trio("ca", "California", "Carmen", "Carlos", "Cora"),
      { email: "ca-teen2@qa.test", name: "Cody California", role: "learner" },
    ],
  },
  {
    id: "qa-oh",
    state: "OH",
    checks: "Permit 11 months old at a slow pace: the projected date lands after the permit expires.",
    people: trio("oh", "Ohio", "Olivia", "Owen", "Opal"),
  },
  {
    id: "qa-tx",
    state: "TX",
    checks: "Days over the 2-hour limit: the Home note, the Drives summary, and the printed log's \"counts toward\" row.",
    people: trio("tx", "Texas", "Tara", "Travis", "Tess"),
  },
  {
    id: "qa-pa",
    state: "PA",
    checks: "Total and night done but only 2 of 5 bad-weather hours: the bad-weather bar, \"still to drive\", and the projection.",
    people: trio("pa", "Pennsylvania", "Paula", "Pete", "Piper"),
  },
  {
    id: "qa-nc",
    state: "NC",
    checks: "A 12-hour week counts 10 (the weekly limit): the Home note, the Drives summary, and the printed log's \"counts toward\" row.",
    people: trio("nc", "Carolina", "Nora", "Nate", "Nia"),
  },
  {
    id: "qa-ga",
    state: "GA",
    checks: "The \"12 months + 1 day\" hold ends in 3 days, with 6 of 6 night hours done and a two-year permit.",
    people: trio("ga", "Georgia", "Gina", "Greg", "Gabe"),
  },
  {
    id: "qa-pa-done",
    state: "PA",
    checks: "Everything done and the hold passed: the eligible banner and the DL-180C link.",
    people: trio("pad", "Penn", "Pam", "Phil", "Parker"),
  },
];
