"use client";

import { useState } from "react";
import { useFamily } from "@/components/FamilyProvider";
import { distinctLabels, supervisorsOf, type Supervisor } from "@/utils/members";
import { INSTRUCTOR_UID, instructorsFor } from "@/utils/instructors";
import { initialsOf } from "@/utils/progress";
import { input, label as labelCls, muted } from "@/components/ui/styles";
import type { Family } from "@/types";

const NEW_INSTRUCTOR = "instructor:new";
const instructorValue = (name: string) => `instructor:${name.trim().toLowerCase()}`;

/**
 * "Who's supervising": a supervising adult in the family, or a driving instructor, who isn't in
 * the log and doesn't need the app. Instructors a parent saved on the Family tab, and any from
 * earlier drives, are listed by name, so a lesson is one tap; a new one is typed in. Returns the choice (null until a new instructor
 * has a name) and the field to render.
 */
export function useSupervisorPicker({
  family,
  initial,
  fieldLabel,
  disabled = false,
}: {
  family: Family;
  initial: Supervisor | null;
  fieldLabel: string;
  disabled?: boolean;
}): { choice: Supervisor | null; element: React.ReactNode } {
  const { allDrives } = useFamily();
  const members = supervisorsOf(family);
  // The same names the printed log uses: initials, or first names when two adults share them
  const printedAs = distinctLabels(members);
  const instructors = instructorsFor(family, allDrives);
  // A drive being edited keeps its instructor in the list, whatever else is there
  if (initial?.uid === INSTRUCTOR_UID && !instructors.some((i) => instructorValue(i.name) === instructorValue(initial.name))) {
    instructors.unshift({ name: initial.name, initials: initial.initials });
  }
  const [value, setValue] = useState(!initial ? "" : initial.uid === INSTRUCTOR_UID ? instructorValue(initial.name) : initial.uid);
  const [newName, setNewName] = useState("");
  // null = follow the name's initials until someone types their own
  const [newInitials, setNewInitials] = useState<string | null>(null);

  const typedInitials = (newInitials ?? initialsOf(newName)).replace(/[^\p{L}]/gu, "").toUpperCase().slice(0, 4);
  const known = instructors.find((i) => instructorValue(i.name) === value);
  const choice: Supervisor | null =
    value === NEW_INSTRUCTOR
      ? newName.trim() && typedInitials
        ? { uid: INSTRUCTOR_UID, name: newName.trim().slice(0, 80), initials: typedInitials }
        : null
      : known
      ? { uid: INSTRUCTOR_UID, name: known.name, initials: known.initials }
      : members.find((m) => m.uid === value) ?? null;

  const element = (
    <div>
      <label className={labelCls} htmlFor="sup">
        {fieldLabel}
      </label>
      <select id="sup" disabled={disabled} className={input} value={value} onChange={(e) => setValue(e.target.value)}>
        {!value && <option value="">Pick who&apos;s supervising</option>}
        {members.map((s) => (
          <option key={s.uid} value={s.uid}>
            {s.name}
            {printedAs.get(s.uid) === s.initials ? ` (${s.initials})` : ""}
          </option>
        ))}
        <optgroup label="Driving instructor">
          {instructors.map((i) => (
            <option key={instructorValue(i.name)} value={instructorValue(i.name)}>
              {i.name} ({i.initials})
            </option>
          ))}
          <option value={NEW_INSTRUCTOR}>{instructors.length ? "Another driving instructor…" : "A driving instructor…"}</option>
        </optgroup>
      </select>
      {value === NEW_INSTRUCTOR && (
        <div className="mt-2 grid grid-cols-[1fr_5rem] gap-2">
          <input
            aria-label="Instructor's name"
            className={input}
            placeholder="Instructor's name"
            maxLength={80}
            autoFocus
            disabled={disabled}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            aria-label="Instructor's initials"
            className={`${input} uppercase`}
            placeholder="Init."
            maxLength={4}
            disabled={disabled}
            value={newInitials ?? initialsOf(newName)}
            onChange={(e) => setNewInitials(e.target.value)}
          />
        </div>
      )}
      {(value === NEW_INSTRUCTOR || known) && (
        <p className={`${muted} mt-1`}>The instructor doesn&apos;t need the app. A parent or guardian confirms the drive afterward.</p>
      )}
    </div>
  );
  return { choice, element };
}
