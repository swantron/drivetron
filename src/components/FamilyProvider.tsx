"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { migrateLegacyLearner, subscribeToDrives, subscribeToMyFamily } from "@/lib/firebase/firestore";
import { driveLearnerId, learnersOf, vehiclesOf, type LearnerWithId, type VehicleWithId } from "@/utils/learners";
import type { Drive, Family, Member } from "@/types";
import { getState, type StateRules } from "@/states";

interface FamilyContextValue {
  /** false until we know whether this user belongs to a family */
  loaded: boolean;
  family: Family | null;
  learners: LearnerWithId[];
  /** The learner this device is looking at (remembered per device) */
  learner: LearnerWithId | null;
  setLearnerId: (id: string) => void;
  vehicles: VehicleWithId[];
  /** The selected learner's drives, newest first */
  drives: Drive[];
  /** Every learner's drives */
  allDrives: Drive[];
  drivesLoaded: boolean;
  /** The selected learner's in-progress drive, if a timer is running on any device */
  activeDrive: Drive | null;
  error: string | null;
  /** This user's entry in the family */
  me: Member | null;
  /** Supervisors can add past drives, edit any drive, and edit learner details */
  isSupervisor: boolean;
  isOwner: boolean;
  /** The state rules this log follows (Montana for logs created before multi-state support) */
  rules: StateRules;
}

const LEARNER_KEY = "drivetron.learnerId";

function storedLearnerId(): string | null {
  try {
    return localStorage.getItem(LEARNER_KEY);
  } catch {
    return null;
  }
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

  const allDrives = driveState && driveState.familyId === familyId ? driveState.drives : [];
  const family = fam?.family ?? null;

  // Families from before multi-learner support get their learner moved into the learners map.
  const needsMigration =
    !!family && !family.learners && !!family.learnerName && !!uid && family.members[uid]?.role === "supervisor";
  useEffect(() => {
    if (needsMigration && family) migrateLegacyLearner(family);
  }, [needsMigration, family]);

  const [pickedLearnerId, setPickedLearnerId] = useState<string | null>(() =>
    typeof window === "undefined" ? null : storedLearnerId()
  );
  const setLearnerId = (id: string) => {
    setPickedLearnerId(id);
    try {
      localStorage.setItem(LEARNER_KEY, id);
    } catch {
      // Private mode: the pick lasts until the app closes
    }
  };

  const learners = family ? learnersOf(family) : [];
  const learner = learners.find((l) => l.id === pickedLearnerId) ?? learners[0] ?? null;
  const drives = learner ? allDrives.filter((d) => driveLearnerId(d) === learner.id) : [];

  const value: FamilyContextValue = {
    loaded: fam !== null,
    family,
    learners,
    learner,
    setLearnerId,
    vehicles: family ? vehiclesOf(family) : [],
    drives,
    allDrives,
    drivesLoaded: driveState !== null && driveState.familyId === familyId,
    activeDrive: drives.find((d) => d.endedAt === null) ?? null,
    error: fam?.error ?? null,
    me: (uid && family?.members[uid]) || null,
    isSupervisor: !!uid && family?.members[uid]?.role === "supervisor",
    isOwner: !!uid && family?.ownerUid === uid,
    rules: getState(family?.state),
  };

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error("useFamily must be used within FamilyProvider");
  return ctx;
}
