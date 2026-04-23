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
  const lunchPeriod     = useScheduleStore((s) => s.lunchPeriod);
  const setLunchPeriod  = useScheduleStore((s) => s.setLunchPeriod);

  const [activeDay, setActiveDay] = useState<CycleDay>(1);
  const [copyFrom, setCopyFrom]   = useState<CycleDay>(2);
  const [saved, setSaved]         = useState(false);

  const entries = schedule[activeDay];

  function handleSave() {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  }

  return (
    <Modal open={open} onClose={onClose} title="My Schedule" widthClass="max-w-xl">
      <div className="flex flex-col" style={{ height: "min(580px, 72vh)" }}>

        {/* ── Top controls ── */}
        <div className="shrink-0 mb-4 space-y-3">
          {/* Homeroom */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-dim w-20 shrink-0">Homeroom</span>
            <input
              type="text"
              value={homeroomRoom}
              placeholder="e.g. Rm 105"
              onChange={(e) => setHomeroomRoom(e.target.value)}
              className="w-28 bg-surface border border-border rounded-lg px-3 h-8 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <span className="text-xs text-dim-2">B schedule only</span>
          </div>

          {/* Lunch period */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-dim w-20 shrink-0">Lunch</span>
            <select
              value={lunchPeriod ?? ""}
              onChange={(e) => setLunchPeriod(e.target.value ? Number(e.target.value) : null)}
              className="w-28 bg-surface border border-border rounded-lg px-3 h-8 text-sm focus:outline-none focus:border-accent transition-colors"
            >
              <option value="">None</option>
              {[4, 5, 6, 7].map((p) => (
                <option key={p} value={p}>Period {p}</option>
              ))}
            </select>
            <span className="text-xs text-dim-2">Which period is your lunch?</span>
          </div>

          {/* Day tabs */}
          <div className="flex gap-1">
            {CYCLE_DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`flex-1 h-8 rounded-lg text-xs font-bold transition-colors duration-100 ${
                  activeDay === d
                    ? "bg-accent text-white"
                    : "text-dim hover:text-text hover:bg-surface"
                }`}
              >
                Day {d}
              </button>
            ))}
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[32px_1fr_120px] gap-2 px-1 text-[10px] uppercase tracking-widest text-dim font-semibold">
            <div className="text-center">#</div>
            <div>Class Name</div>
            <div>Room</div>
          </div>
        </div>

        {/* ── Period rows ── */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-1 pr-0.5">
          {entries.map((p) => (
            <div key={p.period} className="grid grid-cols-[32px_1fr_120px] gap-2 items-center">
              <div className="text-center text-xs font-bold text-dim">{p.period}</div>
              <input
                type="text"
                value={p.className}
                placeholder="e.g. AP Calculus"
                onChange={(e) => setPeriod(activeDay, p.period, { className: e.target.value })}
                className="bg-surface border border-border rounded-lg px-3 h-8 text-sm focus:outline-none focus:border-accent transition-colors w-full"
              />
              <input
                type="text"
                value={p.room}
                placeholder="Rm 201"
                onChange={(e) => setPeriod(activeDay, p.period, { room: e.target.value })}
                className="bg-surface border border-border rounded-lg px-3 h-8 text-sm focus:outline-none focus:border-accent transition-colors w-full"
              />
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 flex items-center gap-2 pt-3 mt-3 border-t border-border">
          <span className="text-xs text-dim shrink-0">Copy from</span>
          <select
            value={copyFrom}
            onChange={(e) => setCopyFrom(Number(e.target.value) as CycleDay)}
            className="bg-surface border border-border rounded-lg px-2 h-7 text-xs"
          >
            {CYCLE_DAYS.filter((d) => d !== activeDay).map((d) => (
              <option key={d} value={d}>Day {d}</option>
            ))}
          </select>
          <button
            onClick={() => copyDay(copyFrom, activeDay)}
            className="px-3 h-7 rounded-lg border border-border text-xs text-dim hover:text-text hover:border-border-2 transition-colors"
          >
            Copy to Day {activeDay}
          </button>
          <button
            onClick={() => { if (confirm(`Clear Day ${activeDay}?`)) resetDay(activeDay); }}
            className="px-3 h-7 rounded-lg border border-border text-xs text-danger hover:border-danger transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            className={`ml-auto px-5 h-7 rounded-lg text-xs font-bold transition-all duration-200 ${
              saved ? "bg-green-500 text-white" : "bg-accent text-white hover:opacity-90"
            }`}
          >
            {saved ? "Saved ✓" : "Done"}
          </button>
        </div>

      </div>
    </Modal>
  );
}
