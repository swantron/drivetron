"use client";

import { useEffect, useState } from "react";
import { finishEmailSignIn, isEmailSignInLink, rememberedSignInEmail, sendEmailSignInLink } from "@/lib/firebase/auth";
import { input, muted, secondaryBtn } from "@/components/ui/styles";

type Phase =
  | { kind: "form" }
  | { kind: "sending" }
  | { kind: "sent"; email: string }
  /** Opened a sign-in link on a device that didn't send it: ask which address it went to */
  | { kind: "confirm" }
  | { kind: "finishing" }
  | { kind: "error"; message: string };

function errorMessage(e: unknown): string {
  const code = (e as { code?: string })?.code ?? "";
  if (code === "auth/invalid-action-code" || code === "auth/expired-action-code")
    return "That sign-in link has expired or was already used. Send yourself a new one.";
  if (code === "auth/invalid-email") return "That doesn't look like an email address.";
  if (code === "auth/too-many-requests") return "Too many tries. Wait a few minutes and try again.";
  if (code === "auth/network-request-failed") return "No connection. Check your signal and try again.";
  return "Something went wrong. Try again, or sign in with Google.";
}

/**
 * Email-link sign-in: for parents and teens without a Google account (most often on iPhone).
 * `continueUrl` is where the link lands, which must be this /login page so it can finish the sign-in.
 */
export function EmailLinkSignIn({ continueUrl }: { continueUrl: string }) {
  // Arriving from the emailed link? Then the address it went to ("" when another device sent it).
  // The login page renders only on the client (it's behind useSearchParams), so reading window here is safe.
  const [arrival] = useState<string | null>(() =>
    typeof window !== "undefined" && isEmailSignInLink(window.location.href) ? (rememberedSignInEmail() ?? "") : null
  );
  const [phase, setPhase] = useState<Phase>(
    arrival === null ? { kind: "form" } : arrival === "" ? { kind: "confirm" } : { kind: "finishing" }
  );
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(arrival !== null);

  const finish = async (addr: string) => {
    try {
      await finishEmailSignIn(addr.trim(), window.location.href);
      // The login page redirects once the auth state changes
    } catch (e) {
      setPhase({ kind: "error", message: errorMessage(e) });
      setOpen(true);
    }
  };

  // Opened on the device that asked for it: finish without asking for the address again
  useEffect(() => {
    if (!arrival) return;
    finishEmailSignIn(arrival, window.location.href).catch((e) => {
      setPhase({ kind: "error", message: errorMessage(e) });
    });
  }, [arrival]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase.kind === "confirm") {
      setPhase({ kind: "finishing" });
      return finish(email);
    }
    setPhase({ kind: "sending" });
    try {
      await sendEmailSignInLink(email.trim(), continueUrl);
      setPhase({ kind: "sent", email: email.trim() });
    } catch (err) {
      setPhase({ kind: "error", message: errorMessage(err) });
    }
  };

  if (phase.kind === "finishing") return <p className={muted}>Signing you in…</p>;

  if (phase.kind === "sent") {
    return (
      <div className="w-full max-w-xs space-y-2 rounded-xl bg-emerald-50 p-4 text-left text-sm text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100" role="status">
        <p>
          <strong>Check your email.</strong> We sent a sign-in link to {phase.email}. Open it on this phone to sign in.
        </p>
        <p className="opacity-80">Not there? Check spam, or wait a minute. The link works once and expires in an hour.</p>
        <button className="underline" onClick={() => setPhase({ kind: "form" })}>
          Use a different address
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button className="text-sm font-medium text-emerald-700 underline dark:text-emerald-400" onClick={() => setOpen(true)}>
        No Google account? Sign in with email
      </button>
    );
  }

  const confirming = phase.kind === "confirm";
  return (
    <form onSubmit={send} className="w-full max-w-xs space-y-2 text-left">
      <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {confirming ? "Confirm the email address the link was sent to" : "Email address"}
      </label>
      <input
        id="signin-email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        className={input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className={secondaryBtn} disabled={phase.kind === "sending"}>
        {confirming ? "Sign in" : phase.kind === "sending" ? "Sending…" : "Email me a sign-in link"}
      </button>
      {phase.kind === "error" && <p className="text-sm text-red-600">{phase.message}</p>}
      {!confirming && <p className={muted}>No password: we email you a link that signs you in.</p>}
    </form>
  );
}
