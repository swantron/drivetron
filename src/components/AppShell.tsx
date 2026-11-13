"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useFamily } from "@/components/FamilyProvider";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { LearnerSwitcher } from "@/components/LearnerSwitcher";
import { subscribeToJoinRequests, type JoinRequest } from "@/lib/firebase/firestore";

const tabs = [
  { href: "/home", label: "Home", icon: "M3 12l9-8 9 8M5 10v10h14V10" },
  { href: "/drives", label: "Drives", icon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/log", label: "Log", icon: "M7 3h7l5 5v13H7zM14 3v5h5" },
  { href: "/family", label: "Family", icon: "M9 11a4 4 0 100-8 4 4 0 000 8zM2 21a7 7 0 0114 0M17 11a3 3 0 100-6M22 21a6 6 0 00-4-5.6" },
];

/** Signed-in pages that need a family. Sends anyone without one to /setup. */
export function AppShell({
  children,
  title,
  switcher = true,
}: {
  children: React.ReactNode;
  title?: string;
  /** Show the learner switcher (when there's more than one learner) */
  switcher?: boolean;
}) {
  return (
    <ProtectedRoute>
      <FamilyGate>
        <div className="mx-auto flex min-h-screen max-w-xl flex-col">
          {title && (
            <header className="px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2 print:hidden">
              <h1 className="text-2xl font-bold">{title}</h1>
            </header>
          )}
          <main className={`flex-1 px-4 pb-28 print:pb-0 ${title ? "" : "pt-[max(1rem,env(safe-area-inset-top))] print:pt-0"}`}>
            <JoinRequestBanner />
            {switcher && (
              <div className="mb-3 empty:hidden">
                <LearnerSwitcher />
              </div>
            )}
            {children}
          </main>
          <BottomNav />
        </div>
      </FamilyGate>
    </ProtectedRoute>
  );
}

function FamilyGate({ children }: { children: React.ReactNode }) {
  const { loaded, family, error } = useFamily();
  const router = useRouter();

  useEffect(() => {
    if (loaded && !family && !error) router.replace("/setup");
  }, [loaded, family, error, router]);

  if (error) {
    return <p className="p-6 text-center text-red-600">Couldn&apos;t load your log: {error}</p>;
  }
  if (!loaded || !family) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  return <>{children}</>;
}

/** Owner only: live list of people waiting to be approved. */
function usePendingRequests(): JoinRequest[] {
  const { family, isOwner } = useFamily();
  const familyId = isOwner ? family?.id : undefined;
  const [state, setState] = useState<{ familyId?: string; reqs: JoinRequest[] }>({ reqs: [] });
  useEffect(() => {
    if (!familyId) return;
    return subscribeToJoinRequests(familyId, (reqs) => setState({ familyId, reqs }));
  }, [familyId]);
  return familyId && state.familyId === familyId ? state.reqs : [];
}

/** Without this the owner only finds out someone asked to join by opening the Family tab. */
function JoinRequestBanner() {
  const pathname = usePathname();
  const reqs = usePendingRequests();
  if (reqs.length === 0 || pathname.startsWith("/family")) return null;
  const who = reqs.length === 1 ? `${reqs[0].name} is` : `${reqs.length} people are`;
  return (
    <Link
      href="/family"
      className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100 print:hidden"
    >
      <span>{who} waiting for you to approve them.</span>
      <span className="shrink-0 font-semibold">Review ›</span>
    </Link>
  );
}

function BottomNav() {
  const pathname = usePathname();
  const pending = usePendingRequests().length;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 print:hidden">
      <ul className="mx-auto grid max-w-xl grid-cols-4">
        {tabs.map((t) => {
          const active = pathname.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                  active ? "text-emerald-700 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <span className="relative">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d={t.icon} />
                  </svg>
                  {t.href === "/family" && pending > 0 && (
                    <span
                      aria-label={`${pending} waiting for approval`}
                      className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white"
                    >
                      {pending}
                    </span>
                  )}
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
