import { DEFAULT_STATE, STATES, getState, getStateBySlug, holdText } from "@/states";
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
      expect(s.permitValidMonths).toBeGreaterThanOrEqual(s.holdMonths);
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
