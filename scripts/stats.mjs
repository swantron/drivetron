#!/usr/bin/env node
/**
 * Drivetron's own numbers: sign-ups, how far learners get, and paid unlocks. Prints counts only,
 * never names, emails, or anything that identifies a family (the privacy policy promises no
 * analytics or tracking; this just counts our own records).
 *
 *   npm run stats            # uses your gcloud login (gcloud auth login)
 *   npm run stats -- --weeks 12
 *
 * Reads Firestore over REST with `gcloud auth print-access-token`; no service account key needed.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const PROJECT = "mt-services-swantron";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const weeksArg = process.argv.indexOf("--weeks");
const WEEKS = weeksArg > 0 ? Number(process.argv[weeksArg + 1]) || 8 : 8;

// Pricing constants come from the app's own source so this can't drift from the paywall.
const pricing = readFileSync(new URL("../src/lib/pricing.ts", import.meta.url), "utf8");
const cutoff = /FREE_FOREVER_BEFORE = Date\.UTC\((\d+), (\d+), (\d+)\)/.exec(pricing);
const freeHours = /FREE_MINUTES = (\d+) \* 60/.exec(pricing);
const warnHours = /FREE_WARN_MINUTES = (\d+) \* 60/.exec(pricing);
if (!cutoff || !freeHours || !warnHours) throw new Error("Couldn't read the pricing constants from src/lib/pricing.ts");
const FREE_FOREVER_BEFORE = Date.UTC(+cutoff[1], +cutoff[2], +cutoff[3]);
const FREE_MINUTES = +freeHours[1] * 60;
const WARN_AT = FREE_MINUTES - +warnHours[1] * 60;

let token;
try {
  token = execFileSync("gcloud", ["auth", "print-access-token"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
} catch {
  console.error("gcloud isn't signed in. Run: gcloud auth login");
  process.exit(1);
}
const headers = { Authorization: `Bearer ${token}`, "x-goog-user-project": PROJECT, "Content-Type": "application/json" };

/** Firestore REST value → plain JS */
function plain(v) {
  if (!v) return undefined;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("stringValue" in v) return v.stringValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("timestampValue" in v) return Date.parse(v.timestampValue);
  if ("mapValue" in v) return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([k, x]) => [k, plain(x)]));
  if ("arrayValue" in v) return (v.arrayValue.values ?? []).map(plain);
  return undefined;
}
const fieldsOf = (doc) => Object.fromEntries(Object.entries(doc.fields ?? {}).map(([k, v]) => [k, plain(v)]));
const idOf = (doc) => doc.name.split("/").pop();

async function list(path, mask) {
  const out = [];
  let pageToken = "";
  do {
    const q = new URLSearchParams({ pageSize: "300" });
    if (pageToken) q.set("pageToken", pageToken);
    for (const f of mask ?? []) q.append("mask.fieldPaths", f);
    const res = await fetch(`${BASE}/${path}?${q}`, { headers });
    if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
    const body = await res.json();
    out.push(...(body.documents ?? []));
    pageToken = body.nextPageToken ?? "";
  } while (pageToken);
  return out;
}

const families = await list("families", ["createdAt", "learners", "learnerName", "state"]);
const payments = await list("payments", ["amount", "currency", "livemode", "matched", "at", "familyId", "learnerId"]);

const now = Date.now();
const DAY = 86_400_000;
const rows = [];
for (const doc of families) {
  const f = fieldsOf(doc);
  const fid = idOf(doc);
  const learnerIds = Object.keys(f.learners ?? {});
  if (learnerIds.length === 0 && f.learnerName) learnerIds.push("primary");
  const [drives, unlocks] = await Promise.all([
    list(`families/${fid}/drives`, ["learnerId", "dayMinutes", "nightMinutes", "endedAt"]),
    list(`families/${fid}/unlocks`, ["at"]),
  ]);
  const minutes = Object.fromEntries(learnerIds.map((id) => [id, 0]));
  let lastDrive = 0;
  for (const d of drives.map(fieldsOf)) {
    if (d.endedAt == null) continue;
    const lid = d.learnerId ?? "primary";
    minutes[lid] = (minutes[lid] ?? 0) + (d.dayMinutes ?? 0) + (d.nightMinutes ?? 0);
    lastDrive = Math.max(lastDrive, d.endedAt);
  }
  rows.push({
    createdAt: f.createdAt ?? 0,
    state: f.state ?? "MT",
    paywall: (f.createdAt ?? 0) >= FREE_FOREVER_BEFORE,
    learners: learnerIds.map((id) => ({ minutes: minutes[id] ?? 0, unlocked: unlocks.some((u) => idOf(u) === id) })),
    driveCount: drives.length,
    activeLast14d: now - lastDrive < 14 * DAY,
  });
}

const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : "—");
const learners = rows.flatMap((r) => r.learners.map((l) => ({ ...l, paywall: r.paywall })));
const paywalled = learners.filter((l) => l.paywall);
const reachedWarn = paywalled.filter((l) => l.minutes >= WARN_AT || l.unlocked);
const reachedFree = paywalled.filter((l) => l.minutes >= FREE_MINUTES || l.unlocked);
const unlocked = paywalled.filter((l) => l.unlocked);
const live = payments.map(fieldsOf).filter((p) => p.livemode);
const liveMatched = live.filter((p) => p.matched);

const byState = {};
for (const r of rows) byState[r.state] = (byState[r.state] ?? 0) + 1;

console.log(`Drivetron stats  ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`);
console.log(`(paywall applies to logs created from ${new Date(FREE_FOREVER_BEFORE).toISOString().slice(0, 10)}; free ${FREE_MINUTES / 60}h per learner)\n`);

console.log("Families");
console.log(`  total                 ${rows.length}   (${Object.entries(byState).map(([s, n]) => `${s} ${n}`).join(", ")})`);
console.log(`  new, last 7 / 30 days ${rows.filter((r) => now - r.createdAt < 7 * DAY).length} / ${rows.filter((r) => now - r.createdAt < 30 * DAY).length}`);
console.log(`  drove in last 14 days ${rows.filter((r) => r.activeLast14d).length}`);
console.log(`  with no drives yet    ${rows.filter((r) => r.driveCount === 0).length}`);

console.log("\nLearners on the paywall (logs created after launch)");
console.log(`  learners              ${paywalled.length}`);
console.log(`  reached ${`${WARN_AT / 60}h`.padEnd(3)} (warning)  ${reachedWarn.length}   ${pct(reachedWarn.length, paywalled.length)} of learners`);
console.log(`  reached ${`${FREE_MINUTES / 60}h`.padEnd(3)} (paywall)  ${reachedFree.length}   ${pct(reachedFree.length, paywalled.length)} of learners`);
console.log(`  unlocked (paid)       ${unlocked.length}   ${pct(unlocked.length, reachedFree.length)} of those who hit the paywall`);

console.log("\nPayments (live)");
const revenue = liveMatched.reduce((s, p) => s + (p.amount ?? 0), 0);
console.log(`  paid unlocks          ${liveMatched.length}   $${(revenue / 100).toFixed(2)} gross (before Stripe fees)`);
if (live.length !== liveMatched.length) console.log(`  ⚠ unmatched payments  ${live.length - liveMatched.length}  (paid for a missing log: refund or unlock by hand)`);

console.log(`\nNew families per week (last ${WEEKS})`);
for (let w = WEEKS - 1; w >= 0; w--) {
  const from = now - (w + 1) * 7 * DAY;
  const to = now - w * 7 * DAY;
  const n = rows.filter((r) => r.createdAt >= from && r.createdAt < to).length;
  const paid = live.filter((p) => p.matched && p.at >= from && p.at < to).length;
  console.log(`  ${new Date(from).toISOString().slice(5, 10)}  ${String(n).padStart(3)} ${"█".repeat(Math.min(n, 40))}${paid ? `   ${paid} paid` : ""}`);
}
