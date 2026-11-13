import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATES, getStateBySlug, holdText } from "@/states";
import { socialMeta } from "@/lib/site";
import { formatMinutes } from "@/utils/progress";

/** "50 hours" rather than "50h", for page titles and prose. */
const hoursText = (minutes: number) => `${minutes / 60} hour${minutes === 60 ? "" : "s"}`;
import { SiteFooter, SiteHeader, START_HREF } from "@/components/public/SiteChrome";

/** One public page per supported state, generated from its entry in src/states. */
export const dynamicParams = false;

export function generateStaticParams() {
  return STATES.map((s) => ({ state: s.slug }));
}

type Props = { params: Promise<{ state: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getStateBySlug((await params).state);
  if (!s) return {};
  const hours = `${hoursText(s.totalMinutes)}, ${hoursText(s.nightMinutes)} at night`;
  const title = `${s.name} supervised driving log: ${hours} | Drivetron`;
  const description = `${s.name} teen drivers need ${hours}, with the ${s.permitName} held at least ${holdText(s)}. Here are the rules, and a free log the whole family can share.`;
  return {
    title,
    description,
    alternates: { canonical: `/${s.slug}` },
    ...socialMeta(title, description, `/${s.slug}`),
    robots: { index: true, follow: true },
  };
}

export default async function StatePage({ params }: Props) {
  const s = getStateBySlug((await params).state);
  if (!s) notFound();
  const facts = [
    { label: "Supervised hours", value: formatMinutes(s.totalMinutes) },
    { label: "At night", value: formatMinutes(s.nightMinutes) },
    { label: `Hold the ${s.permitName}`, value: holdText(s) },
    { label: `${s.permitName} valid for`, value: `${s.permitValidMonths} months` },
  ];
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4">
        <nav className="text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="underline">
            Drivetron
          </Link>{" "}
          › {s.name}
        </nav>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{s.name} supervised driving log</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Under {s.name}&apos;s {s.program} rules, a teen on a {s.permitName} needs {hoursText(s.totalMinutes)} of supervised
          driving, {hoursText(s.nightMinutes)} of it at night, before moving to the next license. A parent or guardian
          certifies the hours on {s.certification.label}.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <dt className="text-sm text-gray-600 first-letter:uppercase dark:text-gray-400">{f.label}</dt>
              <dd className="mt-1 text-2xl font-bold">{f.value}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-8 rounded-2xl bg-emerald-50 p-6 dark:bg-emerald-950">
          <h2 className="text-xl font-bold">Track the {hoursText(s.totalMinutes)} with Drivetron</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-300">
            <li>One log shared by both parents and your teen, on iPhone or Android.</li>
            <li>Night minutes counted from sunset and sunrise where you drove.</li>
            <li>A printable log{s.practiceLog ? ` laid out like ${s.name}'s own practice log` : ""}, ready to sign.</li>
          </ul>
          {s.logAtTest && <p className="mt-3 text-gray-700 dark:text-gray-300">{s.logAtTest} Drivetron&apos;s log opens on your phone, or prints.</p>}
          <Link
            href={START_HREF}
            className="mt-4 inline-block rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm active:bg-emerald-800"
          >
            Start your {s.name} log — free
          </Link>
        </section>

        <section className="mt-10 space-y-6">
          <h2 className="text-2xl font-bold">
            {s.name}&apos;s {s.program} steps
          </h2>
          {s.stages.map((stage) => (
            <div key={stage.title}>
              <h3 className="text-lg font-semibold">{stage.title}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-300">
                {stage.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Who can supervise</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300 first-letter:uppercase">{s.supervisor}.</p>
          <h2 className="mt-8 text-2xl font-bold">What counts as night</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {s.nightDefinition ??
              `${s.name}'s materials don't define “night” precisely. Drivetron counts the minutes between sunset and sunrise at the drive's location; check any drive close to dusk or dawn.`}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Official sources</h2>
          <ul className="mt-2 space-y-1">
            {[s.certification, ...(s.practiceLog ? [s.practiceLog] : []), ...s.sources]
              .filter((l, i, all) => all.findIndex((x) => x.url === l.url) === i)
              .map((l) => (
                <li key={l.url}>
                  <a href={l.url} className="text-emerald-700 underline dark:text-emerald-400" target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                </li>
              ))}
          </ul>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Checked against these sources on {s.verified}. Requirements can change, so confirm with the state before your teen
            applies. Drivetron is not affiliated with {s.notAffiliatedWith}.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
