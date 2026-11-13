import { card, muted } from "@/components/ui/styles";

/**
 * A picture of the app for the landing page, drawn with the app's own styles rather than a
 * screenshot, so it stays crisp, follows light/dark mode, and can't go stale against the real UI.
 * Sample data only.
 */
export function PhonePreview() {
  return (
    <div
      aria-label="The Drivetron app on a phone: a drive in progress, with 31 of 50 hours logged"
      role="img"
      className="mx-auto w-full max-w-[19rem] rounded-[2.5rem] border-[10px] border-gray-900 bg-gray-50 p-3 shadow-xl dark:border-gray-700 dark:bg-gray-950"
    >
      <div aria-hidden className="space-y-3 text-left">
        <p className="flex items-center gap-2 px-1 pt-1 text-lg font-bold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon.svg" alt="" className="h-6 w-6" />
          Sam&apos;s driving log
        </p>

        <div className={`${card} text-center`}>
          <p className={muted}>Driving with Dad · 2014 Outback</p>
          <p className="my-2 font-mono text-4xl font-bold tabular-nums">0:42:17</p>
          <div className="rounded-xl bg-red-600 py-3 font-semibold text-white">Stop drive</div>
        </div>

        <div className={`${card} space-y-3`}>
          <Meter label="Total" value="31h 20m" of="50h" pct={63} color="bg-emerald-700 dark:bg-emerald-600" />
          <Meter label="Night" value="6h 05m" of="10h" pct={61} color="bg-indigo-500" />
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className={muted}>Still to drive</dt>
              <dd className="font-medium">18h 40m</dd>
            </div>
            <div>
              <dt className={muted}>Pace</dt>
              <dd className="font-medium">2h 50m / week</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function Meter({ label, value, of, pct, color }: { label: string; value: string; of: string; pct: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className="tabular-nums">
          {value} <span className="text-gray-500 dark:text-gray-400">/ {of}</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
