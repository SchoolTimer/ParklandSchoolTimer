import { Modal } from "../../components/Modal";
import type { SchoolTimerData } from "../../lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  data: SchoolTimerData | null;
};

export function CycleDaysModal({ open, onClose, data }: Props) {
  const dc = data?.daycycle;
  return (
    <Modal open={open} onClose={onClose} title="Cycle Days">
      <div className="grid grid-cols-3 gap-4 text-center">
        <Tile label="Today" value={dc?.today ?? "—"} />
        <Tile label="Tomorrow" value={dc?.tomorrow ?? "—"} />
        <Tile label="Next Day" value={dc?.next_day ?? "—"} />
      </div>
    </Modal>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="card rounded-2xl p-6 text-center">
      <div className="text-sm text-dim mb-2">{label}</div>
      <div className="text-4xl font-bold text-accent">{value}</div>
    </div>
  );
}
