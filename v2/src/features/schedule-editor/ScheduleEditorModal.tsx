import { useState } from "react";
import { Modal } from "../../components/Modal";
import { CYCLE_DAYS, type CycleDay } from "../../lib/schedule";
import { useScheduleStore } from "../../store/useScheduleStore";

type Props = { open: boolean; onClose: () => void };

export function ScheduleEditorModal({ open, onClose }: Props) {
  const schedule        = useScheduleStore((s) => s.schedule);
  const setPeriod       = useScheduleStore((s) => s.setPeriod);
  const copyDay         = useScheduleStore((s) => s.copyDay);
  const resetDay        = useScheduleStore((s) => s.resetDay);
  const homeroomRoom    = useScheduleStore((s) => s.homeroomRoom);
  const setHomeroomRoom = useScheduleStore((s) => s.setHomeroomRoom);

  const [activeDay, setActiveDay] = useState<CycleDay>(1);
  const [copyFrom, setCopyFrom]   = useState<CycleDay>(1);
  const [saved, setSaved]         = useState(false);

  const entries = schedule[activeDay];

  function handleSave() {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Schedule" widthClass="max-w-2xl">

      {/* Homeroom — single compact row */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-[10px] font-bold text-accent uppercase tracking-[0.15em] w-24 shrink-0">
          Homeroom
        </span>
        <input
          type="text"
          value={homeroomRoom}
          placeholder="Rm 105"
          onChange={(e) => setHomeroomRoom(e.target.value)}
          className="w-28 bg-surface-2 border border-border rounded-lg px-2.5 h-7 text-xs"
        />
        <span className="text-[9px] text-dim shrink-0">B schedule only</span>
      </div>

      {/* Day tabs */}
      <div className="flex gap-1.5 mb-3">
        {CYCLE_DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`px-3 h-8 rounded-lg text-xs font-semibold border transition-all duration-150 ${
              activeDay === d
                ? "border-accent bg-accent-soft text-accent"
                : "border-border bg-surface-2 text-dim hover:text-text hover:border-border-2"
            }`}
          >
            Day {d}
          </button>
        ))}
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[28px_1fr_110px] gap-1.5 px-1 mb-1 text-[9px] uppercase tracking-widest text-dim font-bold">
        <div className="text-center">#</div>
        <div>Class</div>
        <div>Room / Location</div>
      </div>

      {/* Rows */}
      <div className="space-y-1 mb-3">
        {entries.map((p) => (
          <div key={p.period} className="grid grid-cols-[28px_1fr_110px] gap-1.5 items-center">
            <div className="text-center text-xs font-bold text-dim tabular">{p.period}</div>
            <input
              type="text"
              value={p.className}
              placeholder="e.g. AP Calc"
              onChange={(e) => setPeriod(activeDay, p.period, { className: e.target.value })}
              className="bg-surface-2 border border-border rounded-lg px-2.5 h-7 text-xs"
            />
            <input
              type="text"
              value={p.room}
              placeholder="Rm 201 or Cafeteria"
              onChange={(e) => setPeriod(activeDay, p.period, { room: e.target.value })}
              className="bg-surface-2 border border-border rounded-lg px-2.5 h-7 text-xs"
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <span className="text-xs text-dim font-semibold shrink-0">Copy</span>
        <select
          value={copyFrom}
          onChange={(e) => setCopyFrom(Number(e.target.value) as CycleDay)}
          className="bg-surface-2 border border-border rounded-lg px-2 h-7 text-xs"
        >
          {CYCLE_DAYS.filter((d) => d !== activeDay).map((d) => (
            <option key={d} value={d}>Day {d}</option>
          ))}
        </select>
        <button
          onClick={() => copyDay(copyFrom, activeDay)}
          className="px-3 h-7 rounded-lg border border-border bg-surface-2 text-xs font-semibold text-text hover:border-border-2 transition-all"
        >
          → Day {activeDay}
        </button>
        <button
          onClick={() => { if (confirm(`Clear all classes for Day ${activeDay}?`)) resetDay(activeDay); }}
          className="px-3 h-7 rounded-lg border border-border bg-surface-2 text-xs font-semibold text-danger hover:border-border-2 transition-all"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          className={`ml-auto px-5 h-7 rounded-lg text-xs font-bold transition-all duration-200 ${
            saved
              ? "bg-green-500 text-white"
              : "bg-accent text-white hover:opacity-90"
          }`}
        >
          {saved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </Modal>
  );
}
