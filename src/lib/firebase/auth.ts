import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebaseAuth } from "./config";

export async function signInWithGoogle() {
  return signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
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
