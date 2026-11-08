import { Modal } from "../../components/Modal";
import type { FoodMenu } from "../../lib/api";

type Props = { open: boolean; onClose: () => void; menu: FoodMenu | null };

const list = (items?: string[]) => (items && items.length ? items.join(", ") : "-");

export function MenusModal({ open, onClose, menu }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Menus">
      <div>
        <p className="v1-menu-title">Breakfast</p>
        <div className="v1-menu-items">{list(menu?.breakfast)}</div>
      </div>
      <br /><br />
      <div>
        <p className="v1-menu-title">Lunch</p>
        <div className="v1-menu-items">{list(menu?.lunch)}</div>
      </div>
    </Modal>
  );
}
