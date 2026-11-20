"use client";

import Link from "next/link";
import { useState } from "react";
import { holdText, requirementText, upperFirst } from "@/states/text";
import { formatDate, parseLocalDate } from "@/utils/dates";
import { licenseDate, type CalcRules } from "@/utils/licenseDate";

const field =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-base dark:border-gray-700 dark:bg-gray-950";

/**
 * "When can my teen get their license?": the hold period from the permit date, or the day the hours
 * are done at a weekly pace, whichever is later. With one state it's fixed to it (on its page); with
 * several, it has a picker. Pages pass `calcRules(...)`, not full rules, to keep the bundle small.
 */
export function LicenseDateCalculator({ states }: { states: CalcRules[] }) {
  const fixed = states.length === 1;
  const [code, setCode] = useState(fixed ? states[0].code : "");
  const [permit, setPermit] = useState("");
  const [done, setDone] = useState("0");
  const [perWeek, setPerWeek] = useState("3");
  const s = states.find((x) => x.code === code) ?? null;

  const valid = !!s && /^\d{4}-\d{2}-\d{2}$/.test(permit);
  const r = valid ? licenseDate(s, parseLocalDate(permit), Number(done) || 0, Number(perWeek) || 0) : null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="grid gap-4 sm:grid-cols-2">
        {!fixed && (
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">State</span>
            <select className={field} value={code} onChange={(e) => setCode(e.target.value)}>
              <option value="">Choose your state</option>
              {states.map((x) => (
                <option key={x.code} value={x.code}>
                  {x.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="block">
          <span className="mb-1 block text-sm font-medium">{s?.noPermit ? "Started practicing" : `${upperFirst(s?.permitName ?? "permit")} issued`}</span>
          <input type="date" className={field} value={permit} onChange={(e) => setPermit(e.target.value)} />
        </label>
        {!s?.noHours && (
          <>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Hours already driven</span>
              <input type="number" inputMode="decimal" min={0} className={field} value={done} onChange={(e) => setDone(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Hours a week you&apos;ll drive</span>
              <input type="number" inputMode="decimal" min={0} step={0.5} className={field} value={perWeek} onChange={(e) => setPerWeek(e.target.value)} />
            </label>
          </>
        )}
      </div>

      <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-gray-950" aria-live="polite">
        {!r || !s ? (
          <p className="text-gray-600 dark:text-gray-400">
            {s ? `Enter the ${s.noPermit ? "date practice started" : `${s.permitName} date`} to see the earliest date.` : "Choose a state and enter the permit date."}
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">Earliest date to move to the next license</p>
            <p className="mt-1 text-2xl font-bold">{r.earliest ? formatDate(r.earliest) : "Needs a weekly pace"}</p>
            <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {!s.noPermit && (
                <li>
                  Hold the {s.permitName} {holdText(s)}: {formatDate(r.holdDate)}
                </li>
              )}
              {!s.noHours && (
                <li>
                  {r.hoursLeft === 0
                    ? `${requirementText(s)}: done`
                    : `${r.hoursLeft} more hours (${requirementText(s)} in all)${r.hoursDate ? ` at ${Number(perWeek)} a week: about ${formatDate(r.hoursDate)}` : ""}`}
                </li>
              )}
              {s.noHours && <li>{s.name} doesn&apos;t require a set number of supervised hours.</li>}
              {r.expiry && (
                <li>
                  {upperFirst(s.permitName)} expires: {formatDate(r.expiry)}
                </li>
              )}
            </ul>
            {r.afterExpiry && (
              <p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                At this pace the hours finish after the {s.permitName} expires. More hours a week would get there in time.
              </p>
            )}
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {s.name} also has a minimum age for each step, which this doesn&apos;t check.{" "}
              {!fixed && (
                <Link href={`/${s.slug}`} className="underline">
                  See {s.name}&apos;s steps
                </Link>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
