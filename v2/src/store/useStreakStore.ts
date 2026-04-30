import { create } from "zustand";
import { persist } from "zustand/middleware";

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function prevSchoolDayKey(): string {
  const d = new Date();
  // step back to find the previous weekday
  do { d.setDate(d.getDate() - 1); } while (d.getDay() === 0 || d.getDay() === 6);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function isWeekday(): boolean {
  const day = new Date().getDay();
  return day >= 1 && day <= 5;
}

type StreakStore = {
  streak: number;
  best: number;
  lastSeen: string | null;
  tick: () => void;
};

export const useStreakStore = create<StreakStore>()(
  persist(
    (set, get) => ({
      streak: 0,
      best: 0,
      lastSeen: null,

      tick: () => {
        if (!isWeekday()) return;
        const { streak, best, lastSeen } = get();
        const today = todayKey();
        if (lastSeen === today) return; // already counted today

        const prev = prevSchoolDayKey();
        const newStreak = lastSeen === prev ? streak + 1 : 1;
        const newBest = Math.max(best, newStreak);
        set({ streak: newStreak, best: newBest, lastSeen: today });
      },
    }),
    { name: "schooltimer.v2.streak" },
  ),
);
