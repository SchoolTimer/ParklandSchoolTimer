import { useEffect, useState } from "react";
import { useClock } from "./hooks/useClock";
import { useDayCycle } from "./hooks/useDayCycle";
import { useWeather } from "./hooks/useWeather";
import { effectiveLetterOverride, useSettingsStore } from "./store/useSettingsStore";
import { useApplyTheme } from "./store/useThemeStore";
import { useClickSound } from "./hooks/useClickSound";
import { useDocumentTitle } from "./hooks/useDocumentTitle";
import type { ScheduleLetter } from "./lib/schedule";
import { schoolDayProgress, schoolYearProgress } from "./lib/progress";
import { useBellTables, useActiveCustomSchedule } from "./store/useBellStore";

import { Timers } from "./features/v1/Timers";
import { Sidebar } from "./features/v1/Sidebar";

import { ScheduleEditorModal } from "./features/schedule-editor/ScheduleEditorModal";
import { MenusModal } from "./features/menus/MenusModal";
import { WeatherModal } from "./features/panels/WeatherModal";
import { MoreModal } from "./features/panels/MoreModal";
import { CycleDaysModal } from "./features/panels/CycleDaysModal";
import { ColorsModal } from "./features/panels/ColorsModal";
import { AnnouncementModal, ANNOUNCEMENT_ID } from "./features/announcement/AnnouncementModal";

type ModalKey = null | "news" | "schedule" | "colors" | "weather" | "more" | "menus" | "cycle";

function useViewport() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [v, setV] = useState(read);
  useEffect(() => {
    const on = () => setV(read());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return v;
}

function App() {
  useApplyTheme();
  useClickSound();

  const now = useClock(1000);
  const { today, noSchool, data } = useDayCycle();
  const { weather } = useWeather();
  const viewport = useViewport();

  const letterOverride     = useSettingsStore((s) => s.letterOverride);
  const letterOverrideDate = useSettingsStore((s) => s.letterOverrideDate);
  const setLetterOverride  = useSettingsStore((s) => s.setLetterOverride);
  const seenAnnouncement   = useSettingsStore((s) => s.seenAnnouncement);
  const setSeenAnnouncement = useSettingsStore((s) => s.setSeenAnnouncement);
  const effectiveLetter: ScheduleLetter =
    effectiveLetterOverride(letterOverride, letterOverrideDate) ?? today?.letter ?? "A";
  const baseBellTables = useBellTables();
  const customSchedule = useActiveCustomSchedule();
  // A custom schedule swaps the active letter's slots so timers, progress and title use it.
  const bellTables = customSchedule
    ? { ...baseBellTables, [effectiveLetter]: customSchedule.table }
    : baseBellTables;

  const [modal, setModal] = useState<ModalKey>(null);
  const [highlightLunch, setHighlightLunch] = useState(false);
  // V1 narrow layout (aspect <= 1.15): one pane at a time, swapped by the « » toggle.
  const [showSidebar, setShowSidebar] = useState(false);
  const narrow = viewport.w / viewport.h <= 1.15;

  const schoolDates = data?.schoolDates ?? null;
  const dayPct  = schoolDayProgress(now, effectiveLetter, bellTables);
  const yearPct = schoolDates
    ? schoolYearProgress(now, schoolDates.schoolYearStart, schoolDates.schoolYearEnd)
    : null;

  useDocumentTitle(now, effectiveLetter, today?.cycleDay ?? null, noSchool, bellTables);

  // Show the announcement once per id, shortly after load so the slide-in is visible.
  useEffect(() => {
    if (seenAnnouncement === ANNOUNCEMENT_ID) return;
    const t = setTimeout(() => setModal((m) => m ?? "news"), 700);
    return () => clearTimeout(t);
  }, [seenAnnouncement]);

  const open = (key: ModalKey) => { setHighlightLunch(false); setModal(key); };
  const close = () => {
    setHighlightLunch(false);
    if (modal === "news") setSeenAnnouncement(ANNOUNCEMENT_ID);
    setModal(null);
  };

  const sidebar = (
    <Sidebar
      now={now}
      letter={effectiveLetter}
      onLetterChange={setLetterOverride}
      dayPct={dayPct}
      yearPct={yearPct}
      cycleText={data?.daycycle.today || (data ? "-" : "N/A")}
      lastUpdated={null}
      weather={weather}
      onModal={open}
    />
  );

  return (
    <>
      <div className={`v1-root${modal ? " blurred" : ""}`}>
        {narrow ? (
          <>
            <button
              className={`v1-toggle shadows${showSidebar ? " left" : ""}`}
              onClick={() => setShowSidebar((v) => !v)}
              aria-label={showSidebar ? "Back to timers" : "Show sidebar"}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {showSidebar ? <path d="M9 6l6 6-6 6" /> : <path d="M15 6l-6 6 6 6" />}
              </svg>
            </button>
            {showSidebar ? (
              <div className="v1-narrow-sidebar">{sidebar}</div>
            ) : (
              <Timers
                now={now} letter={effectiveLetter} cycleDay={today?.cycleDay ?? null}
                bellTables={bellTables} noSchool={noSchool} viewport={viewport}
              />
            )}
          </>
        ) : (
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Timers
                now={now} letter={effectiveLetter} cycleDay={today?.cycleDay ?? null}
                bellTables={bellTables} noSchool={noSchool} viewport={viewport}
              />
            </div>
            {sidebar}
          </div>
        )}
      </div>

      <ScheduleEditorModal open={modal === "schedule"} highlightLunch={highlightLunch} onClose={close} />
      <AnnouncementModal open={modal === "news"} onClose={close} />
      <ColorsModal    open={modal === "colors"}  onClose={close} />
      <WeatherModal   open={modal === "weather"} onClose={close} weather={weather} />
      <MenusModal     open={modal === "menus"}   onClose={close} menu={data?.foodmenu ?? null} />
      <CycleDaysModal open={modal === "cycle"}   onClose={close} data={data} />
      <MoreModal
        open={modal === "more"}
        onClose={close}
        schoolDates={schoolDates}
        onOpenSchedule={() => open("schedule")}
        onOpenNews={() => open("news")}
      />
    </>
  );
}

export default App;
