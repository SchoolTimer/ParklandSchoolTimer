import { Modal } from "../../components/Modal";
import type { Weather } from "../../hooks/useWeather";
import { WeatherIcon } from "../header/WeatherIcon";

type Props = { open: boolean; onClose: () => void; weather: Weather | null };

export function WeatherModal({ open, onClose, weather }: Props) {
  const rows: [string, string][] = [
    ["Condition:", weather ? weather.description : "-"],
    ["Current Temp:", weather ? `${weather.temp} °F` : "-"],
    ["Real Feel:", weather ? `${weather.feelsLike} °F` : "-"],
    ["Wind Speed:", weather ? `${weather.windSpeed} mph` : "-"],
    ["Humidity:", weather ? `${weather.humidity}%` : "-"],
  ];
  return (
    <Modal open={open} onClose={onClose} title="Weather at School">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "3vh" }}>
        <div>
          {rows.map(([k, v]) => (
            <div key={k} className="v1-weather-line shadows">
              <b>{k}</b>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ color: "var(--text)", width: "20vw", maxWidth: "30%" }}>
          <WeatherIcon condition={weather?.condition} className="w-full h-auto" />
        </div>
      </div>
    </Modal>
  );
}
