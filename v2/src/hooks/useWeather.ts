import { useEffect, useState } from "react";

const API_KEY = "e46805f1e905b75fd69249b93b47a134";
const CITY = "Allentown";
const REFRESH_MS = 10 * 60 * 1000;

export type WeatherCondition =
  | "Clouds"
  | "Thunderstorm"
  | "Drizzle"
  | "Rain"
  | "Snow"
  | "Clear"
  | "Other";

export type Weather = {
  temp: number;
  feelsLike: number;
  condition: WeatherCondition;
  description: string;
  humidity: number;
  windSpeed: number;
};

type OWMResponse = {
  main?: { temp?: number; feels_like?: number; humidity?: number };
  weather?: Array<{ main?: string; description?: string }>;
  wind?: { speed?: number };
};

function classifyCondition(s: string | undefined): WeatherCondition {
  const list: WeatherCondition[] = [
    "Clouds",
    "Thunderstorm",
    "Drizzle",
    "Rain",
    "Snow",
    "Clear",
  ];
  return (list.find((c) => c === s) ?? "Other") as WeatherCondition;
}

export function useWeather(): { weather: Weather | null; error: Error | null } {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=imperial&APPID=${API_KEY}`,
      )
        .then((r) => r.json() as Promise<OWMResponse>)
        .then((d) => {
          if (cancelled) return;
          setWeather({
            temp: Math.round(d.main?.temp ?? 0),
            feelsLike: Math.round(d.main?.feels_like ?? 0),
            humidity: d.main?.humidity ?? 0,
            windSpeed: Math.round(d.wind?.speed ?? 0),
            condition: classifyCondition(d.weather?.[0]?.main),
            description: d.weather?.[0]?.description ?? "",
          });
          setError(null);
        })
        .catch((e) => !cancelled && setError(e instanceof Error ? e : new Error(String(e))));
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { weather, error };
}
