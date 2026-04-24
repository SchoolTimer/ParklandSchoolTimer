import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SaveBar } from '../components/SaveBar'
import { SectionHeader } from '../components/SectionHeader'

type Row = { id: string; today: string; tomorrow: string; next_day: string }

const CYCLE_RE = /^([1-6][ABCD]|N\/A)$/i

function validate(v: string) {
  return v === '' || CYCLE_RE.test(v.trim())
}

export function DayCyclePage() {
  const [row, setRow]   = useState<Row | null>(null)
  const [draft, setDraft] = useState({ today: '', tomorrow: '', next_day: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('daycycles')
      .select('*')
      .eq('id', 'current')
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') {
          setError(error.message)
        } else if (data) {
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
    setSaving(true)
    setError(null)
    const payload = {
      today:    draft.today.trim().toUpperCase() || null,
      tomorrow: draft.tomorrow.trim().toUpperCase() || null,
      next_day: draft.next_day.trim().toUpperCase() || null,
      last_updated: new Date().toISOString(),
    }
    const { error } = row
      ? await supabase.from('daycycles').update(payload).eq('id', 'current')
      : await supabase.from('daycycles').insert({ id: 'current', ...payload })
    if (error) { setError(error.message) }
    else { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    setSaving(false)
  }

  if (loading) return <Skeleton />

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Day Cycle"
        description="Set today, tomorrow, and next day values. Use format like '1A', '3B', or 'N/A' for no school."
      />
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface-2 text-xs text-dim">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-warn">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        This data auto-updates every day at <span className="font-semibold text-text mx-1">4:00 AM EST</span> — manual changes here will be overwritten at the next refresh.
      </div>

      <div className="card p-6 space-y-4">
        {(['today', 'tomorrow', 'next_day'] as const).map((field) => {
          const label = field === 'next_day' ? 'Next Day' : field.charAt(0).toUpperCase() + field.slice(1)
          const val = draft[field]
          const ok = validate(val)
          return (
            <div key={field}>
              <label className="block text-xs font-semibold text-dim mb-1.5 uppercase tracking-wider">{label}</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => setDraft((d) => ({ ...d, [field]: e.target.value }))}
                  placeholder="e.g. 1A or N/A"
                  maxLength={10}
                  className={`w-48 px-3 py-2 rounded-xl border bg-surface-2 text-sm font-mono ${
                    ok ? 'border-border' : 'border-danger'
                  }`}
                />
                <span className={`text-xs font-semibold ${
                  val === '' ? 'text-dim' : ok ? 'text-success' : 'text-danger'
                }`}>
                  {val === '' ? 'empty' : ok ? 'valid' : 'invalid format'}
                </span>
              </div>
            </div>
          )
        })}

        <p className="text-[11px] text-dim">Valid formats: <code className="bg-surface-2 px-1 rounded">1A</code> through <code className="bg-surface-2 px-1 rounded">6D</code>, or <code className="bg-surface-2 px-1 rounded">N/A</code> for no school days.</p>
      </div>

      <SaveBar dirty={dirty && valid} saving={saving} saved={saved} error={error} onSave={save} />
    </div>
  )
}

function Skeleton() {
  return (
    <div className="card p-6 animate-pulse space-y-4">
      {[1,2,3].map((i) => (
        <div key={i} className="h-10 bg-surface-2 rounded-xl" />
      ))}
    </div>
  )
}
