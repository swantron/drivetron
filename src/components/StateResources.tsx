"use client";

import { useFamily } from "@/components/FamilyProvider";
import { card, muted } from "@/components/ui/styles";
import { sourceLinks, upperFirst } from "@/states";

/**
 * The family's state's official forms and pages: the certification form first, then everything the
 * rules were sourced from. Official links only, so it's safe inside the Play app too.
 */
export function StateResources() {
  const { rules } = useFamily();
  const links = sourceLinks(rules);
  return (
    <section className={`${card} space-y-2 print:hidden`}>
      <h2 className="font-semibold">{rules.name} rules and forms</h2>
      <p className={muted}>
        Who can supervise: {rules.supervisor}. Checked against these on {rules.verified}; confirm with the state before your
        teen applies.
      </p>
      <ul className="space-y-1.5 text-sm">
        <li>
          <a className="font-medium text-emerald-700 underline dark:text-emerald-400" href={rules.certification.url} target="_blank" rel="noreferrer">
            {upperFirst(rules.certification.label)}
          </a>
        </li>
        {links
          .filter((l) => l.url !== rules.certification.url)
          .map((l) => (
            <li key={l.url}>
              <a className="text-emerald-700 underline dark:text-emerald-400" href={l.url} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            </li>
          ))}
      </ul>
    </section>
  );
}
