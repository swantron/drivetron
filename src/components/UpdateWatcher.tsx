"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { nowMs } from "@/utils/time";

/**
 * Pages where an automatic reload would throw away what someone is doing: the drive form and
 * setup, and sign-in, where the page sits hidden behind the Google popup until it returns.
 */
const BUSY_PATHS = ["/drives/edit", "/setup", "/login"];

/** This build's id; version.json on the live site names the newest one. */
const BUILD = process.env.NEXT_PUBLIC_BUILD_ID;
/** How long a newer build can be live with no update arriving before we call this copy stuck. */
const STUCK_MS = 5 * 60 * 1000;
const STUCK_KEY = "drivetron:newer-build-seen";
/** The live build we last repaired toward: once per build, so a repair that didn't help can't loop. */
const REPAIRED_KEY = "drivetron:repaired-for-build";

/**
 * Is a newer build live that this copy hasn't picked up, for long enough that it never will? A
 * service worker whose install fails (one bad precache URL did that in Nov 2026) keeps serving the
 * old build forever, and nothing in the app would show it. Remembered across launches, since an
 * installed app may only be opened once a day.
 */
async function stuckOnOldBuild(reg: ServiceWorkerRegistration | undefined): Promise<boolean> {
  if (!BUILD || !reg) return false;
  // A unique URL each time, so no cache (an old worker's runtime cache included) can answer it
  const res = await fetch(`/version.json?t=${nowMs()}`, { cache: "no-store" });
  if (!res.ok) return false;
  const { build } = (await res.json()) as { build?: string };
  const forget = () => {
    try {
      localStorage.removeItem(STUCK_KEY);
    } catch {}
  };
  if (!build || build === BUILD) {
    forget();
    return false;
  }
  // An update is on its way; the normal path will reload
  if (reg.installing || reg.waiting) return false;
  try {
    if (localStorage.getItem(REPAIRED_KEY) === build) return false;
  } catch {}
  let seen: { build: string; at: number } | null = null;
  try {
    seen = JSON.parse(localStorage.getItem(STUCK_KEY) ?? "null");
  } catch {}
  if (seen?.build !== build) {
    try {
      localStorage.setItem(STUCK_KEY, JSON.stringify({ build, at: nowMs() }));
    } catch {}
    return false;
  }
  return nowMs() - seen.at >= STUCK_MS;
}

/** Not a good moment to reload: on a busy page, typing, or with unsaved edits marked `data-unsaved`. */
function busy(): boolean {
  if (BUSY_PATHS.some((p) => window.location.pathname.startsWith(p))) return true;
  const el = document.activeElement;
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true;
  return document.querySelector("[data-unsaved]") !== null;
}

/**
 * Gets phones onto a new build quickly. An installed app resumed from the background doesn't
 * navigate, so the browser never checks for a new service worker on its own; and until the page
 * reloads it keeps running the old code even after the new worker takes over. Security rules
 * may assume the latest build, so a stale copy can have its writes refused.
 */
export function UpdateWatcher() {
  const pathname = usePathname();
  // Set when a new version took over at a bad moment; the reload waits for a better one.
  const pending = useRef(false);
  const reloading = useRef(false);

  // Leaving a busy page (e.g. sign-in finishing, or a saved drive) is a fine moment.
  useEffect(() => {
    if (pending.current && !reloading.current && !busy()) {
      reloading.current = true;
      window.location.reload();
    }
  }, [pathname]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const reload = () => {
      if (reloading.current) return;
      reloading.current = true;
      window.location.reload();
    };

    const onControllerChange = () => {
      // A new version just took over. Reload now unless it would interrupt something; then wait
      // for the app to be backgrounded or for a move to another page.
      if (busy()) pending.current = true;
      else reload();
    };

    // A worker left waiting (e.g. installed by a build whose old worker was still busy) is told to
    // take over; Serwist listens for this message.
    const nudge = (reg?: ServiceWorkerRegistration) => reg?.waiting?.postMessage({ type: "SKIP_WAITING" });
    navigator.serviceWorker.getRegistration().then(nudge).catch(() => {});

    // Last resort when updates never arrive: drop the stuck worker and load the live site. The
    // reload has no worker in control, so it comes from the network; a new worker then registers.
    const checkStuck = async () => {
      if (reloading.current || document.visibilityState !== "visible") return;
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!(await stuckOnOldBuild(reg)) || busy() || reloading.current) return;
        reloading.current = true;
        try {
          localStorage.setItem(REPAIRED_KEY, JSON.parse(localStorage.getItem(STUCK_KEY) ?? "{}").build ?? "");
          localStorage.removeItem(STUCK_KEY);
        } catch {}
        await reg!.unregister();
        // The old worker can still answer this one reload; with its caches gone it has to go to
        // the network. Only page shells and static assets live there (Firestore keeps its own
        // offline data in IndexedDB), and the next worker caches them again.
        await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
        window.location.reload();
      } catch {
        // Offline, or no version.json yet: try again later
      }
    };
    const stuckTimer = window.setInterval(checkStuck, 60 * 1000);
    checkStuck();

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        // Hidden isn't always idle: the sign-in popup hides the page it returns to.
        if (pending.current && !busy()) reload();
        return;
      }
      navigator.serviceWorker
        .getRegistration()
        .then(async (reg) => {
          nudge(reg);
          await reg?.update();
          nudge(reg);
          await checkStuck();
        })
        .catch(() => {});
    };

    // Only an update replacing an existing controller should trigger a reload, not the very
    // first install on a fresh visit.
    const hadController = !!navigator.serviceWorker.controller;
    if (hadController) navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(stuckTimer);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return null;
}
