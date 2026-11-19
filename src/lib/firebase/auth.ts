import {
  deleteUser,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  getRedirectResult,
  signInWithEmailLink,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { clearIndexedDbPersistence, terminate } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "./config";

export async function signInWithGoogle() {
  // Same-tab redirect. A popup comes back through drivetron.app and this browser
  // drops the link to the login page, so the sign-in sits on a blank handler.
  return signInWithRedirect(getFirebaseAuth(), new GoogleAuthProvider());
}

/** Finishes a Google redirect that landed back on this page. */
export function completeRedirectSignIn() {
  return getRedirectResult(getFirebaseAuth());
}

export async function signOut() {
  return firebaseSignOut(getFirebaseAuth());
}

/**
 * Passwordless sign-in for families without a Google account: Firebase emails a one-time link that
 * comes back to `continueUrl` (/login, which finishes the sign-in). The address is remembered on this
 * device so the link opened here needn't ask for it again.
 */
const EMAIL_KEY = "drivetron.emailForSignIn";

export async function sendEmailSignInLink(email: string, continueUrl: string) {
  await sendSignInLinkToEmail(getFirebaseAuth(), email, { url: continueUrl, handleCodeInApp: true });
  try {
    localStorage.setItem(EMAIL_KEY, email);
  } catch {
    // Opened on this device, the link will just ask for the address again
  }
}

export function isEmailSignInLink(href: string): boolean {
  return isSignInWithEmailLink(getFirebaseAuth(), href);
}

/** The address the link was sent to from this device, if any */
export function rememberedSignInEmail(): string | null {
  try {
    return localStorage.getItem(EMAIL_KEY);
  } catch {
    return null;
  }
}

export async function finishEmailSignIn(email: string, href: string) {
  const cred = await signInWithEmailLink(getFirebaseAuth(), email, href);
  try {
    localStorage.removeItem(EMAIL_KEY);
  } catch {
    // nothing to clear
  }
  return cred;
}

/**
 * Firebase only deletes an account that signed in recently (about five minutes), so the deletion page
 * asks for a fresh sign-in first instead of failing halfway through.
 */
const RECENT_MS = 4 * 60 * 1000;
export function signedInRecently(user: User, now: number): boolean {
  const at = Date.parse(user.metadata.lastSignInTime ?? "");
  return Number.isFinite(at) && now - at < RECENT_MS;
}

/** Deletes the signed-in Firebase Auth account, then this device's cached copy of the log and settings. */
export async function deleteMyAccount() {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("Not signed in");
  await deleteUser(user);
  try {
    const db = getFirebaseDb();
    await terminate(db);
    await clearIndexedDbPersistence(db);
  } catch {
    // Another tab still has the cache open; it holds nothing the deleted account can read
  }
  try {
    for (const key of Object.keys(localStorage)) if (key.startsWith("drivetron.")) localStorage.removeItem(key);
    sessionStorage.clear();
  } catch {
    // Storage blocked: nothing to clear
  }
}
