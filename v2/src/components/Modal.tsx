import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  widthClass?: string;
};

export function Modal({ open, onClose, title, children, widthClass = "max-w-2xl" }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-6"
      onClick={onClose}
    >
      <div
        className={`card modal-panel w-full ${widthClass} max-h-[92dvh] overflow-auto rounded-b-none sm:rounded-b-[22px]`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-start justify-between px-6 pt-5 sm:px-8 sm:pt-7">
          <div>
            <h2 className="text-2xl sm:text-4xl font-normal text-text leading-tight">{title}</h2>
            <div className="mt-3 h-1.5 w-16 rounded-full bg-accent" />
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full neu-raised-sm flex items-center justify-center text-dim hover:text-text text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-6 pt-5 sm:p-8 sm:pt-6">{children}</div>
      </div>
    </div>
  );
}
