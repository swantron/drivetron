"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useFamily } from "@/components/FamilyProvider";
import { useToast } from "@/components/ui/Toast";
import {
  approveJoinRequest,
  declineJoinRequest,
  deleteLog,
  leaveFamily,
  subscribeToJoinRequests,
  type JoinRequest,
  removeLearner,
  removeMember,
  removeVehicle,
  rotateInviteCode,
  saveLearner,
  saveVehicle,
  transferOwnership,
  updateFamily,
} from "@/lib/firebase/firestore";
import { writeErrorMessage } from "@/utils/errors";
import { STATES } from "@/states";
import { driveLearnerId, firstName, learnersOf, newId } from "@/utils/learners";
import { signOut } from "@/lib/firebase/auth";
import { initialsOf } from "@/utils/progress";
import type { Family, Learner, Member } from "@/types";
import { card, input, label, muted, primaryBtn, secondaryBtn } from "@/components/ui/styles";

export default function FamilyPage() {
  return (
    <AppShell title="Family" switcher={false}>
      <FamilySettings />
    </AppShell>
  );
}

function FamilySettings() {
  const { family, isOwner, isSupervisor, rules } = useFamily();
  const { user } = useAuth();
  const router = useRouter();
  if (!family || !user) return null;
  return (
    <div className="space-y-4">
      {isOwner && <JoinRequests familyId={family.id} />}
      <Members family={family} myUid={user.uid} />
      <Invite family={family} isOwner={isOwner} />
      {isSupervisor ? <Learners familyId={family.id} /> : <LearnerSummary />}
      <Vehicles familyId={family.id} />
      {!isOwner && <LeaveFamily familyId={family.id} uid={user.uid} />}
      {isOwner && <OwnerControls family={family} myUid={user.uid} />}
      <button
        className={secondaryBtn}
        onClick={async () => {
          await signOut();
          router.replace("/login");
        }}
      >
        Sign out
      </button>
      <Link href="/about" className={`${secondaryBtn} block text-center`}>
        About, install &amp; privacy
      </Link>
      <p className={`${muted} text-center`}>
        Drivetron {process.env.NEXT_PUBLIC_APP_VERSION} · Not affiliated with {rules.notAffiliatedWith}.
      </p>
    </div>
  );
}

function JoinRequests({ familyId }: { familyId: string }) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  useEffect(() => subscribeToJoinRequests(familyId, setRequests), [familyId]);
  if (requests.length === 0) return null;
  return (
    <section className={`${card} space-y-3 border-amber-400 dark:border-amber-600`}>
      <h2 className="font-semibold">Waiting to join</h2>
      <p className={muted}>Only approve people you know. Approved members can see the whole log.</p>
      <ul className="space-y-3">
        {requests.map((r) => (
          <JoinRequestRow key={r.uid} familyId={familyId} req={r} />
        ))}
      </ul>
    </section>
  );
}

function JoinRequestRow({ familyId, req }: { familyId: string; req: JoinRequest }) {
  const { showToast } = useToast();
  // They said what they are; the owner confirms, since that decides who can edit drives.
  const [role, setRole] = useState<Member["role"]>(req.role);
  const [busy, setBusy] = useState(false);
  const act = (p: Promise<void>, done: string) => {
    setBusy(true);
    p.then(() => showToast(done, "success"))
      .catch((e) => showToast(writeErrorMessage(e, "Couldn't update. Are you online?"), "error"))
      .finally(() => setBusy(false));
  };
  return (
    <li className="space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-950">
      <div>
        <p className="font-medium">{req.name}</p>
        {/* The name is whatever they typed; the address is their actual Google account */}
        {req.email ? <p className={`${muted} break-all`}>{req.email}</p> : <p className={muted}>Google account address not shown</p>}
      </div>
      <select className={input} value={role} onChange={(e) => setRole(e.target.value as Member["role"])} aria-label={`Role for ${req.name}`}>
        <option value="supervisor">Supervising adult — can add and edit any drive</option>
        <option value="learner">Learner — can time their own drives only</option>
      </select>
      <div className="grid grid-cols-2 gap-2">
        <button className={secondaryBtn} disabled={busy} onClick={() => act(declineJoinRequest(familyId, req.uid), "Request declined")}>
          Decline
        </button>
        <button className={primaryBtn} disabled={busy} onClick={() => act(approveJoinRequest(familyId, req, role), `${req.name} added`)}>
          Approve
        </button>
      </div>
    </li>
  );
}

function LearnerSummary() {
  const { learners, rules } = useFamily();
  return (
    <section className={`${card} space-y-2`}>
      <h2 className="font-semibold">Learners</h2>
      <ul className="text-sm">
        {learners.map((l) => (
          <li key={l.id}>{l.name}</li>
        ))}
      </ul>
      <p className={muted}>{rules.name} rules. A supervising adult manages learner details and license dates.</p>
    </section>
  );
}

function LeaveFamily({ familyId, uid }: { familyId: string; uid: string }) {
  const { showToast } = useToast();
  const [confirm, setConfirm] = useState(false);
  return (
    <button
      className={`${secondaryBtn} ${confirm ? "border-red-600 text-red-600" : ""}`}
      onClick={() =>
        confirm
          ? leaveFamily(familyId, uid).catch((e) => showToast(writeErrorMessage(e, "Couldn't leave. Are you online?"), "error"))
          : setConfirm(true)
      }
    >
      {confirm ? "Tap again to leave this log" : "Leave this log"}
    </button>
  );
}

function Invite({ family, isOwner }: { family: Family; isOwner: boolean }) {
  const { showToast } = useToast();
  const link = typeof window !== "undefined" ? `${window.location.origin}/setup?code=${family.inviteCode}` : "";

  const share = async () => {
    const names = learnersOf(family).map((l) => firstName(l.name)).join(" & ");
    const text = `Join ${names ? `${names}'s` : "our"} driving log on Drivetron. Code: ${family.inviteCode}`;
    try {
      if (navigator.share) await navigator.share({ title: "Drivetron", text, url: link });
      else {
        await navigator.clipboard.writeText(`${text}\n${link}`);
        showToast("Invite copied", "success");
      }
    } catch {
      // Share sheet dismissed
    }
  };

  return (
    <section className={`${card} space-y-3`}>
      <h2 className="font-semibold">Invite</h2>
      <p className={muted}>Share this with the other parent, another licensed adult you authorize, or your teen. They ask to join with it, and the log owner approves them.</p>
      <p className="rounded-lg bg-gray-100 py-3 text-center font-mono text-2xl tracking-[0.3em] dark:bg-gray-950">{family.inviteCode}</p>
      <button className={primaryBtn} onClick={share}>
        Share invite
      </button>
      {isOwner && (
        <button
          className="w-full text-sm text-gray-500 underline"
          onClick={() =>
            rotateInviteCode(family)
              .then(() => showToast("New code made; the old one no longer works", "success"))
              .catch((e) => showToast(writeErrorMessage(e, "Couldn't change the code"), "error"))
          }
        >
          Make a new code
        </button>
      )}
    </section>
  );
}

function Members({ family, myUid }: { family: Family; myUid: string }) {
  const { showToast } = useToast();
  const isOwner = family.ownerUid === myUid;
  const me = family.members[myUid];
  const [name, setName] = useState(me?.name ?? "");
  const [initials, setInitials] = useState(me?.initials ?? "");

  const saveMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!me) return;
    updateFamily(family.id, {
      [`members.${myUid}`]: { ...me, name: name.trim(), initials: (initials.trim() || initialsOf(name)).toUpperCase().slice(0, 4) },
    } as never)
      .then(() => showToast("Saved", "success"))
      .catch((e) => showToast(writeErrorMessage(e), "error"));
  };

  return (
    <section className={`${card} space-y-3`}>
      <h2 className="font-semibold">People</h2>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {family.memberUids.map((uid) => {
          const m = family.members[uid];
          if (!m) return null;
          return (
            <li key={uid} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">
                  {m.name} <span className="text-sm text-gray-500">({m.initials})</span>
                  {uid === myUid && <span className="ml-1 text-xs text-emerald-600">you</span>}
                </p>
                <p className={muted}>{m.role === "supervisor" ? "Supervising adult" : "Learner"}{uid === family.ownerUid ? " · owner" : ""}</p>
              </div>
              {isOwner && uid !== myUid && (
                <ConfirmRemove
                  label={`Remove ${m.name}`}
                  onConfirm={() => removeMember(family, uid).catch((e) => showToast(writeErrorMessage(e, "Couldn't remove"), "error"))}
                />
              )}
            </li>
          );
        })}
      </ul>
      {me && (
        <form onSubmit={saveMe} className="grid grid-cols-[1fr_5rem] gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
          <div>
            <label className={label} htmlFor="myname">Your name</label>
            <input id="myname" className={input} required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="myinit">Initials</label>
            <input id="myinit" className={`${input} uppercase`} maxLength={4} value={initials} onChange={(e) => setInitials(e.target.value)} />
          </div>
          {(name.trim() !== me.name || (initials.trim() || initialsOf(name)).toUpperCase().slice(0, 4) !== me.initials) && (
            <button className={`${secondaryBtn} col-span-2`}>Save my details</button>
          )}
        </form>
      )}
    </section>
  );
}

function Learners({ familyId }: { familyId: string }) {
  const { learners, allDrives, rules } = useFamily();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);
  return (
    <section className={`${card} space-y-3`}>
      <h2 className="font-semibold">Learners</h2>
      <div>
        <label className={label} htmlFor="logState">State</label>
        <select
          id="logState"
          className={input}
          value={rules.code}
          disabled={STATES.length < 2}
          onChange={(e) =>
            updateFamily(familyId, { state: e.target.value }).catch((err) => showToast(writeErrorMessage(err), "error"))
          }
        >
          {STATES.map((st) => (
            <option key={st.code} value={st.code}>
              {st.name}
            </option>
          ))}
        </select>
        <p className={`${muted} mt-1`}>Sets the hours, hold period and forms this log follows.</p>
      </div>
      {learners.map((l) => (
        <LearnerForm
          key={`${l.id}|${l.name}|${l.dob}|${l.permitDate}`}
          familyId={familyId}
          id={l.id}
          initial={l}
          driveCount={allDrives.filter((d) => driveLearnerId(d) === l.id).length}
          canRemove={learners.length > 1}
        />
      ))}
      {adding ? (
        <LearnerForm familyId={familyId} id={null} onDone={() => setAdding(false)} />
      ) : (
        <button className={secondaryBtn} onClick={() => setAdding(true)} disabled={learners.length >= 6}>
          Add another learner
        </button>
      )}
    </section>
  );
}

function LearnerForm({
  familyId,
  id,
  initial,
  driveCount = 0,
  canRemove = false,
  onDone,
}: {
  familyId: string;
  /** null = adding a new learner */
  id: string | null;
  initial?: Learner;
  driveCount?: number;
  canRemove?: boolean;
  onDone?: () => void;
}) {
  const { showToast } = useToast();
  const [name, setName] = useState(initial?.name ?? "");
  const [dob, setDob] = useState(initial?.dob ?? "");
  const [permitDate, setPermitDate] = useState(initial?.permitDate ?? new Date().toLocaleDateString("en-CA"));
  const onError = (e: Error) => showToast(writeErrorMessage(e), "error");
  const dirty = !initial || name !== initial.name || dob !== initial.dob || permitDate !== initial.permitDate;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    saveLearner(familyId, id ?? newId(), { name: name.trim(), dob, permitDate }, onError);
    showToast(id ? "Saved" : "Learner added", "success");
    onDone?.();
  };

  return (
    <form onSubmit={save} className="space-y-3 border-t border-gray-100 pt-3 first-of-type:border-0 first-of-type:pt-0 dark:border-gray-800">
      <div>
        <label className={label}>Full legal name</label>
        <input className={input} required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Date of birth</label>
          <input type="date" className={input} required value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div>
          <label className={label}>License issued</label>
          <input type="date" className={input} required value={permitDate} onChange={(e) => setPermitDate(e.target.value)} />
        </div>
      </div>
      {id && <p className={muted}>{driveCount === 1 ? "1 drive" : `${driveCount} drives`} logged</p>}
      <div className="flex gap-2">
        {dirty && <button className={secondaryBtn}>{id ? "Save" : "Add learner"}</button>}
        {!id && (
          <button type="button" className={secondaryBtn} onClick={onDone}>
            Cancel
          </button>
        )}
        {id && canRemove && driveCount === 0 && (
          <button
            type="button"
            className="shrink-0 px-3 text-sm text-red-600"
            onClick={() => removeLearner(familyId, id, onError)}
          >
            Remove
          </button>
        )}
      </div>
    </form>
  );
}

function Vehicles({ familyId }: { familyId: string }) {
  const { vehicles } = useFamily();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const onError = (e: Error) => showToast(writeErrorMessage(e), "error");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveVehicle(familyId, newId(), { name: name.trim() }, onError);
    setName("");
  };

  return (
    <section className={`${card} space-y-3`}>
      <h2 className="font-semibold">Vehicles</h2>
      {vehicles.length === 0 ? (
        <p className={muted}>Add the cars you practice in, then pick one when starting a drive.</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {vehicles.map((v) => (
            <li key={v.id} className="flex items-center justify-between py-2">
              <span className="font-medium">{v.name}</span>
              {/* Past drives keep the vehicle's name, so removing one doesn't change the log */}
              <ConfirmRemove label={`Remove ${v.name}`} onConfirm={() => removeVehicle(familyId, v.id, onError)} />
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={add} className="flex gap-2">
        <input
          aria-label="Vehicle name"
          className={input}
          placeholder="e.g. 2014 Outback"
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="shrink-0 rounded-xl bg-emerald-700 px-4 font-semibold text-white disabled:opacity-50" disabled={!name.trim()}>
          Add
        </button>
      </form>
    </section>
  );
}

/** Two taps, like Delete drive: a stray tap on a row shouldn't drop a person or a car. */
function ConfirmRemove({ label, onConfirm }: { label: string; onConfirm: () => void }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      aria-label={armed ? `Confirm: ${label}` : label}
      className={`-my-2 shrink-0 px-3 py-3 text-sm text-red-600 ${armed ? "font-semibold" : ""}`}
      onClick={() => (armed ? onConfirm() : setArmed(true))}
    >
      {armed ? "Tap again" : "Remove"}
    </button>
  );
}

/**
 * The owner can't leave, so these are the ways out: hand the log to the other parent, or delete
 * it outright (including a second log started by mistake instead of joining).
 */
function OwnerControls({ family, myUid }: { family: Family; myUid: string }) {
  const { showToast } = useToast();
  const router = useRouter();
  const others = family.memberUids.filter((uid) => uid !== myUid && family.members[uid]?.role === "supervisor");
  const [to, setTo] = useState(others[0] ?? "");
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  // The list is live: someone approved after this page opened appears in it, while `to` may still
  // be "" from the first render. Fall back to what the picker is actually showing.
  const target = others.includes(to) ? to : others[0];

  const transfer = () => {
    if (!target) return;
    transferOwnership(family.id, target)
      .then(() => showToast(`${family.members[target]?.name ?? "They"} now owns the log`, "success"))
      .catch((e) => showToast(writeErrorMessage(e, "Couldn't hand over the log. Are you online?"), "error"));
    setConfirmTransfer(false);
  };

  const del = async () => {
    setDeleting(true);
    try {
      await deleteLog(family);
      showToast("Log deleted", "info");
      router.replace("/setup");
    } catch (e) {
      setDeleting(false);
      showToast(writeErrorMessage(e, "Couldn't delete — you need a connection for this."), "error");
    }
  };

  return (
    <details className={`${card} group space-y-4`}>
      <summary className="cursor-pointer list-none font-semibold">
        Hand over or delete this log <span className="text-gray-500 group-open:hidden">›</span>
      </summary>
      <div className="space-y-2">
        <p className={muted}>You own this log, so you approve people and can delete it. You can hand that to another supervising adult; you stay on as a supervisor.</p>
        {others.length === 0 ? (
          <p className={muted}>Add another supervising adult first.</p>
        ) : (
          <div className="flex gap-2">
            <select aria-label="New owner" className={input} value={target} onChange={(e) => { setTo(e.target.value); setConfirmTransfer(false); }}>
              {others.map((uid) => (
                <option key={uid} value={uid}>
                  {family.members[uid].name}
                </option>
              ))}
            </select>
            <button
              className={`shrink-0 rounded-xl border px-4 text-sm font-medium ${confirmTransfer ? "border-red-600 text-red-600" : "border-gray-300 dark:border-gray-700"}`}
              onClick={() => (confirmTransfer ? transfer() : setConfirmTransfer(true))}
            >
              {confirmTransfer ? "Confirm" : "Hand over"}
            </button>
          </div>
        )}
      </div>
      <div className="space-y-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <p className="text-sm">
          <strong>Delete this log</strong> for everyone: every drive, the learners, vehicles and the invite code. This can&apos;t be undone.
          Print or save the log first if you might need it.
        </p>
        <label className={label} htmlFor="confirmDelete">Type DELETE to confirm</label>
        <input id="confirmDelete" className={input} autoComplete="off" value={typed} onChange={(e) => setTyped(e.target.value)} />
        <button
          className={`${secondaryBtn} border-red-600 text-red-600`}
          disabled={typed.trim().toUpperCase() !== "DELETE" || deleting}
          onClick={del}
        >
          {deleting ? "Deleting…" : "Delete this log permanently"}
        </button>
      </div>
    </details>
  );
}
