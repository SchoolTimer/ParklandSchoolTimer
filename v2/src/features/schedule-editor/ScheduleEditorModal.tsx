import { useEffect, useRef, useState } from "react";
import { Modal } from "../../components/Modal";
import { CYCLE_DAYS, type CycleDay } from "../../lib/schedule";
import { useScheduleStore } from "../../store/useScheduleStore";

type Props = { open: boolean; onClose: () => void; highlightLunch?: boolean };

const inputClass =
  "w-full min-w-0 rounded-xl px-3 h-10 text-sm";

export function ScheduleEditorModal({ open, onClose, highlightLunch = false }: Props) {
  const schedule        = useScheduleStore((s) => s.schedule);
  const setPeriod       = useScheduleStore((s) => s.setPeriod);
  const copyDay         = useScheduleStore((s) => s.copyDay);
  const resetDay        = useScheduleStore((s) => s.resetDay);
  const homeroomRoom    = useScheduleStore((s) => s.homeroomRoom);
  const setHomeroomRoom = useScheduleStore((s) => s.setHomeroomRoom);
  const lunchPeriod     = useScheduleStore((s) => s.lunchPeriod);
  const setLunchPeriod  = useScheduleStore((s) => s.setLunchPeriod);

  const [activeDay, setActiveDay] = useState<CycleDay>(1);
  const [copyTo, setCopyTo]       = useState<CycleDay>(2);
  const [copied, setCopied]       = useState(false);
  const lunchRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (open && highlightLunch) lunchRef.current?.focus();
  }, [open, highlightLunch]);

  const entries = schedule[activeDay];
  const otherDays = CYCLE_DAYS.filter((d) => d !== activeDay);
  const targetDay = otherDays.includes(copyTo) ? copyTo : otherDays[0];

  function chooseDay(day: CycleDay) {
    setActiveDay(day);
    setCopied(false);
    if (copyTo === day) {
      setCopyTo(CYCLE_DAYS.find((d) => d !== day) ?? 1);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="My Schedule" widthClass="max-w-5xl">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Cycle day">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-dim mr-1">Day</span>
          {CYCLE_DAYS.map((d) => {
            const on = activeDay === d;
            return (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={on}
                data-selected={on || undefined}
                onClick={() => chooseDay(d)}
                className={`w-10 h-10 rounded-xl text-sm font-bold ${on ? "bg-accent" : "neu-raised-sm text-dim"}`}
              >
                {d}
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-text shrink-0">Homeroom</span>
          <input
            type="text"
            value={homeroomRoom}
            placeholder="Room"
            title="Shown on homeroom (B) days"
            onChange={(e) => setHomeroomRoom(e.target.value)}
            className={`${inputClass} w-28`}
          />
        </label>

        <label className={`flex items-center gap-2 min-w-0 rounded-lg ${highlightLunch ? "lunch-blink px-2 py-1" : ""}`}>
          <span className={`text-xs font-semibold shrink-0 ${highlightLunch ? "text-accent" : "text-text"}`}>Lunch</span>
          <select
            ref={lunchRef}
            value={lunchPeriod ?? ""}
            title="Used for the lunch countdown"
            onChange={(e) => setLunchPeriod(e.target.value ? Number(e.target.value) : null)}
            className={`${inputClass} w-36 ${highlightLunch ? "ring-2 ring-accent" : ""}`}
          >
            <option value="">None</option>
            {[4, 5, 6, 7].map((p) => (
              <option key={p} value={p}>Period {p}</option>
            ))}
          </select>
        </label>

        <p className="text-[11px] text-dim ml-auto">Saves as you type</p>
      </div>

      <ul className="grid grid-cols-2 min-[900px]:grid-cols-3 gap-x-4 gap-y-1.5">
        {entries.map((p) => (
          <li key={p.period} className="grid grid-cols-[1.25rem_1fr_4.5rem] gap-1.5 items-center">
            <span className="text-xs font-bold text-dim text-center tabular">{p.period}</span>
            <input
              type="text"
              value={p.className}
              placeholder="Class"
              aria-label={`Period ${p.period} class`}
              onChange={(e) => { setCopied(false); setPeriod(activeDay, p.period, { className: e.target.value }); }}
              className={inputClass}
            />
            <input
              type="text"
              value={p.room}
              placeholder="Room"
              aria-label={`Period ${p.period} room`}
              onChange={(e) => setPeriod(activeDay, p.period, { room: e.target.value })}
              className={inputClass}
            />
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-dim">Copy day {activeDay} onto</span>
        <select
          value={targetDay}
          onChange={(e) => { setCopyTo(Number(e.target.value) as CycleDay); setCopied(false); }}
          className="rounded-xl px-2 h-10 text-sm"
          aria-label={`Day to copy day ${activeDay} onto`}
        >
          {otherDays.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => { copyDay(activeDay, targetDay); setCopied(true); }}
          className="h-10 px-4 rounded-xl neu-raised-sm text-sm font-semibold text-text"
        >
          {copied ? `Copied onto ${targetDay}` : "Copy"}
        </button>
        <button
          type="button"
          onClick={() => { if (confirm(`Clear day ${activeDay}?`)) resetDay(activeDay); }}
          className="h-9 px-3 rounded-lg text-sm font-semibold text-danger"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onClose}
          data-selected
          className="ml-auto h-10 px-6 rounded-xl bg-accent text-sm font-semibold"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
