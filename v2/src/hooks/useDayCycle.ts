import { useEffect, useState } from "react";
import { fetchCombinedData, type SchoolTimerData } from "../lib/api";
import { parseCycleString, isNoSchool, type ParsedCycle } from "../lib/schedule";

const REFRESH_MS = 12 * 60 * 1000; // 12 minutes

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

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetchCombinedData()
        .then((d) => {
          if (cancelled) return;
          setData(d);
          setError(null);
        })
        .catch((e) => {
          if (cancelled) return;
          setError(e instanceof Error ? e : new Error(String(e)));
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
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
