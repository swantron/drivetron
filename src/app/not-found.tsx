import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/public/SiteChrome";

/** Any URL that doesn't exist (Firebase Hosting serves the exported 404.html). */

export const metadata: Metadata = {
  title: "Page not found | Drivetron",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4">
        <h1 className="mt-3 text-3xl font-bold tracking-tight">That page isn&apos;t here</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          The link may be old, or mistyped. Try one of these instead.
        </p>
        <ul className="mt-6 space-y-3 text-lg">
          <li>
            <Link href="/" className="font-semibold text-emerald-700 underline dark:text-emerald-400">
              Drivetron home
            </Link>
          </li>
          <li>
            <Link href="/driving-hours-by-state" className="font-semibold text-emerald-700 underline dark:text-emerald-400">
              Supervised driving hours by state
            </Link>
          </li>
          <li>
            <Link href="/license-date-calculator" className="font-semibold text-emerald-700 underline dark:text-emerald-400">
              When can my teen get a license?
            </Link>
          </li>
          <li>
            <Link href="/home" className="font-semibold text-emerald-700 underline dark:text-emerald-400">
              Open your log
            </Link>
          </li>
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
