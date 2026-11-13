import type { MetadataRoute } from "next";
import { STATES } from "@/states";

export const dynamic = "force-static";

/** The public pages: the landing page and one per state. App pages (and About, for now) are noindex. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://drivetron.app";
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    ...STATES.map((s) => ({ url: `${base}/${s.slug}`, lastModified: s.verified, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
