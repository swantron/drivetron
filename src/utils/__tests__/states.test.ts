import { DEFAULT_STATE, STATES, countLimitText, holdDays, getState, getStateBySlug, holdText, nightRangeText } from "@/states";
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
      expect(s.holdMonths).toBeGreaterThanOrEqual(0);
      expect(s.holdExtraDays).toBeGreaterThanOrEqual(0);
      expect(holdDays(s) > 0 || s.noPermit === true).toBe(true);
      expect(Math.abs(s.nightOffsetMinutes)).toBeLessThanOrEqual(60);
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
    expect([tx.totalMinutes, tx.nightMinutes, tx.countLimit]).toEqual([30 * 60, 10 * 60, { minutes: 120, per: "day" }]);
    expect(nightRangeText(tx)).toBe("30 minutes after sunset to 30 minutes before sunrise");
    const p = computeProgress([], "2026-11-18", new Date(2026, 10, 18), tx);
    expect(p.expiryDate).toBeNull();
    expect(p.holdDate).toEqual(new Date(2027, 4, 18));
    expect(tx.practiceLog).toBeUndefined();
  });

  it("finds Pennsylvania: 65 hours with 5 in bad weather, a one-year permit, sunset to sunrise", () => {
    const pa = getStateBySlug("pennsylvania")!;
    expect(getState("PA")).toBe(pa);
    expect([pa.totalMinutes, pa.nightMinutes, pa.weatherMinutes]).toEqual([65 * 60, 10 * 60, 5 * 60]);
    expect(nightRangeText(pa)).toBe("sunset to sunrise");
    const p = computeProgress([], "2026-11-18", new Date(2026, 10, 18), pa);
    expect(p.expiryDate).toEqual(new Date(2027, 10, 18));
    expect(p.holdDate).toEqual(new Date(2027, 4, 18));
    expect(p.weatherRemaining).toBe(5 * 60);
  });

  it("finds the 2026-11-18 batch: Florida, Georgia, North Carolina, Illinois", () => {
    const fl = getStateBySlug("florida")!;
    const ga = getStateBySlug("georgia")!;
    const nc = getStateBySlug("north-carolina")!;
    const il = getStateBySlug("illinois")!;
    expect([fl, ga, nc, il].map((s) => s.code)).toEqual(["FL", "GA", "NC", "IL"]);
    expect([fl, ga, nc, il].map((s) => [s.totalMinutes / 60, s.nightMinutes / 60])).toEqual([[50, 10], [40, 6], [60, 10], [50, 10]]);
    const now = new Date(2026, 10, 18);
    // Florida: 12 months, no permit term of its own
    expect(computeProgress([], "2026-11-18", now, fl).holdDate).toEqual(new Date(2027, 10, 18));
    expect(computeProgress([], "2026-11-18", now, fl).expiryDate).toBeNull();
    // Georgia: one year and one day; the permit is good for two years
    expect(holdText(ga)).toBe("12 months + 1 day");
    expect(computeProgress([], "2026-11-18", now, ga).holdDate).toEqual(new Date(2027, 10, 19));
    expect(computeProgress([], "2026-11-18", now, ga).expiryDate).toEqual(new Date(2028, 10, 18));
    // North Carolina: nine months, 10 hours a week
    expect(computeProgress([], "2026-11-18", now, nc).holdDate).toEqual(new Date(2027, 7, 18));
    expect(countLimitText(nc)).toBe("10h a week");
    expect(countLimitText(getState("TX"))).toBe("2h a day");
    expect(countLimitText(getState("MT"))).toBeNull();
    // Illinois: nine months, permit valid 24
    expect(computeProgress([], "2026-11-18", now, il).expiryDate).toEqual(new Date(2028, 10, 18));
  });

  it("finds New York, Michigan and Virginia", () => {
    const ny = getStateBySlug("new-york")!;
    const mi = getStateBySlug("michigan")!;
    const va = getStateBySlug("virginia")!;
    expect([ny, mi, va].map((s) => [s.code, s.totalMinutes / 60, s.nightMinutes / 60])).toEqual([
      ["NY", 50, 15],
      ["MI", 50, 10],
      ["VA", 45, 15],
    ]);
    expect(nightRangeText(mi)).toBe("30 minutes after sunset to 30 minutes before sunrise");
    expect([holdText(ny), holdText(mi), holdText(va)]).toEqual(["6 months", "6 months", "9 months"]);
  });

  it("finds New Jersey, Washington, Arizona and Tennessee; Tennessee's hold is 180 days", () => {
    const [nj, wa, az, tn] = ["new-jersey", "washington", "arizona", "tennessee"].map((s) => getStateBySlug(s)!);
    expect([nj, wa, az, tn].map((s) => [s.code, s.totalMinutes / 60, s.nightMinutes / 60])).toEqual([
      ["NJ", 50, 10],
      ["WA", 50, 10],
      ["AZ", 30, 10],
      ["TN", 50, 10],
    ]);
    expect(holdText(tn)).toBe("180 days");
    const p = computeProgress([], "2026-11-19", new Date(2026, 10, 19), tn);
    expect(p.holdDate).toEqual(new Date(2027, 4, 18)); // Nov 19 + 180 days
    expect(computeProgress([], "2026-11-19", new Date(2026, 10, 19), wa).expiryDate).toEqual(new Date(2027, 10, 19));
  });

  it("finds Massachusetts (no night hours), Indiana and Missouri (holds in days), and Maryland (wider night)", () => {
    const [ma, ind, mo, md] = ["massachusetts", "indiana", "missouri", "maryland"].map((s) => getStateBySlug(s)!);
    expect([ma, ind, mo, md].map((s) => [s.code, s.totalMinutes / 60, s.nightMinutes / 60])).toEqual([
      ["MA", 40, 0],
      ["IN", 50, 10],
      ["MO", 40, 10],
      ["MD", 60, 10],
    ]);
    expect([holdText(ind), holdText(mo), holdText(md)]).toEqual(["180 days", "182 days", "9 months"]);
    expect(nightRangeText(md)).toBe("30 minutes before sunset to 30 minutes after sunrise");
    // No night requirement: hours done on total alone
    const p = computeProgress([], "2026-01-01", new Date(2026, 10, 19), { ...ma, totalMinutes: 0 });
    expect(p.hoursDone).toBe(true);
  });

  it("finds Wisconsin, Colorado, Minnesota and South Carolina", () => {
    const [wi, co, mn, sc] = ["wisconsin", "colorado", "minnesota", "south-carolina"].map((s) => getStateBySlug(s)!);
    expect([wi, co, mn, sc].map((s) => [s.code, s.totalMinutes / 60, s.nightMinutes / 60, holdText(s)])).toEqual([
      ["WI", 50, 10, "6 months"],
      ["CO", 50, 10, "12 months"],
      ["MN", 50, 15, "6 months"],
      ["SC", 40, 10, "180 days"],
    ]);
    expect(nightRangeText(wi)).toBe("30 minutes after sunset to 30 minutes before sunrise");
  });

  // Key figures for each state added in the later batches, checked against its sources: [code, total h, night h, hold]
  const FIGURES: [string, number, number, string][] = [
    ["AL", 50, 0, "6 months"],
    ["LA", 50, 15, "180 days"],
    ["KY", 60, 10, "180 days"],
    ["OR", 100, 0, "6 months"],
    ["OK", 50, 10, "180 days"],
    ["CT", 40, 0, "180 days"],
    ["UT", 40, 10, "6 months"],
    ["IA", 20, 2, "12 months"],
    ["NV", 50, 10, "6 months"],
    ["KS", 50, 10, "12 months"],
    ["NM", 50, 10, "6 months"],
    ["NE", 50, 10, "6 months"],
    ["ID", 50, 10, "6 months"],
    ["WV", 50, 10, "6 months"],
    ["ME", 70, 10, "6 months"],
    ["RI", 50, 10, "6 months"],
    ["DE", 50, 10, "6 months"],
    ["SD", 50, 10, "275 days"],
    ["ND", 50, 0, "12 months"],
    ["VT", 40, 10, "12 months"],
    ["WY", 50, 10, "10 days"],
    ["DC", 40, 0, "6 months"],
    ["NH", 40, 10, "none"],
    ["AK", 40, 0, "6 months"],
  ];
  it.each(FIGURES)("%s: %i hours, %i at night, hold %s", (code, total, night, hold) => {
    const s = getState(code);
    expect(s.code).toBe(code);
    expect([s.totalMinutes / 60, s.nightMinutes / 60, holdText(s)]).toEqual([total, night, hold]);
  });

  it("gives every state a form guide that names its form", () => {
    for (const s of STATES) {
      expect(s.formGuide?.steps.length, s.name).toBeGreaterThan(0);
      expect(s.formGuide!.title, s.name).toMatch(new RegExp(s.name));
    }
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
