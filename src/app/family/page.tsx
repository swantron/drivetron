"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useFamily } from "@/components/FamilyProvider";
import { useToast } from "@/components/ui/Toast";
import { removeMember, rotateInviteCode, updateFamily } from "@/lib/firebase/firestore";
import { signOut } from "@/lib/firebase/auth";
import { initialsOf } from "@/utils/progress";
import type { Family } from "@/types";
import { card, input, label, muted, primaryBtn, secondaryBtn } from "@/components/ui/styles";

export default function FamilyPage() {
  return (
    <AppShell title="Family">
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
      <Learner key={`${family.learnerName}|${family.learnerDob}|${family.permitDate}`} family={family} />
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
    const text = `Join ${family.learnerName.split(" ")[0]}'s driving log on Drivetron. Code: ${family.inviteCode}`;
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

function Learner({ family }: { family: Family }) {
  const { showToast } = useToast();
  const [learnerName, setLearnerName] = useState(family.learnerName);
  const [learnerDob, setLearnerDob] = useState(family.learnerDob);
  const [permitDate, setPermitDate] = useState(family.permitDate);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateFamily(family.id, { learnerName: learnerName.trim(), learnerDob, permitDate })
      .then(() => showToast("Saved", "success"))
      .catch(() => showToast("Couldn't save", "error"));
  };

  return (
    <form onSubmit={save} className={`${card} space-y-3`}>
      <h2 className="font-semibold">Learner</h2>
      <div>
        <label className={label} htmlFor="lname">Full legal name</label>
        <input id="lname" className={input} required maxLength={80} value={learnerName} onChange={(e) => setLearnerName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="ldob">Date of birth</label>
          <input id="ldob" type="date" className={input} required value={learnerDob} onChange={(e) => setLearnerDob(e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="lpermit">License issued</label>
          <input id="lpermit" type="date" className={input} required value={permitDate} onChange={(e) => setPermitDate(e.target.value)} />
        </div>
      </div>
      <button className={secondaryBtn}>Save learner details</button>
    </form>
  );
}
