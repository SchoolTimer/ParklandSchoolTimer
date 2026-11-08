import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeName = "default" | "dark" | "beach" | "stealth" | "eww" | "hacker" | "custom";

type ThemeVars = {
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  border2: string;
  text: string;
  dim: string;
  dim2: string;
  accent: string;
  shadowLight: string;
  shadowDark: string;
};

export type CustomColors = {
  accent: string;
  bg: string;
  text: string;
};

// Same lighten/darken as V1: shift every channel by percent of 255, clamped.
function shade(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((num >> 16) + amt);
  const g = clamp(((num >> 8) & 0xff) + amt);
  const b = clamp((num & 0xff) + amt);
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

function mix(a: string, b: string, pctOfA: number) {
  return `color-mix(in srgb, ${a} ${pctOfA}%, ${b})`;
}

// Neumorphic themes: surfaces are the background itself; depth comes from the
// light/dark shadow pair. Supporting tones are derived from bg + text.
function build(
  bg: string,
  text: string,
  accent: string,
  dimText: string,
  shadowLight: string,
  shadowDark: string,
): ThemeVars {
  return {
    bg,
    surface: bg,
    surface2: bg,
    border: mix(text, bg, 12),
    border2: mix(text, bg, 22),
    text,
    dim: dimText,
    dim2: mix(text, bg, 35),
    accent,
    shadowLight,
    shadowDark,
  };
}

function buildCustomVars(c: CustomColors): ThemeVars {
  return build(c.bg, c.text, c.accent, mix(c.text, c.bg, 70), shade(c.bg, 5), shade(c.bg, -6));
}

export const DEFAULT_CUSTOM_COLORS: CustomColors = {
  accent: "#ff2b40",
  bg:     "#ededed",
  text:   "#575757",
};

export const THEME_PRESETS: Record<ThemeName, ThemeVars> = {
  default: build("#ededed", "#575757", "#ff2b40", "#8c8c8c", "rgba(255, 255, 255, 0.8)", "rgba(0, 0, 0, 0.2)"),
  dark:    build("#222226", "#d4d4d4", "#d11f3a", "#8a8a8f", shade("#222226", 3), shade("#222226", -2)),
  beach:   build("#fff7eb", "#575757", "#55dde0", "#8c8c8c", shade("#fff7eb", 2), shade("#fff7eb", -5)),
  stealth: build("#000000", "#1c1c1c", "#1c1c1c", "#1c1c1c", shade("#000000", 3), shade("#000000", -2)),
  eww:     build("#050064", "#ff2afc", "#feff33", "#c020bd", shade("#050064", 6), shade("#050064", -6)),
  hacker:  build("#000000", "#00ff33", "#00ff33", "#00b824", shade("#000000", 6), shade("#000000", -6)),
  custom:  buildCustomVars(DEFAULT_CUSTOM_COLORS),
};

const THEME_DESCRIPTIONS: Record<ThemeName, string> = {
  default: "Classic · Red",
  dark:    "Dark · Red",
  beach:   "Sand · Aqua",
  stealth: "Blackout",
  eww:     "Navy · Yellow",
  hacker:  "Terminal · Green",
  custom:  "Your colors",
};

export { THEME_DESCRIPTIONS };

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
    root.style.setProperty("--color-bg",          p.bg);
    root.style.setProperty("--color-surface",     p.surface);
    root.style.setProperty("--color-surface-2",   p.surface2);
    root.style.setProperty("--color-border",      p.border);
    root.style.setProperty("--color-border-2",    p.border2);
    root.style.setProperty("--color-text",        p.text);
    root.style.setProperty("--color-dim",         p.dim);
    root.style.setProperty("--color-dim-2",       p.dim2);
    root.style.setProperty("--color-accent",      p.accent);
    root.style.setProperty("--color-accent-soft", `${p.accent}12`);
    root.style.setProperty("--color-accent-dim",  `${p.accent}38`);
    root.style.setProperty("--shadow-light",      p.shadowLight);
    root.style.setProperty("--shadow-dark",       p.shadowDark);
  }, [theme, customColors]);
}
