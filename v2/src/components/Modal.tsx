import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "default" | "short" | "wide";
  /** Accepted for older call sites; sizing is handled by `size`. */
  widthClass?: string;
};

/** V1's popup: slides in from the left, red rule under a thin title, × top right. */
export function Modal({ open, onClose, title, children, size = "default" }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const cls = ["popup", open ? "open" : "", size === "short" ? "short" : "", size === "wide" ? "wide" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {open && <div className="popup-backdrop" onClick={onClose} />}
      <div className={cls} role="dialog" aria-modal={open} aria-label={title} aria-hidden={!open}>
        <button className="popup-x" onClick={onClose} aria-label="Close" tabIndex={open ? 0 : -1}>
          &#215;
        </button>
        <h1 className="popupheader">{title}</h1>
        <hr className="popup-rule" />
        {children}
      </div>
    </>
  );
}
