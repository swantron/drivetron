import Link from "next/link";
import type { Drive } from "@/types";
import { formatMinutes } from "@/utils/progress";

export function DriveRow({ drive }: { drive: Drive }) {
  const start = new Date(drive.startedAt);
  const tags = [...drive.conditions, ...drive.skills];
  return (
    <li>
      <Link
        href={`/drives/edit?id=${drive.id}`}
        className="flex items-center justify-between gap-3 py-3"
      >
        <div className="min-w-0">
          <p className="font-medium">
            {start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            <span className="ml-2 text-sm font-normal text-gray-500">
              {start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {drive.supervisorInitials}
            </span>
          </p>
          {tags.length > 0 && <p className="truncate text-sm text-gray-500">{tags.join(", ")}</p>}
        </div>
        <div className="shrink-0 text-right tabular-nums">
          <p className="font-semibold">{formatMinutes(drive.dayMinutes + drive.nightMinutes)}</p>
          {drive.nightMinutes > 0 && <p className="text-xs text-indigo-600 dark:text-indigo-400">🌙 {formatMinutes(drive.nightMinutes)}</p>}
        </div>
      </Link>
    </li>
  );
}
