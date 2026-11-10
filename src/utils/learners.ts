import type { Drive, Family, Learner, Vehicle } from "@/types";

/** The first learner's id, and the owner of any drive saved before drives carried a learnerId. */
export const PRIMARY_LEARNER = "primary";

export type LearnerWithId = Learner & { id: string };
export type VehicleWithId = Vehicle & { id: string };

/** Learners in a stable order (first learner first, then by name), reading legacy single-learner families too. */
export function learnersOf(family: Family): LearnerWithId[] {
  const map: Record<string, Learner> =
    family.learners && Object.keys(family.learners).length > 0
      ? family.learners
      : family.learnerName
      ? { [PRIMARY_LEARNER]: { name: family.learnerName, dob: family.learnerDob ?? "", permitDate: family.permitDate ?? "" } }
      : {};
  return Object.entries(map)
    .map(([id, l]) => ({ id, ...l }))
    .sort((a, b) => (a.id === PRIMARY_LEARNER ? -1 : b.id === PRIMARY_LEARNER ? 1 : a.name.localeCompare(b.name)));
}

export function vehiclesOf(family: Family): VehicleWithId[] {
  return Object.entries(family.vehicles ?? {})
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function driveLearnerId(drive: Pick<Drive, "learnerId">): string {
  return drive.learnerId ?? PRIMARY_LEARNER;
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

/** Short random id for map keys (learners, vehicles). */
export function newId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 10);
}

/** Default vehicle for a new drive: the one this learner used most recently, else the only/first car. */
export function defaultVehicleId(drives: Drive[], vehicles: VehicleWithId[]): string | null {
  const ids = new Set(vehicles.map((v) => v.id));
  const recent = drives.find((d) => d.vehicleId && ids.has(d.vehicleId));
  return recent?.vehicleId ?? vehicles[0]?.id ?? null;
}
