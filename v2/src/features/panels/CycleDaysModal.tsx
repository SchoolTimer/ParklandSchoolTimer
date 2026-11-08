import { Modal } from "../../components/Modal";
import type { SchoolTimerData } from "../../lib/api";

type Props = { open: boolean; onClose: () => void; data: SchoolTimerData | null };

export function CycleDaysModal({ open, onClose, data }: Props) {
  const dc = data?.daycycle;
  return (
    <Modal open={open} onClose={onClose} title="Cycle Days" size="short">
      <div className="v1-cycle-row" style={{ textAlign: "center" }}>
        <Box label="Today" value={dc?.today} />
        <Box label="Tomorrow" value={dc?.tomorrow} />
        <Box label="The Next Day" value={dc?.next_day} />
      </div>
    </Modal>
  );
}

function Box({ label, value }: { label: string; value?: string }) {
  return (
    <div className="v1-cycle-box shadows">
      <h6 className="v1-h6">{label}</h6>
      <h6 className="v1-cycle-out">{value || "-"}</h6>
    </div>
  );
}
