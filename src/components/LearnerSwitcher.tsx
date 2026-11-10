"use client";

import { useFamily } from "@/components/FamilyProvider";
import { driveLearnerId, firstName } from "@/utils/learners";

/** Shown only when the family has more than one learner. */
export function LearnerSwitcher() {
  const { learners, learner, setLearnerId, allDrives } = useFamily();
  if (learners.length < 2) return null;
  // A timer running for someone else shouldn't be invisible just because another learner is selected.
  const driving = new Set(allDrives.filter((d) => d.endedAt === null).map(driveLearnerId));
  return (
    <div role="tablist" aria-label="Learner" className="flex gap-2 overflow-x-auto pb-1 print:hidden">
      {learners.map((l) => {
        const on = l.id === learner?.id;
        return (
          <button
            key={l.id}
            role="tab"
            aria-selected={on}
            onClick={() => setLearnerId(l.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${
              on
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {firstName(l.name)}
            {driving.has(l.id) && (
              <span className="ml-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-red-500 align-middle" aria-label="driving now" />
            )}
          </button>
        );
      })}
    </div>
  );
}
