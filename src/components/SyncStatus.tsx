"use client";

import { useEffect, useState } from "react";
import { useFamily } from "@/components/FamilyProvider";

/**
 * Drives save on the phone first and reach the server (and the other phones) when there's signal.
 * Says so while any are waiting, so a parent doesn't wonder why the teen's drive isn't on theirs.
 * Shows nothing when everything has synced.
 */
export function SyncStatus() {
  const { pendingIds } = useFamily();
  const online = useOnline();
  const n = pendingIds.size;
  if (n === 0 && online) return null;
  return (
    <p role="status" className="mb-3 flex items-start gap-2 rounded-xl bg-sky-50 p-3 text-sm text-sky-950 dark:bg-sky-950 dark:text-sky-100 print:hidden">
      <span aria-hidden>{online ? "⏳" : "📵"}</span>
      <span>
        {n === 0
          ? "Offline. You can keep logging; drives sync when there's signal."
          : `${n === 1 ? "1 drive is" : `${n} drives are`} saved on this phone ${
              online ? "and still syncing" : "but not synced yet (no signal)"
            }. The other phones see ${n === 1 ? "it" : "them"} once ${n === 1 ? "it reaches" : "they reach"} the server.`}
      </span>
    </p>
  );
}

function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}
