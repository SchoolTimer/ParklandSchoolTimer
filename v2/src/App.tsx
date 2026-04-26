import { useState } from "react";
import { useClock } from "./hooks/useClock";
import { useDayCycle } from "./hooks/useDayCycle";
import { useWeather } from "./hooks/useWeather";
import { useSettingsStore } from "./store/useSettingsStore";
import { useApplyTheme } from "./store/useThemeStore";
import { useClickSound } from "./hooks/useClickSound";
import { useDocumentTitle } from "./hooks/useDocumentTitle";
import type { ScheduleLetter } from "./lib/schedule";
import { schoolDayProgress, schoolWeekProgress, schoolYearProgress } from "./lib/progress";
import { useBellTables, useActiveCustomSchedule } from "./store/useBellStore";

import { HeroTimer } from "./features/timers/HeroTimer";
import { RightRail } from "./features/sidebar/RightRail";

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

  const getEffectiveOverride = useSettingsStore((s) => s.getEffectiveOverride);
  const setLetterOverride    = useSettingsStore((s) => s.setLetterOverride);
  const effectiveLetter: ScheduleLetter = getEffectiveOverride() ?? today?.letter ?? "A";
  const baseBellTables = useBellTables();
  const customSchedule = useActiveCustomSchedule();
  // When a custom schedule is enabled, swap the active letter's slots with the
  // custom slots so all downstream consumers (timers, progress, title) use it.
  const bellTables = customSchedule
    ? { ...baseBellTables, [effectiveLetter]: customSchedule.table }
    : baseBellTables;

  const [modal, setModal] = useState<ModalKey>(null);

  const dayPct  = schoolDayProgress(now, effectiveLetter, bellTables);
  const yearPct = schoolYearProgress(now);
  void schoolWeekProgress(now);

  useDocumentTitle(now, effectiveLetter, today?.cycleDay ?? null, noSchool, bellTables);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-bg p-3 gap-3">

      {/* ── LEFT: HERO PANEL ─────────────────────────────────────────── */}
      <div className="flex-1 card flex flex-col overflow-hidden min-w-0 relative">
        {customSchedule && !noSchool && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/40 backdrop-blur">
            <span className="relative flex shrink-0">
              <span className="absolute inline-flex h-2 w-2 rounded-full bg-accent opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.14em]">
              {customSchedule.name}
            </span>
            <span className="text-[10px] font-bold text-accent/70 uppercase tracking-[0.14em] border-l border-accent/30 pl-2">
              Active
            </span>
          </div>
        )}
        {noSchool ? (
          <div className="flex-1 flex flex-col justify-center px-12 pb-10">
            <p className="text-xs font-semibold text-dim uppercase tracking-[0.18em] mb-5">
              School Day
            </p>
            <h1 className="text-[5.5rem] font-bold text-text leading-[0.95] mb-1">
              School Is
            </h1>
            <h1 className="text-[5.5rem] font-bold text-dim-2 leading-[0.95] mb-10">
              Over
            </h1>
            <p className="text-base text-dim">No school today — enjoy your day!</p>
          </div>
        ) : (
          <HeroTimer now={now} letter={effectiveLetter} cycleDay={today?.cycleDay ?? null} bellTables={bellTables} />
        )}
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
        onModal={(key) => setModal(key)}
      />

      {/* ── MODALS ───────────────────────────────────────────────────── */}
      <ScheduleEditorModal open={modal === "schedule"} onClose={() => setModal(null)} />
      <ColorsModal        open={modal === "colors"}   onClose={() => setModal(null)} />
      <WeatherModal       open={modal === "weather"}  onClose={() => setModal(null)} weather={weather} />
      <MenusModal         open={modal === "menus"}    onClose={() => setModal(null)} menu={data?.foodmenu ?? null} />
      <CycleDaysModal     open={modal === "cycle"}    onClose={() => setModal(null)} data={data} />
      <MoreModal open={modal === "more"} onClose={() => setModal(null)} />
    </div>
  );
}

export default App;
