"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export type Platform = "ios" | "android" | "other";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const standaloneQuery = "(display-mode: standalone)";

function subscribeStandalone(cb: () => void) {
  const mq = window.matchMedia(standaloneQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function isStandalone(): boolean {
  // iOS Safari reports home-screen launches through navigator.standalone instead
  return window.matchMedia(standaloneQuery).matches || (navigator as { standalone?: boolean }).standalone === true;
}

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  // iPadOS reports as a Mac; touch support gives it away
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

const noop = () => () => {};

/** Whether this is the installed app, which phone it is, and a one-tap install where the browser offers it. */
export function useInstall() {
  // null on the server render; the real value right after hydration
  const installed = useSyncExternalStore<boolean | null>(subscribeStandalone, isStandalone, () => null);
  const platform = useSyncExternalStore<Platform | null>(noop, detectPlatform, () => null);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setPromptEvent(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = promptEvent
    ? async () => {
        await promptEvent.prompt();
        await promptEvent.userChoice;
        setPromptEvent(null);
      }
    : null;

  return { installed, platform, install };
}
