import type { Drive, Family } from "@/types";
import { isInstructor, supervisorLabel } from "@/utils/instructors";
import { driveLearnerId, learnersOf, vehiclesOf } from "@/utils/learners";
import { confirmationOf } from "@/utils/signoff";

/**
 * "Download my data": a spreadsheet of the drives, and a JSON file of everything the log holds.
 * Built on the device from what the app already has; nothing goes to a server.
 */

const pad = (n: number) => String(n).padStart(2, "0");
const localDate = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const localTime = (ms: number) => {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/**
 * One CSV cell. Quotes anything with a comma, quote or line break, and defuses text a spreadsheet
 * would run as a formula (notes are typed by family members, and a cell starting with "=" runs).
 */
export function csvCell(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return "";
  let s = String(v);
  if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const CSV_HEADER = [
  "Date",
  "Start",
  "End",
  "Learner",
  "Total minutes",
  "Day minutes",
  "Night minutes",
  "Supervising adult",
  "Initials",
  "Vehicle",
  "Conditions",
  "Skills",
  "Notes",
  "Logged",
  "Times edited",
  "Confirmed by",
  "Confirmed on",
];

/** Finished drives, oldest first, one row each. Times are this device's local time. */
export function drivesCsv(family: Family, drives: Drive[]): string {
  const learnerNames = new Map(learnersOf(family).map((l) => [l.id, l.name]));
  const rows = drives
    .filter((d) => d.endedAt !== null)
    .sort((a, b) => a.startedAt - b.startedAt)
    .map((d) => {
      const c = confirmationOf(d);
      const confirmed = c === "confirmed" && d.signedOff ? d.signedOff : null;
      return [
        localDate(d.startedAt),
        localTime(d.startedAt),
        localTime(d.endedAt!),
        learnerNames.get(driveLearnerId(d)) ?? "",
        d.dayMinutes + d.nightMinutes,
        d.dayMinutes,
        d.nightMinutes,
        supervisorLabel(d),
        d.supervisorInitials,
        d.vehicleName ?? "",
        d.conditions.join("; "),
        d.skills.join("; "),
        d.notes,
        d.manual ? "Typed in" : "Timed",
        d.timesEdited ? "Yes" : "",
        c === "self" ? d.supervisorName : confirmed ? confirmed.name : "",
        confirmed ? localDate(confirmed.at) : "",
      ];
    });
  // The byte-order mark makes Excel read the file as UTF-8 (names with accents, the night moon)
  return "﻿" + [CSV_HEADER, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

/** Everything in the log, in a stable shape a person (or another app) can read. */
export function logJson(family: Family, drives: Drive[], exportedAt: number): string {
  const data = {
    format: "drivetron-export",
    version: 1,
    exportedAt: new Date(exportedAt).toISOString(),
    log: {
      state: family.state ?? "MT",
      createdAt: new Date(family.createdAt).toISOString(),
      learners: learnersOf(family).map(({ id, name, dob, permitDate }) => ({ id, name, dob, licenseIssued: permitDate })),
      vehicles: vehiclesOf(family).map(({ id, name }) => ({ id, name })),
      people: family.memberUids
        .filter((uid) => family.members[uid])
        .map((uid) => ({ id: uid, ...family.members[uid], owner: uid === family.ownerUid })),
    },
    drives: [...drives]
      .sort((a, b) => a.startedAt - b.startedAt)
      .map((d) => ({
        id: d.id,
        learnerId: driveLearnerId(d),
        startedAt: new Date(d.startedAt).toISOString(),
        endedAt: d.endedAt === null ? null : new Date(d.endedAt).toISOString(),
        dayMinutes: d.dayMinutes,
        nightMinutes: d.nightMinutes,
        supervisor: { id: d.supervisorUid, name: d.supervisorName, initials: d.supervisorInitials, drivingInstructor: isInstructor(d) },
        vehicle: d.vehicleName ?? null,
        conditions: d.conditions,
        skills: d.skills,
        notes: d.notes,
        location: d.lat !== null && d.lng !== null ? { lat: d.lat, lng: d.lng } : null,
        logged: d.manual ? "typed in" : "timed",
        timesEdited: !!d.timesEdited,
        confirmation: confirmationOf(d),
        confirmedBy: d.signedOff ? { name: d.signedOff.name, at: new Date(d.signedOff.at).toISOString() } : null,
        loggedBy: d.createdBy,
      })),
  };
  return JSON.stringify(data, null, 2) + "\n";
}

/** A file name like "drivetron-maya-2026-11-18.csv" */
export function exportFileName(label: string, ext: "csv" | "json", now: number): string {
  const slug = label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `drivetron-${slug || "log"}-${localDate(now)}.${ext}`;
}
