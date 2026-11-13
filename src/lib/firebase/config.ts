import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
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

/**
 * App Check proves requests come from this site, not a script using the public API key. Off
 * until the reCAPTCHA Enterprise site key is set (repo variable NEXT_PUBLIC_RECAPTCHA_SITE_KEY).
 * Only turn on enforcement in the console once this build has reached the installed apps, or
 * older copies (which send no token) are locked out.
 */
const appCheckSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;

// Lazily initialized: calling getAuth() at module load breaks the static export prerender.
function getFirebaseApp() {
  if (!_app) {
    const fresh = getApps().length === 0;
    _app = fresh ? initializeApp(firebaseConfig) : getApp();
    if (fresh && appCheckSiteKey && !useEmulators && typeof window !== "undefined") {
      initializeAppCheck(_app, { provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey), isTokenAutoRefreshEnabled: true });
    }
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
        const w = window as unknown as Record<string, unknown>;
        w.__devSignIn = async (email: string, name: string) => {
          if (auth.currentUser) await auth.signOut();
          return signInWithCredential(
            auth,
            GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, name, email_verified: true }))
          );
        };
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
