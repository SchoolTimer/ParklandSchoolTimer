import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const PencilIcon = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

export const PaletteIcon = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2a10 10 0 1 0 0 20c1.7 0 3-1.3 3-3 0-.8-.3-1.5-.8-2-.5-.5-.8-1.2-.8-2 0-1.7 1.3-3 3-3h1.7a4 4 0 0 0 3.9-4C22 6.5 17.5 2 12 2z" />
  </svg>
);

export const SunIcon = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

export const CloudIcon = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8 6 6 0 0 0-11.5 2A4 4 0 0 0 5 19h12.5z" />
  </svg>
);

export const CloudRainIcon = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M16 13a4 4 0 0 0-7.9-1A3.5 3.5 0 0 0 4 15a3.5 3.5 0 0 0 3.5 3.5h8a3.5 3.5 0 0 0 .5-7z" />
    <path d="M8 19v3M12 19v3M16 19v3" />
  </svg>
);

export const SnowflakeIcon = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
  </svg>
);

export const BoltIcon = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export const GridIcon = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export const SettingsIcon = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);

export const FoodIcon = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M3 11h18l-1 9H4l-1-9z" />
    <path d="M8 11V7a4 4 0 1 1 8 0v4" />
  </svg>
);

export const UtensilsIcon = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M3 2v7c0 1.1.9 2 2 2h1v11h2V11h1a2 2 0 0 0 2-2V2h-2v5H7V2H5v5H4V2H3z" />
    <path d="M19 2c-1.7 0-3 1.9-3 5v4h2v9h2V2h-1z" />
  </svg>
);
