import { Modal } from "../../components/Modal";

/** Bump this id to show the announcement again to everyone. */
export const ANNOUNCEMENT_ID = "2026-v2-launch";

type Props = { open: boolean; onClose: () => void };

const ITEMS = [
  { t: "Same look, rebuilt", d: "School Timer has the design you know, on a faster, more reliable foundation." },
  { t: "My Schedule", d: "Add your class names and rooms for each cycle day — they show right on your timers." },
  { t: "Lunch countdown", d: "Pick your lunch period and it's marked on your timers." },
  { t: "Better on phones", d: "A cleaner phone layout, with the sidebar one tap away." },
  { t: "New color picker", d: "Preview themes at a glance, or make your own with hex colors." },
];

export function AnnouncementModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="What's New" size="short">
      <p className="pp-hint">Welcome to the new School Timer. Here&apos;s what changed:</p>
      <div className="pp-list">
        {ITEMS.map((it) => (
          <div key={it.t} className="pp-row static">
            <span>{it.t}<small>{it.d}</small></span>
          </div>
        ))}
      </div>
      <div className="pp-foot-actions" style={{ justifyContent: "flex-end" }}>
        <button type="button" className="pp-btn solid" onClick={onClose}>Got it</button>
      </div>
    </Modal>
  );
}
