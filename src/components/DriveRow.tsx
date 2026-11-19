import Link from "next/link";
import type { Drive } from "@/types";
import { countedPerDrive, formatMinutes } from "@/utils/progress";
import { countLimitText } from "@/states";
import { logInitials } from "@/utils/members";
import { needsConfirming } from "@/utils/signoff";
import { useFamily } from "@/components/FamilyProvider";

export function DriveRow({ drive }: { drive: Drive }) {
  const start = new Date(drive.startedAt);
  const tags = [...drive.conditions, ...drive.skills];
  // With one car, naming it on every row is noise
  const { vehicles, drives, rules, pendingIds } = useFamily();
  // Over Texas's 2 hours a day (or a weekly limit), say what counted so the total adds up
  // The same initials the printed log uses, so two parents named Montana read apart
  // (The React compiler memoizes these per render inputs.)
  const initials = logInitials(drives.filter((d) => d.endedAt !== null)).label(drive.supervisorUid) || drive.supervisorInitials;
  const counted = countedPerDrive(drives, rules.countLimit).get(drive.id);
  const showVehicle = !!drive.vehicleName && vehicles.length > 1;
  return (
    <li>
      <Link
        href={`/drives/edit?id=${drive.id}`}
        className="flex items-center justify-between gap-3 py-3"
      >
        <div className="min-w-0">
          <p className="font-medium">
            {start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              {start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {initials}
              {showVehicle && <span className="whitespace-nowrap"> · {drive.vehicleName}</span>}
            </span>
          </p>
          {tags.length > 0 && <p className="truncate text-sm text-gray-500 dark:text-gray-400">{tags.join(", ")}</p>}
          {pendingIds.has(drive.id) && <p className="text-xs font-medium text-sky-700 dark:text-sky-400">On this phone only, syncing…</p>}
          {needsConfirming(drive) && <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Not confirmed yet</p>}
        </div>
        <div className="shrink-0 text-right tabular-nums">
          <p className="font-semibold">{formatMinutes(drive.dayMinutes + drive.nightMinutes)}</p>
          {drive.nightMinutes > 0 && <p className="text-xs text-indigo-600 dark:text-indigo-400">🌙 {formatMinutes(drive.nightMinutes)}</p>}
          {counted !== undefined && (
            <p className="text-xs text-amber-700 dark:text-amber-400" title={`Only ${countLimitText(rules)} counts`}>
              {formatMinutes(counted)} counts
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}
