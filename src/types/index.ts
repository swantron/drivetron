/** A supervising adult (or the learner) who belongs to the family log. */
export interface Member {
  name: string;
  initials: string;
  role: "supervisor" | "learner";
}

export interface Learner {
  /** Full legal name, as printed on form 21-1600 */
  name: string;
  /** YYYY-MM-DD */
  dob: string;
  /** YYYY-MM-DD the learner license was issued; the 6-month hold counts from here */
  permitDate: string;
}

export interface Vehicle {
  name: string;
}

/**
 * One family log: shared supervisors, one or more learners, and a garage of vehicles. Everyone in `memberUids` can read and write it.
 * Doc: families/{familyId}
 */
export interface Family {
  id: string;
  /** Learners by id. Families created before multi-learner support have none until migrated. */
  learners?: Record<string, Learner>;
  vehicles?: Record<string, Vehicle>;
  /** Legacy single-learner fields, migrated into learners["primary"] on first load */
  learnerName?: string;
  learnerDob?: string;
  permitDate?: string;
  ownerUid: string;
  memberUids: string[];
  members: Record<string, Member>;
  /** Shared with invites/{inviteCode}; someone who knows it can join */
  inviteCode: string;
  /** Last place a drive started — fallback for the night calculation when GPS is unavailable */
  lastLat?: number;
  lastLng?: number;
  createdAt: number;
}

/**
 * Doc: families/{familyId}/drives/{driveId}
 * Times are epoch milliseconds. A drive with `endedAt === null` is in progress
 * (at most one per family), so the timer survives a locked phone and shows on every device.
 */
export interface Drive {
  id: string;
  /** Which learner drove. Missing on drives logged before multi-learner support = "primary". */
  learnerId?: string;
  vehicleId?: string | null;
  vehicleName?: string | null;
  startedAt: number;
  endedAt: number | null;
  dayMinutes: number;
  nightMinutes: number;
  supervisorUid: string;
  supervisorName: string;
  supervisorInitials: string;
  conditions: string[];
  skills: string[];
  notes: string;
  lat: number | null;
  lng: number | null;
  /** true when typed in after the fact rather than timed */
  manual: boolean;
  /** Set (permanently) when a finished drive's times were changed afterward */
  timesEdited?: boolean;
  createdBy: string;
  updatedAt: number;
  /**
   * When the server first received the drive (Firestore Timestamp; null until it syncs, missing on
   * drives logged before this field existed). A timer whose syncedAt is long after its startedAt
   * was started offline, or backdated, and the printed log marks it.
   */
  syncedAt?: { toMillis(): number } | null;
}

/** What the app writes; syncedAt is always set by the server. */
export type DriveInput = Omit<Drive, "id" | "syncedAt">;
