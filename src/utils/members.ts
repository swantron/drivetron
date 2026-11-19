import type { Family } from "@/types";

export interface Supervisor {
  uid: string;
  name: string;
  initials: string;
}

export function supervisorsOf(family: Family): Supervisor[] {
  return family.memberUids
    .map((uid) => ({ uid, m: family.members[uid] }))
    .filter((x) => x.m && x.m.role === "supervisor")
    .map(({ uid, m }) => ({ uid, name: m!.name, initials: m!.initials }));
}

/** Whoever's phone this is if they supervise, otherwise the first supervisor (the teen's phone). */
export function defaultSupervisor(family: Family, myUid: string): Supervisor | null {
  const sups = supervisorsOf(family);
  return sups.find((s) => s.uid === myUid) ?? sups[0] ?? null;
}

/**
 * What the printed log calls each supervising adult. Their initials, unless two of them share them
 * (Molly and Mark Montana, both "MM"): then each prints as their first name, which a clerk can read,
 * or their full name if the first names match too. Shared by the printed log, drive rows, the Family
 * list and the "Supervised by" menu, so the app and the paper agree.
 */
export function distinctLabels(people: { uid: string; name: string; initials: string }[]): Map<string, string> {
  const unique = [...new Map(people.map((p) => [p.uid, p])).values()];
  const count = (xs: string[]) => xs.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map<string, number>());
  const byInitials = count(unique.map((p) => p.initials));
  const first = (p: { name: string; initials: string }) => p.name.trim().split(/\s+/)[0] || p.initials;
  const byFirst = count(unique.filter((p) => byInitials.get(p.initials)! > 1).map(first));
  return new Map(
    unique.map((p) => [
      p.uid,
      byInitials.get(p.initials)! === 1 ? p.initials : byFirst.get(first(p))! === 1 ? first(p) : p.name.trim() || p.initials,
    ])
  );
}

/** The printed log's labels for the adults who supervised these drives, and a key of who's who. */
export function logInitials(
  drives: { supervisorUid: string; supervisorName: string; supervisorInitials: string }[]
): { label: (uid: string) => string; key: { label: string; name: string }[]; clash: boolean } {
  const people = drives.map((d) => ({ uid: d.supervisorUid, name: d.supervisorName, initials: d.supervisorInitials }));
  const labels = distinctLabels(people);
  const names = new Map(people.map((p) => [p.uid, p.name]));
  return {
    label: (uid) => labels.get(uid) ?? "",
    key: [...labels].map(([uid, label]) => ({ label, name: names.get(uid)! })),
    clash: [...labels].some(([uid, label]) => people.find((p) => p.uid === uid)!.initials !== label),
  };
}
