import { useEffect, useState } from "react";
import { fetchCombinedData, type SchoolTimerData } from "../lib/api";
import { parseCycleString, isNoSchool, type ParsedCycle } from "../lib/schedule";
import { useBellStore } from "../store/useBellStore";

function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

export type DayCycleState = {
  data: SchoolTimerData | null;
  today: ParsedCycle | null;
  tomorrow: ParsedCycle | null;
  nextDay: ParsedCycle | null;
  noSchool: boolean;
  error: Error | null;
  loading: boolean;
};

export function useDayCycle(): DayCycleState {
  const [data, setData] = useState<SchoolTimerData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const setFromApi        = useBellStore((s) => s.setFromApi);
  const setCustomSchedule = useBellStore((s) => s.setCustomSchedule);

  useEffect(() => {
    let cancelled = false;
    let dayTimer: ReturnType<typeof setTimeout>;
    let lastFetchedDate = new Date().toDateString();

    const load = () => {
      lastFetchedDate = new Date().toDateString();
      fetchCombinedData({ force: true })
        .then((d) => {
          if (cancelled) return;
          setData(d);
          setError(null);
          if (d.schedules) setFromApi(d.schedules);
          setCustomSchedule(d.customSchedule);
        })
        .catch((e) => {
          if (cancelled) return;
          setError(e instanceof Error ? e : new Error(String(e)));
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    const scheduleNextDay = () => {
      dayTimer = setTimeout(() => {
        load();
        scheduleNextDay();
      }, msUntilMidnight());
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && new Date().toDateString() !== lastFetchedDate) {
        load();
        clearTimeout(dayTimer);
        scheduleNextDay();
      }
    };

    load();
    scheduleNextDay();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      clearTimeout(dayTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const todayRaw = data?.daycycle.today ?? null;
  // Only treat as no-school when API responded and explicitly said so.
  // When data is null (loading or error) we don't know, so noSchool = false.
  const noSchool = data !== null && isNoSchool(todayRaw);

  return {
    data,
    today: parseCycleString(todayRaw),
    tomorrow: parseCycleString(data?.daycycle.tomorrow),
    nextDay: parseCycleString(data?.daycycle.next_day),
    noSchool,
    error,
    loading,
  };
}
