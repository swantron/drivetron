"use client";

import { QA_FAMILIES } from "@/lib/qa";
import { getFirebaseAuth } from "@/lib/firebase/config";

/**
 * One-tap sign-in as a seeded QA person (`npm run seed:qa`), using the emulator's `__devSignIn`.
 * The login page loads it only in emulator builds.
 */
export function QaSignIn() {
  const signIn = async (email: string, name: string) => {
    getFirebaseAuth(); // installs __devSignIn
    const w = window as unknown as { __devSignIn?: (e: string, n: string) => Promise<unknown> };
    await w.__devSignIn?.(email, name);
  };
  return (
    <details className="w-full rounded-xl border border-dashed border-amber-500 p-3 text-left text-sm" open>
      <summary className="cursor-pointer font-semibold">QA sign-in (emulators)</summary>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Seed with npm run seed:qa first.</p>
      <ul className="mt-2 space-y-3">
        {QA_FAMILIES.map((f) => (
          <li key={f.id}>
            <p className="font-medium">
              {f.state} · {f.id}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{f.checks}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {f.people.map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => signIn(p.email, p.name)}
                  className="rounded-full border border-gray-300 px-2.5 py-1 text-xs dark:border-gray-700"
                >
                  {p.name.split(" ")[0]} ({p.role === "learner" ? "teen" : "parent"})
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}
