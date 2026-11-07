import { BELL_TABLES, type BellTable, type ScheduleLetter } from "./schedule";
import { parseHHMM } from "./time";
import type { BellTables } from "../store/useBellStore";

export type TimerState =
  | { status: "upcoming"; startsIn: number; endsIn: number }
  | { status: "active"; startsIn: 0; endsIn: number }
  | { status: "over" };

export function computePeriodState(
  now: Date,
  startHHMM: string,
  endHHMM: string,
): TimerState {
  const start = parseHHMM(startHHMM, now).getTime();
  const end = parseHHMM(endHHMM, now).getTime();
  const t = now.getTime();
  if (t >= end) return { status: "over" };
  if (t >= start) return { status: "active", startsIn: 0, endsIn: end - t };
  return { status: "upcoming", startsIn: start - t, endsIn: end - t };
}

export function getSchedule(letter: ScheduleLetter, tables?: BellTables): BellTable {
  return (tables ?? BELL_TABLES)[letter];
}

export type DaySlot = {
  slotLabel: string;
  periodNum: number | null;
  start: string;
  end: string;
  state: TimerState;
};

export function daySlots(now: Date, letter: ScheduleLetter, tables?: BellTables): DaySlot[] {
  const table = getSchedule(letter, tables);
  return table.start.map((start, i) => {
    const slotLabel = table.periodLabels[i];
    return {
      slotLabel,
      periodNum: slotLabel === "HR" ? null : Number(slotLabel),
      start,
      end: table.end[i],
      state: computePeriodState(now, start, table.end[i]),
    };
  });
}
