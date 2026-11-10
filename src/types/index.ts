/** A supervising adult (or the learner) who belongs to the family log. */
export interface Member {
  name: string;
  initials: string;
  role: "supervisor" | "learner";
}

/**
 * One family = one learner's log. Everyone in `memberUids` can read and write it.
 * Doc: families/{familyId}
 */
export interface Family {
  id: string;
  learnerName: string;
  /** YYYY-MM-DD — printed on form 21-1600 */
  learnerDob: string;
  /** YYYY-MM-DD the learner license was issued; the 6-month hold counts from here */
  permitDate: string;
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
  createdBy: string;
  updatedAt: number;
}

export type DriveInput = Omit<Drive, "id">;
