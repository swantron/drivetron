"use client";

import { useFamily } from "@/components/FamilyProvider";
import { computeProgress, formatDate, formatMinutes } from "@/utils/progress";
import { REQUIRED_NIGHT_MINUTES, REQUIRED_TOTAL_MINUTES, FORM_21_1600_URL } from "@/utils/montana";
import { card, muted } from "@/components/ui/styles";

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ProgressCard() {
  const { family, drives } = useFamily();
  if (!family) return null;
  const now = new Date();
  const p = computeProgress(drives, family.permitDate, now);
  const holdPassed = now >= p.holdDate;
  const daysToHold = Math.ceil((p.holdDate.getTime() - now.getTime()) / 86400000);

  // The day they can test is whichever comes last: the hours or the 6-month hold.
  const readyDate =
    p.projectedHoursDate && (p.projectedHoursDate > p.holdDate ? p.projectedHoursDate : p.holdDate);
  const behindExpiry = readyDate && readyDate > p.expiryDate;

  return (
    <section className={`${card} space-y-4`}>
      {p.eligible ? (
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          <p className="font-semibold">Ready for the restricted license 🎉</p>
          <p className="text-sm">
            Print the log, then sign{" "}
            <a className="underline" href={FORM_21_1600_URL} target="_blank" rel="noreferrer">
              form 21-1600
            </a>{" "}
            and bring both to the exam station.
          </p>
        </div>
      ) : null}

      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="font-semibold">Total</span>
          <span className="tabular-nums">
            {formatMinutes(p.totalMinutes)} <span className={muted}>/ 50h</span>
          </span>
        </div>
        <Bar value={p.totalMinutes} max={REQUIRED_TOTAL_MINUTES} color="bg-emerald-500" />
      </div>

      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="font-semibold">Night</span>
          <span className="tabular-nums">
            {formatMinutes(p.nightMinutes)} <span className={muted}>/ 10h</span>
          </span>
        </div>
        <Bar value={p.nightMinutes} max={REQUIRED_NIGHT_MINUTES} color="bg-indigo-500" />
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className={muted}>6-month hold</dt>
          <dd className="font-medium">{holdPassed ? "Done ✓" : `${daysToHold} days · ${formatDate(p.holdDate)}`}</dd>
        </div>
        <div>
          <dt className={muted}>Pace</dt>
          <dd className="font-medium">{formatMinutes(p.minutesPerWeek)} / week</dd>
        </div>
        <div className="col-span-2">
          <dt className={muted}>Projected test-ready</dt>
          <dd className="font-medium">
            {p.eligible
              ? "Now"
              : readyDate
              ? formatDate(readyDate)
              : p.driveCount < 2
              ? "Log a couple of drives to see a date"
              : "Needs some night driving to project"}
          </dd>
          {behindExpiry && (
            <p className="mt-1 text-amber-700 dark:text-amber-400">
              That&apos;s after the learner license expires ({formatDate(p.expiryDate)}) — pick up the pace.
            </p>
          )}
        </div>
      </dl>
    </section>
  );
}
