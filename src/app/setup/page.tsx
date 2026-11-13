"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { DEFAULT_STATE, STATES, getState } from "@/states";
import { useFamily } from "@/components/FamilyProvider";
import { useToast } from "@/components/ui/Toast";
import {
  createFamily,
  requestToJoin,
  InviteNotFoundError,
  pendingFamilyId,
  subscribeToMyJoinRequest,
  withdrawJoinRequest,
} from "@/lib/firebase/firestore";
import { formatMinutes, initialsOf } from "@/utils/progress";
import { card, input, label, primaryBtn, muted } from "@/components/ui/styles";

export default function SetupPage() {
  return (
    <ProtectedRoute>
      <Suspense>
        <Setup />
      </Suspense>
    </ProtectedRoute>
  );
}

function Setup() {
  const { family, loaded } = useFamily();
  const router = useRouter();
  const params = useSearchParams();
  // Invite links look like /setup?code=ABCD2345
  const codeParam = params.get("code") ?? "";
  const [mode, setMode] = useState<"create" | "join">(codeParam ? "join" : "create");
  const { user } = useAuth();
  // A join request waiting on the owner (remembered on this device)
  const [pendingId, setPendingId] = useState<string | null>(() => (typeof window === "undefined" ? null : pendingFamilyId()));

  useEffect(() => {
    if (loaded && family) router.replace("/home");
  }, [loaded, family, router]);

  const clearPending = useCallback(() => setPendingId(null), []);
  if (pendingId && user) {
    return <Waiting familyId={pendingId} uid={user.uid} onGone={clearPending} />;
  }

  return (
    <main className="mx-auto max-w-md space-y-5 px-4 py-[max(1.5rem,env(safe-area-inset-top))]">
      <h1 className="text-2xl font-bold">Set up the driving log</h1>
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-gray-200 p-1 dark:bg-gray-800">
        {(["create", "join"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg py-2 text-sm font-medium ${mode === m ? "bg-white shadow dark:bg-gray-950" : "text-gray-600 dark:text-gray-400"}`}
          >
            {m === "create" ? "Start a new log" : "Join with a code"}
          </button>
        ))}
      </div>
      {mode === "create" ? <CreateForm /> : <JoinForm initialCode={codeParam} onRequested={setPendingId} />}
    </main>
  );
}

function CreateForm() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [myName, setMyName] = useState(user?.displayName ?? "");
  const [learnerName, setLearnerName] = useState("");
  const [learnerDob, setLearnerDob] = useState("");
  const [permitDate, setPermitDate] = useState(() => new Date().toLocaleDateString("en-CA"));
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState(DEFAULT_STATE);
  const rules = getState(state);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      await createFamily(user, {
        learner: { name: learnerName.trim(), dob: learnerDob, permitDate },
        state,
        me: { name: myName.trim(), initials: initialsOf(myName) || "?", role: "supervisor" },
      });
    } catch (err) {
      console.error(err);
      showToast("Couldn't create the log. Are you online?", "error");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className={`${card} space-y-4`}>
      <p className={muted}>For the parent or guardian. You&apos;ll get a code to invite the other parent and your teen.</p>
      <div>
        <label className={label} htmlFor="state">State</label>
        <select id="state" className={input} value={state} onChange={(e) => setState(e.target.value)}>
          {STATES.map((st) => (
            <option key={st.code} value={st.code}>
              {st.name}
            </option>
          ))}
        </select>
        <p className={`${muted} mt-1`}>
          {formatMinutes(rules.totalMinutes)} supervised, {formatMinutes(rules.nightMinutes)} at night, over at least {rules.holdMonths} months.
          {STATES.length === 1 && " More states are on the way."}
        </p>
      </div>
      <div>
        <label className={label} htmlFor="me">Your name (supervising adult)</label>
        <input id="me" className={input} required maxLength={80} value={myName} onChange={(e) => setMyName(e.target.value)} />
      </div>
      <div>
        <label className={label} htmlFor="learner">Learner&apos;s full legal name</label>
        <input id="learner" className={input} required maxLength={80} value={learnerName} onChange={(e) => setLearnerName(e.target.value)} />
        <p className={`${muted} mt-1`}>As it will appear on {rules.certification.label}.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="dob">Date of birth</label>
          <input id="dob" type="date" className={input} required value={learnerDob} onChange={(e) => setLearnerDob(e.target.value)} />
        </div>
        <div>
          <label className={`${label} first-letter:uppercase`} htmlFor="permit">{rules.permitName} issued</label>
          <input id="permit" type="date" className={input} required value={permitDate} onChange={(e) => setPermitDate(e.target.value)} />
        </div>
      </div>
      <button className={primaryBtn} disabled={busy}>
        {busy ? "Creating…" : "Create log"}
      </button>
    </form>
  );
}

function Waiting({ familyId, uid, onGone }: { familyId: string; uid: string; onGone: () => void }) {
  const { showToast } = useToast();
  // Approval adds this account to the family, and the family listener takes over from there.
  // If the request disappears without that (declined or withdrawn), drop back to the form.
  useEffect(
    () =>
      subscribeToMyJoinRequest(familyId, uid, (exists) => {
        if (!exists) onGone();
      }),
    [familyId, uid, onGone]
  );

  return (
    <main className="mx-auto max-w-md space-y-5 px-4 py-[max(1.5rem,env(safe-area-inset-top))]">
      <h1 className="text-2xl font-bold">Waiting for approval</h1>
      <section className={`${card} space-y-3`}>
        <p>Your request to join was sent. The parent who set up the log approves it from their Family tab.</p>
        <p className={muted}>This screen updates on its own once you&apos;re approved.</p>
        <button
          className="w-full text-sm text-gray-500 underline"
          onClick={() =>
            withdrawJoinRequest(familyId, uid)
              .then(onGone)
              .catch(() => showToast("Couldn't cancel. Are you online?", "error"))
          }
        >
          Cancel request
        </button>
      </section>
    </main>
  );
}

function JoinForm({ initialCode, onRequested }: { initialCode: string; onRequested: (familyId: string) => void }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [code, setCode] = useState(initialCode);
  const [myName, setMyName] = useState(user?.displayName ?? "");
  const [role, setRole] = useState<"supervisor" | "learner">("supervisor");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      onRequested(await requestToJoin(user, code, { name: myName.trim(), initials: initialsOf(myName) || "?", role }));
    } catch (err) {
      console.error(err);
      showToast(err instanceof InviteNotFoundError ? "That code doesn't match a log" : "Couldn't join. Check the code and try again.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className={`${card} space-y-4`}>
      <div>
        <label className={label} htmlFor="code">Invite code</label>
        <input
          id="code"
          className={`${input} font-mono uppercase tracking-widest`}
          required
          autoCapitalize="characters"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <div>
        <label className={label} htmlFor="jname">Your name</label>
        <input id="jname" className={input} required maxLength={80} value={myName} onChange={(e) => setMyName(e.target.value)} />
      </div>
      <fieldset>
        <legend className={label}>I am</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["supervisor", "learner"] as const).map((r) => (
            <label key={r} className={`rounded-lg border p-3 text-center text-sm ${role === r ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950" : "border-gray-300 dark:border-gray-700"}`}>
              <input type="radio" name="role" className="sr-only" checked={role === r} onChange={() => setRole(r)} />
              {r === "supervisor" ? "A supervising adult" : "The learner driver"}
            </label>
          ))}
        </div>
      </fieldset>
      <button className={primaryBtn} disabled={busy}>
        {busy ? "Sending…" : "Ask to join"}
      </button>
    </form>
  );
}
