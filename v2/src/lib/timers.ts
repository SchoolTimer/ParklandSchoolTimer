import { BELL_TABLES, type ScheduleLetter } from "./schedule";
import { parseHHMM } from "./time";

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

export function getSchedule(letter: ScheduleLetter) {
  return BELL_TABLES[letter];
}
