"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DriveRow } from "@/components/DriveRow";
import { useFamily } from "@/components/FamilyProvider";
import { computeProgress, formatMinutes } from "@/utils/progress";
import { CONDITIONS, SKILLS } from "@/utils/practice";
import { card, muted, primaryBtn } from "@/components/ui/styles";

export default function DrivesPage() {
  return (
    <AppShell title="Drives">
      <Drives />
    </AppShell>
  );
}

function Drives() {
  const { learner, drives, drivesLoaded, isSupervisor, rules } = useFamily();
  if (!learner) return null;
  const done = drives.filter((d) => d.endedAt !== null);
  const p = computeProgress(drives, learner.permitDate, new Date(), rules);

  // Variety the OPI fact sheet asks for: show what hasn't been practiced yet.
  const allTags = [...CONDITIONS.weather, ...CONDITIONS.road, ...SKILLS];
  const untried = allTags.filter((t) => !p.conditionCounts[t] && !p.skillCounts[t]);

  return (
    <div className="space-y-4">
      {isSupervisor && (
        <Link href="/drives/edit" className={`${primaryBtn} block text-center`}>
          Add a past drive
        </Link>
      )}

      {done.length > 0 && untried.length > 0 && (
        <section className={card}>
          <h2 className="font-semibold">Not practiced yet</h2>
          <p className={`${muted} mb-2`}>{rules.practiceNote}</p>
          <p className="text-sm">{untried.join(" · ")}</p>
        </section>
      )}

      <section className={card}>
        <p className={muted}>
          {p.driveCount} {p.driveCount === 1 ? "drive" : "drives"} · {formatMinutes(p.totalMinutes)} total · {formatMinutes(p.nightMinutes)} night
        </p>
        {!drivesLoaded ? (
          <p className="py-6 text-center text-gray-500 dark:text-gray-400">Loading…</p>
        ) : done.length === 0 ? (
          <p className="py-6 text-center text-gray-500 dark:text-gray-400">No drives yet. Start one from Home.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {done.map((d) => (
              <DriveRow key={d.id} drive={d} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
