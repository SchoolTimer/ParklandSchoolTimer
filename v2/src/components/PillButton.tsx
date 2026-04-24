import type { ReactNode } from "react";

type Props = {
  onClick?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  active?: boolean;
  className?: string;
  small?: boolean;
};

export function PillButton({ onClick, children, icon, active, className = "", small }: Props) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl font-semibold border transition-all duration-200 ${
        small ? "px-3 h-8 text-xs" : "px-4 h-10 text-sm"
      } ${
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-surface text-text hover:border-border-2 hover:text-accent"
      } ${className}`}
    >
      {icon && <span className="shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
}
