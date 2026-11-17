"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFamily } from "@/components/FamilyProvider";
import { CONTACT_EMAIL } from "@/lib/site";
import { clearPendingUnlock, readPendingUnlock } from "@/lib/pendingUnlock";
import { firstName } from "@/utils/learners";
import { nowMs } from "@/utils/time";

/** After this long without the unlock arriving, say so and point at support. */
const SLOW_MS = 90_000;

/**
 * Stripe sends a supervisor back to /home?unlocked=1 after paying. The webhook usually lands the
 * unlock within seconds; this says the payment went through and follows the unlock until it arrives.
 * Needs a <Suspense> boundary (useSearchParams).
 */
export function UnlockReturn() {
  const params = useSearchParams();
  if (params.get("unlocked") !== "1") return null;
  return <UnlockReturnBanner />;
}

function UnlockReturnBanner() {
  const router = useRouter();
  const { family, learners, unlocks, setLearnerId } = useFamily();
  const [pending] = useState(() => readPendingUnlock(nowMs()));
  const [slow, setSlow] = useState(false);

  const target = pending && family && pending.familyId === family.id ? (learners.find((l) => l.id === pending.learnerId) ?? null) : null;
  const done = !!target && !!unlocks?.has(target.id);

  // Show the learner they just paid for, once.
  const shown = useRef(false);
  useEffect(() => {
    if (!target || shown.current) return;
    shown.current = true;
    setLearnerId(target.id);
  }, [target, setLearnerId]);

  useEffect(() => {
    if (done) clearPendingUnlock();
  }, [done]);

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), SLOW_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => router.replace("/home");
  const name = target ? firstName(target.name) : null;

  let tone = "bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100";
  let body: React.ReactNode;
  if (done) {
    body = (
      <>
        <strong>✓ {name}&apos;s log is unlocked.</strong> Thank you! Every phone in the family can log {name}&apos;s drives
        again. A receipt is on its way by email.
      </>
    );
  } else if (!target) {
    // Paid from another device, or this browser couldn't remember which learner
    body = (
      <>
        <strong>Thanks, your payment went through.</strong> The log unlocks on every family phone within a minute.
      </>
    );
  } else if (!slow) {
    body = (
      <>
        <strong>Payment received.</strong> Unlocking {name}&apos;s log, which usually takes a few seconds…
      </>
    );
  } else {
    tone = "bg-amber-50 text-amber-950 dark:bg-amber-950 dark:text-amber-100";
    body = (
      <>
        <strong>Still unlocking {name}&apos;s log.</strong> Stripe can take a few minutes. If it isn&apos;t unlocked within
        the hour, email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
          {CONTACT_EMAIL}
        </a>{" "}
        with your receipt and we&apos;ll sort it out.
      </>
    );
  }

  return (
    <div className={`flex items-start gap-3 rounded-2xl p-4 text-sm ${tone}`} role="status" data-testid="unlock-return">
      <p className="flex-1">{body}</p>
      <button onClick={dismiss} className="-m-1 p-1 text-lg leading-none opacity-70" aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
