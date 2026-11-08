import type { ScheduleLetter } from "../../lib/schedule";
import type { Weather } from "../../hooks/useWeather";

type ModalKey = "colors" | "weather" | "more" | "menus" | "cycle";

type Props = {
  now: Date;
  letter: ScheduleLetter;
  onLetterChange: (l: ScheduleLetter) => void;
  dayPct: number;
  yearPct: number | null;
  cycleText: string;
  lastUpdated: string | null;
  weather: Weather | null;
  onModal: (key: ModalKey) => void;
};

const LETTERS: ScheduleLetter[] = ["A", "B", "C", "D"];

export function Sidebar({
  now, letter, onLetterChange, dayPct, yearPct, cycleText, lastUpdated, weather, onModal,
}: Props) {
  const h = now.getHours();
  // V1 quirk kept: AM hours keep their leading zero ("07:40").
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h < 10 ? `0${h}` : h;
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
  const year = yearPct ?? 0;

  return (
    <div className="v1-sidebars">
      {/* right column */}
      <div className="v1-sidebar">
        <div className="v1-square shadows">
          <h6 className="v1-h6">School Day <br /> Progress</h6>
          <div className="v1-bar-outer shadows"><div className="v1-bar-inner" style={{ width: `${dayPct}%` }} /></div>
          <h6 className="v1-h6 v1-bar-label">{dayPct}%</h6>
        </div>
        <div className="v1-square shadows">
          <h6 className="v1-h6">School Year<br /> Progress</h6>
          <div className="v1-bar-outer shadows"><div className="v1-bar-inner" style={{ width: `${year}%` }} /></div>
          <h6 className="v1-h6 v1-bar-label">{yearPct === null ? "-" : `${year}%`}</h6>
        </div>
        <div className="v1-square shadows" style={{ textAlign: "center" }}>
          <h6 className="v1-h6 v1-time-label">Current Time</h6>
          <h6 className="v1-h6 v1-time-top">{hour12}:{mm}</h6>
          <h6 className="v1-h6 v1-time-bottom">:{ss} {h >= 12 ? "PM" : "AM"}</h6>
        </div>
        <div className="v1-square shadows" style={{ textAlign: "center" }}>
          <div style={{ width: "80%", margin: "0 auto", padding: 5 }}>
            <h6 className="v1-h6 v1-day">{day}</h6>
            <h6 className="v1-h6 v1-date">{date} <br />{now.getFullYear()}</h6>
          </div>
        </div>
      </div>

      {/* left column */}
      <div className="v1-sidebar">
        <div className="v1-rect shadows">
          <h6 className="v1-h6" style={{ paddingTop: "2vh" }}>Schedule</h6>
          <div role="radiogroup" aria-label="Schedule">
            {LETTERS.map((l) => (
              <div key={l} className="v1-radio-row">
                <h6 className="v1-radio-label">{l}</h6>
                <button
                  type="button"
                  role="radio"
                  aria-checked={l === letter}
                  aria-label={`${l} schedule`}
                  className="v1-radio-outer shadows"
                  onClick={() => onLetterChange(l)}
                >
                  {l === letter && <div className="v1-radio-inner" />}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div
          className="v1-square shadows"
          style={{ cursor: "pointer" }}
          onClick={() => onModal("cycle")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onModal("cycle"); }}
        >
          <h6 className="v1-h6" style={{ paddingTop: "2vh", textAlign: "center" }}>Cycle Day</h6>
          <h6 className="v1-last-updated">{lastUpdated ?? ""}</h6>
          <h6 className="v1-cycle-output">{cycleText}</h6>
        </div>
        <div className="v1-square" style={{ textAlign: "center" }}>
          <button className="v1-btn shadows" onClick={() => onModal("colors")}>Color Picker</button>
          <button className="v1-btn right shadows" onClick={() => onModal("menus")}>Food Menus</button>
          <button className="v1-btn shadows" onClick={() => onModal("more")}>More Stuff</button>
          <button className="v1-btn right shadows" onClick={() => onModal("weather")}>
            {weather ? <>Temp: {weather.temp} °F</> : "Temp: -"}
          </button>
        </div>
      </div>
    </div>
  );
}
