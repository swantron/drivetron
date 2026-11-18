import type { Drive, Family } from "@/types";
import { confirmationOf, needsConfirming, signOffFor } from "../signoff";
import { CSV_HEADER, csvCell, drivesCsv, exportFileName, logJson } from "../export";

const drive = (over: Partial<Drive> = {}): Drive => ({
  id: "d1",
  learnerId: "primary",
  vehicleId: null,
  vehicleName: "Outback",
  startedAt: new Date(2026, 10, 2, 16, 5).getTime(),
  endedAt: new Date(2026, 10, 2, 17, 15).getTime(),
  dayMinutes: 40,
  nightMinutes: 30,
  supervisorUid: "mom",
  supervisorName: "Dana Rivera",
  supervisorInitials: "DR",
  conditions: ["Snow", "Highway"],
  skills: ["Merging"],
  notes: "",
  lat: 45.68,
  lng: -111.04,
  manual: false,
  createdBy: "teen",
  updatedAt: 1,
  ...over,
});
const dad = { uid: "dad", name: "Chris Rivera", initials: "CR" };

describe("confirmationOf", () => {
  it("counts a drive the named supervisor logged themselves as vouched for", () => {
    const d = drive({ createdBy: "mom" });
    expect(confirmationOf(d)).toBe("self");
    expect(needsConfirming(d)).toBe(false);
  });

  it("asks for confirmation of a teen's own timer, but not while it's running", () => {
    expect(confirmationOf(drive())).toBe("pending");
    expect(needsConfirming(drive())).toBe(true);
    expect(needsConfirming(drive({ endedAt: null }))).toBe(false);
  });

  it("holds while the drive matches what was confirmed, and lapses when it changes", () => {
    const d = drive();
    const confirmed = { ...d, signedOff: signOffFor(d, dad, 5) };
    expect(confirmationOf(confirmed)).toBe("confirmed");
    expect(needsConfirming(confirmed)).toBe(false);
    expect(confirmationOf({ ...confirmed, nightMinutes: 45, dayMinutes: 25 })).toBe("changed");
    expect(confirmationOf({ ...confirmed, supervisorUid: "grandpa" })).toBe("changed");
    expect(needsConfirming({ ...confirmed, endedAt: d.endedAt! + 60_000 })).toBe(true);
  });

  it("won't confirm a running timer", () => {
    expect(() => signOffFor(drive({ endedAt: null }), dad, 5)).toThrow();
  });
});

const family: Family = {
  id: "f",
  learners: { primary: { name: "Maya Rivera", dob: "2010-05-14", permitDate: "2026-08-24" } },
  vehicles: { v1: { name: "Outback" } },
  ownerUid: "mom",
  memberUids: ["mom", "teen"],
  members: { mom: { name: "Dana Rivera", initials: "DR", role: "supervisor" }, teen: { name: "Maya Rivera", initials: "MR", role: "learner" } },
  inviteCode: "ABCD2345",
  state: "MT",
  createdAt: 0,
};

describe("csvCell", () => {
  it("quotes commas, quotes and line breaks", () => {
    expect(csvCell("plain")).toBe("plain");
    expect(csvCell('said "slow down", twice')).toBe('"said ""slow down"", twice"');
    expect(csvCell("two\nlines")).toBe('"two\nlines"');
    expect(csvCell(null)).toBe("");
    expect(csvCell(70)).toBe("70");
  });

  it("defuses text a spreadsheet would run as a formula", () => {
    expect(csvCell("=HYPERLINK(\"x\")")).toBe("\"'=HYPERLINK(\"\"x\"\")\"");
    expect(csvCell("+1 hour")).toBe("'+1 hour");
    expect(csvCell("@home")).toBe("'@home");
  });
});

describe("drivesCsv", () => {
  it("writes finished drives oldest first, with who confirmed them", () => {
    const older = drive({ id: "a", startedAt: new Date(2026, 9, 1, 9, 0).getTime(), endedAt: new Date(2026, 9, 1, 10, 0).getTime(), createdBy: "mom", dayMinutes: 60, nightMinutes: 0 });
    const newer = drive({ id: "b", notes: "icy, slow" });
    const confirmedNewer = { ...newer, signedOff: signOffFor(newer, dad, new Date(2026, 10, 3).getTime()) };
    const running = drive({ id: "c", endedAt: null });
    const lines = drivesCsv(family, [confirmedNewer, running, older]).replace(/^﻿/, "").trim().split("\r\n");
    expect(lines[0]).toBe(CSV_HEADER.join(","));
    expect(lines).toHaveLength(3);
    expect(lines[1]).toBe("2026-10-01,09:00,10:00,Maya Rivera,60,60,0,Dana Rivera,DR,Outback,Snow; Highway,Merging,,Timed,,Dana Rivera,");
    expect(lines[2]).toBe(
      '2026-11-02,16:05,17:15,Maya Rivera,70,40,30,Dana Rivera,DR,Outback,Snow; Highway,Merging,"icy, slow",Timed,,Chris Rivera,2026-11-03'
    );
  });

  it("leaves Confirmed by empty for a pending drive", () => {
    const row = drivesCsv(family, [drive({ manual: true, timesEdited: true })]).trim().split("\r\n")[1];
    expect(row.endsWith(",Typed in,Yes,,")).toBe(true);
  });
});

describe("logJson", () => {
  it("includes the learners, people and drives", () => {
    const out = JSON.parse(logJson(family, [drive()], Date.UTC(2026, 10, 18)));
    expect(out.format).toBe("drivetron-export");
    expect(out.exportedAt).toBe("2026-11-18T00:00:00.000Z");
    expect(out.log.learners).toEqual([{ id: "primary", name: "Maya Rivera", dob: "2010-05-14", licenseIssued: "2026-08-24" }]);
    expect(out.log.people).toContainEqual({ id: "mom", name: "Dana Rivera", initials: "DR", role: "supervisor", owner: true });
    expect(out.drives[0]).toMatchObject({ id: "d1", dayMinutes: 40, nightMinutes: 30, confirmation: "pending", logged: "timed" });
  });
});

describe("exportFileName", () => {
  it("makes a tidy, dated name", () => {
    const now = new Date(2026, 10, 18, 12).getTime();
    expect(exportFileName("Maya", "csv", now)).toBe("drivetron-maya-2026-11-18.csv");
    expect(exportFileName("Zoë", "json", now)).toBe("drivetron-zoe-2026-11-18.json");
    expect(exportFileName("", "csv", now)).toBe("drivetron-log-2026-11-18.csv");
  });
});
