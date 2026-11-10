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
