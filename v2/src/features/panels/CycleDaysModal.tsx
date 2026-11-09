import { Modal } from "../../components/Modal";
import type { SchoolTimerData } from "../../lib/api";

type Props = { open: boolean; onClose: () => void; data: SchoolTimerData | null };

export function CycleDaysModal({ open, onClose, data }: Props) {
  const dc = data?.daycycle;
  return (
    <Modal open={open} onClose={onClose} title="Cycle Days" size="short">
      <p className="pp-hint">The number is the cycle day; the letter is that day&apos;s bell schedule.</p>
      <div className="pp-grid c3">
        <Box label="Today" value={dc?.today} today />
        <Box label="Tomorrow" value={dc?.tomorrow} />
        <Box label="Next day" value={dc?.next_day} />
      </div>
    </Modal>
  );
}

function Box({ label, value, today }: { label: string; value?: string; today?: boolean }) {
  return (
    <div className={`pp-card pp-cycle${today ? " today" : ""}`}>
      <div className="l">{label}</div>
      <div className="v">{value || "-"}</div>
    </div>
  );
}
