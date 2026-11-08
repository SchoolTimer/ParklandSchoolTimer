import { useEffect, useRef, useState } from "react";
import { Modal } from "../../components/Modal";
import { CYCLE_DAYS, type CycleDay } from "../../lib/schedule";
import { useScheduleStore } from "../../store/useScheduleStore";

type Props = { open: boolean; onClose: () => void; highlightLunch?: boolean };

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
    <Modal open={open} onClose={onClose} title="My Schedule" size="wide">
      <div className="pp-section">
        <p className="pp-label">Cycle day</p>
        <div className="pp-days" role="tablist" aria-label="Cycle day">
          {CYCLE_DAYS.map((d) => {
            const on = activeDay === d;
            return (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={on}
                className={`pp-day${on ? " on" : ""}`}
                onClick={() => chooseDay(d)}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pp-section pp-settings">
        <label className="pp-field">
          <span>Homeroom room</span>
          <input
            type="text"
            className="pp-input"
            value={homeroomRoom}
            placeholder="Room"
            title="Shown on homeroom (B) days"
            onChange={(e) => setHomeroomRoom(e.target.value)}
          />
        </label>
        <label className={`pp-field${highlightLunch ? " lunch-blink" : ""}`} style={highlightLunch ? { padding: 8, margin: -8 } : undefined}>
          <span>Lunch period</span>
          <select
            ref={lunchRef}
            className="pp-input"
            value={lunchPeriod ?? ""}
            title="Used for the lunch countdown"
            onChange={(e) => setLunchPeriod(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">None</option>
            {[4, 5, 6, 7].map((p) => (
              <option key={p} value={p}>Period {p}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="pp-section">
        <p className="pp-label">Day {activeDay} classes <span className="pp-saved">· saves as you type</span></p>
        <ul className="pp-periods">
          {entries.map((p) => (
            <li key={p.period} className="pp-card sm pp-period">
              <span className="pp-period-n">{p.period}</span>
              <input
                type="text"
                className="pp-input"
                value={p.className}
                placeholder="Class"
                aria-label={`Period ${p.period} class`}
                onChange={(e) => { setCopied(false); setPeriod(activeDay, p.period, { className: e.target.value }); }}
              />
              <input
                type="text"
                className="pp-input"
                value={p.room}
                placeholder="Room"
                aria-label={`Period ${p.period} room`}
                onChange={(e) => setPeriod(activeDay, p.period, { room: e.target.value })}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="pp-actions">
        <div className="pp-copy">
          <span>Copy day {activeDay} onto</span>
          <select
            className="pp-input"
            value={targetDay}
            onChange={(e) => { setCopyTo(Number(e.target.value) as CycleDay); setCopied(false); }}
            aria-label={`Day to copy day ${activeDay} onto`}
          >
            {otherDays.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button type="button" className="pp-btn" onClick={() => { copyDay(activeDay, targetDay); setCopied(true); }}>
            {copied ? `Copied to ${targetDay}` : "Copy"}
          </button>
        </div>
        <button
          type="button"
          className="pp-btn danger"
          onClick={() => { if (confirm(`Clear day ${activeDay}?`)) resetDay(activeDay); }}
        >
          Clear day
        </button>
        <span className="spacer" />
        <button type="button" className="pp-btn solid" onClick={onClose}>Done</button>
      </div>
    </Modal>
  );
}
