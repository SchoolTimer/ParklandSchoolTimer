import { Modal } from "../../components/Modal";
import type { FoodMenu } from "../../lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  menu: FoodMenu | null;
};

export function MenusModal({ open, onClose, menu }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Today's Menu" widthClass="max-w-lg">
      {menu ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <MenuColumn label="Breakfast" items={menu.breakfast} />
          <MenuColumn label="Lunch" items={menu.lunch} />
        </div>
      ) : (
        <p className="text-sm text-dim py-6">Menu unavailable.</p>
      )}
    </Modal>
  );
}

const isEmptySentinel = (items: string[]) =>
  items.length === 1 && /^nothing on the menu!?$/i.test(items[0].trim());

function MenuColumn({ label, items: rawItems }: { label: string; items: string[] }) {
  const items = isEmptySentinel(rawItems) ? [] : rawItems;
  return (
    <section>
      <h3 className="text-sm font-bold text-accent">{label}</h3>
      {items.length ? (
        <ul className="mt-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="py-2 text-sm text-text border-b border-border last:border-b-0"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-dim">Nothing listed.</p>
      )}
    </section>
  );
}
