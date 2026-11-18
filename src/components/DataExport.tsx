"use client";

import { useFamily } from "@/components/FamilyProvider";
import { useToast } from "@/components/ui/Toast";
import { drivesCsv, exportFileName, logJson } from "@/utils/export";
import { learnersOf } from "@/utils/learners";
import { nowMs } from "@/utils/time";
import { card, muted, secondaryBtn } from "@/components/ui/styles";

/** Saves text as a file on this device. */
function download(name: string, type: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Some browsers start the download after the click returns
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** The file name's label: the learner's name for one learner, otherwise "family". */
function label(names: string[]) {
  return names.length === 1 ? names[0].split(/\s+/)[0] : "family";
}

export function useExport() {
  const { family, allDrives, drivesLoaded } = useFamily();
  const { showToast } = useToast();
  if (!family) return null;
  const names = learnersOf(family).map((l) => l.name);
  const ready = () => {
    if (drivesLoaded) return true;
    showToast("Still loading the drives. Try again in a moment.", "info");
    return false;
  };
  return {
    csv: () => {
      if (!ready()) return;
      download(exportFileName(label(names), "csv", nowMs()), "text/csv;charset=utf-8", drivesCsv(family, allDrives));
    },
    json: () => {
      if (!ready()) return;
      download(exportFileName(label(names), "json", nowMs()), "application/json", logJson(family, allDrives, nowMs()));
    },
  };
}

/** Family tab: download everything in the log. */
export function DataExport() {
  const exp = useExport();
  if (!exp) return null;
  return (
    <section className={`${card} space-y-3`}>
      <div>
        <h2 className="font-semibold">Your data</h2>
        <p className={muted}>
          Download the log to keep your own copy or move it elsewhere. Every learner&apos;s drives are included.
        </p>
      </div>
      <button className={secondaryBtn} onClick={exp.csv}>
        Download drives (spreadsheet)
      </button>
      <button className={secondaryBtn} onClick={exp.json}>
        Download everything (JSON)
      </button>
    </section>
  );
}
