import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
  setDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
  type Unsubscribe,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { getFirebaseDb } from "./config";
import type { Drive, DriveInput, Family, Learner, Member, Vehicle } from "@/types";
import { PRIMARY_LEARNER } from "@/utils/learners";

const familiesCol = () => collection(getFirebaseDb(), "families");
const drivesCol = (familyId: string) => collection(getFirebaseDb(), "families", familyId, "drives");

/** No 0/O/1/I/L so it reads cleanly when said aloud or texted. */
export function makeInviteCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function subscribeToMyFamily(
  uid: string,
  onData: (family: Family | null) => void,
  onError: (e: Error) => void
): Unsubscribe {
  const q = query(familiesCol(), where("memberUids", "array-contains", uid), limit(1));
  return onSnapshot(
    q,
    (snap) => {
      const d = snap.docs[0];
      onData(d ? ({ id: d.id, ...d.data() } as Family) : null);
    },
    onError
  );
}

export async function createFamily(
  user: User,
  input: { learner: Learner; me: Member }
): Promise<string> {
  const db = getFirebaseDb();
  const familyRef = doc(familiesCol());
  const inviteCode = makeInviteCode();
  const family: Omit<Family, "id"> = {
    learners: { [PRIMARY_LEARNER]: input.learner },
    ownerUid: user.uid,
    memberUids: [user.uid],
    members: { [user.uid]: input.me },
    inviteCode,
    createdAt: Date.now(),
  };
  const batch = writeBatch(db);
  batch.set(familyRef, family);
  batch.set(doc(db, "invites", inviteCode), { familyId: familyRef.id });
  await batch.commit();
  return familyRef.id;
}

export class InviteNotFoundError extends Error {}

export interface JoinRequest {
  uid: string;
  name: string;
  initials: string;
  role: Member["role"];
  code: string;
  createdAt: number;
}

const PENDING_KEY = "drivetron.pendingFamilyId";

/** The family this device asked to join, so the waiting screen survives a reload. */
export function pendingFamilyId(): string | null {
  try {
    return localStorage.getItem(PENDING_KEY);
  } catch {
    return null;
  }
}

function setPendingFamilyId(id: string | null) {
  try {
    if (id) localStorage.setItem(PENDING_KEY, id);
    else localStorage.removeItem(PENDING_KEY);
  } catch {
    // Private mode: they'd re-enter the code after a reload, which just refreshes the request
  }
}

/**
 * Asks to join the family behind an invite code. The owner approves and confirms the role;
 * until then the requester can see only their own request.
 */
export async function requestToJoin(user: User, code: string, me: Member): Promise<string> {
  const db = getFirebaseDb();
  const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const invite = await getDoc(doc(db, "invites", normalized));
  if (!invite.exists()) throw new InviteNotFoundError("No family uses that code");
  const familyId = invite.data().familyId as string;
  await setDoc(doc(db, "families", familyId, "joinRequests", user.uid), {
    name: me.name,
    initials: me.initials,
    role: me.role,
    code: normalized,
    createdAt: Date.now(),
  });
  setPendingFamilyId(familyId);
  return familyId;
}

/** The requester's view of their own request: null once it's approved, declined or withdrawn. */
export function subscribeToMyJoinRequest(
  familyId: string,
  uid: string,
  onData: (exists: boolean) => void
): Unsubscribe {
  return onSnapshot(
    doc(getFirebaseDb(), "families", familyId, "joinRequests", uid),
    (snap) => {
      if (!snap.exists()) setPendingFamilyId(null);
      onData(snap.exists());
    },
    () => onData(false)
  );
}

export async function withdrawJoinRequest(familyId: string, uid: string) {
  await deleteDoc(doc(getFirebaseDb(), "families", familyId, "joinRequests", uid));
  setPendingFamilyId(null);
}

export function subscribeToJoinRequests(familyId: string, onData: (reqs: JoinRequest[]) => void): Unsubscribe {
  return onSnapshot(
    collection(getFirebaseDb(), "families", familyId, "joinRequests"),
    (snap) => onData(snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as JoinRequest)),
    () => onData([])
  );
}

/** Owner only: adds the requester with the role the owner chose, and clears the request. */
export async function approveJoinRequest(familyId: string, req: JoinRequest, role: Member["role"]) {
  const db = getFirebaseDb();
  const batch = writeBatch(db);
  batch.update(doc(db, "families", familyId), {
    memberUids: arrayUnion(req.uid),
    [`members.${req.uid}`]: { name: req.name, initials: req.initials, role },
    approvedUid: req.uid,
  });
  batch.delete(doc(db, "families", familyId, "joinRequests", req.uid));
  await batch.commit();
}

export async function declineJoinRequest(familyId: string, uid: string) {
  await deleteDoc(doc(getFirebaseDb(), "families", familyId, "joinRequests", uid));
}

/** A non-owner leaving. Drives they logged stay in the family's log. */
export async function leaveFamily(familyId: string, uid: string) {
  await updateDoc(doc(getFirebaseDb(), "families", familyId), {
    memberUids: arrayRemove(uid),
    [`members.${uid}`]: deleteField(),
  });
}

/** Accepts dotted paths ("members.uid", "learners.id") as well as top-level fields. */
export async function updateFamily(familyId: string, patch: Record<string, unknown>) {
  await updateDoc(doc(getFirebaseDb(), "families", familyId), patch);
}

/**
 * Moves a pre-multi-learner family's top-level learner fields into learners["primary"].
 * Idempotent: drives without a learnerId already count as the primary learner's.
 */
export function migrateLegacyLearner(family: Family) {
  if (family.learners && Object.keys(family.learners).length > 0) return;
  if (!family.learnerName) return;
  fireAndForget(
    updateFamily(family.id, {
      [`learners.${PRIMARY_LEARNER}`]: {
        name: family.learnerName,
        dob: family.learnerDob ?? "",
        permitDate: family.permitDate ?? "",
      },
      // The legacy fields stay: an installed copy still on the old version reads them until it updates.
    })
  );
}

export function saveLearner(familyId: string, id: string, learner: Learner, onError?: (e: Error) => void) {
  fireAndForget(updateFamily(familyId, { [`learners.${id}`]: learner }), onError);
}

export function removeLearner(familyId: string, id: string, onError?: (e: Error) => void) {
  fireAndForget(updateFamily(familyId, { [`learners.${id}`]: deleteField() }), onError);
}

export function saveVehicle(familyId: string, id: string, vehicle: Vehicle, onError?: (e: Error) => void) {
  fireAndForget(updateFamily(familyId, { [`vehicles.${id}`]: vehicle }), onError);
}

export function removeVehicle(familyId: string, id: string, onError?: (e: Error) => void) {
  fireAndForget(updateFamily(familyId, { [`vehicles.${id}`]: deleteField() }), onError);
}

/** Owner only: drops a member from the log. Their past drives stay. */
export async function removeMember(family: Family, uid: string) {
  await updateDoc(doc(getFirebaseDb(), "families", family.id), {
    memberUids: arrayRemove(uid),
    [`members.${uid}`]: deleteField(),
  });
}

/** Owner only: invalidates the old code (e.g. after it was shared too widely). */
export async function rotateInviteCode(family: Family): Promise<string> {
  const db = getFirebaseDb();
  const code = makeInviteCode();
  const batch = writeBatch(db);
  batch.set(doc(db, "invites", code), { familyId: family.id });
  batch.update(doc(db, "families", family.id), { inviteCode: code });
  batch.delete(doc(db, "invites", family.inviteCode));
  await batch.commit();
  return code;
}

export function subscribeToDrives(
  familyId: string,
  onData: (drives: Drive[]) => void,
  onError: (e: Error) => void
): Unsubscribe {
  const q = query(drivesCol(familyId), orderBy("startedAt", "desc"));
  return onSnapshot(q, (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Drive)), onError);
}

// Writes don't await the server: with the offline cache they resolve once the server acks,
// which never happens in a dead zone. Fire them and let the snapshot listener reflect the change.
function fireAndForget(p: Promise<unknown>, onError?: (e: Error) => void) {
  p.catch((e) => {
    console.error(e);
    onError?.(e);
  });
}

export function addDrive(familyId: string, drive: DriveInput, onError?: (e: Error) => void): string {
  const ref = doc(drivesCol(familyId));
  fireAndForget(setDoc(ref, drive), onError);
  return ref.id;
}

export function saveDrive(familyId: string, id: string, drive: DriveInput, onError?: (e: Error) => void) {
  fireAndForget(setDoc(doc(drivesCol(familyId), id), drive), onError);
}

export function patchDrive(familyId: string, id: string, patch: Partial<DriveInput>, onError?: (e: Error) => void) {
  fireAndForget(updateDoc(doc(drivesCol(familyId), id), { ...patch, updatedAt: Date.now() }), onError);
}

export function removeDrive(familyId: string, id: string, onError?: (e: Error) => void) {
  fireAndForget(deleteDoc(doc(drivesCol(familyId), id)), onError);
}
