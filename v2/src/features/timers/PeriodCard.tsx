import { formatCountdown } from "../../lib/time";
import type { TimerState } from "../../lib/timers";
import type { PeriodEntry } from "../../store/useScheduleStore";

type Props = {
  period: number;
  state: TimerState;
  entry?: PeriodEntry;
};

export function PeriodCard({ period, state, entry }: Props) {
  const label  = entry?.className?.trim() || `Period ${period}`;
  const active = state.status === "active";
  const over   = state.status === "over";

  return (
    <div
      className={`card rounded-2xl flex flex-col p-4 transition-all duration-300 ${
        active ? "border-accent bg-accent-soft" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-dim uppercase tracking-wide">
          Period {period}
        </span>
        {active && (
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
            Live
          </span>
        )}
        {over && (
          <span className="text-[10px] text-dim-2 uppercase tracking-wider">Done</span>
        )}
      </div>

      <div className={`text-base font-bold leading-tight mb-1 ${over ? "text-dim" : "text-text"}`}>
        {label}
      </div>

      {entry?.room && (
        <div className="text-xs text-dim mb-2">{entry.room}</div>
      )}

      <div className="mt-auto pt-3">
        {over ? (
          <div className="text-xs text-dim-2">Completed</div>
        ) : (
          <>
            <div className="text-[10px] text-dim mb-1">
              {active ? "Ends in" : "Starts in"}
            </div>
            <div className={`text-3xl font-bold tabular leading-none ${active ? "text-accent" : "text-dim-2"}`}>
              {formatCountdown(active ? state.endsIn : (state as { startsIn: number }).startsIn)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
