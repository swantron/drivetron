"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DriveTimer } from "@/components/DriveTimer";
import { ProgressCard } from "@/components/ProgressCard";
import { DriveRow } from "@/components/DriveRow";
import { useFamily } from "@/components/FamilyProvider";
import { card } from "@/components/ui/styles";
import { firstName } from "@/utils/learners";

export default function HomePage() {
  return (
    <AppShell>
      <Home />
    </AppShell>
  );
}

function Home() {
  const { learner, drives } = useFamily();
  const recent = drives.filter((d) => d.endedAt !== null).slice(0, 3);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{learner ? `${firstName(learner.name)}’s driving log` : "Driving log"}</h1>
      <DriveTimer />
      <ProgressCard />
      {recent.length > 0 && (
        <section className={card}>
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">Recent drives</h2>
            <Link href="/drives" className="text-sm text-emerald-600">
              All
            </Link>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {recent.map((d) => (
              <DriveRow key={d.id} drive={d} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
