import { Modal } from "../../components/Modal";
import type { Weather } from "../../hooks/useWeather";
import { WeatherIcon } from "../header/WeatherIcon";

type Props = { open: boolean; onClose: () => void; weather: Weather | null };

export function WeatherModal({ open, onClose, weather }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Weather at School" size="short">
      {weather ? (
        <>
          <div className="pp-card pp-weather-hero" style={{ marginBottom: 16 }}>
            <div>
              <div className="pp-temp">{weather.temp}°</div>
              <div className="pp-cond">{weather.description}</div>
            </div>
            <WeatherIcon condition={weather.condition} className="pp-weather-icon" />
          </div>
          <div className="pp-grid c3">
            <Stat n={`${weather.feelsLike}°`} l="Real feel" />
            <Stat n={`${weather.windSpeed} mph`} l="Wind" />
            <Stat n={`${weather.humidity}%`} l="Humidity" />
          </div>
        </>
      ) : (
        <p className="pp-empty">Weather is unavailable right now.</p>
      )}
    </Modal>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="pp-card sm" style={{ textAlign: "center" }}>
      <div className="pp-stat-n">{n}</div>
      <div className="pp-stat-l">{l}</div>
    </div>
  );
}
