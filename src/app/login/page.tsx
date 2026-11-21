"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { LoginButton } from "@/components/auth/LoginButton";
import { EmailLinkSignIn } from "@/components/auth/EmailLinkSignIn";
import { muted } from "@/components/ui/styles";
import { safeNext } from "@/utils/safeNext";
import { usePlayApp } from "@/lib/platform";
import { FREE_HOURS_TEXT, PAYWALL_ON, PRICE_LABEL } from "@/lib/pricing";
import dynamic from "next/dynamic";

// Emulator builds only. The inlined env check folds to false in production, so the QA list (and its
// fake addresses) never reaches the production bundle.
const QaSignIn =
  process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === "1"
    ? dynamic(() => import("@/components/auth/QaSignIn").then((m) => m.QaSignIn), { ssr: false })
    : () => null;

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}

function Login() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"), typeof window === "undefined" ? undefined : window.location.origin);
  // "/" is the public landing page; after signing in, the app lives at /home
  const dest = next === "/" ? "/home" : next;

  useEffect(() => {
    if (!loading && user) router.replace(dest);
  }, [user, loading, router, dest]);

  const intent = useIntent(dest);
  const playApp = usePlayApp();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/icon.svg" alt="" className="h-20 w-20" />
      <div>
        <h1 className="text-3xl font-bold">{intent?.title ?? "Drivetron"}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {intent?.detail ?? "Log your teen’s supervised driving hours, day and night, from any phone, shared with the whole family."}
        </p>
        {/* Not in the Play app: Play's payments policy (src/lib/platform.ts) */}
        {intent?.starting && PAYWALL_ON && !playApp && (
          <p className={`${muted} mt-2`}>
            First {FREE_HOURS_TEXT} free, then {PRICE_LABEL} once per teen. No subscription.
          </p>
        )}
      </div>
      <LoginButton />
      {/* The link comes back here with the same `next`, so it lands where Google sign-in would */}
      <EmailLinkSignIn continueUrl={typeof window === "undefined" ? "" : `${window.location.origin}/login?next=${encodeURIComponent(dest)}`} />
      <QaSignIn />
      <p className={`${muted} max-w-xs`}>
        Built around each state&apos;s teen driver rules. Not affiliated with any state government or motor vehicle agency.{" "}
        By signing in you agree to the{" "}
        <Link href="/terms" className="underline">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline">
          privacy policy
        </Link>
        .{" "}
        <Link href="/about" className="underline">
          About
        </Link>
      </p>
    </main>
  );
}

/**
 * What the person just decided to do on the page before, so sign-in reads as the next step rather
 * than a bare door: start a log (for a state, from its page), or join one. The state list loads only
 * when a state is named, so the login bundle doesn't carry every state's rules.
 */
function useIntent(dest: string): { title: string; detail: string; starting: boolean } | null {
  const url = new URL(dest, "https://drivetron.app");
  const setup = url.pathname === "/setup";
  // An invite link carries the code (/setup?code=…); "Join with a code" carries join=1
  const join = setup && (url.searchParams.has("join") || url.searchParams.has("code"));
  const slug = setup && !join ? url.searchParams.get("state") : null;
  const [state, setState] = useState<{ slug: string; name: string; requirement: string | null } | null>(null);
  useEffect(() => {
    if (!slug) return;
    let live = true;
    import("@/states").then(({ getStateBySlug, requirementText }) => {
      const r = getStateBySlug(slug);
      if (live && r) setState({ slug, name: r.name, requirement: r.noHours ? null : requirementText(r) });
    });
    return () => {
      live = false;
    };
  }, [slug]);

  if (!setup) return null;
  if (join) return { title: "Join your family’s log", detail: "Sign in to join the log your family already shares.", starting: false };
  const s = state && state.slug === slug ? state : null;
  return {
    title: s ? `Start your ${s.name} log` : "Start your family’s log",
    detail: s?.requirement
      ? `Sign in to track the ${s.requirement}, with every drive shared by both parents and your teen.`
      : "Sign in to set it up. Both parents and your teen share one log, on any phone.",
    starting: true,
  };
}
