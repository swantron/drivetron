import { splitDayNight } from "../night";

// Helena, MT. Mountain time: MST is UTC-7, MDT is UTC-6.
const LAT = 46.5891;
const LNG = -112.0391;
const utc = (iso: string) => new Date(iso).getTime();

describe("splitDayNight", () => {
  it("counts a midday drive as all day", () => {
    // Noon MDT on July 1
    expect(splitDayNight(utc("2026-07-01T18:00:00Z"), utc("2026-07-01T19:00:00Z"), LAT, LNG)).toEqual({
      dayMinutes: 60,
      nightMinutes: 0,
    });
  });

  it("counts a midnight drive as all night", () => {
    // 11:30pm–12:30am MST in January
    expect(splitDayNight(utc("2026-01-15T06:30:00Z"), utc("2026-01-15T07:30:00Z"), LAT, LNG)).toEqual({
      dayMinutes: 0,
      nightMinutes: 60,
    });
  });

  it("splits a drive that crosses sunset", () => {
    // Helena sunset on Nov 9 is about 5:00pm MST (00:00Z). Drive 4:20–5:20pm.
    const { dayMinutes, nightMinutes } = splitDayNight(
      utc("2026-11-09T23:20:00Z"),
      utc("2026-11-10T00:20:00Z"),
      LAT,
      LNG
    );
    expect(dayMinutes + nightMinutes).toBe(60);
    expect(dayMinutes).toBeGreaterThan(30);
    expect(dayMinutes).toBeLessThan(50);
  });

  it("splits a drive that crosses sunrise", () => {
    // Helena sunrise on Jan 15 is about 8:05am MST (15:05Z). Drive 7:30–8:30am.
    const { dayMinutes, nightMinutes } = splitDayNight(
      utc("2026-01-15T14:30:00Z"),
      utc("2026-01-15T15:30:00Z"),
      LAT,
      LNG
    );
    expect(dayMinutes + nightMinutes).toBe(60);
    expect(nightMinutes).toBeGreaterThan(20);
    expect(nightMinutes).toBeLessThan(50);
  });

  it("handles a long road trip spanning day and night", () => {
    // 2pm to 10pm MDT in June: sunset ~9:25pm, so roughly 35 minutes of night
    const { dayMinutes, nightMinutes } = splitDayNight(
      utc("2026-06-20T20:00:00Z"),
      utc("2026-06-21T04:00:00Z"),
      LAT,
      LNG
    );
    expect(dayMinutes + nightMinutes).toBe(480);
    expect(nightMinutes).toBeGreaterThan(20);
    expect(nightMinutes).toBeLessThan(50);
  });

  it("returns zero for an empty or reversed range", () => {
    expect(splitDayNight(1000, 1000, LAT, LNG)).toEqual({ dayMinutes: 0, nightMinutes: 0 });
    expect(splitDayNight(2000, 1000, LAT, LNG)).toEqual({ dayMinutes: 0, nightMinutes: 0 });
  });
});
