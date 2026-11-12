"use client";

import { useEffect } from "react";

/** Pages where an automatic reload would throw away what someone is typing. */
const FORM_PATHS = ["/drives/edit", "/setup"];

/**
 * Gets phones onto a new build quickly. An installed app resumed from the background doesn't
 * navigate, so the browser never checks for a new service worker on its own; and until the page
 * reloads it keeps running the old code even after the new worker takes over. Security rules
 * may assume the latest build, so a stale copy can have its writes refused.
 */
export function UpdateWatcher() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let reloading = false;
    let pending = false;

    const reload = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };
    const onFormPage = () => FORM_PATHS.some((p) => window.location.pathname.startsWith(p));

    const onControllerChange = () => {
      // A new version just took over. Reload now unless they're mid-form; then do it the next
      // time the app is backgrounded, which is when a reload goes unnoticed.
      if (document.visibilityState === "hidden" || !onFormPage()) reload();
      else pending = true;
    };

    // A worker left waiting (e.g. installed by a build whose old worker was still busy) is told to
    // take over; Serwist listens for this message.
    const nudge = (reg?: ServiceWorkerRegistration) => reg?.waiting?.postMessage({ type: "SKIP_WAITING" });
    navigator.serviceWorker.getRegistration().then(nudge).catch(() => {});

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (pending) reload();
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
