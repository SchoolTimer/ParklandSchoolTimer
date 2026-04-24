import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScheduleLetter } from "../lib/schedule";

type SettingsStore = {
  letterOverride: ScheduleLetter | null;
  setLetterOverride: (letter: ScheduleLetter | null) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      letterOverride: null,
      setLetterOverride: (letter) => set({ letterOverride: letter }),
    }),
    { name: "schooltimer.v2.settings" },
  ),
);
