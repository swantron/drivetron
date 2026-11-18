// Seeds the QA families in src/lib/qa.ts into the local emulators: their people as emulator Google
// users, and each family's learners and drives, set up to show that state's edge cases.
//
//   firebase emulators:start --only auth,firestore --project demo-drivetron
//   npm run seed:qa
//
// Only ever talks to 127.0.0.1. Safe to rerun: it resets the QA families and keeps their people's uids.
// Run it again after restarting the emulators (they start empty) or after `npm run test:rules`
// (the rules tests clear the Firestore emulator).
import SunCalc from "suncalc";
import { QA_FAMILIES } from "../src/lib/qa.ts";
import { splitDayNight } from "../src/utils/night.ts";
import { montana } from "../src/states/montana.ts";
import { california } from "../src/states/california.ts";
import { ohio } from "../src/states/ohio.ts";
import { texas } from "../src/states/texas.ts";
import { pennsylvania } from "../src/states/pennsylvania.ts";
import { florida } from "../src/states/florida.ts";
import { georgia } from "../src/states/georgia.ts";
import { northCarolina } from "../src/states/northCarolina.ts";
import { illinois } from "../src/states/illinois.ts";

const RULES = Object.fromEntries(
  [montana, california, ohio, texas, pennsylvania, florida, georgia, northCarolina, illinois].map((r) => [r.code, r])
);
const PROJECT = "demo-drivetron";
const AUTH = "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1";
const DB = `http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents`;
const OWNER = { Authorization: "Bearer owner", "Content-Type": "application/json" };
const DAY = 86400000;

// ---- emulator helpers ----

/** Signs in as the same fake Google user `__devSignIn` makes in the browser, so the uids match. */
async function uidFor(email, name) {
  const idToken = encodeURIComponent(JSON.stringify({ sub: email, email, name, email_verified: true }));
  const r = await fetch(`${AUTH}/accounts:signInWithIdp?key=fake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postBody: `id_token=${idToken}&providerId=google.com`, requestUri: "http://localhost", returnSecureToken: true }),
  });
  const d = await r.json();
  if (!d.localId) throw new Error(`auth emulator: ${JSON.stringify(d.error ?? d)}`);
  return d.localId;
}

function val(v) {
  if (v === null) return { nullValue: null };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(val) } };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === "string") return { stringValue: v };
  return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, val(x)])) } };
}

async function put(path, obj) {
  const r = await fetch(`${DB}/${path}`, { method: "PATCH", headers: OWNER, body: JSON.stringify({ fields: val(obj).mapValue.fields }) });
  if (!r.ok) throw new Error(`${path}: ${r.status} ${await r.text()}`);
}

async function clearDrives(fid) {
  for (;;) {
    const r = await fetch(`${DB}/families/${fid}/drives?pageSize=300`, { headers: OWNER });
    const docs = (await r.json()).documents ?? [];
    if (docs.length === 0) return;
    await Promise.all(docs.map((d) => fetch(`http://127.0.0.1:8080/v1/${d.name}`, { method: "DELETE", headers: OWNER })));
  }
}

// ---- dates ----

const today = new Date();
today.setHours(0, 0, 0, 0);
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const daysAgo = (n) => new Date(today.getTime() - n * DAY);
function monthsAgo(n) {
  const d = new Date(today);
  d.setMonth(d.getMonth() - n);
  return d;
}
const at = (day, hour, minute = 0) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute).getTime();
const initials = (name) => name.split(/\s+/).map((w) => w[0].toUpperCase()).join("");

// ---- the families ----

/**
 * Drive plans per family. `d(ago, hour, minutes, opts)` adds one drive `ago` days back starting at
 * `hour` local time; day and night are split with the app's own night code at the state's capital.
 * Evening drives start at 21:30, after dark (even with a 30-minute offset) all year in every state here.
 */
const PLANS = {
  "qa-mt": (d) => {
    for (let i = 0; i < 26; i++) d(175 - i * 6, 10, 90, { tags: ["Clear", i % 2 ? "Highway" : "Residential"] });
    for (let i = 0; i < 6; i++) d(150 - i * 20, 21.5, 100, { tags: ["Clear", "Rural"] });
    d(1, 16, 45, { by: "teen", tags: ["Snow", "City traffic"], notes: "Timed on the teen's phone: waits for a parent." });
    return { permitDate: ymd(monthsAgo(6)) }; // + 6 months + 1 day = tomorrow
  },
  "qa-ca": (d, { lat, lng }) => {
    for (let i = 0; i < 12; i++) d(85 - i * 7, 15, 80, { tags: ["Clear", "City traffic"] });
    for (let i = 0; i < 3; i++) d(60 - i * 20, 21.5, 60, { tags: ["Clear", "Interstate"] });
    // Starts 10 minutes before sunset, ends 20 after: California's night starts 30 after, so all day.
    const dusk = daysAgo(3);
    const sunset = SunCalc.getTimes(new Date(at(dusk, 12)), lat, lng).sunset.getTime();
    d(3, (sunset - 10 * 60000 - at(dusk, 0)) / 3600000, 30, { tags: ["Clear", "Residential"], notes: "Dusk: ends 20 min after sunset, so no night." });
    d(2, 17, 40, { by: "teen", tags: ["Rain", "Highway"] });
    d(1, 16, 50, { by: "teen", tags: ["Clear", "Residential"] });
    // The second learner, newer
    for (let i = 0; i < 3; i++) d(20 - i * 6, 11, 45, { learner: "second", tags: ["Clear", "Parking lot"] });
    return {
      permitDate: ymd(daysAgo(90)),
      second: { name: "Cody California", dob: ymd(new Date(today.getFullYear() - 16, 1, 3)), permitDate: ymd(daysAgo(30)) },
    };
  },
  "qa-oh": (d) => {
    for (let i = 0; i < 6; i++) d(320 - i * 50, 11, 60, { tags: ["Clear", "Residential"] });
    d(200, 21.5, 60, { tags: ["Clear", "Rural"] });
    d(30, 21.5, 60, { tags: ["Rain", "Highway"] });
    return { permitDate: ymd(daysAgo(335)) }; // the permit expires in about a month
  },
  "qa-tx": (d) => {
    for (let i = 0; i < 6; i++) d(100 - i * 12, 10, 60, { tags: ["Clear", "City traffic"] });
    // Two drives one day: 3 hours, 1 over Texas's 2-hour limit
    d(10, 9, 90, { tags: ["Clear", "Highway"], notes: "Morning half of a 3-hour day." });
    d(10, 14, 90, { tags: ["Clear", "Highway"], notes: "Afternoon half: only 30 min of this counts." });
    // One long night drive: 2h 30m, 30 min over
    d(5, 21.5, 150, { tags: ["Clear", "Interstate"], notes: "2h 30m at night: 2h counts." });
    return { permitDate: ymd(daysAgo(120)) };
  },
  "qa-pa": (d) => {
    for (let i = 0; i < 38; i++) d(190 - i * 5, 10, 90, { tags: ["Clear", i % 3 ? "Residential" : "Highway"] });
    for (let i = 0; i < 7; i++) d(185 - i * 25, 21.5, 100, { tags: ["Clear", "Rural"] });
    d(40, 13, 60, { tags: ["Rain", "City traffic"] });
    d(12, 13, 60, { tags: ["Snow", "Residential"] });
    return { permitDate: ymd(daysAgo(200)) };
  },
  "qa-nc": (d) => {
    for (let i = 0; i < 10; i++) d(150 - i * 10, 10, 90, { tags: ["Clear", "Residential"] });
    // Six 2-hour drives in one Sunday-to-Saturday week, three weeks back: 12h, 10 count
    const sunday = daysAgo(21 + daysAgo(0).getDay());
    const back = Math.round((today - sunday) / DAY);
    for (let i = 0; i < 6; i++) d(back - i, i === 5 ? 21.5 : 9, 120, { tags: ["Clear", "Highway"], notes: i === 0 ? "Start of a 12-hour week: 10 count." : "" });
    return { permitDate: ymd(daysAgo(200)) };
  },
  "qa-ga": (d) => {
    for (let i = 0; i < 20; i++) d(350 - i * 15, 11, 75, { tags: ["Clear", "City traffic"] });
    for (let i = 0; i < 4; i++) d(300 - i * 60, 21.5, 90, { tags: ["Clear", "Highway"] });
    // 12 months + 1 day from this date is 3 days out
    const permit = monthsAgo(12);
    permit.setDate(permit.getDate() + 2);
    return { permitDate: ymd(permit) };
  },
  "qa-pa-done": (d) => {
    for (let i = 0; i < 38; i++) d(210 - i * 5, 10, 90, { tags: ["Clear", "Residential"] });
    for (let i = 0; i < 7; i++) d(205 - i * 25, 21.5, 100, { tags: ["Clear", "Rural"] });
    for (const [ago, tag] of [[60, "Rain"], [45, "Snow"], [30, "Fog"], [15, "Ice"]]) d(ago, 13, 90, { tags: [tag, "Highway"] });
    return { permitDate: ymd(daysAgo(220)) };
  },
};

let total = 0;
for (const fam of QA_FAMILIES) {
  const rules = RULES[fam.state];
  if (!rules) throw new Error(`${fam.id}: no rules for ${fam.state}`);
  const { lat, lng } = rules.defaultLocation;
  const people = [];
  for (const p of fam.people) people.push({ ...p, uid: await uidFor(p.email, p.name) });
  const [parent, parent2] = people.filter((p) => p.role === "supervisor");
  const teen = people.find((p) => p.role === "learner");
  const members = Object.fromEntries(people.map((p) => [p.uid, { name: p.name, initials: initials(p.name), role: p.role }]));

  const drives = [];
  let turn = 0;
  const d = (ago, hour, minutes, { by, tags = [], notes = "", learner = "primary" } = {}) => {
    const day = daysAgo(ago);
    const start = at(day, 0) + Math.round(hour * 60) * 60000;
    const end = start + minutes * 60000;
    // Parents take turns; a teen-timed drive names a parent as supervisor but is created by the teen.
    const sup = turn++ % 2 ? parent2 : parent;
    drives.push({
      learnerId: learner,
      vehicleId: "v1",
      vehicleName: "QA car",
      startedAt: start,
      endedAt: end,
      ...splitDayNight(start, end, lat, lng, rules.nightOffsetMinutes),
      supervisorUid: sup.uid,
      supervisorName: sup.name,
      supervisorInitials: initials(sup.name),
      conditions: tags,
      skills: [],
      notes,
      lat,
      lng,
      manual: false,
      createdBy: by === "teen" ? teen.uid : sup.uid,
      updatedAt: end,
      syncedAt: new Date(start + 3000),
    });
  };
  const plan = PLANS[fam.id](d, { lat, lng });

  const learners = { primary: { name: teen.name, dob: ymd(new Date(today.getFullYear() - 16, 3, 10)), permitDate: plan.permitDate } };
  if (plan.second) learners.second = plan.second;
  const inviteCode = `QA${fam.id.replace(/[^a-z]/gi, "").toUpperCase()}`.padEnd(8, "X");
  await put(`families/${fam.id}`, {
    learners,
    vehicles: { v1: { name: "QA car" } },
    ownerUid: parent.uid,
    memberUids: people.map((p) => p.uid),
    members,
    inviteCode,
    state: fam.state,
    lastLat: lat,
    lastLng: lng,
    // Before the paid-unlock launch, so the free-hours limit never gets in the way of QA
    createdAt: Date.parse("2026-01-01T00:00:00Z"),
  });
  await put(`invites/${inviteCode}`, { familyId: fam.id });
  await clearDrives(fam.id);
  drives.sort((a, b) => a.startedAt - b.startedAt);
  await Promise.all(drives.map((dr, i) => put(`families/${fam.id}/drives/q${String(i + 1).padStart(3, "0")}`, dr)));
  total += drives.length;
  console.log(`${fam.id.padEnd(11)} ${fam.state}  ${String(drives.length).padStart(2)} drives  ${fam.checks}`);
}
console.log(`\nSeeded ${QA_FAMILIES.length} families, ${total} drives. Sign in from /login (QA sign-in list), e.g. tx-parent@qa.test.`);
