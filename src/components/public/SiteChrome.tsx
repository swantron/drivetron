import Link from "next/link";
import { STATES } from "@/states";

export const START_HREF = "/login?next=%2Fsetup";

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
      <Link href="/" className="flex items-center gap-2 font-bold">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon.svg" alt="" className="h-8 w-8" />
        Drivetron
      </Link>
      <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
        Sign in
      </Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 text-sm text-gray-600 sm:grid-cols-3 dark:text-gray-400">
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">Drivetron</p>
          <p className="mt-1">A shared supervised-driving log for teen drivers and their parents.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">States</p>
          <ul className="mt-1 space-y-1">
            {STATES.map((s) => (
              <li key={s.code}>
                <Link href={`/${s.slug}`} className="underline">
                  {s.name} requirements
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">More</p>
          <ul className="mt-1 space-y-1">
            <li>
              <Link href="/about" className="underline">
                About, install &amp; privacy
              </Link>
            </li>
          </ul>
          <p className="mt-3 text-xs">Not affiliated with any state government or motor vehicle agency.</p>
        </div>
      </div>
    </footer>
  );
}
