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

  const [modal, setModal] = useState<ModalKey>(null);

  const dayPct  = schoolDayProgress(now, effectiveLetter);
  const yearPct = schoolYearProgress(now);
  void schoolWeekProgress(now);

  useDocumentTitle(now, effectiveLetter, today?.cycleDay ?? null, noSchool);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-bg p-3 gap-3">

      {/* ── LEFT: HERO PANEL ─────────────────────────────────────────── */}
      <div className="flex-1 card flex flex-col overflow-hidden min-w-0">
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
          <HeroTimer now={now} letter={effectiveLetter} cycleDay={today?.cycleDay ?? null} />
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
