import type { Drive } from "@/types";
import { addMonths, computeProgress, formatMinutes, initialsOf, parseLocalDate } from "../progress";

function drive(startedAt: Date, dayMinutes: number, nightMinutes: number, extra: Partial<Drive> = {}): Drive {
  return {
    id: String(startedAt.getTime()),
    startedAt: startedAt.getTime(),
    endedAt: startedAt.getTime() + (dayMinutes + nightMinutes) * 60000,
    dayMinutes,
    nightMinutes,
    supervisorUid: "u1",
    supervisorName: "Joe Swanson",
    supervisorInitials: "JS",
    conditions: [],
    skills: [],
    notes: "",
    lat: null,
    lng: null,
    manual: false,
    createdBy: "u1",
    updatedAt: 0,
    ...extra,
  };
}

describe("addMonths", () => {
  it("adds six months", () => {
    expect(addMonths(new Date(2026, 10, 9), 6)).toEqual(new Date(2027, 4, 9));
  });
  it("clamps to the end of a shorter month", () => {
    expect(addMonths(new Date(2026, 7, 31), 6)).toEqual(new Date(2027, 1, 28));
  });
});

describe("parseLocalDate", () => {
  it("parses as a local date, not UTC", () => {
    const d = parseLocalDate("2026-11-09");
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 10, 9]);
  });
});

describe("computeProgress", () => {
  const permit = "2026-11-01";

  it("starts at zero with the hold date six months out", () => {
    const p = computeProgress([], permit, new Date(2026, 10, 9));
    expect(p.totalRemaining).toBe(3000);
    expect(p.nightRemaining).toBe(600);
    expect(p.holdDate).toEqual(new Date(2027, 4, 1));
    expect(p.expiryDate).toEqual(new Date(2027, 10, 1));
    expect(p.projectedHoursDate).toBeNull();
    expect(p.eligible).toBe(false);
  });

  it("ignores a drive still in progress", () => {
    const live = { ...drive(new Date(2026, 10, 9, 15), 0, 0), endedAt: null };
    expect(computeProgress([live], permit, new Date(2026, 10, 9, 16)).driveCount).toBe(0);
  });

  it("projects a finish date from the pace so far", () => {
    // 4 weeks in, 10 hours logged with 2 at night: 2.5h/week, 40h left -> 16 weeks;
    // night: 0.5h/week, 8h left -> 16 weeks.
    const now = new Date(2026, 10, 30); // 4 weeks after the first drive
    const drives = [drive(new Date(2026, 10, 2), 240, 60), drive(new Date(2026, 10, 20), 240, 60)];
    const p = computeProgress(drives, permit, now);
    expect(p.totalMinutes).toBe(600);
    expect(p.nightMinutes).toBe(120);
    const weeks = (p.projectedHoursDate!.getTime() - now.getTime()) / (7 * 86400000);
    expect(weeks).toBeCloseTo(16, 0);
  });

  it("can't project night hours with no night driving yet", () => {
    const drives = [drive(new Date(2026, 10, 2), 120, 0), drive(new Date(2026, 10, 5), 120, 0)];
    expect(computeProgress(drives, permit, new Date(2026, 10, 9)).projectedHoursDate).toBeNull();
  });

  it("is eligible only once both the hours and the six-month hold are done", () => {
    const drives = [drive(new Date(2026, 11, 1), 2400, 600)];
    expect(computeProgress(drives, permit, new Date(2027, 2, 1)).eligible).toBe(false);
    expect(computeProgress(drives, permit, new Date(2027, 4, 1)).eligible).toBe(true);
  });

  it("tallies conditions and skills", () => {
    const drives = [
      drive(new Date(2026, 10, 2), 30, 0, { conditions: ["Snow", "Highway"], skills: ["Merging"] }),
      drive(new Date(2026, 10, 3), 30, 0, { conditions: ["Snow"] }),
    ];
    const p = computeProgress(drives, permit, new Date(2026, 10, 9));
    expect(p.conditionCounts).toEqual({ Snow: 2, Highway: 1 });
    expect(p.skillCounts).toEqual({ Merging: 1 });
  });
});

describe("formatting", () => {
  it("formats minutes", () => {
    expect(formatMinutes(45)).toBe("45m");
    expect(formatMinutes(120)).toBe("2h");
    expect(formatMinutes(95)).toBe("1h 35m");
  });
  it("makes initials", () => {
    expect(initialsOf("joe swanson")).toBe("JS");
    expect(initialsOf("  Mary Jane Watson Parker ")).toBe("MJW");
  });
});
