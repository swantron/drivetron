"use client";

import { useEffect } from "react";

/**
 * Catches ChunkLoadError (e.g. after deploy when cached chunks are stale)
 * and triggers a full page reload to recover.
 */
export function ChunkLoadErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const err = event.error;
      if (err?.name === "ChunkLoadError" || err?.message?.includes("Loading chunk") || err?.message?.includes("Loading CSS chunk")) {
        event.preventDefault();
        window.location.reload();
        return true;
      }
      return false;
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const err = event.reason;
      if (err?.name === "ChunkLoadError" || err?.message?.includes("Loading chunk") || err?.message?.includes("Loading CSS chunk")) {
        event.preventDefault();
        window.location.reload();
        return true;
      }
      return false;
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
