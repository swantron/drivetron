import SunCalc from "suncalc";
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

  it("narrows night by a state's offset at both ends (California darkness)", () => {
    // 4pm to midnight MST on Nov 9: sunset ~5pm, so plain night ~7h; darkness starts 30 minutes later
    const start = utc("2026-11-09T23:00:00Z");
    const end = utc("2026-11-10T07:00:00Z");
    const plain = splitDayNight(start, end, LAT, LNG);
    const dark = splitDayNight(start, end, LAT, LNG, 30);
    expect(dark.dayMinutes + dark.nightMinutes).toBe(480);
    expect(plain.nightMinutes - dark.nightMinutes).toBe(30);
    // 5:30–6:30am MST on Jan 15: sunrise ~8:05, so all night either way
    expect(splitDayNight(utc("2026-01-15T12:30:00Z"), utc("2026-01-15T13:30:00Z"), LAT, LNG, 30).nightMinutes).toBe(60);
    // 7:30–8:30am: darkness ends ~7:35, so only a few minutes count
    expect(splitDayNight(utc("2026-01-15T14:30:00Z"), utc("2026-01-15T15:30:00Z"), LAT, LNG, 30).nightMinutes).toBeLessThan(15);
  });

  it("returns zero for an empty or reversed range", () => {
    expect(splitDayNight(1000, 1000, LAT, LNG)).toEqual({ dayMinutes: 0, nightMinutes: 0 });
    expect(splitDayNight(2000, 1000, LAT, LNG)).toEqual({ dayMinutes: 0, nightMinutes: 0 });
  });
});

describe("a negative offset widens night (Maryland)", () => {
  it("counts from 30 minutes before sunset", () => {
    const lat = 38.9784;
    const lng = -76.4922;
    const sunset = SunCalc.getTimes(new Date(2026, 5, 15, 12), lat, lng).sunset.getTime();
    const start = sunset - 40 * 60000;
    const end = sunset + 20 * 60000;
    expect(splitDayNight(start, end, lat, lng, 0)).toEqual({ dayMinutes: 40, nightMinutes: 20 });
    expect(splitDayNight(start, end, lat, lng, -30)).toEqual({ dayMinutes: 10, nightMinutes: 50 });
  });
});
