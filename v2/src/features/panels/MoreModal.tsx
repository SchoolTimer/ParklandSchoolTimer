import { useState } from "react";
import { useClock } from "../../hooks/useClock";
import { Modal } from "../../components/Modal";
import { useScheduleStore } from "../../store/useScheduleStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import type { SchoolDates } from "../../lib/api";
import { endOfLocalDay } from "../../lib/time";
import { schoolYearProgress } from "../../lib/progress";

type Props = {
  open: boolean;
  onClose: () => void;
  schoolDates: SchoolDates | null;
  onOpenSchedule: () => void;
  onOpenNews: () => void;
};

const REPO = "https://github.com/SchoolTimer/ParklandSchoolTimer";

const CONTACTS = [
  { name: "Luke Gutman", role: "Developer", info: " Email: luke@schooltimer.net \n LinkedIn: @lukegutman \n GitHub: @lukelmg" },
  { name: "Krushil Amrutiya", role: "Maintainer", info: " Email: krushilamrutiya@gmail.com \n Instagram: @krushil.amrutiya \n GitHub: @krushil1" },
  { name: "Sooraj Tharumia", role: "Maintainer", info: " Email: sendsooraj@gmail.com \n Instagram: @soorajtharumia \n GitHub: @soorajtharumia" },
];

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export function MoreModal({ open, onClose, schoolDates, onOpenSchedule, onOpenNews }: Props) {
  const now      = useClock(1000);
  const resetAll = useScheduleStore((s) => s.resetAll);
  const soundsOn = useSettingsStore((s) => s.soundsOn);
  const setSoundsOn = useSettingsStore((s) => s.setSoundsOn);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const stats = [
    { label: "Last day of school", end: schoolDates?.schoolYearEnd },
    { label: "Seniors' last day", end: schoolDates?.seniorsLastDay },
  ];

  return (
    <>
    <Modal open={open} onClose={onClose} title="More Stuff">
      <div className="pp-section">
        <p className="pp-label">Countdowns</p>
        <div className="pp-grid c2 stack">
          {stats.map((st) => {
            const ms = st.end ? endOfLocalDay(st.end).getTime() - now.getTime() : null;
            const done = ms !== null && ms <= 0;
            const t = ms !== null ? parts(ms) : null;
            const pct = st.end && schoolDates ? schoolYearProgress(now, schoolDates.schoolYearStart, st.end) : 0;
            return (
              <div key={st.label} className="pp-card">
                <p className="pp-count-title">{st.label}</p>
                {t ? (
                  done ? (
                    <div className="pp-count-n">Done</div>
                  ) : (
                    <div className="pp-count-n">{t.d}<small>days</small></div>
                  )
                ) : (
                  <div className="pp-count-n">-</div>
                )}
                <p className="pp-count-sub">{t && !done ? `${t.h}h ${t.m}m ${t.s}s` : done ? "Expired" : ""}</p>
                <div className="pp-bar"><div style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pp-section">
        <p className="pp-label">Preferences</p>
        <div className="pp-list">
          <button className="pp-row" onClick={() => { onClose(); onOpenSchedule(); }}>
            <span>My schedule<small>Class names, rooms and lunch period</small></span>
            <span className="chev">&#8250;</span>
          </button>
          <div className="pp-row static">
            <span id="snd-l">Button click sounds</span>
            <button
              type="button"
              role="switch"
              aria-checked={soundsOn}
              aria-labelledby="snd-l"
              className="pp-switch"
              onClick={() => setSoundsOn(!soundsOn)}
            />
          </div>
        </div>
      </div>

      <div className="pp-section">
        <p className="pp-label">Help &amp; feedback</p>
        <div className="pp-list">
          <button className="pp-row" onClick={() => { onClose(); onOpenNews(); }}>
            <span>What&apos;s new</span><span className="chev">&#8250;</span>
          </button>
          <a className="pp-row" href={`${REPO}/issues/new?template=bug_report.md`} target="_blank" rel="noreferrer">
            <span>Report a bug</span><span className="chev">&#8250;</span>
          </a>
          <a className="pp-row" href={`${REPO}/issues/new`} target="_blank" rel="noreferrer">
            <span>Request a feature</span><span className="chev">&#8250;</span>
          </a>
          <button className="pp-row" onClick={() => setPrivacyOpen(true)}>
            <span>Privacy policy</span><span className="chev">&#8250;</span>
          </button>
        </div>
      </div>

      <div className="pp-section">
        <p className="pp-label">Contact the team</p>
        <div className="pp-list">
          {CONTACTS.map((c) => (
            <button key={c.name} className="pp-row" onClick={() => alert(c.info)}>
              <span>{c.name}<small>{c.role}</small></span><span className="chev">&#8250;</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pp-section">
        <div className="pp-list">
          <button className="pp-row danger" onClick={() => setConfirmOpen(true)}>
            <span>Reset School Timer</span>
          </button>
        </div>
      </div>

      <p className="pp-foot">
        Developed by Luke Gutman, maintained by Krushil Amrutiya &amp; Sooraj Tharumia<br />
        <b>Copyright &copy; Luke Gutman, 2025</b>
      </p>
    </Modal>

    <Modal open={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy">

      <div className="pp-policy">
        <p style={{ opacity: 0.7 }}>Last updated: April 26, 2026</p>

        <section>
          <h4>What We Collect</h4>
          <p>
            SchoolTimer does <span>not</span> require an account
            and does not collect personally identifying information such as your name, email, or location.
            We do, however, use anonymous analytics tools to understand aggregate usage — see &ldquo;Analytics&rdquo; below.
          </p>
        </section>

        <section>
          <h4>Local Storage</h4>
          <p>
            Your preferences — color theme, class schedule, room numbers, and lunch period —
            are stored only in your browser&apos;s local storage on your device. They never leave your device
            and are not transmitted to us or any server.
          </p>
        </section>

        <section>
          <h4>External Data</h4>
          <p>The app fetches the following public data over the network:</p>
          <ul>
            <li>Day cycle, food menu, and bell schedules from our SchoolTimer API.</li>
            <li>Local weather from a public weather API.</li>
            <li>Calendar data scraped from the school&apos;s publicly available calendar page.</li>
          </ul>
          <p>No identifying request data (such as your IP) is logged or retained beyond standard hosting provider defaults.</p>
        </section>

        <section>
          <h4>Analytics</h4>
          <p>SchoolTimer uses two anonymous analytics services:</p>
          <ul>
            <li>
              <span>Google Analytics 4</span> — aggregate page-view
              and session counts. We do not share data with other Google products and IP anonymization
              is enabled by default in GA4.
            </li>
            <li>
              <span>Microsoft Clarity</span> — anonymized session
              recordings and heatmaps used to identify UI bugs. Recordings are masked by default and
              do not capture text input.
            </li>
          </ul>
          <p>
            Both services may set first-party cookies. You can block them with any standard ad-blocker
            (uBlock Origin, Brave Shields, etc.) without affecting the app&apos;s functionality.
          </p>
        </section>

        <section>
          <h4>Advertising</h4>
          <p>
            SchoolTimer does not display ads and does not use advertising or remarketing tracking.
          </p>
        </section>

        <section>
          <h4>Children&apos;s Privacy</h4>
          <p>
            SchoolTimer is intended for students. Because no personally identifying information is collected,
            it is consistent with COPPA and FERPA expectations for school-context tools. Analytics data is
            aggregate and anonymous.
          </p>
        </section>

        <section>
          <h4>Open Source</h4>
          <p>
            The full source code is available at{" "}
            <a
              href="https://github.com/SchoolTimer/ParklandSchoolTimer"
              target="_blank" rel="noreferrer"
             
            >
              https://github.com/SchoolTimer/ParklandSchoolTimer
            </a>{" "}
            for anyone to audit.
          </p>
        </section>

        <section>
          <h4>Contact</h4>
          <p>
            Questions or concerns? Reach out to a maintainer listed in the Contributors section,
            or open an issue on GitHub.
          </p>
        </section>
      </div>
    </Modal>

    <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Reset all data?" size="short">
      <p className="pp-hint">
        This permanently erases your color theme and your class schedule and room numbers. It cannot be undone.
      </p>
      <div className="pp-grid c2" style={{ marginTop: 20 }}>
        <button className="pp-btn" onClick={() => setConfirmOpen(false)}>Cancel</button>
        <button className="pp-btn solid" onClick={resetAll}>Erase everything</button>
      </div>
    </Modal>
    </>
  );
}
