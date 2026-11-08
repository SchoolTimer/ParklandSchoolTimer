import { useMemo } from "react";
import { formatCountdown } from "../../lib/time";
import { ordinal } from "../../lib/time";
import type { ScheduleLetter, CycleDay } from "../../lib/schedule";
import { daySlots } from "../../lib/timers";
import { useScheduleStore } from "../../store/useScheduleStore";
import type { BellTables } from "../../store/useBellStore";

type Props = {
  now: Date;
  letter: ScheduleLetter;
  cycleDay: CycleDay | null;
  bellTables: BellTables;
  noSchool: boolean;
  viewport: { w: number; h: number };
};

const TEN_HOURS = 10 * 3600 * 1000;
const DASHES = "------------";

/**
 * V1's timer column: finished periods drop away, the rest are sized to fill
 * the screen height (same formula as V1's setTimerHeights), and the running
 * period gets the accent border.
 */
export function Timers({ now, letter, cycleDay, bellTables, noSchool, viewport }: Props) {
  const userSchedule = useScheduleStore((s) => s.schedule);
  const homeroomRoom = useScheduleStore((s) => s.homeroomRoom);
  const lunchPeriod  = useScheduleStore((s) => s.lunchPeriod);

  const rows = useMemo(
    () =>
      daySlots(now, letter, bellTables).map((slot, i) => {
        const entry =
          cycleDay && slot.periodNum !== null
            ? userSchedule[cycleDay].find((p) => p.period === slot.periodNum)
            : undefined;
        // C schedule and the B-schedule homeroom keep V1's labels ("1st Period", "Homeroom").
        const base = slot.slotLabel === "HR" ? "Homeroom" : `${ordinal(Number(slot.slotLabel))} Period`;
        const custom = entry?.className?.trim();
        const room = slot.slotLabel === "HR" ? homeroomRoom : entry?.room;
        const lunch = lunchPeriod !== null && String(lunchPeriod) === slot.slotLabel;
        return { ...slot, key: `${i}-${slot.slotLabel}`, title: custom || base, room, lunch };
      }),
    [now, letter, bellTables, userSchedule, cycleDay, homeroomRoom, lunchPeriod],
  );

  const visible = rows.filter((r) => r.state.status !== "over");

  if (noSchool || visible.length === 0) {
    return (
      <div className="v1-timers">
        <h1 className="v1-over">School Is <br /> Over</h1>
      </div>
    );
  }

  const n = visible.length;
  const H = viewport.h;
  const narrow = viewport.w / viewport.h <= 1.15;
  let height: number, radius: number, margin: number;
  if (narrow) {
    // Phones: true stadium pills with an even gap, centred in the column.
    // 64px at the top keeps clear of the toggle button.
    const gap = 12;
    height = Math.min(92, (H - 64 - 20 - gap * (n - 1)) / n);
    radius = height / 2;
    margin = 0;
  } else if (n <= 4) {
    height = H / 4 - (H / 4) * 0.25;
    radius = H / 4;
    margin = (H - height * n) / (n + 1);
  } else {
    height = H / n - (H / n) * 0.25;
    radius = H / n;
    margin = height / 3.5;
  }

  return (
    <div className={`v1-timers${narrow ? " narrow" : ""}`}>
      {visible.map((r) => {
        const live = r.state.status === "active";
        const startsIn = r.state.status === "upcoming" ? r.state.startsIn : null;
        const endsIn = r.state.status !== "over" ? r.state.endsIn : null;
        return (
          <div
            key={r.key}
            className={`v1-timer shadows${live ? " live" : ""}`}
            style={{ height, borderRadius: radius, marginTop: margin }}
          >
            <h2 className="v1-timer-text v1-timer-title">
              {r.title}
              {r.room ? <span style={{ fontWeight: 300, fontSize: "60%" }}> · {r.room}</span> : null}
              {r.lunch ? <span style={{ fontWeight: 300, fontSize: "60%" }}> · Lunch</span> : null}
            </h2>
            <span className="v1-pair">
              <span className="v1-timer-text v1-timer-start-label">Start:</span>
              <span className="v1-timer-text v1-timer-start">
                {startsIn !== null && startsIn < TEN_HOURS ? formatCountdown(startsIn) : DASHES}
              </span>
            </span>
            <span className="v1-pair">
              <span className="v1-timer-text v1-timer-end-label">End:</span>
              <span className="v1-timer-text v1-timer-end">
                {endsIn !== null ? formatCountdown(endsIn) : DASHES}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
