import { useEffect, useState } from "react";
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

function sameColors(a: CustomColors, b: CustomColors) {
  return a.accent === b.accent && a.bg === b.bg && a.surface === b.surface;
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

  const draftIsLive = theme === "custom" && sameColors(draft, customColors);

  return (
    <Modal open={open} onClose={onClose} title="Colors" widthClass="max-w-lg">
      <p className="text-xs text-dim mb-4">
        A preset applies as soon as you tap it. Your own colors apply only when you press Use these colors.
      </p>

      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-dim mb-2">Presets</p>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {PRESET_NAMES.map((name) => {
          const p = THEME_PRESETS[name];
          const active = theme === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setTheme(name)}
              aria-pressed={active}
              className={`flex items-center gap-3 p-3 rounded-xl text-left border ${
                active ? "border-accent bg-accent-soft" : "border-border bg-surface hover:border-border-2"
              }`}
            >
              <span
                className="w-6 h-6 rounded-full shrink-0 border border-black/10"
                style={{ background: p.accent }}
              />
              <span className="min-w-0">
                <span className={`block text-sm font-semibold capitalize ${active ? "text-accent" : "text-text"}`}>
                  {name}
                </span>
                <span className="block text-[11px] text-dim mt-0.5">{THEME_DESCRIPTIONS[name]}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className={`rounded-xl border p-4 ${draftIsLive ? "border-accent bg-accent-soft" : "border-border"}`}>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-dim">Your colors</p>
        <p className="text-xs text-dim mt-1 mb-4">
          {draftIsLive ? "These colors are on now." : "Nothing here changes the app until you use them."}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <ColorSwatch label="Accent" value={draft.accent} onChange={(accent) => setDraft((d) => ({ ...d, accent }))} />
          <ColorSwatch label="Background" value={draft.bg} onChange={(bg) => setDraft((d) => ({ ...d, bg }))} />
          <ColorSwatch label="Cards" value={draft.surface} onChange={(surface) => setDraft((d) => ({ ...d, surface }))} />
        </div>

        <button
          type="button"
          onClick={() => setCustomColors(draft)}
          disabled={draftIsLive}
          data-selected
          className="w-full min-h-11 rounded-xl bg-accent text-sm font-semibold disabled:opacity-60"
        >
          {draftIsLive ? "Using these colors" : "Use these colors"}
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
    <label className="flex flex-col items-center gap-1.5 cursor-pointer">
      <span className="relative">
        <span
          className="block w-12 h-12 rounded-xl border border-black/10"
          style={{ background: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          aria-label={label}
        />
      </span>
      <span className="text-[10px] font-semibold text-dim uppercase tracking-wide">{label}</span>
    </label>
  );
}
