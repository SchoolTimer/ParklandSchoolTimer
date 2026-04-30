import type { ScheduleLetter, ParsedCycle } from "../../lib/schedule";
import type { Weather } from "../../hooks/useWeather";
import { WeatherIcon } from "../header/WeatherIcon";
import { PaletteIcon, PencilIcon, UtensilsIcon, SettingsIcon, FlameIcon } from "../../components/Icons";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useStreakStore } from "../../store/useStreakStore";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

type ModalKey = "schedule" | "colors" | "weather" | "more" | "menus" | "cycle";

type Props = {
  now: Date;
  today: ParsedCycle | null;
  tomorrow: ParsedCycle | null;
  nextDay: ParsedCycle | null;
  noSchool: boolean;
  weather: Weather | null;
  effectiveLetter: ScheduleLetter;
  onLetterChange: (l: ScheduleLetter) => void;
  dayPct: number;
  yearPct: number;
  onModal: (key: ModalKey) => void;
};

const LETTERS: ScheduleLetter[] = ["A", "B", "C", "D"];

function schoolYearDaysLeft(now: Date): number {
  const end = new Date("2026-06-09");
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));
}

export function RightRail({
  now, today, tomorrow, nextDay, noSchool, weather, effectiveLetter, onLetterChange,
  dayPct, yearPct, onModal,
}: Props) {
  const h    = now.getHours();
  const m    = String(now.getMinutes()).padStart(2, "0");
  const s    = String(now.getSeconds()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;
  const daysLeft = schoolYearDaysLeft(now);

  const tick   = useStreakStore((s) => s.tick);
  const streak = useStreakStore((s) => s.streak);
  const best   = useStreakStore((s) => s.best);
  useEffect(() => { tick(); }, [tick]);

  return (
    <div className="w-72 shrink-0 h-full flex flex-col gap-2.5 overflow-hidden">

      {/* ── 1. Header ─────────────────────────────────────────────────── */}
      <div
        className="shrink-0 rounded-2xl px-5 py-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, color-mix(in srgb, var(--color-accent) 85%, transparent) 0%, color-mix(in srgb, var(--color-accent) 30%, var(--color-surface)) 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] leading-none mb-2">
              {DAYS[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}
            </p>
            <p className="tabular font-black text-white leading-none text-5xl">
              {h12}:{m}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 pb-0.5">
            <span className="text-3xl font-black text-white/40 tabular leading-none">{s}</span>
            <span className="text-sm font-bold text-white/60 uppercase tracking-widest leading-none">{ampm}</span>
          </div>
        </div>
      </div>

      {/* ── 2. Cycle Day ──────────────────────────────────────────────── */}
      <div className="card shrink-0 px-4 py-4">
        <p className="text-[10px] font-bold text-dim uppercase tracking-[0.15em] mb-3">Cycle Day</p>
        <div className="grid grid-cols-3 gap-2">
          <CycleCell label="Today"    cycle={noSchool ? null : today} noSchool={noSchool} primary />
          <CycleCell label="Tomorrow" cycle={tomorrow} weekend={now.getDay() === 6} />
          <CycleCell label="Next"     cycle={nextDay}  weekend={now.getDay() >= 5} />
        </div>
      </div>

      {/* ── 3. Progress ───────────────────────────────────────────────── */}
      <div className="card px-4 py-3 shrink-0 flex flex-col gap-3">
        <p className="text-[10px] font-bold text-dim uppercase tracking-[0.15em]">Progress</p>

        <div className="flex flex-col gap-3">
          <ProgressRow label="School Day"  pct={dayPct}  sublabel={`${dayPct}% through today`} />
          <ProgressRow label="School Year" pct={yearPct} sublabel={`${daysLeft} days remaining`} />
        </div>
      </div>

      {/* ── 4. Streak ─────────────────────────────────────────────────── */}
      <StreakWidget streak={streak} best={best} />

      {/* ── 5. Schedule selector ──────────────────────────────────────── */}
      <div className="card shrink-0 p-1.5">
        <div className="flex gap-1">
          {LETTERS.map((l) => {
            const active = l === effectiveLetter;
            return (
              <button
                key={l}
                onClick={() => onLetterChange(l)}
                className={`flex-1 py-2 rounded-xl text-center transition-all duration-150 ${
                  active
                    ? "bg-accent text-white font-bold"
                    : "text-dim hover:text-text hover:bg-surface-2"
                }`}
              >
                <span className="block text-sm font-bold leading-none">{l}</span>
                <span className={`block text-[8px] font-semibold mt-0.5 leading-none tracking-wide ${active ? "text-white/70" : "opacity-50"}`}>
                  {l === "A" ? "REG" : l === "B" ? "HR" : l === "C" ? "EARLY" : "DELAY"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 6. Actions ────────────────────────────────────────────────── */}
      <div className="card shrink-0 p-2">
        <div className="grid grid-cols-2 gap-1">
          <ActionBtn icon={<PaletteIcon width={14} height={14} />} onClick={() => onModal("colors")}>
            Colors
          </ActionBtn>
          <ActionBtn icon={<UtensilsIcon width={14} height={14} />} onClick={() => onModal("menus")}>
            Food Menu
          </ActionBtn>
          <ActionBtn icon={<PencilIcon width={14} height={14} />} onClick={() => onModal("schedule")}>
            Schedule
          </ActionBtn>
          <ActionBtn
            icon={<WeatherIcon condition={weather?.condition} className="w-3.5 h-3.5" />}
            onClick={() => onModal("weather")}
          >
            {weather ? `${weather.temp}°F` : "Weather"}
          </ActionBtn>
        </div>
        <div className="mt-1 pt-1 border-t border-border">
          <button
            onClick={() => onModal("more")}
            className="w-full h-7 rounded-lg text-[11px] font-semibold text-dim hover:text-text hover:bg-surface-2 transition-colors flex items-center justify-center gap-1.5"
          >
            <SettingsIcon width={12} height={12} />
            More
          </button>
        </div>
      </div>

    </div>
  );
}

/* ── CycleCell ────────────────────────────────────────────────────── */
function CycleCell({
  label, cycle, noSchool, primary, weekend,
}: {
  label: string;
  cycle: ParsedCycle | null;
  noSchool?: boolean;
  primary?: boolean;
  weekend?: boolean;
}) {
  const textColor = primary ? "text-accent" : "text-text";
  const dimColor  = primary ? "text-accent/50" : "text-dim";

  return (
    <div
      className={`rounded-xl p-3 flex flex-col gap-2.5 ${
        primary ? "bg-accent-soft border border-accent/20" : "bg-surface-2"
      }`}
    >
      <p className={`text-[10px] font-semibold leading-none ${dimColor}`}>{label}</p>
      {noSchool || weekend ? (
        <span className="text-lg font-bold text-dim-2 leading-none">—</span>
      ) : cycle ? (
        <div className="flex items-baseline gap-1">
          <span className={`text-[2rem] font-bold tabular leading-none ${textColor}`}>{cycle.cycleDay}</span>
          <span className={`text-sm font-bold leading-none ${dimColor}`}>{cycle.letter}</span>
        </div>
      ) : (
        <span className="text-lg font-bold text-dim-2 leading-none">—</span>
      )}
    </div>
  );
}

/* ── ProgressRow ──────────────────────────────────────────────────── */
function ProgressRow({
  label, pct, sublabel,
}: {
  label: string;
  pct: number;
  sublabel: string;
}) {
  const size   = 60;
  const stroke = 6;
  const r      = (size - stroke) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - Math.max(0, Math.min(100, pct)) / 100);

  return (
    <div className="flex items-center gap-3">
      {/* Ring */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="var(--color-border-2)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-bold tabular text-text leading-none">{pct}%</span>
        </div>
      </div>

      {/* Text + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-xs font-bold text-text">{label}</span>
          <span className="text-[11px] font-bold tabular text-accent">{pct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-border-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%`, background: "var(--color-accent)" }}
          />
        </div>
        <p className="text-[10px] text-dim mt-1">{sublabel}</p>
      </div>
    </div>
  );
}

/* ── StreakWidget ─────────────────────────────────────────────────── */
function StreakWidget({ streak, best }: { streak: number; best: number }) {
  const flames = Math.min(streak, 7);
  return (
    <div className="card shrink-0 px-4 py-3 flex items-center gap-3">
      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-accent-soft border border-accent/20 shrink-0">
        <FlameIcon width={20} height={20} className="text-accent" />
        <span className="text-[10px] font-bold text-accent leading-none mt-0.5">{streak}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-text leading-none mb-1">
          {streak === 0 ? "Start your streak!" : streak === 1 ? "1 day streak" : `${streak} day streak`}
        </p>
        <div className="flex gap-0.5 mb-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < flames ? "bg-accent" : "bg-border-2"
              }`}
            />
          ))}
        </div>
        <p className="text-[10px] text-dim">Best: {best} {best === 1 ? "day" : "days"}</p>
      </div>
    </div>
  );
}

/* ── ActionBtn ────────────────────────────────────────────────────── */
function ActionBtn({ icon, onClick, children }: { icon: ReactNode; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 h-9 rounded-xl text-[11px] font-semibold text-dim hover:text-text hover:bg-surface-2 transition-colors w-full"
    >
      <span className="shrink-0">{icon}</span>
      {children}
    </button>
  );
}
