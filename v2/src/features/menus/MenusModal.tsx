import { Modal } from "../../components/Modal";
import type { FoodMenu } from "../../lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  menu: FoodMenu | null;
};

export function MenusModal({ open, onClose, menu }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Today's Menu" widthClass="max-w-md">
      {menu ? (
        <div className="flex flex-col gap-5">
          <MenuSection label="Breakfast" items={menu.breakfast} />
          <MenuSection label="Lunch"     items={menu.lunch} />
        </div>
      ) : (
        <p className="text-sm text-dim text-center py-8">Menu unavailable</p>
      )}
    </Modal>
  );
}

const isEmptySentinel = (items: string[]) =>
  items.length === 1 && /^nothing on the menu!?$/i.test(items[0].trim());

function MenuSection({ label, items: rawItems }: { label: string; items: string[] }) {
  const items = isEmptySentinel(rawItems) ? [] : rawItems;
  return (
    <div
      className="rounded-2xl overflow-hidden border border-border"
      style={{ background: "var(--color-surface-2)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-3 border-b border-border"
        style={{ background: "var(--color-surface)" }}
      >
        <p className="text-sm font-bold text-text flex-1">{label}</p>
        <span className="text-[10px] font-semibold text-dim bg-surface-2 px-2 py-0.5 rounded-full">
          {items.length} items
        </span>
      </div>

      {/* Items */}
      {items.length ? (
        <ul className="divide-y divide-border">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 px-5 py-3">
              <span className="text-[8px] text-accent">●</span>
              <span className="text-sm text-text leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-4 text-sm text-dim">Nothing listed</p>
      )}
    </div>
  );
}
