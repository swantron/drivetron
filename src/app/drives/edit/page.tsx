"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useFamily } from "@/components/FamilyProvider";
import { useToast } from "@/components/ui/Toast";
import { Chips, toggle } from "@/components/ui/Chips";
import { addDrive, removeDrive, saveDrive, saveVehicle } from "@/lib/firebase/firestore";
import { defaultVehicleId, driveLearnerId, newId, PRIMARY_LEARNER } from "@/utils/learners";
import { splitDayNight } from "@/utils/night";
import { driveCoords } from "@/utils/location";
import { defaultSupervisor, supervisorsOf } from "@/utils/members";
import { formatMinutes } from "@/utils/progress";
import { CONDITIONS, SKILLS } from "@/utils/montana";
import type { Drive, Family } from "@/types";
import { nowMs } from "@/utils/time";
import { card, input, label, muted, primaryBtn, secondaryBtn } from "@/components/ui/styles";

const MAX_MINUTES = 16 * 60;
const NEW_VEHICLE = "__new";

export default function EditDrivePage() {
  return (
    <AppShell>
      <Suspense>
        <EditDrive />
      </Suspense>
    </AppShell>
  );
}

function EditDrive() {
  const params = useSearchParams();
  const id = params.get("id");
  const { family, allDrives, drivesLoaded, learner, isSupervisor } = useFamily();
  if (!family || !learner) return null;
  if (id && !drivesLoaded) return <p className="py-10 text-center text-gray-500">Loading…</p>;
  const drive = id ? allDrives.find((d) => d.id === id) : undefined;
  if (id && !drive) return <p className="py-10 text-center text-gray-500">That drive was deleted.</p>;
  if (!drive && !isSupervisor) {
    return (
      <p className="py-10 text-center text-gray-500">
        Past drives are added by a supervising adult. Use Start drive on the Home tab to time a drive.
      </p>
    );
  }
  return (
    <DriveForm
      key={drive?.id ?? "new"}
      family={family}
      drive={drive}
      finished={params.get("finished") === "1"}
      forgot={params.get("forgot") === "1"}
    />
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
const toDateInput = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const toTimeInput = (ms: number) => {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
function combine(date: string, time: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  return new Date(y, m - 1, d, h, min).getTime();
}

function DriveForm({ family, drive, finished, forgot }: { family: Family; drive?: Drive; finished: boolean; forgot: boolean }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const supervisors = supervisorsOf(family);
  const { learners, learner: selectedLearner, vehicles, drives: learnerDrives, isSupervisor } = useFamily();
  // Mirrors firestore.rules: learners edit only their own drives, and only tags once it's finished.
  const ownDrive = !drive || drive.createdBy === user?.uid;
  const canEdit = isSupervisor || ownDrive;
  const canEditTimes = isSupervisor || (ownDrive && drive?.endedAt == null);
  const canDelete = isSupervisor || (ownDrive && drive?.endedAt == null);

  const initialStart = drive?.startedAt ?? nowMs() - 60 * 60 * 1000;
  const [date, setDate] = useState(toDateInput(initialStart));
  const [startTime, setStartTime] = useState(toTimeInput(initialStart));
  // A forgotten timer has no real end; make them type it rather than guessing.
  const [endTime, setEndTime] = useState(drive?.endedAt ? toTimeInput(drive.endedAt) : forgot ? "" : toTimeInput(nowMs()));
  const [supervisorUid, setSupervisorUid] = useState(drive?.supervisorUid ?? defaultSupervisor(family, user!.uid)?.uid ?? "");
  const [conditions, setConditions] = useState<string[]>(drive?.conditions ?? []);
  const [skills, setSkills] = useState<string[]>(drive?.skills ?? []);
  const [notes, setNotes] = useState(drive?.notes ?? "");
  const [learnerId, setLearnerId] = useState(drive ? driveLearnerId(drive) : selectedLearner?.id ?? PRIMARY_LEARNER);
  // "" = no vehicle, NEW_VEHICLE = typing a new one
  const [vehicleId, setVehicleId] = useState<string>(
    drive ? drive.vehicleId ?? "" : defaultVehicleId(learnerDrives, vehicles) ?? ""
  );
  const [newVehicleName, setNewVehicleName] = useState("");
  // Night is worked out from the times; a supervisor can override it if they know better.
  const [nightOverride, setNightOverride] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [initialInputs] = useState(() => ({ date, startTime, endTime }));
  const range = useMemo(() => {
    if (!date || !startTime || !endTime) return null;
    // Untouched timed drive: keep the exact timestamps instead of rounding to the minute.
    if (
      drive?.endedAt &&
      date === initialInputs.date &&
      startTime === initialInputs.startTime &&
      endTime === initialInputs.endTime
    ) {
      return { start: drive.startedAt, end: drive.endedAt };
    }
    const start = combine(date, startTime);
    let end = combine(date, endTime);
    if (end < start) end += 24 * 60 * 60 * 1000; // crossed midnight
    return { start, end };
  }, [date, startTime, endTime, drive, initialInputs]);

  const coords = driveCoords(drive ?? { lat: null, lng: null }, family);
  const untouched =
    !!drive?.endedAt && range?.start === drive.startedAt && range?.end === drive.endedAt;
  // An untouched finished drive keeps the split it was saved with; recomputing could shift a
  // minute (e.g. the GPS fix arrived after it stopped) and wrongly mark it as edited.
  const computed = !range
    ? null
    : untouched
    ? { dayMinutes: drive!.dayMinutes, nightMinutes: drive!.nightMinutes }
    : splitDayNight(range.start, range.end, coords.lat, coords.lng);
  const total = computed ? computed.dayMinutes + computed.nightMinutes : 0;
  const nightMinutes =
    nightOverride !== null && nightOverride !== "" ? Math.max(0, Math.min(total, Math.round(Number(nightOverride)))) : computed?.nightMinutes ?? 0;

  const toggleTag = (list: "c" | "s") => (v: string) =>
    list === "c" ? setConditions((x) => toggle(x, v)) : setSkills((x) => toggle(x, v));

  const onError = () => showToast("Couldn't save — check your connection", "error");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!range || !user) return;
    if (total <= 0) return showToast("End time must be after the start", "error");
    if (total > MAX_MINUTES) return showToast("That's over 16 hours — split it into separate drives", "error");
    if (range.end > nowMs() + 5 * 60 * 1000) return showToast("That drive ends in the future", "error");
    const sup = supervisors.find((s) => s.uid === supervisorUid);
    if (!sup) return showToast("Pick who supervised", "error");

    let vehicle: { id: string; name: string } | null = null;
    if (vehicleId === NEW_VEHICLE) {
      const name = newVehicleName.trim();
      if (!name) return showToast("Name the new vehicle, or pick one", "error");
      vehicle = { id: newId(), name };
      saveVehicle(family.id, vehicle.id, { name }, onError);
    } else if (vehicleId) {
      // A vehicle removed from the garage keeps its name on the drives that used it
      vehicle = vehicles.find((v) => v.id === vehicleId) ?? (drive?.vehicleId === vehicleId ? { id: vehicleId, name: drive.vehicleName ?? "" } : null);
    }

    const data = {
      learnerId,
      vehicleId: vehicle?.id ?? null,
      vehicleName: vehicle?.name ?? null,
      startedAt: range.start,
      endedAt: range.end,
      dayMinutes: total - nightMinutes,
      nightMinutes,
      supervisorUid: sup.uid,
      supervisorName: sup.name,
      supervisorInitials: sup.initials,
      conditions,
      skills,
      notes: notes.trim(),
      lat: drive?.lat ?? null,
      lng: drive?.lng ?? null,
      manual: drive ? drive.manual : true,
      createdBy: drive?.createdBy ?? user.uid,
      updatedAt: nowMs(),
      // Permanent mark on the printed log when a finished drive's times were changed
      timesEdited:
        !!drive?.timesEdited ||
        (!!drive?.endedAt &&
          (range.start !== drive.startedAt ||
            range.end !== drive.endedAt ||
            total - nightMinutes !== drive.dayMinutes ||
            nightMinutes !== drive.nightMinutes)),
    };
    if (drive) saveDrive(family.id, drive.id, data, onError);
    else addDrive(family.id, data, onError);
    showToast(drive ? "Drive saved" : "Drive added", "success");
    router.push(finished ? "/" : "/drives");
  };

  const del = () => {
    if (!drive) return;
    removeDrive(family.id, drive.id, onError);
    showToast("Drive deleted", "info");
    router.push("/drives");
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <fieldset disabled={!canEdit} className="contents">
      <h1 className="text-2xl font-bold">
        {finished ? `Nice — ${formatMinutes(total)} logged` : forgot ? "When did the drive end?" : drive ? "Edit drive" : "Add a past drive"}
      </h1>
      {finished && <p className={muted}>Tag what you practiced. It helps spot what still needs work.</p>}
      {forgot && <p className="text-amber-700 dark:text-amber-400">The timer ran over 16 hours. Enter the real end time.</p>}
      {!canEdit && <p className="rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-900">Logged by a supervisor, so it&apos;s view-only for you.</p>}
      {canEdit && !canEditTimes && (
        <p className={muted}>Times on a finished drive can only be changed by a supervising adult. You can still add tags and notes.</p>
      )}
      {drive?.timesEdited && <p className="text-sm text-amber-700 dark:text-amber-400">Times on this drive were edited after it was logged. The printed log marks it.</p>}

      <section className={`${card} space-y-3`}>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-3">
            <label className={label} htmlFor="date">Date</label>
            <input disabled={!canEditTimes} id="date" type="date" className={input} required value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="col-span-3 grid grid-cols-2 gap-2">
            <div>
              <label className={label} htmlFor="start">Start</label>
              <input disabled={!canEditTimes} id="start" type="time" className={input} required value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="end">End</label>
              <input disabled={!canEditTimes} id="end" type="time" className={input} required value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
        </div>

        {computed && total > 0 && (
          <div className="flex items-end justify-between gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-950">
            <div className="text-sm">
              <p className="font-semibold">{formatMinutes(total)} total</p>
              <p className={muted}>
                ☀️ {formatMinutes(total - nightMinutes)} · 🌙 {formatMinutes(nightMinutes)}
              </p>
            </div>
            <label className="w-28 text-right text-xs text-gray-500">
              Night minutes
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={total}
                disabled={!canEditTimes}
                className={`${input} mt-1 py-1.5 text-right`}
                value={nightOverride ?? String(computed.nightMinutes)}
                onChange={(e) => setNightOverride(e.target.value)}
              />
            </label>
          </div>
        )}

        <div>
          <label className={label} htmlFor="sup">Supervised by</label>
          <select id="sup" className={input} value={supervisorUid} onChange={(e) => setSupervisorUid(e.target.value)}>
            {supervisors.map((s) => (
              <option key={s.uid} value={s.uid}>
                {s.name} ({s.initials})
              </option>
            ))}
          </select>
        </div>

        {learners.length > 1 && (
          <div>
            <label className={label} htmlFor="learner">Driver</label>
            <select id="learner" className={input} value={learnerId} onChange={(e) => setLearnerId(e.target.value)}>
              {learners.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className={label} htmlFor="vehicle">Vehicle</label>
          <select id="vehicle" className={input} value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
            {drive?.vehicleId && !vehicles.some((v) => v.id === drive.vehicleId) && (
              <option value={drive.vehicleId}>{drive.vehicleName} (removed)</option>
            )}
            <option value="">No vehicle</option>
            <option value={NEW_VEHICLE}>Add a vehicle…</option>
          </select>
          {vehicleId === NEW_VEHICLE && (
            <input
              aria-label="New vehicle name"
              className={`${input} mt-2`}
              placeholder="e.g. 2014 Outback"
              maxLength={80}
              autoFocus
              value={newVehicleName}
              onChange={(e) => setNewVehicleName(e.target.value)}
            />
          )}
        </div>
      </section>

      <section className={`${card} space-y-3`}>
        <h2 className="font-semibold">Conditions</h2>
        <Chips options={CONDITIONS.weather} selected={conditions} onToggle={toggleTag("c")} />
        <Chips options={CONDITIONS.road} selected={conditions} onToggle={toggleTag("c")} />
        <h2 className="pt-2 font-semibold">Skills</h2>
        <Chips options={SKILLS} selected={skills} onToggle={toggleTag("s")} />
        <div className="pt-2">
          <label className={label} htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={3}
            maxLength={2000}
            className={input}
            placeholder="What went well, what to work on next time"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </section>

      {canEdit && <button className={primaryBtn}>Save</button>}
      </fieldset>
      {drive && canDelete && (
        <button
          type="button"
          onClick={() => (confirmDelete ? del() : setConfirmDelete(true))}
          className={`${secondaryBtn} ${confirmDelete ? "border-red-600 text-red-600" : ""}`}
        >
          {confirmDelete ? "Tap again to delete" : "Delete drive"}
        </button>
      )}
    </form>
  );
}
