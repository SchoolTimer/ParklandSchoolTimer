import type { ReactNode, CSSProperties } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  padded?: boolean;
};

export function Card({
  children,
  className = "",
  active,
  onClick,
  style,
  padded = true,
}: Props) {
  const pad    = padded ? "p-4" : "";
  const border = active ? "border-accent bg-accent-soft" : "";
  const cursor = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`card rounded-2xl transition-colors duration-200 ${pad} ${border} ${cursor} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
