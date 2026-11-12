"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { LoginButton } from "@/components/auth/LoginButton";
import { muted } from "@/components/ui/styles";
import { safeNext } from "@/utils/safeNext";

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
  const dest = safeNext(params.get("next"), typeof window === "undefined" ? undefined : window.location.origin);

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
          Log your teen&apos;s 50 supervised hours — 10 at night — from any phone, shared with the whole family.
        </p>
      </div>
      <LoginButton />
      <p className={`${muted} max-w-xs`}>
        Built for Montana&apos;s Graduated Driver Licensing rules. Not affiliated with the State of Montana, MVD, or OPI.{" "}
        <Link href="/about" className="underline">
          About &amp; privacy
        </Link>
      </p>
    </main>
  );
}

