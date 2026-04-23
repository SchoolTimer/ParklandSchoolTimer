import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BELL_TABLES, type BellTable, type ScheduleLetter } from "../lib/schedule";
import type { RawSchedules } from "../lib/api";

export type BellTables = Record<ScheduleLetter, BellTable>;

function fromApiSchedules(raw: RawSchedules): BellTables | null {
  const letters: ScheduleLetter[] = ["A", "B", "C", "D"];
  const result = {} as BellTables;
  for (const letter of letters) {
    const entry = raw[letter];
    if (!entry || entry.slots.length === 0) return null;
    result[letter] = {
      start: entry.slots.map((s) => s.start),
      end: entry.slots.map((s) => s.end),
      periodLabels: entry.slots.map((s) => s.label),
    };
  }
  return result;
}

type BellStore = {
  tables: BellTables | null;
  setFromApi: (raw: RawSchedules) => void;
};

export const useBellStore = create<BellStore>()(
  persist(
    (set) => ({
      tables: null,

      setFromApi: (raw) => {
        const parsed = fromApiSchedules(raw);
        if (parsed) set({ tables: parsed });
      },
    }),
    { name: "schooltimer.v2.bellTables" },
  ),
);

export function useBellTables(): BellTables {
  return useBellStore((s) => s.tables) ?? BELL_TABLES;
}
