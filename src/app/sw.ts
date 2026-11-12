import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkOnly, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Never cache Firebase traffic (Firestore has its own offline cache; tokens and family data
// don't belong in Cache Storage) or Firebase Hosting's reserved /__/ paths, which carry the
// OAuth sign-in handler and its callback URLs.
const firebaseHostnames = [
  "firestore.googleapis.com",
  "identitytoolkit.googleapis.com",
  "securetoken.googleapis.com",
  "www.googleapis.com",
  "apis.google.com",
  "accounts.google.com",
];
const neverCache = ({ url }: { url: URL }) =>
  firebaseHostnames.includes(url.hostname) ||
  url.hostname.endsWith(".firebaseio.com") ||
  url.hostname.endsWith(".firebaseapp.com") ||
  (url.origin === self.location.origin && url.pathname.startsWith("/__/"));

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    // Query strings carry ids (/fleet?van=…, /vehicles/detail?id=…), not
    // different pages, so /fleet?van=x is served the precached /fleet.
    ignoreURLParametersMatching: [/.*/],
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  // First match wins, so this has to come before the defaults (which cache cross-origin GETs).
  runtimeCaching: [{ matcher: neverCache, handler: new NetworkOnly() }, ...defaultCache],
});

serwist.addEventListeners();

// Builds before 0.3 cached Firestore responses and sign-in URLs in these runtime caches. Drop them
// whenever a new worker activates; they only ever hold re-fetchable responses, and with the
// NetworkOnly rule above nothing sensitive goes back in.
self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all(["cross-origin", "others"].map((name) => caches.delete(name))));
});
