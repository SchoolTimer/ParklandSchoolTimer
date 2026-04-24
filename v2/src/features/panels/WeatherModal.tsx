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
    <Modal open={open} onClose={onClose} title="Weather at School" widthClass="max-w-sm">
      {!weather ? (
        <p className="text-sm text-dim text-center py-6">Loading…</p>
      ) : (
        <div className="flex flex-col gap-4">

          {/* Hero — big temp + icon */}
          <div
            className="rounded-2xl px-6 py-5 flex items-center justify-between relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--color-accent) 0%, color-mix(in srgb, var(--color-accent) 60%, #000) 100%)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="relative">
              <p className="text-[3.5rem] font-bold text-white tabular leading-none">
                {weather.temp}°
              </p>
              <p className="text-sm text-white/70 mt-1 capitalize">{weather.description}</p>
              <p className="text-xs text-white/50 mt-0.5">Allentown, PA</p>
            </div>
            <WeatherIcon condition={weather.condition} className="relative w-16 h-16 text-white/80" />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard label="Feels Like"  value={`${weather.feelsLike}°F`} />
            <StatCard label="Humidity"    value={`${weather.humidity}%`} />
            <StatCard label="Wind Speed"  value={`${weather.windSpeed} mph`} />
            <StatCard label="Condition"   value={weather.description} capitalize />
          </div>

        </div>
      )}
    </Modal>
  );
}

function StatCard({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="bg-surface-2 border border-border rounded-xl px-4 py-3">
      <p className="text-[10px] font-bold text-dim uppercase tracking-[0.15em] mb-1">{label}</p>
      <p className={`text-base font-bold text-text leading-none ${capitalize ? "capitalize" : ""}`}>
        {value}
      </p>
    </div>
  );
}
