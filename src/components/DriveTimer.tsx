"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useNow } from "@/hooks/useNow";
import { useFamily } from "@/components/FamilyProvider";
import { useToast } from "@/components/ui/Toast";
import { addDrive, patchDrive, removeDrive, updateFamily } from "@/lib/firebase/firestore";
import { getLocation, driveCoords } from "@/utils/location";
import { splitDayNight } from "@/utils/night";
import { defaultSupervisor, supervisorsOf } from "@/utils/members";
import { defaultVehicleId } from "@/utils/learners";
import { nowMs } from "@/utils/time";
import { writeErrorMessage } from "@/utils/errors";
import { card, input, primaryBtn, secondaryBtn, muted } from "@/components/ui/styles";

const MAX_DRIVE_MS = 16 * 60 * 60 * 1000;

function clock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function DriveTimer() {
  const { user } = useAuth();
  const { family, learner, drives, vehicles, activeDrive, isSupervisor } = useFamily();
  const { showToast } = useToast();
  const router = useRouter();
  const now = useNow(1000, activeDrive !== null);
  const [starting, setStarting] = useState(false);
  const [pickedSupervisor, setPickedSupervisor] = useState<string | null>(null);
  // undefined = not touched, use the default; "" = no vehicle
  const [pickedVehicle, setPickedVehicle] = useState<string | undefined>(undefined);
  // Discard sits under Stop, so it takes a second tap within a few seconds.
  const [discardArmed, setDiscardArmed] = useState(false);
  useEffect(() => {
    if (!discardArmed) return;
    const t = setTimeout(() => setDiscardArmed(false), 4000);
    return () => clearTimeout(t);
  }, [discardArmed]);

  if (!family || !user || !learner) return null;
  const vehicleId = pickedVehicle !== undefined ? pickedVehicle || null : defaultVehicleId(drives, vehicles);
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? null;
  const supervisors = supervisorsOf(family);
  const supervisor =
    supervisors.find((s) => s.uid === pickedSupervisor) ?? defaultSupervisor(family, user.uid);
  const onError = (e: Error) => showToast(writeErrorMessage(e), "error");

  const start = async () => {
    if (!supervisor) {
      showToast("Add a supervising adult on the Family tab first", "error");
      return;
    }
    setStarting(true);
    const startedAt = nowMs();
    // Don't hold up the start waiting on GPS; fill the location in when it arrives.
    const id = addDrive(
      family.id,
      {
        learnerId: learner.id,
        vehicleId: vehicle?.id ?? null,
        vehicleName: vehicle?.name ?? null,
        startedAt,
        endedAt: null,
        dayMinutes: 0,
        nightMinutes: 0,
        supervisorUid: supervisor.uid,
        supervisorName: supervisor.name,
        supervisorInitials: supervisor.initials,
        conditions: [],
        skills: [],
        notes: "",
        lat: null,
        lng: null,
        manual: false,
        createdBy: user.uid,
        updatedAt: startedAt,
      },
      onError
    );
    setStarting(false);
    const loc = await getLocation();
    if (loc) {
      patchDrive(family.id, id, { lat: loc.lat, lng: loc.lng });
      updateFamily(family.id, { lastLat: loc.lat, lastLng: loc.lng }).catch(() => {});
    }
  };

  const stop = () => {
    if (!activeDrive) return;
    const endedAt = nowMs();
    if (endedAt - activeDrive.startedAt > MAX_DRIVE_MS) {
      // Forgot to stop it. Let them enter the real end time instead of logging 20 hours.
      router.push(`/drives/edit?id=${activeDrive.id}&forgot=1`);
      return;
    }
    const { lat, lng } = driveCoords(activeDrive, family);
    const split = splitDayNight(activeDrive.startedAt, endedAt, lat, lng);
    if (split.dayMinutes + split.nightMinutes === 0) {
      // Under a minute: almost certainly a mis-tap, and a 0m row is just clutter on the printed log.
      removeDrive(family.id, activeDrive.id, onError);
      showToast("Under a minute, so it wasn't logged", "info");
      return;
    }
    patchDrive(family.id, activeDrive.id, { endedAt, ...split }, onError);
    if (isSupervisor || activeDrive.createdBy === user.uid) {
      router.push(`/drives/edit?id=${activeDrive.id}&finished=1`);
    } else {
      // Started on a parent's phone: it's theirs to tag
      showToast(`Drive stopped — ${split.dayMinutes + split.nightMinutes} min logged`, "success");
    }
  };

  const discard = () => {
    if (!activeDrive) return;
    if (!discardArmed) {
      setDiscardArmed(true);
      return;
    }
    setDiscardArmed(false);
    removeDrive(family.id, activeDrive.id, onError);
    showToast("Drive discarded", "info");
  };

  if (activeDrive) {
    const elapsed = now - activeDrive.startedAt;
    return (
      <section className={`${card} text-center`}>
        <p className={muted}>
          Driving with {activeDrive.supervisorName}
          {activeDrive.vehicleName && <> · {activeDrive.vehicleName}</>}
        </p>
        <p className="my-3 font-mono text-5xl font-bold tabular-nums" aria-live="off">
          {clock(elapsed)}
        </p>
        <p className={`${muted} mb-4`}>
          Started {new Date(activeDrive.startedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </p>
        <button onClick={stop} className="w-full rounded-xl bg-red-600 px-4 py-4 text-lg font-semibold text-white active:bg-red-700">
          Stop drive
        </button>
        {(isSupervisor || activeDrive.createdBy === user.uid) && (
          <button
            onClick={discard}
            className={`mt-6 rounded-lg px-3 py-2 text-sm ${discardArmed ? "bg-red-50 font-semibold text-red-700 dark:bg-red-950 dark:text-red-300" : "text-gray-500 underline"}`}
          >
            {discardArmed ? "Tap again to discard this drive" : "Discard — started by mistake"}
          </button>
        )}
      </section>
    );
  }

  return (
    <section className={card}>
      {supervisors.length > 1 && (
        <label className="mb-3 block">
          <span className={`${muted} mb-1 block`}>Supervising</span>
          <select
            className={input}
            value={supervisor?.uid ?? ""}
            onChange={(e) => setPickedSupervisor(e.target.value)}
          >
            {supervisors.map((s) => (
              <option key={s.uid} value={s.uid}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      )}
      {vehicles.length > 0 && (
        <label className="mb-3 block">
          <span className={`${muted} mb-1 block`}>Vehicle</span>
          <select className={input} value={vehicleId ?? ""} onChange={(e) => setPickedVehicle(e.target.value)}>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
            <option value="">No vehicle</option>
          </select>
        </label>
      )}
      <button onClick={start} disabled={starting} className={`${primaryBtn} py-4 text-lg`}>
        Start drive
      </button>
      {isSupervisor && (
        <button onClick={() => router.push("/drives/edit")} className={`${secondaryBtn} mt-3`}>
          Add a past drive
        </button>
      )}
    </section>
  );
}
