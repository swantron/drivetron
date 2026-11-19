"use client";

import Link from "next/link";
import { Fragment } from "react";
import { AppShell } from "@/components/AppShell";
import { useExport } from "@/components/DataExport";
import { confirmationOf, needsConfirming } from "@/utils/signoff";
import { useFamily } from "@/components/FamilyProvider";
import { computeProgress, formatDate, formatMinutes, parseLocalDate } from "@/utils/progress";
import { card, muted, primaryBtn, secondaryBtn } from "@/components/ui/styles";
import { syncedLate } from "@/utils/syncedLate";
import { logInitials } from "@/utils/members";
import { BAD_WEATHER } from "@/utils/practice";
import { StateResources } from "@/components/StateResources";
import { countLimitText, holdText, nightRangeText, upperFirst } from "@/states";

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
  const { learner, drives, rules, isSupervisor } = useFamily();
  const exp = useExport();
  if (!learner) return null;
  const done = drives.filter((d) => d.endedAt !== null).sort((a, b) => a.startedAt - b.startedAt);
  const unconfirmed = done.filter(needsConfirming).length;
  const confirmedLater = done.some((d) => confirmationOf(d) === "confirmed");
  const p = computeProgress(drives, learner.permitDate, new Date(), rules);
  // The rows show every minute driven; with a daily or weekly limit, a second total shows what counts.
  const loggedTotal = done.reduce((s, d) => s + d.dayMinutes + d.nightMinutes, 0);
  const loggedNight = done.reduce((s, d) => s + d.nightMinutes, 0);
  // With one car, naming it on every row is noise
  const manyVehicles = new Set(done.map((d) => d.vehicleName).filter(Boolean)).size > 1;
  // Initials a clerk can tell apart, and a key of who's who
  const inits = logInitials(done);

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
          {rules.certification ? (
            <>
              Print it or save it as a PDF, sign it, and bring it with{" "}
              <a href={rules.certification.url} className="underline" target="_blank" rel="noreferrer">
                {rules.certification.label}
              </a>{" "}
              when your teen applies.
            </>
          ) : (
            <>{rules.name} doesn&apos;t ask for a log or an hours certification, so this is your family&apos;s own record. Print it or save it as a PDF to keep.</>
          )}
        </p>
        {unconfirmed > 0 && (
          <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100">
            {unconfirmed === 1 ? "1 drive isn't" : `${unconfirmed} drives aren't`} confirmed by a supervising adult yet, and
            the log marks {unconfirmed === 1 ? "it" : "them"}.{" "}
            {isSupervisor ? (
              <Link href="/home" className="font-semibold underline">
                Confirm on Home
              </Link>
            ) : (
              "A parent or guardian can confirm from their phone."
            )}
          </p>
        )}
        <button className={primaryBtn} onClick={() => window.print()}>
          Print / Save as PDF
        </button>
        {exp && (
          <button className={secondaryBtn} onClick={exp.csv}>
            Download as a spreadsheet
          </button>
        )}
      </div>

      <article className={`${card} overflow-x-auto text-sm print:border-0 print:p-0 print:shadow-none`}>
        <header className="mb-4 text-center">
          <h2 className="text-lg font-bold uppercase tracking-wide">Practice Driving Log</h2>
          <p>
            {rules.name} {rules.program} — {rules.noHours ? "no set number of supervised hours required" : `${formatMinutes(rules.totalMinutes)} supervised`}{rules.nightMinutes ? <>, including {formatMinutes(rules.nightMinutes)} at night</> : null}
            {rules.weatherMinutes ? <> and {formatMinutes(rules.weatherMinutes)} in bad weather</> : null}
            {rules.challengingMinutes ? <>, including {formatMinutes(rules.challengingMinutes)} at night or in bad weather</> : null}
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
            {/* ::first-letter doesn't apply to inline elements, so capitalize in code */}
            <dt className="inline font-semibold">{rules.noPermit ? "Started practicing" : `${upperFirst(rules.permitName)} issued`}: </dt>
            <dd className="inline">{formatDate(parseLocalDate(learner.permitDate))}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">Earliest test date ({holdText(rules)} held): </dt>
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
                <Fragment key={d.id}>
                <tr className={`break-inside-avoid align-top ${d.notes ? "" : "border-b border-gray-300 dark:border-gray-700 print:border-gray-400"}`}>
                  <td className="py-1 pr-1.5 sm:pr-2">
                    <span className="whitespace-nowrap">{start.toLocaleDateString(undefined, { month: "numeric", day: "numeric", year: "2-digit" })}</span>
                    {/* On a phone the range breaks after the dash, leaving room for the other columns */}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="whitespace-nowrap">{t(start)}–</span>
                      <span className="whitespace-nowrap">{t(end)}</span>
                    </div>
                  </td>
                  <td className="break-words py-1 pr-1.5 sm:pr-2">
                    {[...d.conditions, ...d.skills].join(", ") || "—"}
                    {d.vehicleName && manyVehicles && <div className="text-xs text-gray-500 dark:text-gray-400">Vehicle: {d.vehicleName}</div>}
                  </td>
                  <td className="whitespace-nowrap py-1 pr-1.5 text-right tabular-nums sm:pr-2">
                    {formatMinutes(d.dayMinutes + d.nightMinutes)}
                    {d.manual && <sup title="Entered by hand">†</sup>}
                    {d.timesEdited && <sup title="Times edited after logging">*</sup>}
                    {syncedLate(d) && <sup title="Reached the server well after its start time">‡</sup>}
                  </td>
                  <td className="whitespace-nowrap py-1 pr-1.5 text-right tabular-nums sm:pr-2">{d.nightMinutes ? formatMinutes(d.nightMinutes) : ""}</td>
                  <td className="whitespace-nowrap py-1 text-center font-medium">
                    {inits.label(d.supervisorUid) || d.supervisorInitials}
                    {confirmationOf(d) === "confirmed" && <sup title={`Confirmed by ${d.signedOff?.name}`}>✓</sup>}
                    {needsConfirming(d) && <sup title="Not confirmed by a supervising adult">?</sup>}
                  </td>
                </tr>
                {/* Notes get the full width, so they don't squeeze the conditions column into a tall stack */}
                {d.notes && (
                  <tr className="break-inside-avoid border-b border-gray-300 dark:border-gray-700 print:border-gray-400">
                    <td colSpan={5} className="pb-1 text-xs text-gray-500 dark:text-gray-400">
                      {d.notes}
                    </td>
                  </tr>
                )}
                </Fragment>
              );
            })}
            {done.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500 dark:text-gray-400">
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
              <td className="whitespace-nowrap py-1 pr-2 text-right tabular-nums">{formatMinutes(loggedTotal)}</td>
              <td className="whitespace-nowrap py-1 pr-2 text-right tabular-nums">{formatMinutes(loggedNight)}</td>
              <td />
            </tr>
            {p.overLimitMinutes > 0 && (
              <tr className="font-bold">
                <td className="py-1 pr-2" colSpan={2}>
                  COUNTS TOWARD THE {rules.totalMinutes / 60} HOURS (up to {countLimitText(rules)})
                </td>
                <td className="whitespace-nowrap py-1 pr-2 text-right tabular-nums">{formatMinutes(p.totalMinutes)}</td>
                <td className="whitespace-nowrap py-1 pr-2 text-right tabular-nums">{formatMinutes(p.nightMinutes)}</td>
                <td />
              </tr>
            )}
          </tfoot>
        </table>

        {rules.challengingMinutes ? (
          <p className="mt-2 font-bold">
            AT NIGHT OR IN BAD WEATHER: {formatMinutes(p.challengingMinutes)}{" "}
            <span className="font-normal">(night minutes, plus drives tagged {BAD_WEATHER.join(", ")})</span>
          </p>
        ) : null}
        {rules.weatherMinutes ? (
          <p className="mt-2 font-bold">
            IN BAD WEATHER: {formatMinutes(p.weatherMinutes)}{" "}
            <span className="font-normal">(drives tagged {BAD_WEATHER.join(", ")})</span>
          </p>
        ) : null}

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Night = {nightRangeText(rules)} at the drive&apos;s location. Init. = initials of the supervising licensed adult
          {inits.key.length > 0 && <> ({inits.key.map((k) => `${k.label}: ${k.name}`).join("; ")})</>}.
          {done.some((d) => d.manual) && <> † Entered by hand after the drive, not timed live.</>}
          {done.some((d) => d.timesEdited) && <> * Times were edited after the drive was logged.</>}
          {confirmedLater && <> ✓ Logged on another phone and confirmed afterward by a supervising adult.</>}
          {unconfirmed > 0 && <> ? Logged on another phone and not yet confirmed by a supervising adult.</>}
          {done.some(syncedLate) && (
            <> ‡ Timed, but first saved more than 15 minutes after its start — usually started without signal; check the start time.</>
          )}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-8 break-inside-avoid">
          {["Parent/Guardian", "Teen Driver"].map((who) => (
            <div key={who}>
              <div className="h-10 border-b border-black dark:border-gray-400 print:border-black" />
              <p className="mt-1 text-xs">{who}</p>
            </div>
          ))}
        </div>
      </article>

      <StateResources />
    </div>
  );
}
