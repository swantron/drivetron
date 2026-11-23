import { describe, expect, it } from "vitest";
import { INSTRUCTOR_UID, instructorsFor, personKey, recentInstructors, supervisorLabel } from "@/utils/instructors";
import { logInitials } from "@/utils/members";
import { confirmationOf, needsConfirming } from "@/utils/signoff";
import type { Drive } from "@/types";

const d = (over: Partial<Drive>): Drive =>
  ({
    id: "x",
    startedAt: 1,
    endedAt: 3_600_001,
    dayMinutes: 60,
    nightMinutes: 0,
    supervisorUid: "dad",
    supervisorName: "Joe",
    supervisorInitials: "JS",
    conditions: [],
    skills: [],
    notes: "",
    lat: null,
    lng: null,
    manual: false,
    createdBy: "teen",
    updatedAt: 1,
    ...over,
  }) as Drive;
const lesson = (name: string, initials: string, startedAt = 1) =>
  d({ supervisorUid: INSTRUCTOR_UID, supervisorName: name, supervisorInitials: initials, startedAt });

describe("driving instructors", () => {
  it("names them as instructors", () => {
    expect(supervisorLabel(lesson("Pat Jones", "PJ"))).toBe("Pat Jones (driving instructor)");
    expect(supervisorLabel(d({}))).toBe("Joe");
  });

  it("tells instructors apart by name, since they share the placeholder", () => {
    expect(personKey(lesson("Pat Jones", "PJ"))).not.toBe(personKey(lesson("Sam Lee", "SL")));
    expect(personKey(lesson("Pat Jones", "PJ"))).toBe(personKey(lesson(" pat jones", "PJ")));
  });

  it("lists earlier instructors once each, most recent first", () => {
    const list = recentInstructors([lesson("Pat Jones", "PJ", 1), d({ startedAt: 2 }), lesson("Sam Lee", "SL", 3), lesson("Pat Jones", "PJ", 4)]);
    expect(list.map((i) => i.name)).toEqual(["Pat Jones", "Sam Lee"]);
  });

  it("offers the ones a parent saved first, then others from earlier drives, once each", () => {
    const family = { instructors: { a: { name: "Pat Jones", initials: "PJ" }, b: { name: "Ann Bell", initials: "AB" } } };
    const list = instructorsFor(family, [lesson("Sam Lee", "SL", 5), lesson("pat jones", "PJ", 6)]);
    expect(list.map((i) => i.name)).toEqual(["Ann Bell", "Pat Jones", "Sam Lee"]);
    expect(instructorsFor({}, [])).toEqual([]);
  });

  it("keys them on the printed log as instructors", () => {
    const drives = [d({}), lesson("Pat Jones", "PJ")];
    const inits = logInitials(drives);
    expect(inits.label(drives[1])).toBe("PJ");
    expect(inits.key).toContainEqual({ label: "PJ", name: "Pat Jones, driving instructor" });
    // Same initials as Dad: both print as first names instead
    const clash = [d({}), lesson("Jane Smith", "JS")];
    expect(logInitials(clash).label(clash[1])).toBe("Jane");
  });

  it("always waits for a parent's confirmation, even typed in by one", () => {
    expect(needsConfirming(lesson("Pat Jones", "PJ"))).toBe(true);
    expect(confirmationOf({ ...lesson("Pat Jones", "PJ"), createdBy: "dad" })).toBe("pending");
  });
});
