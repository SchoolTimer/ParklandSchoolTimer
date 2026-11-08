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

  function change(key: keyof CustomColors, value: string) {
    const next = { ...draft, [key]: value };
    setDraft(next);
    setCustomColors(next);
  }

  return (
    <Modal open={open} onClose={onClose} title="Color Picker">
      <h1 className="popuplabel first">Preset Themes</h1>
      <select
        className="v1-select shadows"
        value={theme}
        onChange={(e) => {
          const name = e.target.value as ThemeName;
          const p = THEME_PRESETS[name];
          setDraft({ accent: p.accent, bg: p.bg, text: p.text });
          setTheme(name);
        }}
      >
        <option value="custom" disabled>Select</option>
        {PRESET_NAMES.map((n) => (
          <option key={n} value={n}>{THEME_LABELS[n]}</option>
        ))}
      </select>

      <h1 className="popuplabel">Custom Colors</h1>
      <Swatch label="Accent" value={draft.accent} onChange={(v) => change("accent", v)} />
      <Swatch label="Background" value={draft.bg} onChange={(v) => change("bg", v)} />
      <Swatch label="Text" value={draft.text} onChange={(v) => change("text", v)} />
    </Modal>
  );
}

function Swatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="v1-color-el shadows">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} />
      <p>{label}</p>
    </div>
  );
}
