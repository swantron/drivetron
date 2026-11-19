"use client";

import { useFamily } from "@/components/FamilyProvider";
import { computeProgress, formatDate, formatMinutes } from "@/utils/progress";
import { card, muted } from "@/components/ui/styles";
import { countLimitText, holdText } from "@/states";
import { FreeHoursNotice } from "@/components/UnlockCard";
import { BAD_WEATHER } from "@/utils/practice";

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
  const behindExpiry = readyDate && p.expiryDate && readyDate > p.expiryDate;
  const totalToGo = Math.max(0, REQUIRED_TOTAL_MINUTES - p.totalMinutes);
  const nightToGo = Math.max(0, REQUIRED_NIGHT_MINUTES - p.nightMinutes);
  const stillToGo = [
    nightToGo > 0 && `${formatMinutes(nightToGo)} at night`,
    p.weatherRemaining > 0 && `${formatMinutes(p.weatherRemaining)} in bad weather`,
    p.challengingRemaining > 0 && `${formatMinutes(p.challengingRemaining)} at night or in bad weather`,
  ].filter((s): s is string => !!s);

  return (
    <section className={`${card} space-y-4`}>
      {p.eligible ? (
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          <p className="font-semibold">Hours and waiting period done 🎉</p>
          <p className="text-sm">
            Print the log, then sign{" "}
            <a className="underline" href={rules.certification.url} target="_blank" rel="noreferrer">
              {rules.certification.label}
            </a>{" "}
            and bring both when your teen applies for the next license.
          </p>
        </div>
      ) : null}

      <FreeHoursNotice />

      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="font-semibold">Total</span>
          <span className="tabular-nums">
            {formatMinutes(p.totalMinutes)} <span className={muted}>/ {formatMinutes(rules.totalMinutes)}</span>
          </span>
        </div>
        <Bar value={p.totalMinutes} max={REQUIRED_TOTAL_MINUTES} color="bg-emerald-700 dark:bg-emerald-600" />
      </div>

      {/* Massachusetts requires no night hours */}
      {REQUIRED_NIGHT_MINUTES > 0 && (
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="font-semibold">Night</span>
            <span className="tabular-nums">
              {formatMinutes(p.nightMinutes)} <span className={muted}>/ {formatMinutes(rules.nightMinutes)}</span>
            </span>
          </div>
          <Bar value={p.nightMinutes} max={REQUIRED_NIGHT_MINUTES} color="bg-indigo-500" />
        </div>
      )}

      {rules.challengingMinutes ? (
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="font-semibold">Night or bad weather</span>
            <span className="tabular-nums">
              {formatMinutes(p.challengingMinutes)} <span className={muted}>/ {formatMinutes(rules.challengingMinutes)}</span>
            </span>
          </div>
          <Bar value={p.challengingMinutes} max={rules.challengingMinutes} color="bg-indigo-500" />
          <p className={`${muted} mt-1 text-xs`}>Night minutes, plus whole drives tagged with bad weather.</p>
        </div>
      ) : null}

      {rules.weatherMinutes ? (
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="font-semibold">Bad weather</span>
            <span className="tabular-nums">
              {formatMinutes(p.weatherMinutes)} <span className={muted}>/ {formatMinutes(rules.weatherMinutes)}</span>
            </span>
          </div>
          <Bar value={p.weatherMinutes} max={rules.weatherMinutes} color="bg-sky-600" />
          <p className={`${muted} mt-1 text-xs`}>Drives tagged {BAD_WEATHER.join(", ").replace(/, ([^,]*)$/, " or $1")}.</p>
        </div>
      ) : null}

      {p.overLimitMinutes > 0 && (
        <p className={muted}>
          {rules.name} counts practice up to {countLimitText(rules)}, so {formatMinutes(p.overLimitMinutes)} of driving
          isn&apos;t in these totals.
        </p>
      )}

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className={muted}>Still to drive</dt>
          <dd className="font-medium">
            {/* Total done but night or bad weather short: name what's left instead of "0m" */}
            {p.hoursDone ? "Done ✓" : totalToGo > 0 ? formatMinutes(totalToGo) : stillToGo.join(", ")}
            {!p.hoursDone && totalToGo > 0 && stillToGo.length > 0 && (
              <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">incl. {stillToGo.join(", ")}</span>
            )}
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
            {!holdPassed && <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">Hold of {holdText(rules)} · {daysToHold} {daysToHold === 1 ? "day" : "days"}</span>}
          </dd>
        </div>
        {p.expiryDate && (
          <div>
            <dt className={`${muted} first-letter:uppercase`}>{rules.permitName} expires</dt>
            <dd className="font-medium">{formatDate(p.expiryDate)}</dd>
          </div>
        )}
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
          {!p.eligible && readyDate && p.weatherRemaining > 0 && (
            <p className={`${muted} mt-1`}>Plus {formatMinutes(p.weatherRemaining)} in bad weather, whenever the weather allows.</p>
          )}
          {behindExpiry && (
            <p className="mt-1 text-amber-700 dark:text-amber-400">
              That&apos;s after the {rules.permitName} expires ({formatDate(p.expiryDate!)}) — pick up the pace.
            </p>
          )}
        </div>
      </dl>
    </section>
  );
}
