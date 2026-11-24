#!/usr/bin/env node
/**
 * Fails when the service worker would precache a URL the export doesn't have. One 404 in the
 * precache list fails the whole service worker install, and every installed app then stays on its
 * old build with no sign anything is wrong (Nov 2026: a literal /[state]/printable-log did that
 * for four days). Run after `npm run build`; checks public/sw.js against out/, the way Hosting
 * serves it (cleanUrls: /x is out/x.html or out/x/index.html).
 *
 *   node scripts/check-precache.mjs
 */
import { existsSync, readFileSync } from "node:fs";

const sw = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");
const urls = [...sw.matchAll(/'url':'([^']+)'/g)].map((m) => m[1]);
if (urls.length === 0) {
  console.error("check-precache: no precache entries found in public/sw.js (did the build run, or did Serwist's output change?)");
  process.exit(1);
}

const out = new URL("../out", import.meta.url).pathname;
const served = (url) => {
  const path = decodeURIComponent(url.split(/[?#]/)[0]);
  if (path === "/") return [`${out}/index.html`];
  return [`${out}${path}`, `${out}${path}.html`, `${out}${path}/index.html`];
};
const missing = urls.filter((url) => !served(url).some((file) => existsSync(file)));

if (missing.length) {
  console.error(`check-precache: ${missing.length} precache URL(s) have no file in out/, so the service worker install would fail:`);
  for (const url of missing) console.error(`  ${url}`);
  process.exit(1);
}
console.log(`check-precache: all ${urls.length} precache URLs exist in out/`);
