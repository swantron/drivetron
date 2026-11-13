"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useInstall } from "@/hooks/useInstall";
import { useToast } from "@/components/ui/Toast";
import { STATES } from "@/states";
import { CONTACT_EMAIL } from "@/lib/site";
import { card, muted, primaryBtn, secondaryBtn } from "@/components/ui/styles";

const VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";
const COMMIT = process.env.NEXT_PUBLIC_BUILD_COMMIT ?? "dev";
const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME;


/** Public: linked from the sign-in screen, so the disclaimer is readable before anyone signs in. */
export default function AboutPage() {
  const { user } = useAuth();
  return (
    <main className="mx-auto max-w-xl space-y-4 px-4 pb-12 pt-[max(1rem,env(safe-area-inset-top))]">
      <Link href={user ? "/family" : "/"} className="inline-block py-1 text-sm text-emerald-700 dark:text-emerald-400">
        ‹ Back
      </Link>
      <header className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon.svg" alt="" className="h-14 w-14" />
        <div>
          <h1 className="text-2xl font-bold">Drivetron</h1>
          <p className={muted}>Shared supervised driving log for teen drivers and their parents</p>
        </div>
      </header>
      <VersionCard />
      <InstallCard />
      <Disclaimer />
      <DataCard />
    </main>
  );
}

function VersionCard() {
  const { showToast } = useToast();
  const [checking, setChecking] = useState(false);
  const built = BUILD_TIME ? new Date(BUILD_TIME) : null;

  // The service worker already updates on each fresh launch; this lets someone pull a new
  // version into an app that's been sitting open in the background.
  const checkForUpdate = async () => {
    const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : undefined;
    if (!reg) {
      window.location.reload();
      return;
    }
    setChecking(true);
    let updated = false;
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => {
        updated = true;
        window.location.reload();
      },
      { once: true }
    );
    try {
      await reg.update();
    } catch {
      setChecking(false);
      showToast("Couldn't check — are you online?", "error");
      return;
    }
    // A new version installs and takes over within a few seconds; if nothing changed, we're current.
    setTimeout(() => {
      if (updated) return;
      setChecking(false);
      if (reg.installing || reg.waiting) {
        showToast("Update downloading — the app reloads by itself when it's ready", "info");
      } else {
        showToast("You're on the latest version", "success");
      }
    }, 4000);
  };

  return (
    <section className={`${card} space-y-3`}>
      <h2 className="font-semibold">Version</h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className={muted}>Version</dt>
        <dd className="font-medium">{VERSION}</dd>
        <dt className={muted}>Build</dt>
        <dd className="font-mono">{COMMIT}</dd>
        {built && (
          <>
            <dt className={muted}>Released</dt>
            <dd>{built.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</dd>
          </>
        )}
      </dl>
      <p className={muted}>Updates install on their own: the app checks whenever it&apos;s opened and reloads into the new version.</p>
      <button className={secondaryBtn} onClick={checkForUpdate} disabled={checking}>
        {checking ? "Checking…" : "Check for updates"}
      </button>
    </section>
  );
}

function InstallCard() {
  const { installed, platform, install } = useInstall();
  if (installed === null || platform === null) return null;

  return (
    <section className={`${card} space-y-3`}>
      <h2 className="font-semibold">Installation</h2>
      {installed ? (
        <p className="text-sm">✓ Running as an installed app on this device. It works offline, and drives sync when you&apos;re back in coverage.</p>
      ) : (
        <>
          <p className="text-sm">
            Running in a browser tab. Install it so it opens like an app, works offline, and keeps you signed in.
          </p>
          {install && (
            <button className={primaryBtn} onClick={install}>
              Install Drivetron
            </button>
          )}
          {platform === "ios" && (
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              <li>Open this page in <strong>Safari</strong>.</li>
              <li>Tap the <strong>Share</strong> button (square with an arrow).</li>
              <li>Choose <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
            </ol>
          )}
          {platform === "android" && !install && (
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              <li>Open this page in <strong>Chrome</strong>.</li>
              <li>Tap the <strong>⋮</strong> menu.</li>
              <li>Choose <strong>Install app</strong> (or <strong>Add to Home screen</strong>).</li>
            </ol>
          )}
          {platform === "other" && !install && (
            <p className={muted}>On a phone, open drivetron.app and add it to your home screen. On a computer, Chrome and Edge offer an install icon in the address bar.</p>
          )}
        </>
      )}
      <p className={muted}>Everyone in the family installs it on their own phone and signs in with their own Google account.</p>
    </section>
  );
}

function Disclaimer() {
  return (
    <section className={`${card} space-y-3 text-sm`}>
      <h2 className="font-semibold">Disclaimer</h2>
      <p>
        Drivetron is an independent tool for keeping a practice log. It is <strong>not affiliated with, endorsed by, or
        approved by</strong> any state government or motor vehicle agency, including {STATES.map((st) => st.notAffiliatedWith).join("; ")}.
      </p>
      <p>
        The parent or guardian is responsible for the accuracy of the hours they certify to the state, which is signed under
        penalty of law. Review the log before signing.
      </p>
      <p>
        Night hours are worked out as sunset to sunrise at the drive&apos;s approximate location. Where a state&apos;s
        materials don&apos;t define &ldquo;night&rdquo; more precisely, check any drive close to dusk or dawn, and adjust the
        night minutes on that drive if needed.
      </p>
      <p>
        Requirements can change. Confirm the current rules with your state before your teen applies. Provided as-is, with no
        warranty.
      </p>
      {STATES.map((st) => (
        <div key={st.code}>
          <p className="font-medium">
            {st.name} sources <span className={muted}>(checked {st.verified})</span>
          </p>
          <ul className="space-y-1">
            {[...st.sources, st.certification].map((l) => (
              <li key={l.url}>
                <a className="text-emerald-700 underline dark:text-emerald-400" href={l.url} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function DataCard() {
  return (
    <section className={`${card} space-y-2 text-sm`}>
      <h2 className="font-semibold">Your data</h2>
      <p>
        Stored: names, the learner&apos;s date of birth and license date, drive times, tags and notes, and each
        drive&apos;s starting location rounded to about 1 km (used only for sunset times).
      </p>
      <p>
        Only people who joined your family log with its invite code can see it. There are no ads, analytics, or tracking, and
        the data isn&apos;t shared or sold.
      </p>
      <p className={muted}>
        Data is stored in Google Firebase. The family owner can remove members and make a new invite code from the Family
        tab, and can delete the whole log there, which erases it for everyone.
      </p>
      <p>
        Questions, a correction to a state&apos;s rules, or a request to delete your data:{" "}
        <a className="text-emerald-700 underline dark:text-emerald-400" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </p>
    </section>
  );
}
