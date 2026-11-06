import { BELL_TABLES, type ScheduleLetter } from "./schedule";
import { endOfLocalDay, parseHHMM, parseLocalDate } from "./time";
import type { BellTables } from "../store/useBellStore";

export function schoolYearProgress(now: Date, start: string, end: string): number {
  const a = parseLocalDate(start).getTime();
  const b = endOfLocalDay(end).getTime();
  if (b <= a) return 0;
  const pct = ((now.getTime() - a) / (b - a)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

/** Whole calendar days from today until `end` (`YYYY-MM-DD`). Zero on that day. */
export function daysUntil(now: Date, end: string): number {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const target = parseLocalDate(end);
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86_400_000));
}

export function schoolDayProgress(now: Date, letter: ScheduleLetter, tables?: BellTables): number {
  const t = (tables ?? BELL_TABLES)[letter];
  // Use first period slot (skip HR on B schedule) through last slot
  const firstIdx = t.periodLabels.findIndex((l) => l !== "HR");
  const startMs  = parseHHMM(t.start[firstIdx >= 0 ? firstIdx : 0], now).getTime();
  const endMs    = parseHHMM(t.end[t.end.length - 1], now).getTime();
  if (now.getTime() < startMs) return 0;
  if (now.getTime() > endMs) return 100;
  return Math.round(((now.getTime() - startMs) / (endMs - startMs)) * 100);
}

export function schoolWeekProgress(now: Date): number {
  const day = now.getDay();
  if (day === 0 || day === 6) return day === 6 ? 100 : 0;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - (day - 1));
  const fridayEnd = new Date(monday);
  fridayEnd.setDate(fridayEnd.getDate() + 4);
  fridayEnd.setHours(23, 59, 59, 999);
  const pct = ((now.getTime() - monday.getTime()) / (fridayEnd.getTime() - monday.getTime())) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}
