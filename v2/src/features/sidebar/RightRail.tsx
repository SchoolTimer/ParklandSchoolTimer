import type { ScheduleLetter, ParsedCycle } from "../../lib/schedule";
import type { Weather } from "../../hooks/useWeather";
import { WeatherIcon } from "../header/WeatherIcon";
import { PaletteIcon, PencilIcon, UtensilsIcon, SettingsIcon } from "../../components/Icons";
import type { ReactNode } from "react";
import { useScheduleStore } from "../../store/useScheduleStore";
import { useBellTables } from "../../store/useBellStore";
import { getSchedule, computePeriodState } from "../../lib/timers";
import { formatCountdown } from "../../lib/time";

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
  yearPct: number | null;
  daysLeft: number | null;
  onModal: (key: ModalKey) => void;
  onSetLunch: () => void;
};

const LETTERS: ScheduleLetter[] = ["A", "B", "C", "D"];
const SCHEDULE_NAMES: Record<ScheduleLetter, string> = { A: "Regular", B: "Homeroom", C: "Early", D: "Delay" };

export function LetterPicker({
  value,
  onChange,
}: {
  value: ScheduleLetter;
  onChange: (letter: ScheduleLetter) => void;
}) {
  return (
    <div className="flex justify-around gap-1" role="radiogroup" aria-label="Schedule">
      {LETTERS.map((l) => {
        const active = l === value;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${l} schedule, ${SCHEDULE_NAMES[l]}`}
            title={`${SCHEDULE_NAMES[l]} schedule`}
            onClick={() => onChange(l)}
            className="flex flex-col items-center gap-1 min-h-11 py-1 px-0.5 bg-transparent"
          >
            <span
              className={`relative flex items-center justify-center w-11 h-11 rounded-full text-base font-semibold ${
                active ? "neu-inset text-accent" : "neu-raised-sm text-dim"
              }`}
            >
              {l}
            </span>
            <span className={`text-[9px] font-semibold tracking-wide ${active ? "text-accent" : "text-dim"}`}>
              {SCHEDULE_NAMES[l]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function RightRail({
  now, today, tomorrow, nextDay, noSchool, weather, effectiveLetter, onLetterChange,
  dayPct, yearPct, daysLeft, onModal, onSetLunch,
}: Props) {
  const h    = now.getHours();
  const m    = String(now.getMinutes()).padStart(2, "0");
  const s    = String(now.getSeconds()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;
  const yearLabel = daysLeft === null
    ? "—"
    : daysLeft === 1
      ? "1 day remaining"
      : `${daysLeft} days remaining`;

  return (
    <div className="w-full lg:w-64 lg:shrink-0 lg:h-full flex flex-col gap-2 lg:overflow-y-auto lg:overflow-x-hidden">

      {/* ── 1. Header ─────────────────────────────────────────────────── */}
      <div className="card shrink-0 rounded-2xl px-4 py-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold text-dim uppercase tracking-[0.2em] leading-none mb-2">
              {DAYS[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}
            </p>
            <p className="tabular font-black text-text leading-none text-4xl">
              {h12}:{m}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 pb-0.5">
            <span className="text-2xl font-black text-dim tabular leading-none">{s}</span>
            <span className="text-xs font-bold text-dim uppercase tracking-widest leading-none">{ampm}</span>
          </div>
        </div>
      </div>

      {/* ── 2. Cycle Day ──────────────────────────────────────────────── */}
      <div className="card shrink-0 px-4 py-3">
        <p className="text-[10px] font-bold text-dim uppercase tracking-[0.15em] mb-2">Cycle Day</p>
        <div className="grid grid-cols-3 gap-2">
          <CycleCell label="Today"    cycle={noSchool ? null : today} noSchool={noSchool} primary />
          <CycleCell label="Tomorrow" cycle={tomorrow} weekend={now.getDay() === 6} />
          <CycleCell label="Next"     cycle={nextDay}  weekend={now.getDay() >= 5} />
        </div>
      </div>

      {/* ── 3. Progress ───────────────────────────────────────────────── */}
      <div className="card px-4 py-3 shrink-0 flex flex-col gap-2">
        <p className="text-[10px] font-bold text-dim uppercase tracking-[0.15em]">Progress</p>
        <div className="flex flex-col gap-2">
          <ProgressRow label="School Day"  pct={dayPct}  sublabel={`${dayPct}% through today`} />
          <ProgressRow label="School Year" pct={yearPct} sublabel={yearLabel} />
        </div>
      </div>

      {/* ── 4. Lunch ──────────────────────────────────────────────────── */}
      <LunchWidget now={now} effectiveLetter={effectiveLetter} onEdit={onSetLunch} />

      {/* ── 6. Schedule selector ──────────────────────────────────────── */}
      <div className="card shrink-0 px-2 py-3 hidden lg:block">
        <LetterPicker value={effectiveLetter} onChange={onLetterChange} />
      </div>

      {/* ── 6. Actions ────────────────────────────────────────────────── */}
      <div className="card shrink-0 p-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
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
        <div className="mt-3">
          <button
            onClick={() => onModal("more")}
            className="w-full min-h-11 rounded-2xl neu-raised-sm text-[11px] font-semibold text-dim hover:text-text flex items-center justify-center gap-1.5"
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
      className={`rounded-xl p-2.5 flex flex-col gap-1.5 ${
        primary ? "bg-accent-soft" : "neu-raised-sm"
      }`}
    >
      <p className={`text-[10px] font-semibold leading-none ${dimColor}`}>{label}</p>
      {noSchool || weekend ? (
        <span className="text-base font-bold text-dim-2 leading-none">—</span>
      ) : cycle ? (
        <div className="flex items-baseline gap-1">
          <span className={`text-[1.6rem] font-bold tabular leading-none ${textColor}`}>{cycle.cycleDay}</span>
          <span className={`text-xs font-bold leading-none ${dimColor}`}>{cycle.letter}</span>
        </div>
      ) : (
        <span className="text-base font-bold text-dim-2 leading-none">—</span>
      )}
    </div>
  );
}

/* ── ProgressRow ──────────────────────────────────────────────────── */
function ProgressRow({
  label, pct, sublabel,
}: {
  label: string;
  pct: number | null;
  sublabel: string;
}) {
  const shown  = pct ?? 0;
  const size   = 48;
  const stroke = 5;
  const r      = (size - stroke) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - Math.max(0, Math.min(100, shown)) / 100);
  const pctLabel = pct === null ? "—" : `${pct}%`;

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
          <span className="text-[11px] font-bold tabular text-text leading-none">{pctLabel}</span>
        </div>
      </div>

      {/* Text + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-xs font-bold text-text">{label}</span>
          <span className="text-[11px] font-bold tabular text-accent">{pctLabel}</span>
        </div>
        <div className="h-2 w-full bg-border-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{ width: `${shown}%`, background: "var(--color-accent)" }}
          />
        </div>
        <p className="text-[10px] text-dim mt-1">{sublabel}</p>
      </div>
    </div>
  );
}

/* ── LunchWidget ──────────────────────────────────────────────────── */
function LunchWidget({ now, effectiveLetter, onEdit }: { now: Date; effectiveLetter: ScheduleLetter; onEdit: () => void }) {
  const lunchPeriod = useScheduleStore((s) => s.lunchPeriod);
  const bellTables  = useBellTables();

  if (!lunchPeriod) {
    return (
      <div className="card shrink-0 px-4 py-3">
        <p className="text-[10px] font-bold text-dim uppercase tracking-[0.15em] mb-2">Lunch</p>
        <button onClick={onEdit} className="text-[11px] font-semibold text-accent hover:underline">
          Set your lunch period →
        </button>
      </div>
    );
  }

  const table = getSchedule(effectiveLetter, bellTables);
  const idx   = table.periodLabels.findIndex((l) => l === String(lunchPeriod));
  const state = idx >= 0 ? computePeriodState(now, table.start[idx], table.end[idx]) : null;

  const isActive = state?.status === "active";
  const isOver   = state?.status === "over";
  const startsIn = state?.status === "upcoming" ? (state as { startsIn: number }).startsIn : null;

  return (
    <div className="card shrink-0 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold text-dim uppercase tracking-[0.15em]">Lunch</p>
        <span className="text-[10px] text-dim">Period {lunchPeriod}</span>
      </div>

      {isActive ? (
        <p className="text-sm font-bold text-accent">Lunch now!</p>
      ) : isOver ? (
        <p className="text-sm font-semibold text-dim-2">Lunch is over</p>
      ) : startsIn !== null ? (
        <div>
          <p className="text-[10px] text-dim mb-1">Starts in</p>
          <p className="text-xl font-black tabular text-text leading-none">{formatCountdown(startsIn)}</p>
        </div>
      ) : (
        <p className="text-xs text-dim-2">—</p>
      )}
    </div>
  );
}

/* ── ActionBtn ────────────────────────────────────────────────────── */
function ActionBtn({ icon, onClick, children }: { icon: ReactNode; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1.5 px-2 py-3 min-h-16 rounded-2xl neu-raised-sm text-xs font-semibold text-dim hover:text-text w-full"
    >
      <span className="shrink-0">{icon}</span>
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}
