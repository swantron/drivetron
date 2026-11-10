import type { Family } from "@/types";
import { DEFAULT_LAT, DEFAULT_LNG } from "./montana";

/**
 * One GPS fix, used only to work out sunset/sunrise for the night split. Resolves null
 * rather than failing if permission is denied or there's no fix in time.
 */
export function getLocation(timeoutMs = 6000): Promise<{ lat: number; lng: number } | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      // ~1km precision is plenty for sunset times and keeps the log from holding exact addresses
      (pos) => resolve({ lat: round2(pos.coords.latitude), lng: round2(pos.coords.longitude) }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 10 * 60 * 1000 }
    );
  });
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** Where to compute sun times for a drive: its own fix, else the family's last, else Helena. */
export function driveCoords(drive: { lat: number | null; lng: number | null }, family: Family | null) {
  if (drive.lat != null && drive.lng != null) return { lat: drive.lat, lng: drive.lng };
  if (family?.lastLat != null && family?.lastLng != null) return { lat: family.lastLat, lng: family.lastLng };
  return { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
}
