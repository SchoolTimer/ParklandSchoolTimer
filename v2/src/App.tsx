import { useState } from "react";
import { useClock } from "./hooks/useClock";
import { useDayCycle } from "./hooks/useDayCycle";
import { useWeather } from "./hooks/useWeather";
import { effectiveLetterOverride, useSettingsStore, type PeriodView } from "./store/useSettingsStore";
import { useApplyTheme } from "./store/useThemeStore";
import { useClickSound } from "./hooks/useClickSound";
import { useDocumentTitle } from "./hooks/useDocumentTitle";
import type { ScheduleLetter } from "./lib/schedule";
import { daysUntil, schoolDayProgress, schoolWeekProgress, schoolYearProgress } from "./lib/progress";
import { useBellTables, useActiveCustomSchedule } from "./store/useBellStore";

import { HeroTimer } from "./features/timers/HeroTimer";
import { PeriodGrid } from "./features/timers/PeriodGrid";
import { LetterPicker, RightRail } from "./features/sidebar/RightRail";

import { ScheduleEditorModal } from "./features/schedule-editor/ScheduleEditorModal";
import { MenusModal } from "./features/menus/MenusModal";
import { WeatherModal } from "./features/panels/WeatherModal";
import { MoreModal } from "./features/panels/MoreModal";
import { CycleDaysModal } from "./features/panels/CycleDaysModal";
import { ColorsModal } from "./features/panels/ColorsModal";

type ModalKey = null | "schedule" | "colors" | "weather" | "more" | "menus" | "cycle";

function App() {
  useApplyTheme();
  useClickSound();

  const now = useClock(1000);
  const { today, tomorrow, nextDay, noSchool, data } = useDayCycle();
  const { weather } = useWeather();

  const letterOverride     = useSettingsStore((s) => s.letterOverride);
  const letterOverrideDate = useSettingsStore((s) => s.letterOverrideDate);
  const setLetterOverride  = useSettingsStore((s) => s.setLetterOverride);
  const periodView         = useSettingsStore((s) => s.periodView);
  const setPeriodView      = useSettingsStore((s) => s.setPeriodView);
  const effectiveLetter: ScheduleLetter =
    effectiveLetterOverride(letterOverride, letterOverrideDate) ?? today?.letter ?? "A";
  const baseBellTables = useBellTables();
  const customSchedule = useActiveCustomSchedule();
  // When a custom schedule is enabled, swap the active letter's slots with the
  // custom slots so all downstream consumers (timers, progress, title) use it.
  const bellTables = customSchedule
    ? { ...baseBellTables, [effectiveLetter]: customSchedule.table }
    : baseBellTables;

  const [modal, setModal] = useState<ModalKey>(null);

  const schoolDates = data?.schoolDates ?? null;
  const dayPct  = schoolDayProgress(now, effectiveLetter, bellTables);
  const yearPct = schoolDates
    ? schoolYearProgress(now, schoolDates.schoolYearStart, schoolDates.schoolYearEnd)
    : null;
  const daysLeft = schoolDates ? daysUntil(now, schoolDates.schoolYearEnd) : null;
  void schoolWeekProgress(now);

  useDocumentTitle(now, effectiveLetter, today?.cycleDay ?? null, noSchool, bellTables);

  return (
    <div className="min-h-dvh w-full flex flex-col lg:h-dvh lg:flex-row lg:overflow-hidden bg-bg p-2 gap-2 lg:p-3 lg:gap-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">

      {/* ── LEFT: HERO PANEL ─────────────────────────────────────────── */}
      <div className="card flex flex-col min-w-0 w-full lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        {!noSchool && (
          <div className="shrink-0 flex items-center justify-between gap-2 px-3 pt-3 sm:px-5">
            {customSchedule ? (
              <div className="flex items-center gap-2 min-w-0 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/40">
                <span className="relative flex shrink-0">
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-accent opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="text-[10px] font-bold text-accent uppercase tracking-[0.14em] truncate">
                  {customSchedule.name}
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-dim uppercase tracking-[0.16em]">Today</span>
            )}
            <ViewToggle value={periodView} onChange={setPeriodView} />
          </div>
        )}
        {!noSchool && (
          <div className="lg:hidden px-3 pt-2">
            <LetterPicker value={effectiveLetter} onChange={setLetterOverride} />
          </div>
        )}
        <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
          {noSchool ? (
            <div className="flex flex-col justify-center px-5 py-8 sm:px-10 lg:min-h-full lg:py-10">
              <p className="text-xs font-semibold text-dim uppercase tracking-[0.18em] mb-5">
                School Day
              </p>
              <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold text-text leading-[0.95] mb-1">
                School Is
              </h1>
              <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold text-dim-2 leading-[0.95] mb-8">
                Over
              </h1>
              <p className="text-base text-dim">No school today — enjoy your day!</p>
            </div>
          ) : periodView === "all" ? (
            <PeriodGrid now={now} letter={effectiveLetter} cycleDay={today?.cycleDay ?? null} bellTables={bellTables} />
          ) : (
            <HeroTimer now={now} letter={effectiveLetter} cycleDay={today?.cycleDay ?? null} bellTables={bellTables} />
          )}
        </div>
      </div>

      {/* ── RIGHT: PANEL RAIL ────────────────────────────────────────── */}
      <RightRail
        now={now}
        today={today}
        tomorrow={tomorrow}
        nextDay={nextDay}
        noSchool={noSchool}
        weather={weather}
        effectiveLetter={effectiveLetter}
        onLetterChange={setLetterOverride}
        dayPct={dayPct}
        yearPct={yearPct}
        daysLeft={daysLeft}
        onModal={(key) => setModal(key)}
      />

      {/* ── MODALS ───────────────────────────────────────────────────── */}
      <ScheduleEditorModal open={modal === "schedule"} onClose={() => setModal(null)} />
      <ColorsModal        open={modal === "colors"}   onClose={() => setModal(null)} />
      <WeatherModal       open={modal === "weather"}  onClose={() => setModal(null)} weather={weather} />
      <MenusModal         open={modal === "menus"}    onClose={() => setModal(null)} menu={data?.foodmenu ?? null} />
      <CycleDaysModal     open={modal === "cycle"}    onClose={() => setModal(null)} data={data} />
      <MoreModal open={modal === "more"} onClose={() => setModal(null)} schoolDates={schoolDates} />
    </div>
  );
}

function ViewToggle({ value, onChange }: { value: PeriodView; onChange: (view: PeriodView) => void }) {
  const options: { id: PeriodView; label: string }[] = [
    { id: "all", label: "All periods" },
    { id: "focus", label: "One period" },
  ];
  return (
    <div className="shrink-0 flex p-0.5 rounded-xl bg-surface-2" role="group" aria-label="Period view">
      {options.map((opt) => {
        const on = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(opt.id)}
            className={`min-h-9 px-2.5 sm:px-3 rounded-[10px] text-[11px] sm:text-xs font-bold ${
              on ? "bg-surface text-text shadow-sm" : "text-dim"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default App;
