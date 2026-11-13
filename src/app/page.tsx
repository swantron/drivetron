import type { Metadata } from "next";
import Link from "next/link";
import { STATES, holdText } from "@/states";
import { socialMeta } from "@/lib/site";
import { formatMinutes } from "@/utils/progress";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { LandingRedirect, SIGNED_IN_HINT_SCRIPT } from "@/components/public/LandingRedirect";
import { JOIN_HREF, SiteFooter, SiteHeader, START_HREF } from "@/components/public/SiteChrome";

const title = "Drivetron — the supervised driving log the whole family shares";
const description =
  "Log your teen's supervised driving hours from any phone, iPhone or Android, in one shared log. Night hours are counted from sunset, and the printable log follows your state's rules.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  ...socialMeta(title, description, "/"),
  robots: { index: true, follow: true },
};

const features = [
  {
    title: "One log, every phone",
    body: "Parents and teen each use their own phone, iPhone or Android, and see the same log. Start a drive on one phone and stop it on another.",
  },
  {
    title: "Night hours counted for you",
    body: "Each drive is split into day and night minutes using sunset and sunrise where you drove.",
  },
  {
    title: "Hours a parent can sign for",
    body: "Teens time their own drives but can't type in past ones or stretch the times. Anything typed in or edited afterward is marked on the log.",
  },
  {
    title: "Ready for the license office",
    body: "Print the log or save it as a PDF, laid out like your state's own practice log, with totals and signature lines.",
  },
  {
    title: "Works without signal",
    body: "Install it to your home screen. Drives logged on a back road save on the phone and sync when you're back in coverage.",
  },
  {
    title: "Private by default",
    body: "Only people you approve can see your log. No ads, no tracking, and nothing is sold.",
  },
];

const steps = [
  "Create your log and pick your state.",
  "Invite the other parent and your teen. You approve each person.",
  "Tap Start drive when your teen gets behind the wheel, and Stop when you park.",
  "When the hours are done, print the log and sign your state's form.",
];

export default function LandingPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SIGNED_IN_HINT_SCRIPT }} />
      <LandingRedirect />
      <div className="dt-redirecting min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
      <div className="dt-landing">
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4">
          <section className="py-10 sm:py-16">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              The supervised driving log the whole family shares.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-400">
              Time your teen&apos;s practice drives from any phone, see the same log on every phone in the family, and print it
              when it&apos;s time for the license test.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={START_HREF}
                className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm active:bg-emerald-800"
              >
                Start your log — free
              </Link>
              <a href="#how" className="rounded-xl border border-gray-300 px-5 py-3 font-medium dark:border-gray-700">
                How it works
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Already invited? Open the link the other parent sent you, or{" "}
              <Link href={JOIN_HREF} className="font-medium text-emerald-700 underline dark:text-emerald-400">
                join with a code
              </Link>
              . Each family shares one log.
            </p>
          </section>

          <section aria-labelledby="features" className="py-6">
            <h2 id="features" className="sr-only">
              Features
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <li key={f.title} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{f.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="how" aria-labelledby="how-title" className="scroll-mt-4 py-10">
            <h2 id="how-title" className="text-2xl font-bold">
              How it works
            </h2>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-3 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="states-title" className="py-6">
            <h2 id="states-title" className="text-2xl font-bold">
              Built around your state&apos;s rules
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {STATES.map((s) => (
                <li key={s.code}>
                  <Link
                    href={`/${s.slug}`}
                    className="block rounded-2xl border border-gray-200 p-4 hover:border-emerald-600 dark:border-gray-800"
                  >
                    <span className="font-semibold">{s.name}</span>
                    <span className="block text-sm text-gray-600 dark:text-gray-400">
                      {formatMinutes(s.totalMinutes)} supervised · {formatMinutes(s.nightMinutes)} at night · hold {holdText(s)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">More states are on the way.</p>
          </section>

          <section className="mt-6 rounded-2xl bg-emerald-50 p-6 dark:bg-emerald-950">
            <h2 className="text-xl font-bold">Free to start</h2>
            <p className="mt-1 text-gray-700 dark:text-gray-300">Set up your family&apos;s log in a couple of minutes with a Google account.</p>
            <Link
              href={START_HREF}
              className="mt-4 inline-block rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm active:bg-emerald-800"
            >
              Start your log
            </Link>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
