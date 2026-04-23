import { useMemo } from "react";
import { formatCountdown, parseHHMM } from "../../lib/time";
import type { ScheduleLetter, CycleDay } from "../../lib/schedule";
import { getSchedule, computePeriodState } from "../../lib/timers";
import { useScheduleStore } from "../../store/useScheduleStore";
import type { BellTables } from "../../store/useBellStore";

type Props = {
  now: Date;
  letter: ScheduleLetter;
  cycleDay: CycleDay | null;
  bellTables: BellTables;
};

function fmt(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function HeroTimer({ now, letter, cycleDay, bellTables }: Props) {
  const table        = getSchedule(letter, bellTables);
  const userSchedule = useScheduleStore((s) => s.schedule);
  const homeroomRoom = useScheduleStore((s) => s.homeroomRoom);

  const periods = useMemo(
    () =>
      table.start.map((s, i) => {
        const slotLabel = table.periodLabels[i];
        const periodNum = slotLabel === "HR" ? null : Number(slotLabel);
        return {
          slotLabel,
          periodNum,
          start: s,
          end: table.end[i],
          state: computePeriodState(now, s, table.end[i]),
          entry: (cycleDay && periodNum !== null)
            ? userSchedule[cycleDay].find((p) => p.period === periodNum)
            : undefined,
        };
      }),
    [now, table, userSchedule, cycleDay],
  );

  const active   = periods.find((p) => p.state.status === "active");
  const next     = periods.find((p) => p.state.status === "upcoming");
  const allOver  = periods.every((p) => p.state.status === "over");
  const upcoming = periods.filter((p) => p.state.status === "upcoming");

  const label = (p: typeof periods[0]) => {
    if (p.slotLabel === "HR") return "Homeroom";
    return p.entry?.className?.trim() || `Period ${p.slotLabel}`;
  };

  /* ── SCHOOL OVER ─────────────────────────────────────────────────────── */
  if (allOver) {
    return (
      <div className="flex-1 flex flex-col justify-center px-10 pb-8">
        <p className="text-[11px] font-semibold text-dim uppercase tracking-[0.18em] mb-5">
          School Day
        </p>
        <h1 className="text-[5.5rem] font-bold text-text leading-[0.95] mb-1">School Is</h1>
        <h1 className="text-[5.5rem] font-bold text-dim-2 leading-[0.95] mb-10">Over</h1>
        <p className="text-base text-dim">See you tomorrow!</p>
      </div>
    );
  }

  /* ── ACTIVE PERIOD ───────────────────────────────────────────────────── */
  if (active) {
    const endsIn = (active.state as { endsIn: number }).endsIn;
    const totalMs =
      parseHHMM(active.end, now).getTime() - parseHHMM(active.start, now).getTime();
    const pct = Math.max(0, Math.min(100, ((totalMs - endsIn) / totalMs) * 100));

    return (
      <div className="flex-1 flex flex-col justify-center px-10 pb-8">
        {/* Live badge */}
        <div className="flex items-center gap-2.5 mb-8">
          <span className="live-dot w-2 h-2 rounded-full bg-accent shrink-0" />
          <span className="text-[11px] font-bold text-accent uppercase tracking-[0.18em]">
            Live · {active.slotLabel === "HR" ? "Homeroom" : `Period ${active.slotLabel}`}
          </span>
        </div>

        {/* Class name */}
        <h1 className="text-[4.5rem] font-bold text-text leading-none mb-1.5 max-w-2xl">
          {label(active)}
        </h1>

        <p className="text-base text-dim mb-8 h-6">
          {active.slotLabel === "HR"
            ? (homeroomRoom || "")
            : (active.entry?.room ?? "")}
        </p>

        <p className="text-[11px] font-semibold text-dim uppercase tracking-[0.18em] mb-2">
          Ends in
        </p>

        {/* Big countdown */}
        <p className="countdown text-[5.5rem] font-bold text-accent leading-none mb-7">
          {formatCountdown(endsIn)}
        </p>

        {/* Progress track */}
        <div className="h-1.5 w-full max-w-xl overflow-hidden mb-8 bg-border">
          <div
            className="h-full bg-accent transition-[width] duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Upcoming strip */}
        {upcoming.length > 0 && (
          <div className="flex gap-2.5 flex-wrap">
            {upcoming.map((p) => (
              <div key={p.slotLabel} className="card px-4 py-3 min-w-30">
                <p className="text-[10px] text-dim uppercase tracking-wider mb-1">
                  {p.slotLabel === "HR" ? "Homeroom" : `Period ${p.slotLabel}`}
                </p>
                <p className="text-sm font-semibold text-text leading-tight">{label(p)}</p>
                <p className="text-xs text-dim mt-0.5">
                  {fmt(p.start)}{p.entry?.room ? ` · ${p.entry.room}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── BETWEEN PERIODS / UP NEXT ────────────────────────────────────────── */
  if (!active && next) {
    const startsIn = (next.state as { startsIn: number }).startsIn;

    return (
      <div className="flex-1 flex flex-col justify-center px-10 pb-8">
        <p className="text-[11px] font-semibold text-dim uppercase tracking-[0.18em] mb-7">
          Up Next
        </p>

        <h1 className="text-[4.5rem] font-bold text-text leading-none mb-1.5 max-w-2xl">
          {label(next)}
        </h1>
        <p className="text-base text-dim mb-8">
          {fmt(next.start)} – {fmt(next.end)}
          {next.entry?.room ? <span className="ml-3">· {next.entry.room}</span> : null}
        </p>

        <p className="text-[11px] font-semibold text-dim uppercase tracking-[0.18em] mb-2">
          Starts in
        </p>
        <p className="countdown text-[5.5rem] font-bold text-dim-2 leading-none mb-10">
          {formatCountdown(startsIn)}
        </p>

        {/* Later periods strip */}
        {upcoming.length > 1 && (
          <div className="flex gap-2.5 flex-wrap">
            {upcoming.slice(1).map((p) => (
              <div
                key={p.slotLabel}
                className="card px-4 py-3 min-w-30"
              >
                <p className="text-[10px] text-dim uppercase tracking-wider mb-1">
                  {p.slotLabel === "HR" ? "Homeroom" : `Period ${p.slotLabel}`}
                </p>
                <p className="text-sm font-semibold text-text leading-tight">{label(p)}</p>
                <p className="text-xs text-dim mt-0.5">
                  {fmt(p.start)}{p.entry?.room ? ` · ${p.entry.room}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── BEFORE SCHOOL ───────────────────────────────────────────────────── */
  return (
    <div className="flex-1 flex flex-col justify-center px-10 pb-8">
      <p className="text-[11px] font-semibold text-dim uppercase tracking-[0.18em] mb-5">
        Good Morning
      </p>
      <h1 className="text-[5.5rem] font-bold text-text leading-[0.95] mb-10">
        School Starts
        <br />
        <span className="text-dim-2">Soon</span>
      </h1>
      {next && (
        <>
          <p className="text-[11px] font-semibold text-dim uppercase tracking-[0.18em] mb-2">
            First period in
          </p>
          <p className="countdown text-[4rem] font-bold text-dim-2 leading-none mb-5">
            {formatCountdown((next.state as { startsIn: number }).startsIn)}
          </p>
          <p className="text-base text-dim">
            {label(next)} · {fmt(next.start)}
          </p>
        </>
      )}
    </div>
  );
}
