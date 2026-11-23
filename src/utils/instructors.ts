import type { Drive, Family, Instructor } from "@/types";

/**
 * A driving instructor supervising a drive. They aren't in the family log (they don't need the
 * app), so their drives name this placeholder instead of an account, carry the instructor's name
 * and initials as typed, and always wait for a parent or guardian to confirm them. Never a real
 * uid: Firebase uids are 28 characters.
 */
export const INSTRUCTOR_UID = "instructor";

type Supervised = Pick<Drive, "supervisorUid" | "supervisorName" | "supervisorInitials">;

export const isInstructor = (d: Pick<Drive, "supervisorUid">) => d.supervisorUid === INSTRUCTOR_UID;

/** Who supervised, as the app says it: "Ms. Jones (driving instructor)" or "Katie". */
export function supervisorLabel(d: Supervised): string {
  return isInstructor(d) ? `${d.supervisorName} (driving instructor)` : d.supervisorName;
}

/**
 * Tells supervisors apart on the printed log. Family members by account; instructors share the
 * placeholder uid, so by name.
 */
export function personKey(d: Pick<Drive, "supervisorUid" | "supervisorName">): string {
  return isInstructor(d) ? `${INSTRUCTOR_UID}:${d.supervisorName.trim().toLowerCase()}` : d.supervisorUid;
}

/**
 * Who the Supervising menu offers as instructors: the ones a parent saved on the Family tab
 * (so the teen can pick them before the first lesson), then any others from earlier drives, most
 * recent first. Once each, by name.
 */
export function instructorsFor(family: Pick<Family, "instructors">, drives: (Supervised & Pick<Drive, "startedAt">)[]): Instructor[] {
  const byName = new Map<string, Instructor>();
  const saved = Object.values(family.instructors ?? {}).sort((a, b) => a.name.localeCompare(b.name));
  for (const i of [...saved, ...recentInstructors(drives)]) {
    const key = i.name.trim().toLowerCase();
    if (!byName.has(key)) byName.set(key, i);
  }
  return [...byName.values()];
}

/** Instructors on earlier drives, most recent first, so the next lesson is one tap. */
export function recentInstructors(drives: (Supervised & Pick<Drive, "startedAt">)[]): { name: string; initials: string }[] {
  const seen = new Map<string, { name: string; initials: string }>();
  for (const d of [...drives].sort((a, b) => b.startedAt - a.startedAt)) {
    if (!isInstructor(d)) continue;
    const key = personKey(d);
    if (!seen.has(key)) seen.set(key, { name: d.supervisorName, initials: d.supervisorInitials });
  }
  return [...seen.values()];
}
