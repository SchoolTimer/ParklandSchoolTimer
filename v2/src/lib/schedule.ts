export type ScheduleLetter = "A" | "B" | "C" | "D";
export type CycleDay = 1 | 2 | 3 | 4 | 5 | 6;

export type BellTable = {
  start: string[];
  end: string[];
  periodLabels: string[];   // display label for each slot, e.g. "HR", "1", "8"
};

export const BELL_TABLES: Record<ScheduleLetter, BellTable> = {
  // A — Regular Day
  A: {
    start:        ["07:40","08:33","09:21","10:09","10:57","11:45","12:33","13:21","14:09"],
    end:          ["08:29","09:17","10:05","10:53","11:41","12:29","13:17","14:05","14:53"],
    periodLabels: ["1","2","3","4","5","6","7","8","9"],
  },
  // B — Homeroom Day
  B: {
    start:        ["07:40","07:54","08:41","09:28","10:15","11:02","11:49","12:36","13:23","14:10"],
    end:          ["07:50","08:37","09:24","10:11","10:58","11:45","12:32","13:19","14:06","14:53"],
    periodLabels: ["HR","1","2","3","4","5","6","7","8","9"],
  },
  // C — Early Dismissal (periods 1, 2, 3, 8, 9 only)
  C: {
    start:        ["07:40","08:24","09:04","09:44","10:24"],
    end:          ["08:20","09:00","09:40","10:20","11:00"],
    periodLabels: ["1","2","3","8","9"],
  },
  // D — 2-Hour Delay (9:35 AM warning bell)
  D: {
    start:        ["09:40","10:13","10:43","11:13","11:47","12:21","12:55","13:29","14:13"],
    end:          ["10:09","10:39","11:09","11:43","12:17","12:51","13:25","14:09","14:53"],
    periodLabels: ["1","2","3","4","5","6","7","8","9"],
  },
};

export const SCHEDULE_LABELS: Record<ScheduleLetter, string> = {
  A: "Regular",
  B: "Homeroom",
  C: "Early Dismissal",
  D: "2-Hour Delay",
};

export const CYCLE_DAYS: CycleDay[] = [1, 2, 3, 4, 5, 6];

const CYCLE_RE = /^([1-6])([ABCD])$/;

export type ParsedCycle = {
  cycleDay: CycleDay;
  letter: ScheduleLetter;
};

export function parseCycleString(raw: string | null | undefined): ParsedCycle | null {
  if (!raw) return null;
  const match = CYCLE_RE.exec(raw.trim().toUpperCase());
  if (!match) return null;
  return {
    cycleDay: Number(match[1]) as CycleDay,
    letter: match[2] as ScheduleLetter,
  };
}

export function isNoSchool(raw: string | null | undefined): boolean {
  if (!raw) return true;
  return raw.trim().toUpperCase() === "N/A";
}
