import { Modal } from "../../components/Modal";
import type { Weather } from "../../hooks/useWeather";
import { WeatherIcon } from "../header/WeatherIcon";

type Props = {
  open: boolean;
  onClose: () => void;
  weather: Weather | null;
};

export function WeatherModal({ open, onClose, weather }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Weather at School" widthClass="max-w-md">
      {!weather ? (
        <p className="text-sm text-dim py-6">Loading…</p>
      ) : (
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-5xl font-bold tabular text-text leading-none">{weather.temp}°</p>
            <WeatherIcon condition={weather.condition} className="w-12 h-12 text-accent shrink-0" />
          </div>
          <p className="text-sm text-dim capitalize mt-2">{weather.description}</p>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 mt-5 pt-4 border-t border-border">
            <Stat label="Feels like" value={`${weather.feelsLike}°F`} />
            <Stat label="Humidity" value={`${weather.humidity}%`} />
            <Stat label="Wind" value={`${weather.windSpeed} mph`} />
            <Stat label="Condition" value={weather.description} capitalize />
          </dl>
        </div>
      )}
    </Modal>
  );
}

function Stat({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-dim">{label}</dt>
      <dd className={`text-sm font-semibold text-text mt-1 ${capitalize ? "capitalize" : ""}`}>{value}</dd>
    </div>
  );
}
