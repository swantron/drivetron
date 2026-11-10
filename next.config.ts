import type { NextConfig } from "next";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import withSerwistInit from "@serwist/next";

// Every page is a static shell that loads its data client-side, so precache
// them all: the installed app then opens any page with no signal, not just
// ones the phone happened to load before. Paths match Hosting's cleanUrls.
const pageUrls = readdirSync("src/app", { recursive: true, encoding: "utf8" })
  .filter((file) => /(^|\/)page\.tsx$/.test(file))
  .map((file) => "/" + file.replace(/\/?page\.tsx$/, ""));
const buildId = randomUUID();

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: pageUrls.map((url) => ({ url, revision: buildId })),
});

// Shown on the About page so a family can tell which version a phone is running.
const { version } = JSON.parse(readFileSync("package.json", "utf8")) as { version: string };
function commit(): string {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "dev";
  }
}

const nextConfig: NextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_BUILD_COMMIT: commit(),
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  images: {
    unoptimized: true,
  },
};

export default withSerwist(nextConfig);
