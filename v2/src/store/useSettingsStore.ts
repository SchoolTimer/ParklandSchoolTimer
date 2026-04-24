import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScheduleLetter } from "../lib/schedule";

function todayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

type SettingsStore = {
  letterOverride: ScheduleLetter | null;
  letterOverrideDate: string | null;
  setLetterOverride: (letter: ScheduleLetter | null) => void;
  getEffectiveOverride: () => ScheduleLetter | null;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      letterOverride: null,
      letterOverrideDate: null,
      setLetterOverride: (letter) => set({
        letterOverride: letter,
        letterOverrideDate: letter !== null ? todayDateKey() : null,
      }),
      // Returns override only if it was set today, otherwise null
      getEffectiveOverride: () => {
        const { letterOverride, letterOverrideDate } = get();
        if (!letterOverride || letterOverrideDate !== todayDateKey()) return null;
        return letterOverride;
      },
    }),
    { name: "schooltimer.v2.settings" },
  ),
);
