import { useEffect, useMemo, useRef } from "react";
import { formatCountdown, parseHHMM } from "../../lib/time";
import type { ScheduleLetter, CycleDay } from "../../lib/schedule";
import { daySlots, type DaySlot } from "../../lib/timers";
import { useScheduleStore, type PeriodEntry } from "../../store/useScheduleStore";
import type { BellTables } from "../../store/useBellStore";

type Props = {
  now: Date;
  letter: ScheduleLetter;
  cycleDay: CycleDay | null;
  bellTables: BellTables;
};

type Row = DaySlot & { entry?: PeriodEntry };

function fmt(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function rowLabel(row: Row) {
  if (row.slotLabel === "HR") return "Homeroom";
  return row.entry?.className?.trim() || `Period ${row.slotLabel}`;
}

export function PeriodGrid({ now, letter, cycleDay, bellTables }: Props) {
  const userSchedule = useScheduleStore((s) => s.schedule);
  const homeroomRoom = useScheduleStore((s) => s.homeroomRoom);
  const activeRef = useRef<HTMLLIElement>(null);

  const rows: Row[] = useMemo(
    () =>
      daySlots(now, letter, bellTables).map((slot) => ({
        ...slot,
        entry:
          cycleDay && slot.periodNum !== null
            ? userSchedule[cycleDay].find((p) => p.period === slot.periodNum)
            : undefined,
      })),
    [now, letter, bellTables, userSchedule, cycleDay],
  );

  const active = rows.find((p) => p.state.status === "active");
  const next = rows.find((p) => p.state.status === "upcoming");
  const focusKey = active?.slotLabel ?? next?.slotLabel ?? "none";

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [focusKey]);

  return (
    <ul className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5">
      {rows.map((row) => {
        const isOver = row.state.status === "over";
        const isNext = !active && next?.slotLabel === row.slotLabel;
        const room = row.slotLabel === "HR" ? homeroomRoom : row.entry?.room;
        const name = rowLabel(row);

        if (row.state.status === "active") {
          const endsIn = row.state.endsIn;
          const total = parseHHMM(row.end, now).getTime() - parseHHMM(row.start, now).getTime();
          const pct = total > 0 ? Math.max(0, Math.min(100, ((total - endsIn) / total) * 100)) : 0;

          return (
            <li
              key={row.slotLabel}
              ref={activeRef}
              className="neu-raised rounded-[22px] ring-2 ring-accent/60 px-4 py-4 sm:px-5"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-accent uppercase tracking-[0.14em]">
                  <span className="live-dot w-1.5 h-1.5 rounded-full bg-accent" />
                  Now · {row.slotLabel === "HR" ? "Homeroom" : `Period ${row.slotLabel}`}
                </span>
                <span className="text-[11px] font-semibold text-dim tabular">
                  {fmt(row.start)} – {fmt(row.end)}
                </span>
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold text-text leading-tight truncate">{name}</p>
                  {room ? <p className="text-sm text-dim mt-0.5 truncate">{room}</p> : null}
                </div>
                <p className="countdown text-3xl sm:text-4xl font-bold text-accent leading-none shrink-0">
                  {formatCountdown(endsIn)}
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden mt-3 bg-border">
                <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        }

        return (
          <li
            key={row.slotLabel}
            ref={isNext ? activeRef : undefined}
            className={`rounded-[22px] px-4 py-3 sm:px-5 flex items-center gap-3 ${
              isNext ? "neu-raised ring-1 ring-accent/40" : isOver ? "bg-surface-2" : "neu-raised-sm"
            }`}
          >
            <span
              className={`w-9 shrink-0 text-center text-sm font-bold tabular ${
                isOver ? "text-dim-2" : isNext ? "text-accent" : "text-dim"
              }`}
            >
              {row.slotLabel}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold leading-tight truncate ${isOver ? "text-dim" : "text-text"}`}>
                {name}
              </p>
              <p className="text-[11px] text-dim mt-0.5 truncate">
                {fmt(row.start)} – {fmt(row.end)}
                {room ? ` · ${room}` : ""}
                {isNext ? " · Up next" : ""}
              </p>
            </div>
            <span className={`shrink-0 text-xs font-semibold tabular ${isOver ? "text-dim-2" : "text-dim"}`}>
              {isOver
                ? "Done"
                : formatCountdown(row.state.status === "upcoming" ? row.state.startsIn : 0)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
