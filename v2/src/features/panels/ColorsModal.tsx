import { useEffect, useState } from "react";
import { Modal } from "../../components/Modal";
import {
  useThemeStore,
  THEME_PRESETS,
  THEME_LABELS,
  type ThemeName,
  type CustomColors,
} from "../../store/useThemeStore";

type Props = { open: boolean; onClose: () => void };

const PRESET_NAMES = (Object.keys(THEME_PRESETS) as ThemeName[]).filter((n) => n !== "custom");

export function ColorsModal({ open, onClose }: Props) {
  const theme           = useThemeStore((s) => s.theme);
  const setTheme        = useThemeStore((s) => s.setTheme);
  const customColors    = useThemeStore((s) => s.customColors);
  const setCustomColors = useThemeStore((s) => s.setCustomColors);

  const [draft, setDraft] = useState<CustomColors>(customColors);

  useEffect(() => {
    if (open) setDraft(customColors);
  }, [open, customColors]);

  function pick(name: ThemeName) {
    const p = THEME_PRESETS[name];
    setDraft({ accent: p.accent, bg: p.bg, text: p.text });
    setTheme(name);
  }

  function change(key: keyof CustomColors, value: string) {
    const next = { ...draft, [key]: value };
    setDraft(next);
    setCustomColors(next);
  }

  return (
    <Modal open={open} onClose={onClose} title="Color Picker">
      <div className="pp-section">
        <p className="pp-label">Preset themes</p>
        <div className="pp-grid c3 presets">
          {PRESET_NAMES.map((n) => {
            const p = THEME_PRESETS[n];
            const on = theme === n;
            return (
              <button key={n} type="button" className={`pp-theme${on ? " on" : ""}`} aria-pressed={on} onClick={() => pick(n)}>
                <span className="pp-theme-dot" style={{ background: p.bg }}>
                  <i style={{ background: p.accent }} />
                </span>
                <span className="pp-theme-name">{THEME_LABELS[n]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pp-section">
        <p className="pp-label">Custom colors{theme === "custom" ? " · in use" : ""}</p>
        <div className="pp-grid c3">
          <Swatch label="Accent" value={draft.accent} onChange={(v) => change("accent", v)} />
          <Swatch label="Background" value={draft.bg} onChange={(v) => change("bg", v)} />
          <Swatch label="Text" value={draft.text} onChange={(v) => change("text", v)} />
        </div>
      </div>
    </Modal>
  );
}

function Swatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="pp-card pp-swatch" style={{ cursor: "pointer" }}>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} />
      <span>{label}</span>
    </label>
  );
}
