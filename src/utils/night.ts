import SunCalc from "suncalc";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Night = sunset to sunrise at the drive's location. Montana's GDL materials don't define
 * "night" more precisely, so this uses the plain astronomical meaning.
 *
 * Returns whole minutes; day + night always equals the rounded total so the columns add up.
 */
export function splitDayNight(
  startMs: number,
  endMs: number,
  lat: number,
  lng: number
): { dayMinutes: number; nightMinutes: number } {
  if (!(endMs > startMs)) return { dayMinutes: 0, nightMinutes: 0 };

  const totalMinutes = Math.round((endMs - startMs) / 60000);
  let nightMs = 0;

  // Walk each local day touching the drive: night runs from that day's sunset to the next sunrise.
  // Start a day early so a drive just after midnight catches the previous evening's sunset.
  for (let t = startMs - DAY_MS; t <= endMs + DAY_MS; t += DAY_MS) {
    const sunset = SunCalc.getTimes(new Date(t), lat, lng).sunset.getTime();
    const nextSunrise = SunCalc.getTimes(new Date(t + DAY_MS), lat, lng).sunrise.getTime();
    if (Number.isNaN(sunset) || Number.isNaN(nextSunrise) || nextSunrise <= sunset) continue;
    const overlap = Math.min(endMs, nextSunrise) - Math.max(startMs, sunset);
    if (overlap > 0) nightMs += overlap;
  }

  const nightMinutes = Math.min(totalMinutes, Math.round(nightMs / 60000));
  return { dayMinutes: totalMinutes - nightMinutes, nightMinutes };
}
