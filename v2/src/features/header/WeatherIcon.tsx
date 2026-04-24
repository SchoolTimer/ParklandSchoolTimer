import type { WeatherCondition } from "../../hooks/useWeather";
import {
  SunIcon,
  CloudIcon,
  CloudRainIcon,
  SnowflakeIcon,
  BoltIcon,
} from "../../components/Icons";

export function WeatherIcon({
  condition,
  className,
}: {
  condition: WeatherCondition | undefined;
  className?: string;
}) {
  switch (condition) {
    case "Clouds":
      return <CloudIcon className={className} />;
    case "Rain":
    case "Drizzle":
      return <CloudRainIcon className={className} />;
    case "Snow":
      return <SnowflakeIcon className={className} />;
    case "Thunderstorm":
      return <BoltIcon className={className} />;
    case "Clear":
    default:
      return <SunIcon className={className} />;
  }
}
