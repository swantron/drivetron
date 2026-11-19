import type { Metadata } from "next";
import Link from "next/link";
import { STATES, countLimitText, holdDays, holdText, upperFirst, type StateRules } from "@/states";
import { SITE_URL, socialMeta } from "@/lib/site";
import { PAYWALL_ON } from "@/lib/pricing";
import { SiteFooter, SiteHeader, START_HREF } from "@/components/public/SiteChrome";

/**
 * Every supported state side by side, generated from src/states: one page for the "hours by state"
 * searches, linking to each state's own page.
 */

const PATH = "/driving-hours-by-state";
const TITLE = "Supervised driving hours by state: teen permit requirements compared | Drivetron";
/** "47 states and Washington, D.C.": D.C. is in STATES but isn't a state. */
const COVERAGE = `${STATES.filter((s) => s.code !== "DC").length} states${STATES.some((s) => s.code === "DC") ? " and Washington, D.C." : ""}`;
const DESCRIPTION = `How many supervised driving hours a teen needs, how many at night, how long to hold the permit, and the form a parent signs, compared across ${COVERAGE}, from each state's own sources.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  ...socialMeta(TITLE, DESCRIPTION, PATH),
  robots: { index: true, follow: true },
};

const hours = (m: number) => `${m / 60}`;
const byName = [...STATES].sort((a, b) => a.name.localeCompare(b.name));
const listNames = (ss: StateRules[]) =>
  ss.length <= 1 ? (ss[0]?.name ?? "") : `${ss.slice(0, -1).map((s) => s.name).join(", ")} and ${ss[ss.length - 1].name}`;

/** Extra requirements beyond total and night hours, in a few words each. */
function extras(s: StateRules): string[] {
  const out: string[] = [];
  if (s.weatherMinutes) out.push(`${hours(s.weatherMinutes)}h in bad weather`);
  if (s.challengingMinutes) out.push(`${hours(s.challengingMinutes)}h at night or in bad weather`);
  if (s.noPermit) out.push("no learner's permit");
  const limit = countLimitText(s);
  if (limit) out.push(`only ${limit} counts`);
  return out;
}

/** Plain-language questions answered from the state data, shown on the page and as FAQ structured data. */
function faqs(): { q: string; a: string }[] {
  const most = Math.max(...STATES.map((s) => s.totalMinutes));
  const fewest = Math.min(...STATES.map((s) => s.totalMinutes));
  const mostStates = byName.filter((s) => s.totalMinutes === most);
  const fewestStates = byName.filter((s) => s.totalMinutes === fewest);
  const limited = byName.filter((s) => s.countLimit);
  const weather = byName.filter((s) => s.weatherMinutes);
  const narrower = byName.filter((s) => s.nightOffsetMinutes > 0);
  const wider = byName.filter((s) => s.nightOffsetMinutes < 0);
  const withNight = STATES.filter((s) => s.nightMinutes > 0);
  const noNight = byName.filter((s) => !s.nightMinutes);
  const byHold = STATES.filter((s) => !s.noPermit).sort((a, b) => holdDays(a) - holdDays(b));
  const noPermit = byName.filter((s) => s.noPermit);
  const shortest = byHold[0];
  const longest = byHold[byHold.length - 1];
  return [
    {
      q: "Which state requires the most supervised driving hours?",
      a: `Of the states Drivetron covers, ${listNames(mostStates)} ${mostStates.length === 1 ? "requires" : "require"} the most: ${hours(most)} hours. ${listNames(fewestStates)} ${fewestStates.length === 1 ? "requires" : "require"} the fewest, ${hours(fewest)} hours.`,
    },
    {
      q: "Do all states require night driving hours?",
      a: [
        `${noNight.length ? `Every state here except ${listNames(noNight)}` : "Every state here"} requires some driving at night, from ${hours(Math.min(...withNight.map((s) => s.nightMinutes)))} to ${hours(Math.max(...withNight.map((s) => s.nightMinutes)))} hours.`,
        narrower.length ? `${listNames(narrower)} ${narrower.length === 1 ? "counts" : "count"} night from half an hour after sunset to half an hour before sunrise.` : "",
        wider.length ? `${listNames(wider)} ${wider.length === 1 ? "counts" : "count"} it from half an hour before sunset to half an hour after sunrise.` : "",
        "Where a state doesn't define night, Drivetron counts sunset to sunrise.",
      ].filter(Boolean).join(" "),
    },
    ...(limited.length
      ? [
          {
            q: "Do states limit how many hours count per day or week?",
            a: `${limited.map((s) => `${s.name} counts only ${countLimitText(s)}`).join("; ")}. Longer drives still count up to that limit, so steady practice gets there sooner than marathon sessions.`,
          },
        ]
      : []),
    ...(weather.length
      ? [
          {
            q: "Which states require driving in bad weather?",
            a: `${weather.map((s) => `${s.name} requires ${hours(s.weatherMinutes!)} of its ${hours(s.totalMinutes)} hours in bad weather`).join("; ")}. Drivetron counts a drive toward them when it's tagged with rain, snow, ice, fog or wind.`,
          },
        ]
      : []),
    {
      q: "How long does a teen have to hold a learner's permit?",
      a: `From ${listNames(byName.filter((s) => !s.noPermit && holdDays(s) === holdDays(shortest)))}'s ${holdText(shortest)} to ${longest.name}'s ${holdText(longest)}${noPermit.length ? `; ${listNames(noPermit)} ${noPermit.length === 1 ? "has" : "have"} no learner's permit at all` : ""}. ${byName.filter((s) => !s.noPermit).map((s) => `${s.name}: ${holdText(s)}`).join("; ")}.`,
    },
    {
      q: "Who signs off on the supervised hours?",
      a: "In every state here a parent or guardian (or, in some states, another responsible adult) certifies the hours, on a form or affidavit some states require to be notarized or signed in front of an examiner. A few states also want the log itself. The table lists each state's form.",
    },
  ];
}

export default function DrivingHoursByState() {
  const qa = faqs();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: qa.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Drivetron", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Driving hours by state", item: `${SITE_URL}${PATH}` },
      ],
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <nav className="text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="underline">
            Drivetron
          </Link>{" "}
          › Driving hours by state
        </nav>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Supervised driving hours by state</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Before a teen moves from a learner&apos;s permit to a license, most states want a set number of supervised hours,
          some of them at night, certified by a parent. Here are the rules in the {COVERAGE} Drivetron covers, each
          checked against the state&apos;s own sources.
        </p>

        {/* Phones: one card per state; the table needs a wider screen */}
        <ul className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white sm:hidden dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
          {byName.map((s) => (
            <li key={s.code} className="px-4 py-3 text-sm">
              <Link href={`/${s.slug}`} className="font-semibold text-emerald-700 underline dark:text-emerald-400">
                {s.name}
              </Link>
              <p className="mt-0.5">
                {hours(s.totalMinutes)} hours{s.nightMinutes ? `, ${hours(s.nightMinutes)} at night` : ""}
                {s.noPermit ? "" : ` · hold the permit ${holdText(s)}`}
              </p>
              {extras(s).length > 0 && <p className="text-gray-600 dark:text-gray-400">{upperFirst(extras(s).join("; "))}</p>}
              <p className="text-gray-600 dark:text-gray-400">
                Parent signs:{" "}
                <a href={s.certification.url} className="underline" target="_blank" rel="noreferrer">
                  {s.certification.label.replace(/^the /, "")}
                </a>
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-gray-200 sm:block dark:border-gray-800">
          <table className="w-full min-w-[40rem] border-collapse bg-white text-left text-sm dark:bg-gray-900">
            <thead className="bg-gray-50 dark:bg-gray-950">
              <tr>
                <th scope="col" className="px-3 py-2">State</th>
                <th scope="col" className="px-3 py-2 text-right">Hours</th>
                <th scope="col" className="px-3 py-2 text-right">At night</th>
                <th scope="col" className="px-3 py-2">Also</th>
                <th scope="col" className="px-3 py-2">Hold the permit</th>
                <th scope="col" className="px-3 py-2">Parent signs</th>
              </tr>
            </thead>
            <tbody>
              {byName.map((s) => (
                <tr key={s.code} className="border-t border-gray-200 align-top dark:border-gray-800">
                  <th scope="row" className="px-3 py-2 font-semibold">
                    <Link href={`/${s.slug}`} className="text-emerald-700 underline dark:text-emerald-400">
                      {s.name}
                    </Link>
                  </th>
                  <td className="px-3 py-2 text-right tabular-nums">{hours(s.totalMinutes)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{s.nightMinutes ? hours(s.nightMinutes) : "—"}</td>
                  <td className="px-3 py-2">{extras(s).join("; ") || "—"}</td>
                  <td className="px-3 py-2">{holdText(s)}</td>
                  <td className="px-3 py-2">
                    <a href={s.certification.url} className="underline" target="_blank" rel="noreferrer">
                      {upperFirst(s.certification.label.replace(/^the /, ""))}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Hours are the minimum supervised practice for the next license, on top of any driver education the state requires.
          Rules change, so confirm with your state before your teen applies. Drivetron isn&apos;t affiliated with any state
          government or motor vehicle agency.
        </p>

        <section className="mt-8 rounded-2xl bg-emerald-50 p-6 dark:bg-emerald-950">
          <h2 className="text-xl font-bold">Log the hours on every family phone</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Drivetron times each drive, splits day and night from sunset and sunrise where you drove, follows your state&apos;s
            rules (daily or weekly limits, bad-weather hours, the permit hold), and prints a log ready to sign. Parents and teens
            share one log, on iPhone or Android.
          </p>
          <Link
            href={START_HREF}
            className="mt-4 inline-block rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm active:bg-emerald-800"
          >
            Start your log — free{PAYWALL_ON ? " to start" : ""}
          </Link>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold">Common questions</h2>
          <dl className="mt-4 space-y-5">
            {qa.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-semibold">{q}</dt>
                <dd className="mt-1 text-gray-700 dark:text-gray-300">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
