"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useFamily } from "@/components/FamilyProvider";
import { useToast } from "@/components/ui/Toast";
import { confirmDrives } from "@/lib/firebase/firestore";
import { confirmationOf, needsConfirming, signOffFor } from "@/utils/signoff";
import { driveLearnerId, firstName } from "@/utils/learners";
import { supervisorLabel } from "@/utils/instructors";
import { formatDate, formatMinutes } from "@/utils/progress";
import { writeErrorMessage } from "@/utils/errors";
import { nowMs } from "@/utils/time";
import { card, muted, primaryBtn } from "@/components/ui/styles";
import type { Drive } from "@/types";

const SHOWN = 5;

/** Confirms drives as the signed-in supervising adult. */
function useConfirm() {
  const { user } = useAuth();
  const { family, me, isSupervisor } = useFamily();
  const { showToast } = useToast();
  if (!user || !family || !me || !isSupervisor) return null;
  return (drives: Drive[]) => {
    const at = nowMs();
    const by = { uid: user.uid, name: me.name, initials: me.initials };
    confirmDrives(
      family.id,
      drives.map((d) => ({ id: d.id, signOff: signOffFor(d, by, at) })),
      (e) => showToast(writeErrorMessage(e), "error")
    );
    showToast(drives.length === 1 ? "Drive confirmed" : `${drives.length} drives confirmed`, "success");
  };
}

const when = (d: Drive) => {
  const s = new Date(d.startedAt);
  return `${s.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}, ${s.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
};

/**
 * Home: drives waiting for a supervising adult's OK. Supervisors confirm them here; a learner
 * sees how many of theirs are waiting.
 */
export function ConfirmCard() {
  const { user } = useAuth();
  const { allDrives, learners, isSupervisor } = useFamily();
  const confirm = useConfirm();
  if (!user) return null;
  const waiting = allDrives.filter(needsConfirming).sort((a, b) => a.startedAt - b.startedAt);

  if (!isSupervisor) {
    const mine = waiting.filter((d) => d.createdBy === user.uid).length;
    if (mine === 0) return null;
    return (
      <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100">
        {mine === 1
          ? "1 of your drives is waiting for a parent or guardian to confirm it from their phone."
          : `${mine} of your drives are waiting for a parent or guardian to confirm them from their phone.`}
      </p>
    );
  }
  if (waiting.length === 0 || !confirm) return null;
  const nameOf = (d: Drive) => learners.find((l) => l.id === driveLearnerId(d))?.name;

  return (
    <section className={`${card} space-y-3 border-amber-300 dark:border-amber-700`} data-testid="confirm-card">
      <div>
        <h2 className="font-semibold">{waiting.length === 1 ? "1 drive to confirm" : `${waiting.length} drives to confirm`}</h2>
        <p className={muted}>
          Timed on a phone other than the supervising adult&apos;s, usually your teen&apos;s, or with a driving instructor.
          Confirm each one happened as logged, and the printed log shows it as checked.
        </p>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {waiting.slice(0, SHOWN).map((d) => (
          <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
            <Link href={`/drives/view?id=${d.id}`} className="min-w-0">
              <p className="font-medium">
                {when(d)} · <span className="tabular-nums">{formatMinutes(d.dayMinutes + d.nightMinutes)}</span>
              </p>
              <p className={`${muted} truncate`}>
                {learners.length > 1 && <>{firstName(nameOf(d) ?? "")} · </>}
                with {supervisorLabel(d)}
                {confirmationOf(d) === "changed" && " · changed since confirmed"}
              </p>
            </Link>
            <button
              onClick={() => confirm([d])}
              className="min-h-11 shrink-0 rounded-lg border border-emerald-700 px-3 py-2 text-sm font-semibold text-emerald-800 active:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-300 dark:active:bg-emerald-950"
            >
              Confirm
            </button>
          </li>
        ))}
      </ul>
      {waiting.length > SHOWN && <p className={muted}>and {waiting.length - SHOWN} more</p>}
      {waiting.length > 1 && (
        <button className={primaryBtn} onClick={() => confirm(waiting)}>
          {waiting.length === 2 ? "Confirm both" : `Confirm all ${waiting.length}`}
        </button>
      )}
    </section>
  );
}

/** The drive page's confirmation status, with the button for a supervising adult. */
export function ConfirmationNote({ drive }: { drive: Drive }) {
  const confirm = useConfirm();
  if (drive.endedAt === null) return null;
  const c = confirmationOf(drive);
  if (c === "self") return null;
  const s = drive.signedOff;
  if (c === "confirmed" && s) {
    return (
      <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
        ✓ Confirmed by {s.name} on {formatDate(new Date(s.at))}.
      </p>
    );
  }
  return (
    <div className="space-y-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100">
      <p>
        {c === "changed" && s
          ? `Changed after ${s.name} confirmed it, so it needs confirming again.`
          : "Not confirmed by a supervising adult yet."}
        {!confirm && " A parent or guardian confirms it from their phone."}
      </p>
      {confirm && (
        <button
          type="button"
          onClick={() => confirm([drive])}
          className="w-full rounded-lg bg-emerald-700 px-3 py-2.5 font-semibold text-white active:bg-emerald-800"
        >
          {c === "changed" ? "Confirm it as it is now" : "Confirm this drive"}
        </button>
      )}
    </div>
  );
}
