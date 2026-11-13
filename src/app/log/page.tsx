"use client";

import { AppShell } from "@/components/AppShell";
import { useFamily } from "@/components/FamilyProvider";
import { computeProgress, formatDate, formatMinutes, parseLocalDate } from "@/utils/progress";
import { card, muted, primaryBtn } from "@/components/ui/styles";
import { syncedLate } from "@/utils/syncedLate";
import { holdText } from "@/states";

export default function LogPage() {
  return (
    <AppShell>
      <PrintableLog />
    </AppShell>
  );
}

/**
 * Mirrors the OPI "Practice Driving Log" (Date / Conditions & Skills / Amount of Time / Initials,
 * total, parent and teen signatures) so it reads the way an examiner expects, plus a night column
 * and a summary with what form 21-1600 certifies.
 */
function PrintableLog() {
  const { learner, drives, rules } = useFamily();
  if (!learner) return null;
  const done = drives.filter((d) => d.endedAt !== null).sort((a, b) => a.startedAt - b.startedAt);
  const p = computeProgress(drives, learner.permitDate, new Date(), rules);

  return (
    <div className="space-y-4">
      <div className="space-y-3 print:hidden">
        <h1 className="text-2xl font-bold">Printable log</h1>
        <p className={muted}>
          {rules.practiceLog ? (
            <>
              Laid out like {rules.name}&apos;s{" "}
              <a href={rules.practiceLog.url} className="underline" target="_blank" rel="noreferrer">
                practice driving log
              </a>
              .{" "}
            </>
          ) : null}
          Print it or save it as a PDF, sign it, and bring it with{" "}
          <a href={rules.certification.url} className="underline" target="_blank" rel="noreferrer">
            {rules.certification.label}
          </a>{" "}
          when your teen applies.
        </p>
        <button className={primaryBtn} onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      <article className={`${card} overflow-x-auto text-sm print:border-0 print:p-0 print:shadow-none`}>
        <header className="mb-4 text-center">
          <h2 className="text-lg font-bold uppercase tracking-wide">Practice Driving Log</h2>
          <p>
            {rules.name} {rules.program} — {formatMinutes(rules.totalMinutes)} supervised, including {formatMinutes(rules.nightMinutes)} at night
          </p>
        </header>

        <dl className="mb-4 grid grid-cols-2 gap-x-6 gap-y-1">
          <div>
            <dt className="inline font-semibold">This log belongs to: </dt>
            <dd className="inline">{learner.name}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">Date of birth: </dt>
            <dd className="inline">{formatDate(parseLocalDate(learner.dob))}</dd>
          </div>
          <div>
            <dt className="inline font-semibold first-letter:uppercase">{rules.permitName} issued: </dt>
            <dd className="inline">{formatDate(parseLocalDate(learner.permitDate))}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">Held {holdText(rules)}: </dt>
            <dd className="inline">{formatDate(p.holdDate)}</dd>
          </div>
        </dl>

        <table className="w-full border-collapse text-xs sm:text-sm print:text-sm">
          <thead>
            <tr className="border-b-2 border-black text-left dark:border-gray-500 print:border-black">
              <th className="py-1 pr-1.5 sm:pr-2">Date</th>
              <th className="py-1 pr-1.5 sm:pr-2">Conditions &amp; Skills</th>
              <th className="py-1 pr-1.5 sm:pr-2 text-right">Time</th>
              <th className="py-1 pr-1.5 sm:pr-2 text-right">Night</th>
              <th className="py-1 text-center">Init.</th>
            </tr>
          </thead>
          <tbody>
            {done.map((d) => {
              const start = new Date(d.startedAt);
              const end = new Date(d.endedAt!);
              const t = (x: Date) => x.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
              return (
                <tr key={d.id} className="break-inside-avoid border-b border-gray-300 align-top dark:border-gray-700 print:border-gray-400">
                  <td className="whitespace-nowrap py-1 pr-1.5 sm:pr-2">
                    {start.toLocaleDateString(undefined, { month: "numeric", day: "numeric", year: "2-digit" })}
                    <div className="text-xs text-gray-500">
                      {t(start)}–{t(end)}
                    </div>
                  </td>
                  <td className="break-words py-1 pr-1.5 sm:pr-2">
                    {[...d.conditions, ...d.skills].join(", ") || "—"}
                    {d.vehicleName && <div className="text-xs text-gray-500">Vehicle: {d.vehicleName}</div>}
                    {d.notes && <div className="text-xs text-gray-500">{d.notes}</div>}
                  </td>
                  <td className="whitespace-nowrap py-1 pr-1.5 text-right tabular-nums sm:pr-2">
                    {formatMinutes(d.dayMinutes + d.nightMinutes)}
                    {d.manual && <sup title="Entered by hand">†</sup>}
                    {d.timesEdited && <sup title="Times edited after logging">*</sup>}
                    {syncedLate(d) && <sup title="Reached the server well after its start time">‡</sup>}
                  </td>
                  <td className="whitespace-nowrap py-1 pr-1.5 text-right tabular-nums sm:pr-2">{d.nightMinutes ? formatMinutes(d.nightMinutes) : ""}</td>
                  <td className="py-1 text-center font-medium">{d.supervisorInitials}</td>
                </tr>
              );
            })}
            {done.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No drives logged yet.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-black font-bold dark:border-gray-500 print:border-black">
              <td className="py-1 pr-2" colSpan={2}>
                TOTAL TIME ({p.driveCount} {p.driveCount === 1 ? "drive" : "drives"})
              </td>
              <td className="py-1 pr-2 text-right tabular-nums">{formatMinutes(p.totalMinutes)}</td>
              <td className="py-1 pr-2 text-right tabular-nums">{formatMinutes(p.nightMinutes)}</td>
              <td />
            </tr>
          </tfoot>
        </table>

        <p className="mt-3 text-xs text-gray-500">
          Night = sunset to sunrise at the drive&apos;s location. Init. = initials of the supervising licensed adult.
          {done.some((d) => d.manual) && <> † Entered by hand after the drive, not timed live.</>}
          {done.some((d) => d.timesEdited) && <> * Times were edited after the drive was logged.</>}
          {done.some(syncedLate) && (
            <> ‡ Timed, but first saved more than 15 minutes after its start — usually started without signal; check the start time.</>
          )}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-8 break-inside-avoid">
          {["Parent/Guardian", "Teen Driver"].map((who) => (
            <div key={who}>
              <div className="flex items-end gap-2 border-b border-black pb-1 dark:border-gray-400 print:border-black">
                <span className="text-lg">X</span>
                <span className="h-8" />
              </div>
              <p className="mt-1 text-xs">{who}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
