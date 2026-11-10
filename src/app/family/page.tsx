"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useFamily } from "@/components/FamilyProvider";
import { useToast } from "@/components/ui/Toast";
import {
  removeLearner,
  removeMember,
  removeVehicle,
  rotateInviteCode,
  saveLearner,
  saveVehicle,
  updateFamily,
} from "@/lib/firebase/firestore";
import { driveLearnerId, firstName, learnersOf, newId } from "@/utils/learners";
import { signOut } from "@/lib/firebase/auth";
import { initialsOf } from "@/utils/progress";
import type { Family, Learner } from "@/types";
import { card, input, label, muted, primaryBtn, secondaryBtn } from "@/components/ui/styles";

export default function FamilyPage() {
  return (
    <AppShell title="Family" switcher={false}>
      <FamilySettings />
    </AppShell>
  );
}

function FamilySettings() {
  const { family } = useFamily();
  const { user } = useAuth();
  const router = useRouter();
  if (!family || !user) return null;
  return (
    <div className="space-y-4">
      <Invite family={family} isOwner={family.ownerUid === user.uid} />
      <Members family={family} myUid={user.uid} />
      <Learners familyId={family.id} />
      <Vehicles familyId={family.id} />
      <button
        className={secondaryBtn}
        onClick={async () => {
          await signOut();
          router.replace("/login");
        }}
      >
        Sign out
      </button>
      <p className={`${muted} text-center`}>Not affiliated with the State of Montana, MVD, or OPI.</p>
    </div>
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
      <p className={muted}>The other parent, another licensed adult you authorize, or your teen can join with this code.</p>
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
              .catch(() => showToast("Couldn't change the code", "error"))
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
      .catch(() => showToast("Couldn't save", "error"));
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
                <button
                  className="text-sm text-red-600"
                  onClick={() => removeMember(family, uid).catch(() => showToast("Couldn't remove", "error"))}
                >
                  Remove
                </button>
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
          <button className={`${secondaryBtn} col-span-2`}>Save my details</button>
        </form>
      )}
    </section>
  );
}

function Learners({ familyId }: { familyId: string }) {
  const { learners, allDrives } = useFamily();
  const [adding, setAdding] = useState(false);
  return (
    <section className={`${card} space-y-3`}>
      <h2 className="font-semibold">Learners</h2>
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
  const onError = () => showToast("Couldn't save — check your connection", "error");
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
  const onError = () => showToast("Couldn't save — check your connection", "error");

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
              <button className="text-sm text-red-600" onClick={() => removeVehicle(familyId, v.id, onError)}>
                Remove
              </button>
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
        <button className="shrink-0 rounded-xl bg-emerald-600 px-4 font-semibold text-white disabled:opacity-50" disabled={!name.trim()}>
          Add
        </button>
      </form>
    </section>
  );
}
