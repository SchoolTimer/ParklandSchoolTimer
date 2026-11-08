import { Modal } from "../../components/Modal";
import type { FoodMenu } from "../../lib/api";

type Props = { open: boolean; onClose: () => void; menu: FoodMenu | null };

export function MenusModal({ open, onClose, menu }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Menus">
      <div className="pp-grid c2 stack">
        <MenuCard title="Breakfast" items={menu?.breakfast} />
        <MenuCard title="Lunch" items={menu?.lunch} />
      </div>
    </Modal>
  );
}

function MenuCard({ title, items }: { title: string; items?: string[] }) {
  return (
    <div className="pp-card">
      <h2 className="pp-menu-title"><i />{title}</h2>
      {items && items.length ? (
        <ul className="pp-menu-list">
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      ) : (
        <p className="pp-empty">Nothing listed today.</p>
      )}
    </div>
  );
}
