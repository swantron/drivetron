"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

/** "Sign in", or "Open app" once auth shows this browser is signed in (first render matches the server). */
export function HeaderAction() {
  const { user } = useAuth();
  return (
    <Link href={user ? "/home" : "/login"} className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
      {user ? "Open app" : "Sign in"}
    </Link>
  );
}
