"use client";

import Link from "next/link";
import { useFamily } from "@/components/FamilyProvider";
import { CONTACT_EMAIL } from "@/lib/site";
import { FREE_HOURS_TEXT, FREE_WARN_MINUTES, PRICE_LABEL, unlockUrl } from "@/lib/pricing";
import { rememberPendingUnlock } from "@/lib/pendingUnlock";
import { card, muted, primaryBtn } from "@/components/ui/styles";
import { firstName } from "@/utils/learners";
import { formatMinutes } from "@/utils/progress";
import { nowMs } from "@/utils/time";
import { usePlayApp } from "@/lib/platform";

/** The link to Stripe for the selected learner. Remembers the learner so the return page can follow the unlock. */
function UnlockLink({ className, children }: { className: string; children: React.ReactNode }) {
  const { family, learner } = useFamily();
  if (!family || !learner) return null;
  return (
    <a
      href={unlockUrl(family.id, learner.id)}
      className={className}
      onClick={() => rememberPendingUnlock(family.id, learner.id, nowMs())}
    >
      {children}
    </a>
  );
}

/**
 * Shown in place of "Start drive" once a learner has used the free hours. Logged drives stay
 * visible and printable; a running drive can always be stopped.
 */
export function UnlockCard() {
  const { family, learner, isSupervisor } = useFamily();
  const playApp = usePlayApp();
  if (!family || !learner) return null;
  const name = firstName(learner.name);

  // Google Play app: no price, no checkout, no pointer to one (Play payments policy; see lib/platform.ts)
  if (playApp) {
    return (
      <section className={`${card} space-y-3`} data-testid="unlock-card">
        <h2 className="text-lg font-bold">{name} has used the free hours</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Logging more of {name}&apos;s drives needs an unlock, which isn&apos;t available in the Android app.
        </p>
        <p className={muted}>Everything logged so far stays here, and the printable log still works.</p>
      </section>
    );
  }

  return (
    <section className={`${card} space-y-3`} data-testid="unlock-card">
      <h2 className="text-lg font-bold">Keep logging {name}&apos;s drives</h2>
      <p className="text-gray-700 dark:text-gray-300">
        The first {FREE_HOURS_TEXT} are free. Unlock the rest of {name}&apos;s log for a one-time {PRICE_LABEL}: every
        drive until the license, for the whole family, on every phone. No subscription.
      </p>
      {isSupervisor ? (
        <>
          <UnlockLink className={`${primaryBtn} block text-center`}>Unlock for {PRICE_LABEL}</UnlockLink>
          <p className={muted}>
            Secure checkout by Stripe. It unlocks on every family phone within a minute of paying. Problems or refunds:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
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

/** A heads-up in the last stretch of the free hours, so the paywall isn't a surprise. */
export function FreeHoursNotice() {
  const { learner, freeLeft, isSupervisor } = useFamily();
  const playApp = usePlayApp();
  if (!learner || freeLeft === null || freeLeft === 0 || freeLeft > FREE_WARN_MINUTES) return null;
  const name = firstName(learner.name);
  if (playApp) {
    return (
      <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100" data-testid="free-hours-notice">
        <strong>{formatMinutes(freeLeft)}</strong> of free logging left for {name}.
      </div>
    );
  }
  return (
    <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100" data-testid="free-hours-notice">
      <p>
        <strong>{formatMinutes(freeLeft)}</strong> of free logging left for {name}. After that, a one-time {PRICE_LABEL}{" "}
        unlocks the rest of the log for the whole family.
      </p>
      {isSupervisor ? (
        <UnlockLink className="mt-1 inline-block font-semibold underline">Unlock now</UnlockLink>
      ) : (
        <p className="mt-1">A parent or guardian can unlock it from their phone.</p>
      )}
    </div>
  );
}
