import { useState } from "react";
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const msLast    = Math.max(0, LAST_DAY.getTime()    - now.getTime());
  const msSeniors = Math.max(0, SENIORS_END.getTime() - now.getTime());

  return (
    <>
    <Modal open={open} onClose={onClose} title="More" widthClass="max-w-lg">

      {/* ── Countdowns ─────────────────────────────────────────── */}
      <p className="text-[10px] font-bold text-dim uppercase tracking-[0.15em] mb-2">Countdowns</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Countdown label="Last Day of School" date="Jun 9" ms={msLast}    pct={pct(now, SCHOOL_START, LAST_DAY)} />
        <Countdown label="Seniors' Last Day"  date="Jun 3" ms={msSeniors} pct={pct(now, SCHOOL_START, SENIORS_END)} />
      </div>

      {/* ── Actions ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <a
          href="https://github.com/SchoolTimer/ParklandSchoolTimer/issues/new?template=bug_report.md"
          target="_blank" rel="noreferrer"
          className="text-center px-3 py-2 rounded-xl border border-border bg-surface-2 text-xs font-semibold text-text hover:border-border-2 transition-colors"
        >
          Bug Report
        </a>
        <button
          onClick={() => setPrivacyOpen(true)}
          className="px-3 py-2 rounded-xl border border-border bg-surface-2 text-xs font-semibold text-text hover:border-border-2 transition-colors"
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setConfirmOpen(true)}
          className="px-3 py-2 rounded-xl border border-border bg-surface-2 text-xs font-semibold text-danger hover:border-border-2 transition-colors"
        >
          Reset Data
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

    {/* ── Privacy Policy ─────────────────────────────────────────── */}
    <Modal open={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy" widthClass="max-w-lg">
      <div className="flex flex-col gap-4 text-xs text-text leading-relaxed">
        <p className="text-[10px] text-dim">Last updated: April 26, 2026</p>

        <section>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-dim mb-1.5">What We Collect</h4>
          <p>
            SchoolTimer does <span className="font-semibold text-text">not</span> require an account
            and does not collect personally identifying information such as your name, email, or location.
            We do, however, use anonymous analytics tools to understand aggregate usage — see &ldquo;Analytics&rdquo; below.
          </p>
        </section>

        <section>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-dim mb-1.5">Local Storage</h4>
          <p>
            Your preferences — color theme, class schedule, room numbers, lunch period, and daily streak —
            are stored only in your browser&apos;s local storage on your device. They never leave your device
            and are not transmitted to us or any server.
          </p>
        </section>

        <section>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-dim mb-1.5">External Data</h4>
          <p className="mb-1.5">The app fetches the following public data over the network:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Day cycle, food menu, and bell schedules from our SchoolTimer API.</li>
            <li>Local weather from a public weather API.</li>
            <li>Calendar data scraped from the school&apos;s publicly available calendar page.</li>
          </ul>
          <p className="mt-1.5">No identifying request data (such as your IP) is logged or retained beyond standard hosting provider defaults.</p>
        </section>

        <section>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-dim mb-1.5">Analytics</h4>
          <p className="mb-1.5">SchoolTimer uses two anonymous analytics services:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <span className="font-semibold text-text">Google Analytics 4</span> — aggregate page-view
              and session counts. We do not share data with other Google products and IP anonymization
              is enabled by default in GA4.
            </li>
            <li>
              <span className="font-semibold text-text">Microsoft Clarity</span> — anonymized session
              recordings and heatmaps used to identify UI bugs. Recordings are masked by default and
              do not capture text input.
            </li>
          </ul>
          <p className="mt-1.5">
            Both services may set first-party cookies. You can block them with any standard ad-blocker
            (uBlock Origin, Brave Shields, etc.) without affecting the app&apos;s functionality.
          </p>
        </section>

        <section>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-dim mb-1.5">Advertising</h4>
          <p>
            SchoolTimer does not display ads and does not use advertising or remarketing tracking.
          </p>
        </section>

        <section>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-dim mb-1.5">Children&apos;s Privacy</h4>
          <p>
            SchoolTimer is intended for students. Because no personally identifying information is collected,
            it is consistent with COPPA and FERPA expectations for school-context tools. Analytics data is
            aggregate and anonymous.
          </p>
        </section>

        <section>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-dim mb-1.5">Open Source</h4>
          <p>
            The full source code is available at{" "}
            <a
              href="https://github.com/SchoolTimer/ParklandSchoolTimer"
              target="_blank" rel="noreferrer"
              className="text-accent hover:underline"
            >
              https://github.com/SchoolTimer/ParklandSchoolTimer
            </a>{" "}
            for anyone to audit.
          </p>
        </section>

        <section>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-dim mb-1.5">Contact</h4>
          <p>
            Questions or concerns? Reach out to a maintainer listed in the Contributors section,
            or open an issue on GitHub.
          </p>
        </section>
      </div>
    </Modal>

    {/* ── Reset confirm ──────────────────────────────────────────── */}
    {confirmOpen && (
      <div
        className="fixed inset-0 z-60 flex items-center justify-center p-6"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
        onClick={() => setConfirmOpen(false)}
      >
        <div
          className="card w-full max-w-sm p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-base font-bold text-text mb-1">Reset all data?</h3>
          <p className="text-xs text-dim mb-4">This will permanently erase:</p>
          <ul className="flex flex-col gap-2 mb-6">
            {["Color theme", "Class schedule & room numbers", "Daily streak"].map((item) => (
              <li key={item} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-2 border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
                <span className="text-xs font-medium text-text">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-dim mb-4">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="flex-1 py-2 rounded-xl border border-border bg-surface-2 text-xs font-semibold text-text hover:bg-border transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={resetAll}
              className="flex-1 py-2 rounded-xl bg-danger text-xs font-bold text-white hover:opacity-90 transition-opacity"
            >
              Erase Everything
            </button>
          </div>
        </div>
      </div>
    )}
    </>
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
      <div className="h-1 w-full bg-border overflow-hidden">
        <div className="h-full" style={{ width: `${p}%`, background: "var(--color-accent)" }} />
      </div>
      <p className="text-[9px] text-dim mt-1">{p}% elapsed</p>
    </div>
  );
}
