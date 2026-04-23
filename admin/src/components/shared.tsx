export function SectionFooter({
  dirty, saving, saved, error, onSave,
}: {
  dirty: boolean; saving: boolean; saved: boolean; error: string | null; onSave: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-xs">
        {error  && <span className="text-danger font-semibold">{error}</span>}
        {saved  && !error && <span className="text-success font-semibold">Saved successfully</span>}
        {!saved && !error && dirty  && <span className="text-dim">You have unsaved changes</span>}
        {!saved && !error && !dirty && <span className="text-dim/40">All changes saved</span>}
      </div>
      <button
        onClick={onSave}
        disabled={!dirty || saving}
        className="px-5 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

export function WarnIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-warn">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}
