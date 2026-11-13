"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Pages where an automatic reload would throw away what someone is doing: the drive form and
 * setup, and sign-in, where the page sits hidden behind the Google popup until it returns.
 */
const BUSY_PATHS = ["/drives/edit", "/setup", "/login"];

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
        })
        .catch(() => {});
    };

    // Only an update replacing an existing controller should trigger a reload, not the very
    // first install on a fresh visit.
    const hadController = !!navigator.serviceWorker.controller;
    if (hadController) navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return null;
}
