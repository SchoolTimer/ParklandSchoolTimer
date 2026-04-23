import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SectionFooter, WarnIcon } from '../components/shared'

type Row = { id: string; today: string; tomorrow: string; next_day: string }

const CYCLE_RE = /^([1-6][ABCD]|N\/A)$/i
function validate(v: string) { return v === '' || CYCLE_RE.test(v.trim()) }

const FIELDS = [
  { key: 'today'    as const, label: 'Today' },
  { key: 'tomorrow' as const, label: 'Tomorrow' },
  { key: 'next_day' as const, label: 'Next Day' },
]

export function DayCycleSection() {
  const [row, setRow]     = useState<Row | null>(null)
  const [draft, setDraft] = useState({ today: '', tomorrow: '', next_day: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    supabase.from('daycycles').select('*').eq('id', 'current').single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') setError(error.message)
        else if (data) {
          setRow(data)
          setDraft({ today: data.today ?? '', tomorrow: data.tomorrow ?? '', next_day: data.next_day ?? '' })
        }
        setLoading(false)
      })
  }, [])

  const dirty = row
    ? draft.today !== (row.today ?? '') || draft.tomorrow !== (row.tomorrow ?? '') || draft.next_day !== (row.next_day ?? '')
    : true
  const valid = validate(draft.today) && validate(draft.tomorrow) && validate(draft.next_day)

  const save = async () => {
    setSaving(true); setError(null)
    const payload = {
      today:    draft.today.trim().toUpperCase() || null,
      tomorrow: draft.tomorrow.trim().toUpperCase() || null,
      next_day: draft.next_day.trim().toUpperCase() || null,
      last_updated: new Date().toISOString(),
    }
    const { error } = row
      ? await supabase.from('daycycles').update(payload).eq('id', 'current')
      : await supabase.from('daycycles').insert({ id: 'current', ...payload })
    if (error) setError(error.message)
    else { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    setSaving(false)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <AutoUpdateBanner />

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-xs font-bold text-dim uppercase tracking-widest">Current Values</p>
        </div>

        {loading ? <LoadingSkeleton rows={3} /> : (
          <div className="p-5 space-y-4">
            {FIELDS.map(({ key, label }) => {
              const val = draft[key]
              const ok  = validate(val)
              return (
                <div key={key} className="flex items-center gap-4">
                  <label className="w-28 text-sm font-semibold text-text shrink-0">{label}</label>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                    placeholder="e.g. 1A or N/A"
                    maxLength={10}
                    className={`w-36 px-3 py-2 rounded-xl border bg-surface-2 text-sm font-mono tracking-wider ${
                      ok ? 'border-border focus:border-accent' : 'border-danger'
                    }`}
                  />
                  {val !== '' && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      ok ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                    }`}>
                      {ok ? 'valid' : 'invalid'}
                    </span>
                  )}
                </div>
              )
            })}
            <p className="text-[11px] text-dim pt-1">
              Format: <code className="bg-surface-2 px-1.5 py-0.5 rounded text-text">1A</code> – <code className="bg-surface-2 px-1.5 py-0.5 rounded text-text">6D</code>, or <code className="bg-surface-2 px-1.5 py-0.5 rounded text-text">N/A</code>
            </p>
          </div>
        )}

        <div className="px-5 pb-5">
          <SectionFooter dirty={dirty && valid} saving={saving} saved={saved} error={error} onSave={save} />
        </div>
      </div>
    </div>
  )
}

function AutoUpdateBanner() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-warn/20 bg-warn/5 text-xs text-dim">
      <WarnIcon />
      <span>Auto-updates every day at <strong className="text-text font-semibold">4:00 AM EST</strong> — manual edits will be overwritten at next refresh.</span>
    </div>
  )
}

function LoadingSkeleton({ rows }: { rows: number }) {
  return (
    <div className="p-5 space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-28 h-5 bg-surface-2 rounded" />
          <div className="w-36 h-9 bg-surface-2 rounded-xl" />
        </div>
      ))}
    </div>
  )
}
