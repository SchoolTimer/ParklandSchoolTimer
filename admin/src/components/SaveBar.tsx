type Props = {
  dirty: boolean
  saving: boolean
  saved: boolean
  error: string | null
  onSave: () => void
}

export function SaveBar({ dirty, saving, saved, error, onSave }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 sticky bottom-4">
      <div className="card flex-1 flex items-center justify-between px-5 py-3 shadow-lg">
        <div>
          {error && <p className="text-xs font-semibold text-danger">{error}</p>}
          {saved && !error && <p className="text-xs font-semibold text-success">Saved successfully</p>}
          {!saved && !error && dirty && <p className="text-xs text-dim">You have unsaved changes.</p>}
          {!saved && !error && !dirty && <p className="text-xs text-dim">No changes.</p>}
        </div>
        <button
          onClick={onSave}
          disabled={!dirty || saving}
          className="px-5 py-2 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
