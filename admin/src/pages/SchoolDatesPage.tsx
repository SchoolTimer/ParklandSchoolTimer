import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SectionFooter } from '../components/shared'

type Row = { id: string; school_year_start: string; school_year_end: string; seniors_last_day: string }
type Draft = Omit<Row, 'id'>

const FIELDS: { key: keyof Draft; label: string; hint: string; emoji: string }[] = [
  { key: 'school_year_start', label: 'School Year Start',  hint: 'First day students attend',       emoji: '🏫' },
  { key: 'seniors_last_day',  label: "Seniors' Last Day",  hint: 'Last day for the senior class',   emoji: '🎓' },
  { key: 'school_year_end',   label: 'Last Day of School', hint: 'Final day for all students',      emoji: '🏁' },
]

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
}

function daysUntil(d: string) {
  const diff = new Date(d + 'T12:00:00').getTime() - Date.now()
  const days = Math.ceil(diff / 86_400_000)
  if (days < 0)   return { label: `${Math.abs(days)}d ago`, past: true }
  if (days === 0) return { label: 'Today',                  past: false }
  return { label: `in ${days}d`,                           past: false }
}

export function SchoolDatesSection() {
  const [row, setRow]     = useState<Row | null>(null)
  const [draft, setDraft] = useState<Draft>({ school_year_start: '', school_year_end: '', seniors_last_day: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    supabase.from('school_dates').select('*').order('id', { ascending: false }).limit(1).single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') setError(error.message)
        else if (data) {
          setRow(data)
          setDraft({ school_year_start: data.school_year_start ?? '', school_year_end: data.school_year_end ?? '', seniors_last_day: data.seniors_last_day ?? '' })
        }
        setLoading(false)
      })
  }, [])

  const dirty = !row ||
    draft.school_year_start !== (row.school_year_start ?? '') ||
    draft.school_year_end   !== (row.school_year_end   ?? '') ||
    draft.seniors_last_day  !== (row.seniors_last_day  ?? '')
  const valid = !!(draft.school_year_start && draft.school_year_end && draft.seniors_last_day)

  const save = async () => {
    setSaving(true); setError(null)
    const payload = { ...draft, last_updated: new Date().toISOString() }
    const { error } = row
      ? await supabase.from('school_dates').update(payload).eq('id', row.id)
      : await supabase.from('school_dates').insert(payload)
    if (error) setError(error.message)
    else { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    setSaving(false)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-xs font-bold text-dim uppercase tracking-widest">Important Dates</p>
        </div>

        {loading ? (
          <div className="p-5 space-y-4 animate-pulse">
            {[1,2,3].map((i) => <div key={i} className="h-20 bg-surface-2 rounded-xl" />)}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {FIELDS.map(({ key, label, hint, emoji }) => {
              const val = draft[key]
              const countdown = val ? daysUntil(val) : null
              return (
                <div key={key} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center shrink-0 text-base">
                    {emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text leading-none">{label}</p>
                    <p className="text-[11px] text-dim mt-0.5">{hint}</p>
                    {val && <p className="text-[11px] text-dim/70 mt-1">{fmtDate(val)}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {countdown && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        countdown.past ? 'bg-surface-2 text-dim' : 'bg-accent-soft text-accent'
                      }`}>
                        {countdown.label}
                      </span>
                    )}
                    <input
                      type="date"
                      value={val}
                      onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                      className="px-3 py-2 rounded-xl border border-border bg-surface-2 text-sm hover:border-border-2 focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="px-5 pb-5 pt-4 border-t border-border">
          <SectionFooter dirty={dirty && valid} saving={saving} saved={saved} error={error} onSave={save} />
        </div>
      </div>
    </div>
  )
}
