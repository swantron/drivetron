"use client";

import { useSyncExternalStore } from "react";

/**
 * The Google Play app is a Trusted Web Activity: this same site, opened by an Android wrapper
 * (package `app.drivetron`, see android/). Play's payments policy doesn't allow selling the unlock
 * through Stripe inside it, or pointing people to buy it elsewhere, so the Play app hides the price
 * and the checkout. A parent can still unlock from the website or an iPhone, and it applies everywhere.
 *
 * The wrapper launches /home?source=play (android/twa-manifest.json) and Chrome passes a referrer of
 * android-app://app.drivetron on that launch. Either marks the session. sessionStorage, not
 * localStorage: a TWA shares storage with Chrome on the phone, and a session flag keeps the same
 * person's regular browser tabs showing the normal web app.
 */
export const PLAY_PACKAGE = "app.drivetron";
const KEY = "drivetron.playApp";

function detect(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(KEY) === "1") return true;
    const fromPlay =
      new URLSearchParams(window.location.search).get("source") === "play" ||
      document.referrer.startsWith(`android-app://${PLAY_PACKAGE}`);
    if (fromPlay) sessionStorage.setItem(KEY, "1");
    return fromPlay;
  } catch {
    return false;
  }
}

// Read once at load, before client-side navigation drops the launch query string.
const launchedFromPlay = detect();

const noop = () => () => {};

/** True inside the Google Play app. Always false during prerendering. */
export function usePlayApp(): boolean {
  return useSyncExternalStore(
    noop,
    () => launchedFromPlay,
    () => false
  );
}
