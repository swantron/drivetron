import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/public/SiteChrome";

/** Date shown on /privacy and /terms. Bump it whenever either page changes in substance. */
export const LEGAL_UPDATED = "November 17, 2026";

/** Shared layout for the privacy policy and terms: plain prose, the public site's header and footer. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 pb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Last updated {LEGAL_UPDATED}</p>
        <div className="mt-6 space-y-4 text-gray-800 dark:text-gray-200 [&_a]:text-emerald-700 [&_a]:underline dark:[&_a]:text-emerald-400 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1">
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
