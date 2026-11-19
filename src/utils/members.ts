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
 * Initials a clerk can tell apart on the printed log. Drives keep the initials they were saved with;
 * when two supervising adults share them (Molly and Mark Montana, both "MM"), each gets the first two
 * letters of their first name instead ("MoM", "MaM"), or their first name if even those match.
 * Returns the label for each supervisor and a key of who's who, in first-seen order.
 */
export function logInitials(
  drives: { supervisorUid: string; supervisorName: string; supervisorInitials: string }[]
): { label: (uid: string) => string; key: { label: string; name: string }[]; clash: boolean } {
  const people = new Map<string, { name: string; initials: string }>();
  for (const d of drives) if (!people.has(d.supervisorUid)) people.set(d.supervisorUid, { name: d.supervisorName, initials: d.supervisorInitials });
  const count = (xs: string[]) => xs.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map<string, number>());
  const byInitials = count([...people.values()].map((p) => p.initials));
  const longer = (name: string, initials: string) => {
    const [first = "", ...rest] = name.trim().split(/\s+/);
    return first.slice(0, 2) + rest.map((w) => w[0]?.toUpperCase() ?? "").join("") || initials;
  };
  const labels = new Map<string, string>();
  for (const [uid, p] of people) labels.set(uid, byInitials.get(p.initials)! > 1 ? longer(p.name, p.initials) : p.initials);
  // Still the same (Molly and Mona Montana): fall back to first names
  const byLabel = count([...labels.values()]);
  for (const [uid, p] of people) if (byLabel.get(labels.get(uid)!)! > 1) labels.set(uid, p.name.trim().split(/\s+/)[0] || p.initials);
  return {
    label: (uid) => labels.get(uid) ?? "",
    key: [...people].map(([uid, p]) => ({ label: labels.get(uid)!, name: p.name })),
    clash: [...byInitials.values()].some((n) => n > 1),
  };
}
