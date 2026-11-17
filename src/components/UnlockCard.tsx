"use client";

import Link from "next/link";
import { useFamily } from "@/components/FamilyProvider";
import { FREE_HOURS_TEXT, PRICE_LABEL, unlockUrl } from "@/lib/pricing";
import { card, muted, primaryBtn } from "@/components/ui/styles";
import { firstName } from "@/utils/learners";

/**
 * Shown in place of "Start drive" once a learner has used the free hours. Logged drives stay
 * visible and printable; a running drive can always be stopped.
 */
export function UnlockCard() {
  const { family, learner, isSupervisor } = useFamily();
  if (!family || !learner) return null;
  const name = firstName(learner.name);

  return (
    <section className={`${card} space-y-3`} data-testid="unlock-card">
      <h2 className="text-lg font-bold">Keep logging {name}&apos;s drives</h2>
      <p className="text-gray-700 dark:text-gray-300">
        The first {FREE_HOURS_TEXT} are free. Unlock the rest of {name}&apos;s log for a one-time {PRICE_LABEL}: every
        drive until the license, for the whole family, on every phone. No subscription.
      </p>
      {isSupervisor ? (
        <>
          <a href={unlockUrl(family.id, learner.id)} className={`${primaryBtn} block text-center`}>
            Unlock for {PRICE_LABEL}
          </a>
          <p className={muted}>
            Secure checkout by Stripe. It unlocks on every family phone within a minute of paying. Problems or refunds:{" "}
            <a href="mailto:support@drivetron.app" className="underline">
              support@drivetron.app
            </a>
            .{" "}
            <Link href="/terms" className="underline">
              Terms
            </Link>
          </p>
        </>
      ) : (
        <p className={muted}>Ask a parent or guardian in the family to unlock it from their phone.</p>
      )}
      <p className={muted}>Everything logged so far stays here, and the printable log still works.</p>
    </section>
  );
}
