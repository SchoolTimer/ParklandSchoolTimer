import type { ParsedCycle } from "../../lib/schedule";

export function DayTile({ today, noSchool }: { today: ParsedCycle | null; noSchool: boolean }) {
  return (
    <div className="card rounded-2xl p-4 flex flex-col gap-1">
      <div className="text-xs text-dim font-semibold">Cycle Day</div>
      {noSchool ? (
        <>
          <div className="text-3xl font-bold text-dim-2 tabular leading-none">—</div>
          <div className="text-xs text-dim">No school</div>
        </>
      ) : today ? (
        <div className="text-4xl font-bold text-accent tabular leading-none">
          {today.cycleDay}<span className="text-2xl text-dim-2">{today.letter}</span>
        </div>
      ) : (
        <div className="text-3xl font-bold text-dim-2 tabular leading-none">···</div>
      )}
    </div>
  );
}
