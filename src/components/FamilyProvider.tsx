"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { subscribeToDrives, subscribeToMyFamily } from "@/lib/firebase/firestore";
import type { Drive, Family } from "@/types";

interface FamilyContextValue {
  /** false until we know whether this user belongs to a family */
  loaded: boolean;
  family: Family | null;
  drives: Drive[];
  drivesLoaded: boolean;
  /** The in-progress drive, if a timer is running on any device */
  activeDrive: Drive | null;
  error: string | null;
}

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  // Each piece of state remembers which key it was loaded for, so switching accounts
  // never briefly shows the previous user's data.
  const [famState, setFamState] = useState<{ uid: string; family: Family | null; error: string | null } | null>(null);
  const [driveState, setDriveState] = useState<{ familyId: string; drives: Drive[] } | null>(null);

  useEffect(() => {
    if (!uid) return;
    return subscribeToMyFamily(
      uid,
      (family) => setFamState({ uid, family, error: null }),
      (e) => setFamState({ uid, family: null, error: e.message })
    );
  }, [uid]);

  const fam = famState && famState.uid === uid ? famState : null;
  const familyId = fam?.family?.id ?? null;

  // A listener that errors is dead for good. That happens right after creating or joining a family:
  // the family snapshot arrives from the local cache before the server has it, so the drives rules
  // can't see the membership yet. Resubscribe after a pause instead of silently showing nothing.
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!familyId) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsub = subscribeToDrives(
      familyId,
      (drives) => setDriveState({ familyId, drives }),
      (e) => {
        console.warn("drives subscription failed, retrying", e.message);
        timer = setTimeout(() => setRetry((n) => n + 1), 2000);
      }
    );
    return () => {
      unsub();
      if (timer) clearTimeout(timer);
    };
  }, [familyId, retry]);

  const drives = driveState && driveState.familyId === familyId ? driveState.drives : [];

  const value: FamilyContextValue = {
    loaded: fam !== null,
    family: fam?.family ?? null,
    drives,
    drivesLoaded: driveState !== null && driveState.familyId === familyId,
    activeDrive: drives.find((d) => d.endedAt === null) ?? null,
    error: fam?.error ?? null,
  };

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error("useFamily must be used within FamilyProvider");
  return ctx;
}
