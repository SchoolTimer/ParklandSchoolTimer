import { useState } from "react";
import { Modal } from "../../components/Modal";
import {
  useThemeStore,
  THEME_PRESETS,
  THEME_DESCRIPTIONS,
  type ThemeName,
  type CustomColors,
} from "../../store/useThemeStore";

type Props = { open: boolean; onClose: () => void };

const PRESET_NAMES = (Object.keys(THEME_PRESETS) as ThemeName[]).filter((n) => n !== "custom");

export function ColorsModal({ open, onClose }: Props) {
  const theme         = useThemeStore((s) => s.theme);
  const setTheme      = useThemeStore((s) => s.setTheme);
  const customColors  = useThemeStore((s) => s.customColors);
  const setCustomColors = useThemeStore((s) => s.setCustomColors);

  const [draft, setDraft] = useState<CustomColors>(customColors);

  function applyCustom() {
    setCustomColors(draft);
  }

  return (
    <Modal open={open} onClose={onClose} title="Color Scheme">
      {/* ── Presets ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {PRESET_NAMES.map((name) => {
          const p      = THEME_PRESETS[name];
          const active = theme === name;
          return (
            <button
              key={name}
              onClick={() => setTheme(name)}
              className={`flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-150 border ${
                active
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-surface-2 hover:border-border-2"
              }`}
            >
              <div
                className="w-7 h-7 rounded-full shrink-0 border-2 border-white shadow-sm"
                style={{ background: p.accent }}
              />
              <div className="min-w-0">
                <p className={`text-sm font-semibold capitalize ${active ? "text-accent" : "text-text"}`}>
                  {name}
                </p>
                <p className="text-[11px] text-dim mt-0.5">{THEME_DESCRIPTIONS[name]}</p>
              </div>
              {active && <span className="ml-auto text-accent text-base shrink-0">✓</span>}
            </button>
          );
        })}
      </div>

      {/* ── Custom ──────────────────────────────────────────────── */}
      <div className={`rounded-2xl border p-5 transition-all duration-150 ${
        theme === "custom" ? "border-accent bg-accent-soft" : "border-border bg-surface-2"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-text">Custom</p>
            <p className="text-[11px] text-dim mt-0.5">Pick your own colors</p>
          </div>
          {theme === "custom" && <span className="text-accent text-base">✓</span>}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <ColorSwatch
            label="Accent"
            value={draft.accent}
            onChange={(v) => setDraft((d) => ({ ...d, accent: v }))}
          />
          <ColorSwatch
            label="Background"
            value={draft.bg}
            onChange={(v) => setDraft((d) => ({ ...d, bg: v }))}
          />
          <ColorSwatch
            label="Surface"
            value={draft.surface}
            onChange={(v) => setDraft((d) => ({ ...d, surface: v }))}
          />
        </div>

        <button
          onClick={applyCustom}
          className="w-full h-9 rounded-xl bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Apply Custom Theme
        </button>
      </div>
    </Modal>
  );
}

function ColorSwatch({
  label, value, onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <label className="relative cursor-pointer">
        <div
          className="w-12 h-12 rounded-xl border-2 border-white shadow-md transition-transform hover:scale-105"
          style={{ background: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </label>
      <p className="text-[10px] font-semibold text-dim uppercase tracking-wide">{label}</p>
    </div>
  );
}
