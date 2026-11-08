import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeName = "default" | "dark" | "beach" | "stealth" | "eww" | "hacker" | "custom";

// Mirrors V1's theme objects (other/color/colorValues.js) value for value.
type ThemeVars = {
  bg: string;
  text: string;
  accent: string;
  inactive: string;       // V1 timertextdeactive
  lightDim: string;       // V1 lightshadowdim (offset + blur)
  darkDim: string;
  shadowLight: string;
  shadowDark: string;
};

export type CustomColors = {
  accent: string;
  bg: string;
  text: string;
};

// V1's LightenColor: shift every channel by percent of 255, clamped.
function shade(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((num >> 16) + amt);
  const g = clamp(((num >> 8) & 0xff) + amt);
  const b = clamp((num & 0xff) + amt);
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

const NORMAL_LIGHT = "-6px -6px 10px";
const SOFT_LIGHT   = "-3px -6px 7px";
const DARK_OFFSET  = "6px 6px 10px";

function buildCustomVars(c: CustomColors): ThemeVars {
  return {
    bg: c.bg, text: c.text, accent: c.accent, inactive: "#bfbfbf",
    lightDim: NORMAL_LIGHT, darkDim: DARK_OFFSET,
    shadowLight: shade(c.bg, 3), shadowDark: shade(c.bg, -1),
  };
}

export const DEFAULT_CUSTOM_COLORS: CustomColors = {
  accent: "#ff2b40",
  bg:     "#ededed",
  text:   "#575757",
};

export const THEME_PRESETS: Record<ThemeName, ThemeVars> = {
  default: { bg: "#ededed", text: "#575757", accent: "#ff2b40", inactive: "#bfbfbf",
    lightDim: NORMAL_LIGHT, darkDim: DARK_OFFSET,
    shadowLight: shade("#ededed", 5), shadowDark: shade("#ededed", -6) },
  dark:    { bg: "#222226", text: "#d4d4d4", accent: "#d11f3a", inactive: "#575757",
    lightDim: SOFT_LIGHT, darkDim: DARK_OFFSET,
    shadowLight: shade("#222226", 3), shadowDark: shade("#222226", -2) },
  beach:   { bg: "#fff7eb", text: "#575757", accent: "#55dde0", inactive: "#bfbfbf",
    lightDim: NORMAL_LIGHT, darkDim: DARK_OFFSET,
    shadowLight: shade("#fff7eb", 2), shadowDark: shade("#fff7eb", -5) },
  stealth: { bg: "#000000", text: "#1c1c1c", accent: "#1c1c1c", inactive: "#575757",
    lightDim: SOFT_LIGHT, darkDim: DARK_OFFSET,
    shadowLight: shade("#000000", 3), shadowDark: shade("#000000", -2) },
  eww:     { bg: "#050064", text: "#ff2afc", accent: "#feff33", inactive: "#575757",
    lightDim: NORMAL_LIGHT, darkDim: DARK_OFFSET,
    shadowLight: shade("#050064", 6), shadowDark: shade("#050064", -6) },
  hacker:  { bg: "#000000", text: "#00ff33", accent: "#00ff33", inactive: "#00ff33",
    lightDim: NORMAL_LIGHT, darkDim: DARK_OFFSET,
    shadowLight: shade("#000000", 6), shadowDark: shade("#000000", -6) },
  custom:  buildCustomVars(DEFAULT_CUSTOM_COLORS),
};

const THEME_LABELS: Record<ThemeName, string> = {
  default: "Default", dark: "Dark", beach: "Beach", stealth: "Stealth",
  eww: "Eww", hacker: "Hacker", custom: "Custom",
};

export { THEME_LABELS };

type ThemeStore = {
  theme: ThemeName;
  setTheme: (name: ThemeName) => void;
  customColors: CustomColors;
  setCustomColors: (c: CustomColors) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "default",
      setTheme: (name) => set({ theme: name }),
      customColors: DEFAULT_CUSTOM_COLORS,
      setCustomColors: (c) => {
        THEME_PRESETS["custom"] = buildCustomVars(c);
        set({ customColors: c, theme: "custom" });
      },
    }),
    {
      name: "schooltimer.v2.theme",
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ThemeStore>;
        return { ...current, ...p, customColors: { ...DEFAULT_CUSTOM_COLORS, ...(p.customColors ?? {}) } };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!THEME_PRESETS[state.theme]) state.theme = "default";
          if (state.theme === "custom" && state.customColors) {
            THEME_PRESETS["custom"] = buildCustomVars(state.customColors);
          }
        }
      },
    },
  ),
);

export function useApplyTheme() {
  const theme        = useThemeStore((s) => s.theme);
  const customColors = useThemeStore((s) => s.customColors);

  useEffect(() => {
    const p = theme === "custom"
      ? buildCustomVars(customColors)
      : THEME_PRESETS[theme] ?? THEME_PRESETS["default"];
    const root = document.documentElement;
    const set = (k: string, v: string) => root.style.setProperty(k, v);
    set("--bg", p.bg);
    set("--text", p.text);
    set("--accent", p.accent);
    set("--inactive", p.inactive);
    set("--light-dim", p.lightDim);
    set("--dark-dim", p.darkDim);
    set("--shadow-light", p.shadowLight);
    set("--shadow-dark", p.shadowDark);
    // Tokens used by the Tailwind-styled editor modal.
    set("--color-bg", p.bg);
    set("--color-surface", p.bg);
    set("--color-surface-2", p.bg);
    set("--color-text", p.text);
    set("--color-dim", `color-mix(in srgb, ${p.text} 75%, ${p.bg})`);
    set("--color-dim-2", `color-mix(in srgb, ${p.text} 40%, ${p.bg})`);
    set("--color-border", `color-mix(in srgb, ${p.text} 12%, ${p.bg})`);
    set("--color-border-2", `color-mix(in srgb, ${p.text} 22%, ${p.bg})`);
    set("--color-accent", p.accent);
    set("--color-accent-soft", `color-mix(in srgb, ${p.accent} 8%, transparent)`);
    set("--color-accent-dim", `color-mix(in srgb, ${p.accent} 22%, transparent)`);
  }, [theme, customColors]);
}
