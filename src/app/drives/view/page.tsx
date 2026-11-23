"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useFamily } from "@/components/FamilyProvider";
import { ConfirmationNote } from "@/components/ConfirmDrives";
import { countLimitText } from "@/states";
import { countedPerDrive, formatMinutes } from "@/utils/progress";
import { driveLearnerId } from "@/utils/learners";
import { supervisorLabel } from "@/utils/instructors";
import { card, muted, primaryBtn, secondaryBtn } from "@/components/ui/styles";
import type { Drive } from "@/types";

/**
 * One drive, to look at. History opens here rather than in the edit form, so looking up last
 * Thursday doesn't mean opening the thing you'd change it with. Edit is one tap away.
 */
export default function ViewDrivePage() {
  return (
    <AppShell>
      <Suspense>
        <ViewDrive />
      </Suspense>
    </AppShell>
  );
}

function ViewDrive() {
  const id = useSearchParams().get("id");
  const { family, allDrives, drivesLoaded } = useFamily();
  if (!family) return null;
  if (!drivesLoaded) return <p className="py-10 text-center text-gray-500 dark:text-gray-400">Loading…</p>;
  const drive = id ? allDrives.find((d) => d.id === id) : undefined;
  if (!drive) {
    return (
      <div className="space-y-4 py-10 text-center">
        <p className="text-gray-500 dark:text-gray-400">That drive was deleted.</p>
        <Link href="/drives" className="text-emerald-700 underline dark:text-emerald-400">
          All drives
        </Link>
      </div>
    );
  }
  return <DriveView drive={drive} />;
}

const time = (ms: number) => new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function DriveView({ drive }: { drive: Drive }) {
  const { user } = useAuth();
  const router = useRouter();
  const { learners, drives, rules, isSupervisor, vehicles } = useFamily();
  const start = new Date(drive.startedAt);

  if (drive.endedAt === null) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Drive in progress</h1>
        <p className={muted}>Started {time(drive.startedAt)}. Stop it from the Home tab.</p>
        <Link href="/home" className={`${primaryBtn} block text-center`}>
          Go to Home
        </Link>
      </div>
    );
  }

  // Mirrors the edit form (and firestore.rules): learners edit only their own drives, and only the
  // tags and notes once it's finished
  const ownDrive = drive.createdBy === user?.uid;
  const canEdit = isSupervisor || ownDrive;
  const total = drive.dayMinutes + drive.nightMinutes;
  const counted = countedPerDrive(drives, rules.countLimit).get(drive.id);
  const learnerName = learners.length > 1 ? learners.find((l) => l.id === driveLearnerId(drive))?.name : undefined;
  const vehicleRemoved = !!drive.vehicleId && !vehicles.some((v) => v.id === drive.vehicleId);
  const endsNextDay = new Date(drive.endedAt).toDateString() !== start.toDateString();
  const facts: [string, string][] = [
    ["Supervised by", supervisorLabel(drive)],
    ...(learnerName ? ([["Driver", learnerName]] as [string, string][]) : []),
    ...(drive.vehicleName ? ([["Vehicle", `${drive.vehicleName}${vehicleRemoved ? " (removed)" : ""}`]] as [string, string][]) : []),
    ["Logged", drive.manual ? "Added after the drive" : "Timed live"],
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">
          {start.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </h1>
        <p className={muted}>
          {time(drive.startedAt)}–{time(drive.endedAt)}
          {endsNextDay && " the next day"}
        </p>
      </div>

      <ConfirmationNote drive={drive} />
      {drive.timesEdited && (
        <p className="text-sm text-amber-700 dark:text-amber-400">Times on this drive were edited after it was logged. The printed log marks it.</p>
      )}

      <section className={`${card} space-y-3`}>
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-bold tabular-nums">{formatMinutes(total)}</p>
          <p className={`${muted} tabular-nums`}>
            ☀️ {formatMinutes(drive.dayMinutes)} · 🌙 {formatMinutes(drive.nightMinutes)}
          </p>
        </div>
        {counted !== undefined && (
          <p className="text-sm text-amber-700 dark:text-amber-400">
            {formatMinutes(counted)} of it counts: {rules.name} counts up to {countLimitText(rules)}.
          </p>
        )}
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          {facts.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-gray-500 dark:text-gray-400">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {(drive.conditions.length > 0 || drive.skills.length > 0 || drive.notes) && (
        <section className={`${card} space-y-3 text-sm`}>
          {drive.conditions.length > 0 && (
            <div>
              <h2 className="font-semibold">Conditions</h2>
              <p className="text-gray-700 dark:text-gray-300">{drive.conditions.join(", ")}</p>
            </div>
          )}
          {drive.skills.length > 0 && (
            <div>
              <h2 className="font-semibold">Skills</h2>
              <p className="text-gray-700 dark:text-gray-300">{drive.skills.join(", ")}</p>
            </div>
          )}
          {drive.notes && (
            <div>
              <h2 className="font-semibold">Notes</h2>
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{drive.notes}</p>
            </div>
          )}
        </section>
      )}

      <div className={canEdit ? "grid grid-cols-[1fr_2fr] gap-2" : ""}>
        <button type="button" className={secondaryBtn} onClick={() => router.back()}>
          Back
        </button>
        {canEdit && (
          <Link href={`/drives/edit?id=${drive.id}`} className={`${primaryBtn} block text-center`}>
            {isSupervisor ? "Edit drive" : "Add tags or notes"}
          </Link>
        )}
      </div>
    </div>
  );
}
