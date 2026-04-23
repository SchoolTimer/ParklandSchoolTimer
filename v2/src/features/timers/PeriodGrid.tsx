import { useMemo } from "react";
import { PeriodCard } from "./PeriodCard";
import type { ScheduleLetter, CycleDay } from "../../lib/schedule";
import { getSchedule, computePeriodState } from "../../lib/timers";
import { useScheduleStore } from "../../store/useScheduleStore";
import { useBellTables } from "../../store/useBellStore";

type Props = {
  now: Date;
  letter: ScheduleLetter;
  cycleDay: CycleDay | null;
};

export function PeriodGrid({ now, letter, cycleDay }: Props) {
  const bellTables = useBellTables();
  const table = getSchedule(letter, bellTables);
  const userSchedule = useScheduleStore((s) => s.schedule);

  const periods = useMemo(
    () =>
      table.start.map((s, i) => ({
        period: i + 1,
        state: computePeriodState(now, s, table.end[i]),
        entry: cycleDay
          ? userSchedule[cycleDay].find((p) => p.period === i + 1)
          : undefined,
      })),
    [now, table, userSchedule, cycleDay],
  );

  return (
    <div className="grid gap-3 p-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-rows-fr content-start">
      {periods.map((p) => (
        <PeriodCard key={p.period} period={p.period} state={p.state} entry={p.entry} />
      ))}
    </div>
  );
}
