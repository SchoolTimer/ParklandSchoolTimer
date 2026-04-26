import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BELL_TABLES, type BellTable, type ScheduleLetter } from "../lib/schedule";
import type { CustomSchedule, RawSchedules } from "../lib/api";

export type BellTables = Record<ScheduleLetter, BellTable>;

export type ActiveCustomSchedule = {
  id: string;
  name: string;
  table: BellTable;
};

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

function fromCustomSchedule(custom: CustomSchedule | null): ActiveCustomSchedule | null {
  if (!custom || custom.slots.length === 0) return null;
  return {
    id: custom.id,
    name: custom.name,
    table: {
      start: custom.slots.map((s) => s.start),
      end: custom.slots.map((s) => s.end),
      periodLabels: custom.slots.map((s) => s.label),
    },
  };
}

type BellStore = {
  tables: BellTables | null;
  customSchedule: ActiveCustomSchedule | null;
  setFromApi: (raw: RawSchedules) => void;
  setCustomSchedule: (custom: CustomSchedule | null) => void;
};

export const useBellStore = create<BellStore>()(
  persist(
    (set) => ({
      tables: null,
      customSchedule: null,

      setFromApi: (raw) => {
        const parsed = fromApiSchedules(raw);
        if (parsed) set({ tables: parsed });
      },

      setCustomSchedule: (custom) => {
        set({ customSchedule: fromCustomSchedule(custom) });
      },
    }),
    { name: "schooltimer.v2.bellTables" },
  ),
);

export function useBellTables(): BellTables {
  return useBellStore((s) => s.tables) ?? BELL_TABLES;
}

export function useActiveCustomSchedule(): ActiveCustomSchedule | null {
  return useBellStore((s) => s.customSchedule);
}
