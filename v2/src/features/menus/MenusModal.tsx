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

// The API sends a placeholder string when a meal has no menu; treat it as empty.
const PLACEHOLDER = /^\s*nothing on the menu!?\s*$/i;

function MenuCard({ title, items: raw }: { title: string; items?: string[] }) {
  const items = raw?.filter((it) => !PLACEHOLDER.test(it));
  return (
    <div className="pp-card">
      <h2 className="pp-menu-title"><i />{title}{items && items.length ? <span className="pp-badge" style={{ fontSize: 12, fontWeight: 600 }}>{items.length} items</span> : null}</h2>
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
