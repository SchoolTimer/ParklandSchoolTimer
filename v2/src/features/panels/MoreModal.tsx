import { useState } from "react";
import { useClock } from "../../hooks/useClock";
import { Modal } from "../../components/Modal";
import { useScheduleStore } from "../../store/useScheduleStore";
import type { SchoolDates } from "../../lib/api";
import { endOfLocalDay } from "../../lib/time";

type Props = {
  open: boolean;
  onClose: () => void;
  schoolDates: SchoolDates | null;
  onOpenSchedule: () => void;
};

const REPO = "https://github.com/SchoolTimer/ParklandSchoolTimer";

const CONTACTS = [
  { name: "Luke", info: " Email: luke@schooltimer.net \n LinkedIn: @lukegutman \n GitHub: @lukelmg" },
  { name: "Krushil", info: " Email: krushilamrutiya@gmail.com \n Instagram: @krushil.amrutiya \n GitHub: @krushil1" },
  { name: "Sooraj", info: " Email: sendsooraj@gmail.com \n Instagram: @soorajtharumia \n GitHub: @soorajtharumia" },
];

function longFmt(ms: number): string {
  if (ms <= 0) return "Expired";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d} Days ${h} Hours ${m} Minutes ${s % 60} Seconds`;
}

export function MoreModal({ open, onClose, schoolDates, onOpenSchedule }: Props) {
  const now      = useClock(1000);
  const resetAll = useScheduleStore((s) => s.resetAll);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const stats = [
    { label: "Last Day of School", end: schoolDates?.schoolYearEnd },
    { label: "Seniors Last Day", end: schoolDates?.seniorsLastDay },
  ];

  return (
    <>
    <Modal open={open} onClose={onClose} title="More Stuff">
      <div style={{ marginBottom: "6vh" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ marginBottom: "1.5vh" }}>
            <span style={{ fontSize: 25, fontWeight: "bold", marginRight: 10 }}>{s.label}</span>
            <span className="v1-stat-row" style={{ display: "inline-block" }}>
              {s.end ? longFmt(endOfLocalDay(s.end).getTime() - now.getTime()) : "-"}
            </span>
          </div>
        ))}
      </div>

      <div>
        <div className="v1-request-row">
          <a className="v1-request shadows" href={`${REPO}/issues/new?template=bug_report.md`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>Bug Report</a>
          <a className="v1-request shadows" href={`${REPO}/issues/new`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>Feature Request</a>
          <button className="v1-request shadows" onClick={() => setPrivacyOpen(true)}>Privacy Policy</button>
        </div>
        <div className="v1-request-row">
          {CONTACTS.map((c) => (
            <button key={c.name} className="v1-request shadows" onClick={() => alert(c.info)}>
              Contact {c.name}
            </button>
          ))}
        </div>
        <div className="v1-request-row center">
          <button className="v1-request shadows" onClick={() => { onClose(); onOpenSchedule(); }}>My Schedule</button>
          <button className="v1-request shadows" onClick={() => setConfirmOpen(true)}>Reset School Timer</button>
        </div>
      </div>

      <p className="v1-dev">Developed by Luke Gutman, maintained by Krushil Amrutiya &amp; Sooraj Tharumia</p>
      <p className="v1-dev" style={{ margin: 0, fontWeight: 800 }}>Copyright &copy; Luke Gutman, 2025</p>
    </Modal>

    <Modal open={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy">
      <div className="flex flex-col gap-4 text-text leading-relaxed text-base">
        <p className="text-sm">Last updated: April 26, 2026</p>

        <section>
          <h4 className="text-lg font-semibold mb-1.5">What We Collect</h4>
          <p>
            SchoolTimer does <span className="font-semibold text-text">not</span> require an account
            and does not collect personally identifying information such as your name, email, or location.
            We do, however, use anonymous analytics tools to understand aggregate usage — see &ldquo;Analytics&rdquo; below.
          </p>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-1.5">Local Storage</h4>
          <p>
            Your preferences — color theme, class schedule, room numbers, and lunch period —
            are stored only in your browser&apos;s local storage on your device. They never leave your device
            and are not transmitted to us or any server.
          </p>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-1.5">External Data</h4>
          <p className="mb-1.5">The app fetches the following public data over the network:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Day cycle, food menu, and bell schedules from our SchoolTimer API.</li>
            <li>Local weather from a public weather API.</li>
            <li>Calendar data scraped from the school&apos;s publicly available calendar page.</li>
          </ul>
          <p className="mt-1.5">No identifying request data (such as your IP) is logged or retained beyond standard hosting provider defaults.</p>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-1.5">Analytics</h4>
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
          <h4 className="text-lg font-semibold mb-1.5">Advertising</h4>
          <p>
            SchoolTimer does not display ads and does not use advertising or remarketing tracking.
          </p>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-1.5">Children&apos;s Privacy</h4>
          <p>
            SchoolTimer is intended for students. Because no personally identifying information is collected,
            it is consistent with COPPA and FERPA expectations for school-context tools. Analytics data is
            aggregate and anonymous.
          </p>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-1.5">Open Source</h4>
          <p>
            The full source code is available at{" "}
            <a
              href="https://github.com/SchoolTimer/ParklandSchoolTimer"
              target="_blank" rel="noreferrer"
              className="underline"
            >
              https://github.com/SchoolTimer/ParklandSchoolTimer
            </a>{" "}
            for anyone to audit.
          </p>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-1.5">Contact</h4>
          <p>
            Questions or concerns? Reach out to a maintainer listed in the Contributors section,
            or open an issue on GitHub.
          </p>
        </section>
      </div>
    </Modal>

    <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Reset all data?" size="short">
      <p className="popuplabel first" style={{ marginBottom: "2vh" }}>
        This permanently erases your color theme and your class schedule and room numbers. It cannot be undone.
      </p>
      <div className="v1-request-row">
        <button className="v1-request shadows" onClick={() => setConfirmOpen(false)}>Cancel</button>
        <button className="v1-request shadows" style={{ color: "var(--accent)" }} onClick={resetAll}>Erase Everything</button>
      </div>
    </Modal>
    </>
  );
}
