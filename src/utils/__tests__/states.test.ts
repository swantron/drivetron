import { DEFAULT_STATE, STATES, getState, getStateBySlug, holdText, nightRangeText } from "@/states";
import { computeProgress } from "@/utils/progress";

describe("state rules", () => {
  it("has unique codes and slugs, and a default that exists", () => {
    expect(new Set(STATES.map((s) => s.code)).size).toBe(STATES.length);
    expect(new Set(STATES.map((s) => s.slug)).size).toBe(STATES.length);
    expect(STATES.some((s) => s.code === DEFAULT_STATE)).toBe(true);
  });

  it("gives every state sane figures, sources and a verification date", () => {
    for (const s of STATES) {
      expect(s.code).toMatch(/^[A-Z]{2}$/);
      expect(s.slug).toMatch(/^[a-z-]+$/);
      expect(s.totalMinutes).toBeGreaterThan(0);
      expect(s.nightMinutes).toBeGreaterThanOrEqual(0);
      expect(s.nightMinutes).toBeLessThanOrEqual(s.totalMinutes);
      expect(s.holdMonths).toBeGreaterThan(0);
      expect(s.holdExtraDays).toBeGreaterThanOrEqual(0);
      expect(s.nightOffsetMinutes).toBeGreaterThanOrEqual(0);
      if (s.permitValidMonths !== null) expect(s.permitValidMonths).toBeGreaterThanOrEqual(s.holdMonths);
      expect(s.sources.length).toBeGreaterThan(0);
      for (const l of [...s.sources, s.certification]) expect(l.url).toMatch(/^https:\/\//);
      expect(s.verified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("falls back to Montana for logs with no state", () => {
    expect(getState(undefined).code).toBe("MT");
    expect(getState("ZZ").code).toBe("MT");
    expect(getStateBySlug("montana")?.code).toBe("MT");
    expect(getStateBySlug("home")).toBeUndefined();
  });

  it("finds California by code and slug, with a plain 6-month hold and darkness offset", () => {
    const ca = getStateBySlug("california")!;
    expect(ca.code).toBe("CA");
    expect(getState("CA")).toBe(ca);
    expect(holdText(ca)).toBe("6 months");
    expect(nightRangeText(ca)).toBe("30 minutes after sunset to 30 minutes before sunrise");
    expect(nightRangeText(getState("MT"))).toBe("sunset to sunrise");
    expect(computeProgress([], "2026-08-31", new Date(2026, 10, 9), ca).expiryDate).toBeNull();
    const p = computeProgress([], "2026-08-31", new Date(2026, 10, 9), ca);
    expect([p.holdDate.getFullYear(), p.holdDate.getMonth(), p.holdDate.getDate()]).toEqual([2027, 1, 28]); // Feb 28, 2027
  });

  it("finds Ohio, with a one-year permit and nighttime from the affidavit", () => {
    const oh = getStateBySlug("ohio")!;
    expect(getState("OH")).toBe(oh);
    expect([oh.totalMinutes, oh.nightMinutes]).toEqual([50 * 60, 10 * 60]);
    expect(holdText(oh)).toBe("6 months");
    expect(nightRangeText(oh)).toBe("30 minutes after sunset to 30 minutes before sunrise");
    const p = computeProgress([], "2026-11-17", new Date(2026, 10, 17), oh);
    expect(p.expiryDate).toEqual(new Date(2027, 10, 17));
    expect(p.holdDate).toEqual(new Date(2027, 4, 17));
  });

  it("finds Texas: 30 hours, a learner license good until 18, and a 2-hour daily limit", () => {
    const tx = getStateBySlug("texas")!;
    expect(getState("TX")).toBe(tx);
    expect([tx.totalMinutes, tx.nightMinutes, tx.dailyCountMinutes]).toEqual([30 * 60, 10 * 60, 120]);
    expect(nightRangeText(tx)).toBe("30 minutes after sunset to 30 minutes before sunrise");
    const p = computeProgress([], "2026-11-18", new Date(2026, 10, 18), tx);
    expect(p.expiryDate).toBeNull();
    expect(p.holdDate).toEqual(new Date(2027, 4, 18));
    expect(tx.practiceLog).toBeUndefined();
  });

  it("drives progress from the state's own figures", () => {
    const strict = { ...getState("MT"), totalMinutes: 60 * 60, nightMinutes: 15 * 60, holdMonths: 9 };
    const p = computeProgress([], "2026-11-01", new Date(2026, 10, 9), strict);
    expect(p.holdDate.getMonth()).toBe(7); // Aug 2027
  });

  it("adds a state's extra hold days, across a month end", () => {
    const r = { ...getState("MT"), holdMonths: 6, holdExtraDays: 1 };
    expect(computeProgress([], "2026-08-31", new Date(2026, 8, 1), r).holdDate).toEqual(new Date(2027, 2, 1));
    expect(holdText(r)).toBe("6 months + 1 day");
    expect(holdText({ ...r, holdExtraDays: 0 })).toBe("6 months");
  });
});
