import { useEffect, useMemo } from "react";
import type { ScheduleLetter } from "../lib/schedule";
import { getSchedule, computePeriodState } from "../lib/timers";
import { formatCountdown } from "../lib/time";
import type { CycleDay } from "../lib/schedule";
import { useScheduleStore } from "../store/useScheduleStore";

export function useDocumentTitle(now: Date, letter: ScheduleLetter, cycleDay: CycleDay | null, noSchool: boolean) {
  const userSchedule = useScheduleStore((s) => s.schedule);

  const title = useMemo(() => {
    if (noSchool) return "No School · School Timer";

    const table = getSchedule(letter);
    const periods = table.start.map((s, i) => {
      const slotLabel = table.periodLabels[i];
      const periodNum = slotLabel === "HR" ? null : Number(slotLabel);
      const entry = (cycleDay && periodNum !== null)
        ? userSchedule[cycleDay].find((p) => p.period === periodNum)
        : undefined;
      const name = slotLabel === "HR" ? "Homeroom" : (entry?.className?.trim() || `Period ${slotLabel}`);
      return { slotLabel, name, state: computePeriodState(now, s, table.end[i]) };
    });

    const active = periods.find((p) => p.state.status === "active");
    if (active) {
      const endsIn = (active.state as { endsIn: number }).endsIn;
      return `${formatCountdown(endsIn)} · ${active.name}`;
    }

    const next = periods.find((p) => p.state.status === "upcoming");
    if (next) {
      const startsIn = (next.state as { startsIn: number }).startsIn;
      return `${formatCountdown(startsIn)} · Up Next: ${next.name}`;
    }

    return "School Is Over · School Timer";
  }, [now, letter, cycleDay, noSchool, userSchedule]);

  useEffect(() => {
    document.title = title;
    return () => { document.title = "School Timer"; };
  }, [title]);
}
