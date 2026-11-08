import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScheduleLetter } from "../lib/schedule";

function todayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export type PeriodView = "all" | "focus";

type SettingsStore = {
  letterOverride: ScheduleLetter | null;
  letterOverrideDate: string | null;
  periodView: PeriodView;
  soundsOn: boolean;
  setSoundsOn: (on: boolean) => void;
  setLetterOverride: (letter: ScheduleLetter | null) => void;
  setPeriodView: (view: PeriodView) => void;
  getEffectiveOverride: () => ScheduleLetter | null;
};

export function effectiveLetterOverride(
  letter: ScheduleLetter | null,
  date: string | null,
): ScheduleLetter | null {
  if (!letter || date !== todayDateKey()) return null;
  return letter;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      letterOverride: null,
      letterOverrideDate: null,
      periodView: "all",
      soundsOn: true,
      setSoundsOn: (soundsOn) => set({ soundsOn }),
      setLetterOverride: (letter) => set({
        letterOverride: letter,
        letterOverrideDate: letter !== null ? todayDateKey() : null,
      }),
      setPeriodView: (periodView) => set({ periodView }),
      // Returns override only if it was set today, otherwise null
      getEffectiveOverride: () => {
        const { letterOverride, letterOverrideDate } = get();
        return effectiveLetterOverride(letterOverride, letterOverrideDate);
      },
    }),
    { name: "schooltimer.v2.settings" },
  ),
);
