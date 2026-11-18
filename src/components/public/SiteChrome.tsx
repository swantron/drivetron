import Link from "next/link";
import { STATES } from "@/states";
import { CONTACT_EMAIL, OPERATOR } from "@/lib/site";
import { HeaderAction } from "./HeaderAction";

export const START_HREF = "/login?next=%2Fsetup";
/** For a second parent or the teen: one family shares one log, so they join rather than start one. */
export const JOIN_HREF = "/login?next=%2Fsetup%3Fjoin%3D1";

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
      <Link href="/" className="flex items-center gap-2 font-bold">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon.svg" alt="" className="h-8 w-8" />
        Drivetron
      </Link>
      <HeaderAction />
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
                About &amp; install
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="underline">
                Privacy
              </Link>{" "}
              ·{" "}
              <Link href="/terms" className="underline">
                Terms
              </Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
          <p className="mt-3 text-xs">Not affiliated with any state government or motor vehicle agency.</p>
          <p className="mt-1 text-xs">Drivetron is a product of {OPERATOR}, Montana.</p>
        </div>
      </div>
    </footer>
  );
}
