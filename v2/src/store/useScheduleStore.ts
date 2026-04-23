import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CYCLE_DAYS, type CycleDay } from "../lib/schedule";

export type PeriodEntry = {
  period: number;
  className: string;
  room: string;
  color?: string;
};

export type UserSchedule = Record<CycleDay, PeriodEntry[]>;

const DEFAULT_PERIODS = 9;

function emptyDay(periods = DEFAULT_PERIODS): PeriodEntry[] {
  return Array.from({ length: periods }, (_, i) => ({
    period: i + 1,
    className: "",
    room: "",
  }));
}

function emptySchedule(): UserSchedule {
  return CYCLE_DAYS.reduce((acc, d) => {
    acc[d] = emptyDay();
    return acc;
  }, {} as UserSchedule);
}

type ScheduleStore = {
  schedule: UserSchedule;
  homeroomRoom: string;
  lunchPeriod: number | null;
  setHomeroomRoom: (room: string) => void;
  setLunchPeriod: (period: number | null) => void;
  setPeriod: (day: CycleDay, period: number, patch: Partial<PeriodEntry>) => void;
  copyDay: (from: CycleDay, to: CycleDay) => void;
  resetDay: (day: CycleDay) => void;
  resetAll: () => void;
  exportJSON: () => string;
  importJSON: (json: string) => boolean;
  hasAnyEntries: () => boolean;
};

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      schedule: emptySchedule(),
      homeroomRoom: "",
      lunchPeriod: null,
      setHomeroomRoom: (room) => set({ homeroomRoom: room }),
      setLunchPeriod: (period) => set({ lunchPeriod: period }),

      setPeriod: (day, period, patch) =>
        set((state) => ({
          schedule: {
            ...state.schedule,
            [day]: state.schedule[day].map((p) =>
              p.period === period ? { ...p, ...patch } : p,
            ),
          },
        })),

      copyDay: (from, to) =>
        set((state) => ({
          schedule: {
            ...state.schedule,
            [to]: state.schedule[from].map((p) => ({ ...p })),
          },
        })),

      resetDay: (day) =>
        set((state) => ({
          schedule: { ...state.schedule, [day]: emptyDay() },
        })),

      resetAll: () => {
        localStorage.clear();
        window.location.reload();
      },

      exportJSON: () => JSON.stringify(get().schedule, null, 2),

      importJSON: (json) => {
        try {
          const parsed = JSON.parse(json) as UserSchedule;
          for (const d of CYCLE_DAYS) {
            if (!Array.isArray(parsed[d])) return false;
          }
          set({ schedule: parsed });
          return true;
        } catch {
          return false;
        }
      },

      hasAnyEntries: () => {
        const s = get().schedule;
        return CYCLE_DAYS.some((d) =>
          s[d].some((p) => p.className.trim() || p.room.trim()),
        );
      },
    }),
    { name: "schooltimer.v2.userSchedule" },
  ),
);
