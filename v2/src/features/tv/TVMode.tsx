import { useMemo } from "react";
import { useClock } from "../../hooks/useClock";
import { useDayCycle } from "../../hooks/useDayCycle";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useScheduleStore } from "../../store/useScheduleStore";
import { useApplyTheme } from "../../store/useThemeStore";
import { useClickSound } from "../../hooks/useClickSound";
import { getSchedule, computePeriodState } from "../../lib/timers";
import { formatCountdown, parseHHMM } from "../../lib/time";
import type { ScheduleLetter } from "../../lib/schedule";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function fmt(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function TVMode() {
  useApplyTheme();
  useClickSound();

  const now          = useClock(1000);
  const { today, noSchool } = useDayCycle();
  const getEffectiveOverride = useSettingsStore((s) => s.getEffectiveOverride);
  const effectiveLetter: ScheduleLetter = getEffectiveOverride() ?? today?.letter ?? "A";
  const userSchedule = useScheduleStore((s) => s.schedule);
  const homeroomRoom = useScheduleStore((s) => s.homeroomRoom);

  const h    = now.getHours();
  const m    = String(now.getMinutes()).padStart(2, "0");
  const s    = String(now.getSeconds()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;

  const table = getSchedule(effectiveLetter);

  const periods = useMemo(() =>
    table.start.map((st, i) => {
      const slotLabel = table.periodLabels[i];
      const periodNum = slotLabel === "HR" ? null : Number(slotLabel);
      const entry = (today?.cycleDay && periodNum !== null)
        ? userSchedule[today.cycleDay].find((p) => p.period === periodNum)
        : undefined;
      const name = slotLabel === "HR" ? "Homeroom" : (entry?.className?.trim() || `Period ${slotLabel}`);
      const rawRoom = slotLabel === "HR" ? homeroomRoom : (entry?.room?.trim() ?? "");
      const isDefaultLabel = /^Period \d+$/.test(rawRoom) || rawRoom === "Homeroom";
      const room = (rawRoom === name || isDefaultLabel) ? "" : rawRoom;
      return { slotLabel, name, room, start: st, end: table.end[i], state: computePeriodState(now, st, table.end[i]) };
    }),
  [now, table, today, userSchedule, homeroomRoom]);

  const active   = periods.find((p) => p.state.status === "active");
  const next     = periods.find((p) => p.state.status === "upcoming");
  const allOver  = periods.every((p) => p.state.status === "over");

  return (
    <div data-tv className="h-screen w-screen bg-bg flex flex-col overflow-hidden">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-16 pt-10">
        <p className="text-[15px] font-bold text-dim uppercase tracking-[0.25em]">Parkland HS</p>
        <p className="text-[15px] font-bold tabular text-dim">
          {h12}:{m}<span className="text-dim-2 ml-1">:{s}</span>
          <span className="text-dim-2 ml-2 text-sm">{ampm}</span>
        </p>
        <p className="text-[15px] font-bold text-dim uppercase tracking-[0.25em]">
          {DAYS[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}
        </p>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col justify-center px-20 pb-12 gap-10">

        {noSchool || allOver ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <p className="text-2xl font-bold text-dim uppercase tracking-[0.2em] mb-6">
              {noSchool ? "No School Today" : "School Day Complete"}
            </p>
            <h1 className="text-[12rem] font-black text-text leading-none">
              {noSchool ? "—" : "Done"}
            </h1>
          </div>
        ) : active ? (
          <>
            {/* ── Row 1: class name + cycle day ── */}
            <div className="flex items-end gap-8">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <span className="live-dot w-3 h-3 rounded-full bg-accent shrink-0" />
                  <span className="text-lg font-bold text-accent uppercase tracking-[0.2em]">Now</span>
                </div>
                <h1 className="text-[5.5rem] font-black text-text leading-none">
                  {active.name}
                </h1>
                {active.room && (
                  <p className="text-2xl text-dim mt-3">{active.room}</p>
                )}
              </div>

              {today && !noSchool && (
                <div className="shrink-0 flex flex-col items-center px-8 py-5 rounded-2xl bg-surface border border-border">
                  <p className="text-[11px] font-bold text-dim uppercase tracking-[0.2em] mb-2">Cycle Day</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[6rem] font-black text-accent tabular leading-none">{today.cycleDay}</p>
                    <p className="text-3xl font-black text-dim leading-none">{today.letter}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Row 2: countdown + progress ── */}
            <div>
              <p className="text-[11px] font-bold text-dim uppercase tracking-[0.2em] mb-3">Ends in</p>
              <p className="text-[9rem] font-black tabular text-accent leading-none mb-5">
                {formatCountdown((active.state as { endsIn: number }).endsIn)}
              </p>
              {(() => {
                const endsIn = (active.state as { endsIn: number }).endsIn;
                const totalMs = parseHHMM(active.end, now).getTime() - parseHHMM(active.start, now).getTime();
                const pct = Math.max(0, Math.min(100, ((totalMs - endsIn) / totalMs) * 100));
                return (
                  <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-linear" style={{ width: `${pct}%` }} />
                  </div>
                );
              })()}
            </div>

            {/* ── Row 3: up next ── */}
            {next && (
              <div className="flex items-center gap-6 px-8 py-5 rounded-2xl bg-surface border border-border self-start">
                <div>
                  <p className="text-xs font-bold text-dim uppercase tracking-widest mb-1">Up Next</p>
                  <p className="text-2xl font-bold text-text">{next.name}</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-xs font-bold text-dim uppercase tracking-widest mb-1">Starts</p>
                  <p className="text-2xl font-bold text-text">{fmt(next.start)}</p>
                </div>
                {next.room && (
                  <>
                    <div className="w-px h-10 bg-border" />
                    <div>
                      <p className="text-xs font-bold text-dim uppercase tracking-widest mb-1">Room</p>
                      <p className="text-2xl font-bold text-text">{next.room}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        ) : next ? (
          <>
            <div className="flex items-end gap-8">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-dim uppercase tracking-[0.2em] mb-4">Up Next</p>
                <h1 className="text-[5.5rem] font-black text-text leading-none">
                  {next.name}
                </h1>
                {next.room && <p className="text-2xl text-dim mt-3">{next.room}</p>}
              </div>
              {today && !noSchool && (
                <div className="shrink-0 flex flex-col items-center px-8 py-5 rounded-2xl bg-surface border border-border">
                  <p className="text-[11px] font-bold text-dim uppercase tracking-[0.2em] mb-2">Cycle Day</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[6rem] font-black text-accent tabular leading-none">{today.cycleDay}</p>
                    <p className="text-3xl font-black text-dim leading-none">{today.letter}</p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="text-[11px] font-bold text-dim uppercase tracking-[0.2em] mb-3">Starts in</p>
              <p className="text-[9rem] font-black tabular text-dim-2 leading-none mb-3">
                {formatCountdown((next.state as { startsIn: number }).startsIn)}
              </p>
              <p className="text-xl text-dim">{fmt(next.start)} – {fmt(next.end)}</p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
