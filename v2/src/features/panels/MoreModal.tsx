import { useClock } from "../../hooks/useClock";
import { Modal } from "../../components/Modal";
import { useScheduleStore } from "../../store/useScheduleStore";

type Props = { open: boolean; onClose: () => void };

const CONTRIBUTORS = [
  { name: "Luke Gutman",     role: "Developer",   email: "luke@schooltimer.net",       github: "lukelmg",       social: "LinkedIn: @lukegutman" },
  { name: "Krushil Amrutiya", role: "Maintainer",  email: "krushilamrutiya@gmail.com",  github: "krushil1",      social: "Instagram: @krushil.amrutiya" },
  { name: "Sooraj Tharumia", role: "Maintainer",  email: "sendsooraj@gmail.com",        github: "soorajtharumia", social: "Instagram: @soorajtharumia" },
];

const SCHOOL_START = new Date("2025-08-15T00:00:00");
const SENIORS_END  = new Date("2026-06-03T15:00:00");
const LAST_DAY     = new Date("2026-06-09T14:53:00");

function fmt(ms: number): string {
  if (ms <= 0) return "0s";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${sc}s`].filter(Boolean).join(" ");
}

function pct(now: Date, start: Date, end: Date) {
  return Math.max(0, Math.min(100, Math.round(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100)));
}

export function MoreModal({ open, onClose }: Props) {
  const now      = useClock(1000);
  const resetAll = useScheduleStore((s) => s.resetAll);

  const msLast    = Math.max(0, LAST_DAY.getTime()    - now.getTime());
  const msSeniors = Math.max(0, SENIORS_END.getTime() - now.getTime());

  return (
    <Modal open={open} onClose={onClose} title="More" widthClass="max-w-lg">

      {/* ── Countdowns ─────────────────────────────────────────── */}
      <p className="text-[10px] font-bold text-dim uppercase tracking-[0.15em] mb-2">Countdowns</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Countdown label="Last Day of School" date="Jun 9" ms={msLast}    pct={pct(now, SCHOOL_START, LAST_DAY)} />
        <Countdown label="Seniors' Last Day"  date="Jun 3" ms={msSeniors} pct={pct(now, SCHOOL_START, SENIORS_END)} />
      </div>

      {/* ── Actions ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <a
          href="https://github.com/SchoolTimer/schooltimer/issues/new?template=bug_report.md"
          target="_blank" rel="noreferrer"
          className="text-center px-3 py-2 rounded-xl border border-border bg-surface-2 text-xs font-semibold text-text hover:border-border-2 transition-colors"
        >
          Bug Report
        </a>
        <button
          onClick={() => { if (confirm("Erase every cycle day? This can't be undone.")) resetAll(); }}
          className="px-3 py-2 rounded-xl border border-border bg-surface-2 text-xs font-semibold text-danger hover:border-border-2 transition-colors"
        >
          Reset Schedule Data
        </button>
      </div>

      {/* ── Contributors ───────────────────────────────────────── */}
      <p className="text-[10px] font-bold text-dim uppercase tracking-[0.15em] mb-2">Contributors</p>
      <div className="flex flex-col gap-1.5 mb-4">
        {CONTRIBUTORS.map((c) => (
          <div key={c.name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-2 border border-border">
            <div className="w-7 h-7 rounded-full bg-accent-soft border border-accent/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-accent">{c.name[0]}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-text leading-none">{c.name}</p>
              <p className="text-[10px] text-dim mt-0.5">{c.role} · {c.social}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <a href={`mailto:${c.email}`} className="text-[10px] text-dim hover:text-accent transition-colors">{c.email}</a>
              <a href={`https://github.com/${c.github}`} target="_blank" rel="noreferrer" className="text-[10px] text-dim hover:text-accent transition-colors">gh/{c.github}</a>
            </div>
          </div>
        ))}
      </div>

    </Modal>
  );
}

function Countdown({ label, date, ms, pct: p }: { label: string; date: string; ms: number; pct: number }) {
  return (
    <div className="px-3 py-3 rounded-xl bg-surface-2 border border-border">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] font-semibold text-text">{label}</span>
        <span className="text-[10px] text-dim">{date}</span>
      </div>
      <p className="text-base font-bold tabular text-text leading-none mb-2">{fmt(ms)}</p>
      <div className="h-1 w-full rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${p}%`, background: "var(--color-accent)" }} />
      </div>
      <p className="text-[9px] text-dim mt-1">{p}% elapsed</p>
    </div>
  );
}
