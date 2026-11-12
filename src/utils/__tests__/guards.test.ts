import { safeNext } from "@/utils/safeNext";
import { syncedLate } from "@/utils/syncedLate";
import { parseLocalDate } from "@/utils/progress";
import type { Drive } from "@/types";

const ORIGIN = "https://drivetron.app";

describe("safeNext", () => {
  it("follows paths on this site", () => {
    expect(safeNext("/log", ORIGIN)).toBe("/log");
    expect(safeNext("/drives/edit?id=abc#x", ORIGIN)).toBe("/drives/edit?id=abc#x");
  });

  it("refuses anything that leaves the site", () => {
    expect(safeNext("/\\example.com", ORIGIN)).toBe("/");
    expect(safeNext("//example.com", ORIGIN)).toBe("/");
    expect(safeNext("https://example.com/", ORIGIN)).toBe("/");
    expect(safeNext("javascript:alert(1)", ORIGIN)).toBe("/");
    expect(safeNext(null, ORIGIN)).toBe("/");
    expect(safeNext("/log", undefined)).toBe("/");
  });
});

describe("syncedLate", () => {
  const base = { startedAt: 1_000_000_000_000, manual: false } as Drive;
  const at = (ms: number) => ({ toMillis: () => ms });

  it("flags a timer the server first saw well after its start", () => {
    expect(syncedLate({ ...base, syncedAt: at(base.startedAt + 3 * 3_600_000) })).toBe(true);
  });

  it("ignores prompt syncs, typed-in drives, unsynced and older drives", () => {
    expect(syncedLate({ ...base, syncedAt: at(base.startedAt + 2000) })).toBe(false);
    expect(syncedLate({ ...base, manual: true, syncedAt: at(base.startedAt + 3 * 3_600_000) })).toBe(false);
    expect(syncedLate({ ...base, syncedAt: null })).toBe(false);
    expect(syncedLate(base)).toBe(false);
  });
});

describe("parseLocalDate", () => {
  it("parses YYYY-MM-DD as a local date", () => {
    const d = parseLocalDate("2026-11-09");
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 10, 9]);
  });

  it("falls back to today instead of an invalid date", () => {
    for (const bad of ["", "soon", undefined, null, "2026-1-9"]) {
      expect(Number.isNaN(parseLocalDate(bad).getTime())).toBe(false);
    }
  });
});
