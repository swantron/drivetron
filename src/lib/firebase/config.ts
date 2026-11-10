import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, GoogleAuthProvider, signInWithCredential, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Local testing against `firebase emulators:start --project demo-drivetron`:
 * run the dev server with NEXT_PUBLIC_FIREBASE_EMULATORS=1 and
 * NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-drivetron. Ports match firebase.json.
 */
const useEmulators = process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === "1";

let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;

// Lazily initialized: calling getAuth() at module load breaks the static export prerender.
function getFirebaseApp() {
  if (!_app) {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return _app;
}

export function getFirebaseAuth() {
  if (!_auth) {
    _auth = getAuth(getFirebaseApp());
    if (useEmulators) {
      connectAuthEmulator(_auth, "http://127.0.0.1:9099", { disableWarnings: true });
      // Emulator only: sign in as a fake Google user from the console or a browser test,
      // since the real popup flow can't be scripted. e.g. __devSignIn("parent@test.dev", "Pat Parent")
      if (typeof window !== "undefined") {
        const auth = _auth;
        (window as unknown as Record<string, unknown>).__devSignIn = (email: string, name: string) =>
          signInWithCredential(
            auth,
            GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, name, email_verified: true }))
          );
      }
    }
  }
  return _auth;
}

export function getFirebaseDb() {
  if (!_db) {
    const app = getFirebaseApp();
    // Offline cache: drives logged in a dead zone save locally and sync when signal returns.
    _db =
      typeof window !== "undefined" && !useEmulators
        ? initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })
        : getFirestore(app);
    if (useEmulators) connectFirestoreEmulator(_db, "127.0.0.1", 8080);
  }
  return _db;
}
