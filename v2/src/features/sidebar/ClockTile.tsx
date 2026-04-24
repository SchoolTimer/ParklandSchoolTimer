const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

type Props = { now: Date };

export function ClockTile({ now }: Props) {
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = String(h % 12 || 12);

  return (
    <div className="card rounded-2xl p-4">
      <div className="text-xs text-dim font-semibold mb-1">
        {DAYS[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}
      </div>
      <div className="flex items-baseline gap-1 tabular">
        <span className="text-4xl font-bold leading-none text-text">{h12}:{m}</span>
        <span className="text-xl font-bold text-accent">:{s}</span>
        <span className="text-sm text-dim">{ampm}</span>
      </div>
    </div>
  );
}
