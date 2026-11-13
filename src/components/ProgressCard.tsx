"use client";

import { useFamily } from "@/components/FamilyProvider";
import { computeProgress, formatDate, formatMinutes } from "@/utils/progress";
import { card, muted } from "@/components/ui/styles";
import { holdText } from "@/states";

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ProgressCard() {
  const { learner, drives, rules } = useFamily();
  if (!learner) return null;
  const now = new Date();
  const p = computeProgress(drives, learner.permitDate, now, rules);
  const REQUIRED_TOTAL_MINUTES = rules.totalMinutes;
  const REQUIRED_NIGHT_MINUTES = rules.nightMinutes;
  const holdPassed = now >= p.holdDate;
  const daysToHold = Math.ceil((p.holdDate.getTime() - now.getTime()) / 86400000);

  // The day they can test is whichever comes last: the hours or the hold period.
  const readyDate =
    p.projectedHoursDate && (p.projectedHoursDate > p.holdDate ? p.projectedHoursDate : p.holdDate);
  const behindExpiry = readyDate && readyDate > p.expiryDate;
  const totalToGo = Math.max(0, REQUIRED_TOTAL_MINUTES - p.totalMinutes);
  const nightToGo = Math.max(0, REQUIRED_NIGHT_MINUTES - p.nightMinutes);

  return (
    <section className={`${card} space-y-4`}>
      {p.eligible ? (
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          <p className="font-semibold">Ready for the restricted license 🎉</p>
          <p className="text-sm">
            Print the log, then sign{" "}
            <a className="underline" href={rules.certification.url} target="_blank" rel="noreferrer">
              {rules.certification.label}
            </a>{" "}
            and bring both to the exam station.
          </p>
        </div>
      ) : null}

      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="font-semibold">Total</span>
          <span className="tabular-nums">
            {formatMinutes(p.totalMinutes)} <span className={muted}>/ {formatMinutes(rules.totalMinutes)}</span>
          </span>
        </div>
        <Bar value={p.totalMinutes} max={REQUIRED_TOTAL_MINUTES} color="bg-emerald-700 dark:bg-emerald-600" />
      </div>

      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="font-semibold">Night</span>
          <span className="tabular-nums">
            {formatMinutes(p.nightMinutes)} <span className={muted}>/ {formatMinutes(rules.nightMinutes)}</span>
          </span>
        </div>
        <Bar value={p.nightMinutes} max={REQUIRED_NIGHT_MINUTES} color="bg-indigo-500" />
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className={muted}>Still to drive</dt>
          <dd className="font-medium">
            {p.hoursDone ? "Done ✓" : formatMinutes(totalToGo)}
            {!p.hoursDone && nightToGo > 0 && <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">incl. {formatMinutes(nightToGo)} at night</span>}
          </dd>
        </div>
        <div>
          <dt className={muted}>Pace</dt>
          <dd className="font-medium">{p.driveCount < 2 ? "—" : `${formatMinutes(p.minutesPerWeek)} / week`}</dd>
        </div>
        <div>
          {/* The hold period: the earliest the next license can be applied for */}
          <dt className={muted}>Earliest test date</dt>
          <dd className="font-medium">
            {holdPassed ? "Reached ✓" : formatDate(p.holdDate)}
            {!holdPassed && <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">Hold of {holdText(rules)} · {daysToHold} days</span>}
          </dd>
        </div>
        <div>
          <dt className={`${muted} first-letter:uppercase`}>{rules.permitName} expires</dt>
          <dd className="font-medium">{formatDate(p.expiryDate)}</dd>
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
