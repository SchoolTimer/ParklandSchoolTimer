import { useEffect, useState, type CSSProperties } from "react";
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
const ACCENTS = ["#ff2b40", "#ff7a00", "#f5b800", "#2ecc71", "#00b8d9", "#3b82f6", "#8b5cf6", "#ec4899"];
const HEX = /^#[0-9a-f]{6}$/i;

type Look = { bg: string; text: string; accent: string; shadowLight: string; shadowDark: string };

/** A tiny skeleton of the home screen drawn in a theme's colors. */
function Preview({ look }: { look: Look }) {
  const style = {
    background: look.bg,
    "--sl": look.shadowLight,
    "--sd": look.shadowDark,
    "--pt": look.text,
    "--pa": look.accent,
  } as CSSProperties;
  return (
    <div className="pp-prev" style={style} aria-hidden="true">
      <div className="col">
        <div className="pill live"><i /><i /></div>
        <div className="pill"><i /><i /></div>
        <div className="pill"><i /><i /></div>
      </div>
      <div className="tiles">
        <div className="tile"><b /></div>
        <div className="tile"><b /></div>
        <div className="tile"><b /></div>
        <div className="tile"><b /></div>
      </div>
    </div>
  );
}

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
            const on = theme === n;
            return (
              <button key={n} type="button" className={`pp-theme${on ? " on" : ""}`} aria-pressed={on} onClick={() => pick(n)}>
                <Preview look={THEME_PRESETS[n]} />
                <span className="pp-theme-name">{THEME_LABELS[n]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pp-section">
        <p className="pp-label">Make your own{theme === "custom" ? <span className="pp-badge">In use</span> : null}</p>
        <div className="pp-custom pp-card">
          <div className="pp-color-cols">
            <ColorCol label="Accent" value={draft.accent} onChange={(v) => change("accent", v)} />
            <ColorCol label="Background" value={draft.bg} onChange={(v) => change("bg", v)} />
            <ColorCol label="Text" value={draft.text} onChange={(v) => change("text", v)} />
          </div>
          <div className="pp-chips-row">
            <span>Accent ideas</span>
            <div className="pp-chips" role="group" aria-label="Accent suggestions">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`pp-chip${draft.accent.toLowerCase() === c ? " on" : ""}`}
                  style={{ background: c }}
                  aria-label={`Accent ${c}`}
                  onClick={() => change("accent", c)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pp-foot-actions" style={{ justifyContent: "flex-end" }}>
        <button type="button" className="pp-btn solid" onClick={onClose}>Done</button>
      </div>
    </Modal>
  );
}

function ColorCol({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  // While typing, show what the user typed; only valid hex values are applied.
  const [typed, setTyped] = useState<string | null>(null);
  return (
    <div className="pp-color-col">
      <label className="pp-color-sw" style={{ background: value }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={`${label} color`} />
      </label>
      <span className="pp-color-name">{label}</span>
      <input
        type="text"
        className="pp-input pp-hexin"
        value={typed ?? value.toUpperCase()}
        maxLength={7}
        spellCheck={false}
        aria-label={`${label} hex`}
        onChange={(e) => {
          const v = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
          setTyped(v);
          if (HEX.test(v)) onChange(v.toLowerCase());
        }}
        onBlur={() => setTyped(null)}
      />
    </div>
  );
}
