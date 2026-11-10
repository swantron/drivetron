import type { NextConfig } from "next";
import { randomUUID } from "node:crypto";
import { readdirSync } from "node:fs";
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

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default withSerwist(nextConfig);
