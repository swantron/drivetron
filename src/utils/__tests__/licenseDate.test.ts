import { describe, expect, it } from "vitest";
import { getState } from "@/states";
import { licenseDate } from "@/utils/licenseDate";

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);
const ymd = (x: Date | null) => (x ? `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}` : null);

describe("licenseDate", () => {
  const mt = getState("MT"); // 50 hours, hold 6 months + 1 day
  const today = d(2026, 1, 1);

  it("is the hold date when the hours finish first", () => {
    const r = licenseDate(mt, d(2026, 1, 1), 0, 10, today); // 50h at 10/week = 35 days
    expect(ymd(r.hoursDate)).toBe("2026-2-5");
    expect(ymd(r.holdDate)).toBe("2026-7-2");
    expect(ymd(r.earliest)).toBe("2026-7-2");
  });

  it("is the hours date when the hours take longer than the hold", () => {
    const r = licenseDate(mt, d(2026, 1, 1), 10, 1, today); // 40h at 1/week = 280 days
    expect(ymd(r.earliest)).toBe("2026-10-8");
    expect(r.hoursLeft).toBe(40);
  });

  it("counts hours from today, not the permit date, for a permit issued earlier", () => {
    const r = licenseDate(mt, d(2025, 6, 1), 40, 5, today); // 10h at 5/week = 14 days from today
    expect(ymd(r.hoursDate)).toBe("2026-1-15");
  });

  it("has no date with hours left and no pace", () => {
    const r = licenseDate(mt, d(2026, 1, 1), 0, 0, today);
    expect(r.hoursDate).toBeNull();
    expect(r.earliest).toBeNull();
  });

  it("ignores hours in a state that requires none", () => {
    const ar = getState("AR");
    const r = licenseDate(ar, d(2026, 1, 1), 0, 0, today);
    expect(r.hoursLeft).toBe(0);
    expect(ymd(r.earliest)).toBe(ymd(r.holdDate));
  });

  it("flags a date after the permit expires", () => {
    const r = licenseDate(mt, d(2026, 1, 1), 0, 0.1, today);
    expect(r.afterExpiry).toBe(r.expiry !== null);
  });
});
