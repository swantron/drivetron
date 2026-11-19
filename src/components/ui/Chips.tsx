"use client";

export function Chips({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(o)}
            className={`min-h-11 rounded-full border px-3.5 py-2 text-sm transition-colors ${
              on
                ? "border-emerald-700 bg-emerald-700 text-white"
                : // View-only: fade what wasn't picked so the picked ones read at a glance
                  "border-gray-300 bg-white text-gray-700 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
