import type { MetadataRoute } from "next";
import { STATES } from "@/states";

export const dynamic = "force-static";

/** The public pages: the landing page, the state comparison, and one per state. App pages (and About, for now) are noindex. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://drivetron.app";
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/driving-hours-by-state`, lastModified: STATES.map((s) => s.verified).sort().at(-1), changeFrequency: "monthly", priority: 0.9 },
    ...STATES.map((s) => ({ url: `${base}/${s.slug}`, lastModified: s.verified, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/delete-account`, changeFrequency: "yearly", priority: 0.1 },
  ];
}
