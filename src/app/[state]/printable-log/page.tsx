import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATES, countLimitText, getStateBySlug, holdText, nightRangeText, requirementText, upperFirst } from "@/states";
import type { StateRules } from "@/states";
import { socialMeta } from "@/lib/site";
import { PAYWALL_ON } from "@/lib/pricing";
import { PriceLine, SiteFooter, SiteHeader, startHref } from "@/components/public/SiteChrome";
import { PrintButton } from "@/components/public/PrintButton";
import { FitToWidth } from "@/components/public/FitToWidth";

/**
 * A free blank log per state, for parents searching "printable <state> driving log". The sheet is the
 * same shape as the app's printed log, with the state's figures on it, so a family that later moves to
 * the app gets the filled-in version of what they were keeping by hand.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return STATES.map((s) => ({ state: s.slug }));
}

type Props = { params: Promise<{ state: string }> };

const path = (s: StateRules) => `/${s.slug}/printable-log`;

/** Rows on one letter-size sheet, with room left for the totals and signatures */
const ROWS = 16;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getStateBySlug((await params).state);
  if (!s) return {};
  // Name the state's form, unless it's a log of its own that this sheet doesn't match (Texas's
  // DES150N, North Carolina's DL-4A), so the title doesn't promise a stand-in for it
  const form = s.formName && (s.practiceLog || !/log/i.test(s.certification?.label ?? "")) ? ` for ${s.formName}` : "";
  const title = s.noHours ? `Free printable ${s.name} practice driving log | Drivetron` : `Free printable ${s.name} driving log${form} (${requirementText(s)}) | Drivetron`;
  const description = s.noHours
    ? `A free blank practice driving log for ${s.name} teen drivers: date, times, conditions, total and night time, supervisor initials and signatures. ${s.name} sets no hour requirement, so it's your own record.`
    : `A free blank supervised driving log for ${s.name}: date, times, conditions, total and night time, supervisor initials and signatures, with ${s.name}'s ${requirementText(s)} printed on the sheet.`;
  return { title, description, alternates: { canonical: path(s) }, ...socialMeta(title, description, path(s)), robots: { index: true, follow: true } };
}

export default async function PrintableLogPage({ params }: Props) {
  const s = getStateBySlug((await params).state);
  if (!s) notFound();
  // Pennsylvania and Alaska count bad-weather driving, so the sheet needs somewhere to mark it
  const weatherColumn = !!(s.weatherMinutes || s.challengingMinutes);
  const limit = countLimitText(s);
  // Massachusetts and Mississippi need no night hours; a state with no hours at all still gets one, as a record
  const nightColumn = s.nightMinutes > 0 || !!s.noHours;

  return (
    <>
      <div className="print:hidden">
        <SiteHeader />
      </div>
      <main className="mx-auto max-w-3xl px-4 print:max-w-none print:px-0">
        <div className="print:hidden">
          <nav className="text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="underline">
              Drivetron
            </Link>{" "}
            ›{" "}
            <Link href={`/${s.slug}`} className="underline">
              {s.name}
            </Link>{" "}
            › Printable log
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Printable {s.name} driving log</h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            A free blank log to print and keep in the glovebox.{" "}
            {s.noHours
              ? `${s.name} doesn't require a set number of supervised hours, so this is your family's own record of what your teen has practiced.`
              : `It has ${s.name}'s requirement on it (${requirementText(s)}) and a night column, so you can add up the hours a parent certifies.`}{" "}
            Print as many sheets as you need.
          </p>
          {s.practiceLog && (
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              {s.name} also publishes{" "}
              <a href={s.practiceLog.url} className="text-emerald-700 underline dark:text-emerald-400" target="_blank" rel="noreferrer">
                its own practice log
              </a>
              . If the state asks to see a log, bring that one.
            </p>
          )}
          {s.certification && (
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              When the hours are done, a parent or guardian signs{" "}
              <a href={s.certification.url} className="text-emerald-700 underline dark:text-emerald-400" target="_blank" rel="noreferrer">
                {s.certification.label}
              </a>
              . This log is the record behind it.
            </p>
          )}
          <PrintButton className="mt-5 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm active:bg-emerald-800">
            Print / Save as PDF
          </PrintButton>
        </div>

        {/* The sheet: paper on screen too, whatever the theme */}
        <article className="mt-6 overflow-x-auto rounded-2xl border border-gray-300 bg-white p-4 text-black shadow-sm sm:p-6 print:mt-0 print:overflow-visible print:rounded-none print:border-0 print:p-0 print:shadow-none">
          <FitToWidth width={640} className="text-sm">
            <header className="text-center">
              <h2 className="text-lg font-bold uppercase tracking-wide">{s.name} Practice Driving Log</h2>
              <p>
                {s.noHours ? "No set number of supervised hours required" : `Required: ${requirementText(s)}`}
                {s.noPermit ? null : `. Hold the ${s.permitName} at least ${holdText(s)}.`}
              </p>
            </header>

            <div className="mt-4 grid grid-cols-[2fr_1fr] gap-x-6 gap-y-3">
              {[
                "Teen driver",
                "Date of birth",
                s.noPermit ? "Started practicing" : `${upperFirst(s.permitName)} issued`,
                "Page ___ of ___",
              ].map((label) =>
                label.startsWith("Page") ? (
                  <p key={label} className="self-end">
                    {label}
                  </p>
                ) : (
                  <div key={label} className="flex items-end gap-2">
                    <span className="whitespace-nowrap font-semibold">{label}:</span>
                    <span className="h-5 flex-1 border-b border-black" />
                  </div>
                )
              )}
            </div>

            <table className="mt-4 w-full table-fixed border-collapse">
              <thead>
                <tr className="text-left text-xs">
                  <th className="w-[13%] border border-black px-1 py-1">Date</th>
                  <th className="w-[10%] border border-black px-1 py-1">Start</th>
                  <th className="w-[10%] border border-black px-1 py-1">End</th>
                  <th className="border border-black px-1 py-1">Conditions &amp; skills practiced</th>
                  {weatherColumn && <th className="w-[9%] border border-black px-1 py-1">Bad weather</th>}
                  <th className="w-[10%] border border-black px-1 py-1">Total time</th>
                  {nightColumn && <th className="w-[10%] border border-black px-1 py-1">Night time</th>}
                  <th className="w-[12%] border border-black px-1 py-1">Supervisor initials</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: ROWS }, (_, i) => (
                  <tr key={i} className="h-8">
                    <td className="border border-black" />
                    <td className="border border-black" />
                    <td className="border border-black" />
                    <td className="border border-black" />
                    {weatherColumn && <td className="border border-black" />}
                    <td className="border border-black" />
                    {nightColumn && <td className="border border-black" />}
                    <td className="border border-black" />
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {["This page", "Running total"].map((label) => (
                  <tr key={label} className="h-8 font-bold">
                    <td colSpan={weatherColumn ? 5 : 4} className="border border-black px-1 text-right">
                      {label}
                    </td>
                    <td className="border border-black" />
                    {nightColumn && <td className="border border-black" />}
                    <td className="border border-black bg-gray-100" />
                  </tr>
                ))}
              </tfoot>
            </table>

            <p className="mt-2 text-xs">
              {nightColumn && <>Night = {nightRangeText(s)}. </>}
              {limit && <>Only up to {limit} counts toward the hours. </>}
              {weatherColumn && <>Mark bad weather (rain, snow, fog, ice). </>}
              Supervisor: {s.supervisor}.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-8 break-inside-avoid">
              {["Parent/Guardian", "Teen Driver"].map((who) => (
                <div key={who}>
                  <div className="h-8 border-b border-black" />
                  <p className="mt-1 text-xs">{who}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[10px] text-gray-600">
              Blank log from drivetron.app{path(s)}. Not an official {s.name} form; confirm requirements with the state.
            </p>
          </FitToWidth>
        </article>

        <section className="mt-10 rounded-2xl bg-emerald-50 p-6 print:hidden dark:bg-emerald-950">
          <h2 className="text-xl font-bold">Rather not add it up by hand?</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Drivetron is this log on your phone. Tap Start and Stop and it fills in the row, splits the night minutes using sunset and sunrise where
            you drove, and keeps the running total{s.noHours ? "" : ` against ${s.name}'s ${requirementText(s)}`}. Both parents and your teen share
            one log, and it prints filled in, ready to sign.
          </p>
          <Link
            href={startHref(s.slug)}
            className="mt-4 inline-block rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm active:bg-emerald-800"
          >
            {PAYWALL_ON ? `Start your ${s.name} log free` : `Start your free ${s.name} log`}
          </Link>
          <PriceLine className="mt-2" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            More on{" "}
            <Link href={`/${s.slug}`} className="underline">
              {s.name}&apos;s rules and official forms
            </Link>
            .
          </p>
        </section>
      </main>
      <div className="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}
