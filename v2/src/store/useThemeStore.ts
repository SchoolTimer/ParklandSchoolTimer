import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeName = "light" | "dark" | "warm" | "ocean" | "forest" | "violet" | "custom";

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
};

export type CustomColors = {
  accent: string;
  bg: string;
  surface: string;
};

function buildCustomVars(c: CustomColors): ThemeVars {
  // Derive supporting tones from the three user-controlled values.
  // surface2 / borders sit between bg and surface.
  return {
    bg:       c.bg,
    surface:  c.surface,
    surface2: c.bg,
    border:   `color-mix(in srgb, ${c.surface} 60%, ${c.bg})`,
    border2:  `color-mix(in srgb, ${c.surface} 40%, ${c.bg})`,
    text:     "#111116",
    dim:      "#8a8a96",
    dim2:     "#c4c4cc",
    accent:   c.accent,
  };
}

export const DEFAULT_CUSTOM_COLORS: CustomColors = {
  accent:  "#e8294c",
  bg:      "#f5f5f7",
  surface: "#ffffff",
};

export const THEME_PRESETS: Record<ThemeName, ThemeVars> = {
  light: {
    bg:       "#f5f5f7",
    surface:  "#ffffff",
    surface2: "#f0f0f2",
    border:   "#e8e8ec",
    border2:  "#d8d8de",
    text:     "#111116",
    dim:      "#8a8a96",
    dim2:     "#c4c4cc",
    accent:   "#e8294c",
  },
  dark: {
    bg:       "#0e0e10",
    surface:  "#1a1a1f",
    surface2: "#141418",
    border:   "#2a2a32",
    border2:  "#38383f",
    text:     "#f0f0f4",
    dim:      "#6a6a78",
    dim2:     "#3a3a44",
    accent:   "#f0314f",
  },
  warm: {
    bg:       "#faf6f1",
    surface:  "#ffffff",
    surface2: "#f5ede4",
    border:   "#ede0d4",
    border2:  "#ddd0c4",
    text:     "#1a1410",
    dim:      "#9a8a7a",
    dim2:     "#c8b8a8",
    accent:   "#d9520e",
  },
  ocean: {
    bg:       "#f0f5fb",
    surface:  "#ffffff",
    surface2: "#e6eff8",
    border:   "#d8e6f4",
    border2:  "#c4d8ee",
    text:     "#0d1f38",
    dim:      "#6a88aa",
    dim2:     "#b0c8e0",
    accent:   "#1a6fdb",
  },
  forest: {
    bg:       "#f2f6f2",
    surface:  "#ffffff",
    surface2: "#e8f0e8",
    border:   "#d8e4d8",
    border2:  "#c4d4c4",
    text:     "#0d1f0d",
    dim:      "#6a8a6a",
    dim2:     "#b0c8b0",
    accent:   "#1a8a3a",
  },
  violet: {
    bg:       "#f5f3fb",
    surface:  "#ffffff",
    surface2: "#eeeaf8",
    border:   "#e0d8f4",
    border2:  "#cec4ec",
    text:     "#120d28",
    dim:      "#7a6aa0",
    dim2:     "#b8acd8",
    accent:   "#6d28d9",
  },
  custom: buildCustomVars(DEFAULT_CUSTOM_COLORS),
};

const THEME_DESCRIPTIONS: Record<ThemeName, string> = {
  light:  "Clean · Red",
  dark:   "Dark · Red",
  warm:   "Warm · Orange",
  ocean:  "Cool · Blue",
  forest: "Fresh · Green",
  violet: "Rich · Violet",
  custom: "Your colors",
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
      theme: "light",
      setTheme: (name) => set({ theme: name }),
      customColors: DEFAULT_CUSTOM_COLORS,
      setCustomColors: (c) => {
        THEME_PRESETS["custom"] = buildCustomVars(c);
        set({ customColors: c, theme: "custom" });
      },
    }),
    {
      name: "schooltimer.v2.theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!THEME_PRESETS[state.theme]) state.theme = "light";
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
      : THEME_PRESETS[theme] ?? THEME_PRESETS["light"];
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
  }, [theme, customColors]);
}
