import type { ScheduleLetter } from "../../lib/schedule";

const LETTERS: ScheduleLetter[] = ["A", "B", "C", "D"];

const DESCRIPTIONS: Record<ScheduleLetter, string> = {
  A: "Regular",
  B: "2-Hr Delay",
  C: "Half Day",
  D: "Modified",
};

type Props = {
  active: ScheduleLetter;
  onChange: (letter: ScheduleLetter) => void;
};

export function ScheduleSelector({ active, onChange }: Props) {
  return (
    <div className="card rounded-2xl p-3">
      <div className="text-xs text-dim font-semibold mb-2">Schedule</div>
      <div className="grid grid-cols-4 gap-2">
        {LETTERS.map((l) => {
          const selected = l === active;
          return (
            <button
              key={l}
              onClick={() => onChange(l)}
              className={`flex flex-col items-center justify-center py-3 rounded-xl text-sm font-bold border transition-all duration-200 ${
                selected
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border bg-surface-2 text-dim hover:text-text hover:border-border-2"
              }`}
            >
              <span className="text-lg">{l}</span>
              <span className="text-[9px] mt-0.5 font-normal text-dim">
                {DESCRIPTIONS[l]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
