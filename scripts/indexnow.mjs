#!/usr/bin/env node
/**
 * Tells Bing (and through IndexNow, Yandex and others) which public pages are new or changed, so
 * they're crawled in days instead of weeks. Google doesn't use IndexNow; Search Console covers it.
 *
 *   node scripts/indexnow.mjs --before <old-sitemap.xml>   new URLs, or ones whose lastmod changed
 *   node scripts/indexnow.mjs --all                        every URL in the sitemap
 *   add --dry-run to list the URLs without submitting them
 *
 * The URLs come from the built out/sitemap.xml. The key is public by design: IndexNow checks that
 * https://drivetron.app/<key>.txt holds it, which proves we control the site.
 */
import { readFileSync, existsSync } from "node:fs";

const HOST = "drivetron.app";
const KEY = "2a66140d8373157847624ceee6aa4032";

/** url -> lastmod ("" when the entry has none) */
function parseSitemap(xml) {
  const out = new Map();
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(m[1])?.[1]?.trim();
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(m[1])?.[1]?.trim() ?? "";
    if (loc) out.set(loc, lastmod);
  }
  return out;
}

const args = process.argv.slice(2);
const now = parseSitemap(readFileSync("out/sitemap.xml", "utf8"));
let urls;
if (args.includes("--all")) {
  urls = [...now.keys()];
} else {
  const beforePath = args[args.indexOf("--before") + 1];
  if (!args.includes("--before") || !beforePath) {
    console.error("Usage: indexnow.mjs --before <old-sitemap.xml> | --all");
    process.exit(2);
  }
  // No earlier sitemap (first deploy, or the fetch failed): nothing to compare, so skip quietly
  const before = existsSync(beforePath) ? parseSitemap(readFileSync(beforePath, "utf8")) : null;
  if (!before || before.size === 0) {
    console.log("IndexNow: no earlier sitemap to compare with; skipping");
    process.exit(0);
  }
  urls = [...now].filter(([u, mod]) => before.get(u) !== mod).map(([u]) => u);
}

if (urls.length === 0) {
  console.log("IndexNow: no new or changed URLs");
  process.exit(0);
}

if (args.includes("--dry-run")) {
  console.log(`IndexNow (dry run): would submit ${urls.length} URL(s)`);
  for (const u of urls) console.log(`  ${u}`);
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URL(s), HTTP ${res.status}`);
for (const u of urls) console.log(`  ${u}`);
// 200 and 202 are success. A failure here shouldn't fail the deploy, so report it and exit 0.
if (res.status >= 300) console.log(`IndexNow: ${await res.text().catch(() => "")}`);
