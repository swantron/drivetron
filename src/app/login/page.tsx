"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { LoginButton } from "@/components/auth/LoginButton";
import { EmailLinkSignIn } from "@/components/auth/EmailLinkSignIn";
import { muted } from "@/components/ui/styles";
import { safeNext } from "@/utils/safeNext";
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

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/icon.svg" alt="" className="h-20 w-20" />
      <div>
        <h1 className="text-3xl font-bold">Drivetron</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Log your teen&apos;s supervised driving hours, day and night, from any phone, shared with the whole family.
        </p>
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

