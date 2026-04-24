import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SaveBar } from '../components/SaveBar'
import { SectionHeader } from '../components/SectionHeader'

type Row = {
  id: string
  school_year_start: string
  school_year_end: string
  seniors_last_day: string
}

type Draft = Omit<Row, 'id'>

export function SchoolDatesPage() {
  const [row, setRow]     = useState<Row | null>(null)
  const [draft, setDraft] = useState<Draft>({
    school_year_start: '',
    school_year_end: '',
    seniors_last_day: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('school_dates')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') {
          setError(error.message)
        } else if (data) {
          setRow(data)
          setDraft({
            school_year_start: data.school_year_start ?? '',
            school_year_end:   data.school_year_end   ?? '',
            seniors_last_day:  data.seniors_last_day  ?? '',
          })
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
    setSaving(true)
    setError(null)
    const payload = { ...draft, last_updated: new Date().toISOString() }
    const { error } = row
      ? await supabase.from('school_dates').update(payload).eq('id', row.id)
      : await supabase.from('school_dates').insert(payload)
    if (error) { setError(error.message) }
    else { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    setSaving(false)
  }

  const FIELDS: { key: keyof Draft; label: string; hint: string }[] = [
    { key: 'school_year_start', label: 'School Year Start',   hint: 'First day of school' },
    { key: 'school_year_end',   label: 'Last Day of School',  hint: 'Final day for all students' },
    { key: 'seniors_last_day',  label: "Seniors' Last Day",   hint: "Last day for senior class" },
  ]

  if (loading) return <Skeleton />

  return (
    <div className="space-y-6">
      <SectionHeader
        title="School Dates"
        description="Configure the school year start, last day, and seniors' last day. These drive the progress countdowns in the app."
      />

      <div className="card p-6 space-y-5">
        {FIELDS.map(({ key, label, hint }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-dim mb-0.5 uppercase tracking-wider">{label}</label>
            <p className="text-[11px] text-dim mb-1.5">{hint}</p>
            <input
              type="date"
              value={draft[key]}
              onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
              className="px-3 py-2 rounded-xl border border-border bg-surface-2 text-sm"
            />
          </div>
        ))}
      </div>

      {draft.school_year_start && draft.school_year_end && draft.seniors_last_day && (
        <div className="card p-5">
          <p className="text-xs font-bold text-dim uppercase tracking-wider mb-3">Preview</p>
          <div className="grid grid-cols-3 gap-3">
            <DateCard label="School Year Start" date={draft.school_year_start} />
            <DateCard label="Seniors' Last Day"  date={draft.seniors_last_day} />
            <DateCard label="Last Day of School" date={draft.school_year_end} />
          </div>
        </div>
      )}

      <SaveBar dirty={dirty && valid} saving={saving} saved={saved} error={error} onSave={save} />
    </div>
  )
}

function DateCard({ label, date }: { label: string; date: string }) {
  const d = new Date(date + 'T12:00:00')
  const fmt = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return (
    <div className="p-3 rounded-xl bg-surface-2 border border-border">
      <p className="text-[10px] font-semibold text-dim mb-1">{label}</p>
      <p className="text-sm font-bold text-text">{fmt}</p>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="card p-6 animate-pulse space-y-5">
      {[1,2,3].map((i) => <div key={i} className="h-10 bg-surface-2 rounded-xl" />)}
    </div>
  )
}
