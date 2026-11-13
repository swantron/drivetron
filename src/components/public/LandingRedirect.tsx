"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * "/" is the public landing page, but it's also where older installed apps open. A signed-in
 * visitor goes straight to the app; the inline hint script on the page has already hidden the
 * landing content for them, and this removes that class if the hint turns out to be stale.
 */
export function LandingRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (user) router.replace("/home");
    else document.documentElement.classList.remove("dt-signed-in");
  }, [user, loading, router]);
  return null;
}

/** Runs before first paint, so a signed-in visitor never sees the landing page flash. */
export const SIGNED_IN_HINT_SCRIPT = `try{if(localStorage.getItem("drivetron.signedIn")==="1")document.documentElement.classList.add("dt-signed-in")}catch(e){}`;
