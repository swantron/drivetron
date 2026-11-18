"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useFamily } from "@/components/FamilyProvider";
import { deleteMyAccount, signOut, signedInRecently } from "@/lib/firebase/auth";
import { deleteLog, leaveFamily } from "@/lib/firebase/firestore";
import { CONTACT_EMAIL } from "@/lib/site";
import { dangerBtn, input, label, secondaryBtn } from "@/components/ui/styles";
import { nowMs } from "@/utils/time";

const HERE = "/delete-account";

/**
 * The self-serve part of /delete-account. Order matters: confirm a fresh sign-in first (Firebase
 * refuses to delete a stale one), then remove the person from the log (or delete a log only they
 * supervise), then delete the sign-in account, which also signs them out.
 */
export function DeleteAccountPanel() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { loaded, family, isOwner } = useFamily();
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const box = "not-prose space-y-3 rounded-2xl border border-red-200 p-4 dark:border-red-900";

  if (params.get("done") === "1") {
    return (
      <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100" role="status">
        <strong>Your account is deleted.</strong> Thanks for using Drivetron.
      </div>
    );
  }
  if (loading || (user && !loaded)) return <p>Checking your account…</p>;

  if (!user) {
    return (
      <div className={box}>
        <p>Sign in with the account you want to delete.</p>
        <Link href={`/login?next=${encodeURIComponent(HERE)}`} className={`${secondaryBtn} block text-center`}>
          Sign in to delete your account
        </Link>
      </div>
    );
  }

  const me = user.uid;
  const otherSupervisors = family
    ? family.memberUids.filter((uid) => uid !== me && family.members[uid]?.role === "supervisor")
    : [];

  // An owner with another supervising adult hands the log over first, so the family keeps it.
  if (family && isOwner && otherSupervisors.length > 0) {
    return (
      <div className={box}>
        <p>
          You own your family&apos;s log, and another supervising adult is in it. Hand the log to them first (Family tab →
          &ldquo;Hand over or delete this log&rdquo;), then come back here.
        </p>
        <Link href="/family" className={`${secondaryBtn} block text-center`}>
          Go to the Family tab
        </Link>
      </div>
    );
  }

  const deletesLog = !!family && isOwner;
  const recent = signedInRecently(user, nowMs());

  const reSignIn = async () => {
    await signOut();
    router.push(`/login?next=${encodeURIComponent(HERE)}`);
  };

  const run = async () => {
    setError(null);
    if (!signedInRecently(user, nowMs())) return reSignIn();
    setBusy(true);
    try {
      if (family) {
        if (isOwner) await deleteLog(family);
        else await leaveFamily(family.id, me);
      }
      await deleteMyAccount();
      // Firestore is shut down now; a fresh load shows the confirmation
      window.location.replace(`${HERE}?done=1`);
    } catch (e) {
      setBusy(false);
      const code = (e as { code?: string })?.code ?? "";
      setError(
        code === "auth/requires-recent-login"
          ? "For security, sign in again, then delete."
          : `That didn't finish. Check your connection and try again, or email ${CONTACT_EMAIL}.`
      );
    }
  };

  return (
    <div className={box}>
      <p>
        Signed in as <strong>{user.email ?? "your account"}</strong>.{" "}
        {deletesLog
          ? "You're the only supervising adult in your family's log, so deleting your account deletes the whole log too, for everyone in it. Print or save it first if you might need it."
          : family
            ? "Deleting your account removes you from your family's log; the log stays with the family."
            : "You're not in a family log, so this deletes just your sign-in account."}
      </p>
      {recent ? (
        <>
          <label className={label} htmlFor="confirmAccountDelete">
            Type DELETE to confirm
          </label>
          <input
            id="confirmAccountDelete"
            className={input}
            autoComplete="off"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
          />
          <button
            className={dangerBtn}
            disabled={typed.trim().toUpperCase() !== "DELETE" || busy}
            onClick={run}
          >
            {busy ? "Deleting…" : deletesLog ? "Delete my account and the log" : "Delete my account"}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm">To delete your account, sign in again first. It&apos;s a security check.</p>
          <button className={secondaryBtn} onClick={reSignIn}>
            Sign in again to continue
          </button>
        </>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
