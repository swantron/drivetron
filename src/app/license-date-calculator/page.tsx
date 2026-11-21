import type { Metadata } from "next";
import Link from "next/link";
import { STATES_BY_NAME } from "@/states";
import { socialMeta } from "@/lib/site";
import { PAYWALL_ON } from "@/lib/pricing";
import { PriceLine, SiteFooter, SiteHeader, START_HREF } from "@/components/public/SiteChrome";
import { LicenseDateCalculator } from "@/components/public/LicenseDateCalculator";
import { calcRules } from "@/utils/licenseDate";

/** "When can my teen get their license?", for every state, from the same rules data as the state pages. */

const PATH = "/license-date-calculator";
const TITLE = "When can my teen get their driver's license? Date calculator by state | Drivetron";
const DESCRIPTION =
  "Enter your state and the learner's permit date to see the earliest date your teen can move to the next license: the permit hold period, or when the supervised hours are done at your pace, whichever is later.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  ...socialMeta(TITLE, DESCRIPTION, PATH),
  robots: { index: true, follow: true },
};

export default function LicenseDateCalculatorPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4">
        <nav className="text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="underline">
            Drivetron
          </Link>{" "}
          › License date calculator
        </nav>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">When can my teen get their driver&apos;s license?</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Two things decide it in most states: how long the learner&apos;s permit has to be held, and when the supervised driving hours are done.
          Whichever comes later is the earliest your teen can move to the next license.
        </p>

        <div className="mt-6">
          <LicenseDateCalculator states={STATES_BY_NAME.map(calcRules)} />
        </div>

        <section className="mt-10 space-y-3 text-gray-700 dark:text-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">How it&apos;s figured</h2>
          <p>
            The hold period runs from the date the permit was issued: six months in many states, a year in others, and in a few a set number
            of days. The hours are counted from today at the pace you enter, since practice before the permit doesn&apos;t count. Each
            state&apos;s figures come from its own DMV pages, statutes and forms, listed on its page.
          </p>
          <p>
            It doesn&apos;t check minimum ages, driver&apos;s education, or the knowledge and road tests, which vary by state and by age. Each
            state&apos;s page has its steps. Requirements change, so confirm with the state before your teen applies.
          </p>
        </section>

        <section className="mt-8 rounded-2xl bg-emerald-50 p-6 dark:bg-emerald-950">
          <h2 className="text-xl font-bold">Let the date update itself</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Drivetron times each practice drive, counts night minutes from sunset and sunrise where you drove, and projects the test-ready date from
            your actual pace. One log shared by both parents and your teen.
          </p>
          <Link
            href={START_HREF}
            className="mt-4 inline-block rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm active:bg-emerald-800"
          >
            {PAYWALL_ON ? "Start your log free" : "Start your free log"}
          </Link>
          <PriceLine className="mt-2" />
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Rules by state</h2>
          <ul className="mt-3 columns-2 gap-x-6 text-sm sm:columns-3">
            {STATES_BY_NAME.map((s) => (
              <li key={s.code} className="mb-1 break-inside-avoid">
                <Link href={`/${s.slug}`} className="text-emerald-700 underline dark:text-emerald-400">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Or <Link href="/driving-hours-by-state" className="underline">compare every state&apos;s hours side by side</Link>.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
