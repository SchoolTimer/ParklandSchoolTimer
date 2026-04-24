import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SaveBar } from '../components/SaveBar'
import { SectionHeader } from '../components/SectionHeader'
import type { ScheduleLetter } from '../lib/types'

type Slot = { label: string; start: string; end: string }
type TableRow = { id: string; letter: ScheduleLetter; name: string; slots: Slot[] }

const LETTERS: ScheduleLetter[] = ['A', 'B', 'C', 'D']
const LETTER_NAMES: Record<ScheduleLetter, string> = {
  A: 'Regular',
  B: 'Homeroom',
  C: 'Early Dismissal',
  D: '2-Hour Delay',
}

const DEFAULTS: Record<ScheduleLetter, Slot[]> = {
  A: [
    { label: '1', start: '07:40', end: '08:29' },
    { label: '2', start: '08:33', end: '09:17' },
    { label: '3', start: '09:21', end: '10:05' },
    { label: '4', start: '10:09', end: '10:53' },
    { label: '5', start: '10:57', end: '11:41' },
    { label: '6', start: '11:45', end: '12:29' },
    { label: '7', start: '12:33', end: '13:17' },
    { label: '8', start: '13:21', end: '14:05' },
    { label: '9', start: '14:09', end: '14:53' },
  ],
  B: [
    { label: 'HR', start: '07:40', end: '07:50' },
    { label: '1',  start: '07:54', end: '08:37' },
    { label: '2',  start: '08:41', end: '09:24' },
    { label: '3',  start: '09:28', end: '10:11' },
    { label: '4',  start: '10:15', end: '10:58' },
    { label: '5',  start: '11:02', end: '11:45' },
    { label: '6',  start: '11:49', end: '12:32' },
    { label: '7',  start: '12:36', end: '13:19' },
    { label: '8',  start: '13:23', end: '14:06' },
    { label: '9',  start: '14:10', end: '14:53' },
  ],
  C: [
    { label: '1', start: '07:40', end: '08:20' },
    { label: '2', start: '08:24', end: '09:00' },
    { label: '3', start: '09:04', end: '09:40' },
    { label: '8', start: '09:44', end: '10:20' },
    { label: '9', start: '10:24', end: '11:00' },
  ],
  D: [
    { label: '1', start: '09:40', end: '10:09' },
    { label: '2', start: '10:13', end: '10:39' },
    { label: '3', start: '10:43', end: '11:09' },
    { label: '4', start: '11:13', end: '11:43' },
    { label: '5', start: '11:47', end: '12:17' },
    { label: '6', start: '12:21', end: '12:51' },
    { label: '7', start: '12:55', end: '13:25' },
    { label: '8', start: '13:29', end: '14:09' },
    { label: '9', start: '14:13', end: '14:53' },
  ],
}

export function BellSchedulePage() {
  const [rows, setRows]     = useState<Record<ScheduleLetter, TableRow | null>>({ A: null, B: null, C: null, D: null })
  const [drafts, setDrafts] = useState<Record<ScheduleLetter, Slot[]>>({ A: DEFAULTS.A, B: DEFAULTS.B, C: DEFAULTS.C, D: DEFAULTS.D })
  const [active, setActive] = useState<ScheduleLetter>('A')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('bell_schedules')
      .select('*')
      .then(({ data, error }) => {
        if (error) { setError(error.message); setLoading(false); return }
        const r: Record<ScheduleLetter, TableRow | null> = { A: null, B: null, C: null, D: null }
        const d: Record<ScheduleLetter, Slot[]> = { A: DEFAULTS.A, B: DEFAULTS.B, C: DEFAULTS.C, D: DEFAULTS.D }
        for (const row of (data ?? [])) {
          r[row.letter as ScheduleLetter] = row
          d[row.letter as ScheduleLetter] = row.slots ?? DEFAULTS[row.letter as ScheduleLetter]
        }
        setRows(r)
        setDrafts(d)
        setLoading(false)
      })
  }, [])

  const updateSlot = (letter: ScheduleLetter, i: number, field: keyof Slot, val: string) => {
    setDrafts((d) => {
      const next = [...d[letter]]
      next[i] = { ...next[i], [field]: val }
      return { ...d, [letter]: next }
    })
  }

  const addSlot = (letter: ScheduleLetter) => {
    setDrafts((d) => ({
      ...d,
      [letter]: [...d[letter], { label: '', start: '', end: '' }],
    }))
  }

  const removeSlot = (letter: ScheduleLetter, i: number) => {
    setDrafts((d) => ({
      ...d,
      [letter]: d[letter].filter((_, idx) => idx !== i),
    }))
  }

  const isDirty = (letter: ScheduleLetter) => {
    const row = rows[letter]
    if (!row) return true
    return JSON.stringify(drafts[letter]) !== JSON.stringify(row.slots ?? [])
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    const letter = active
    const slots = drafts[letter].filter((s) => s.label && s.start && s.end)
    const row = rows[letter]
    const payload = { letter, name: LETTER_NAMES[letter], slots, last_updated: new Date().toISOString() }
    const { error } = row
      ? await supabase.from('bell_schedules').update(payload).eq('id', row.id)
      : await supabase.from('bell_schedules').insert(payload)
    if (error) { setError(error.message) }
    else { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    setSaving(false)
  }

  if (loading) return <Skeleton />

  const slots = drafts[active]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Bell Schedules"
        description="Edit start/end times for each schedule type. Changes are saved per schedule letter."
      />

      <div className="flex gap-1 p-1 card w-fit">
        {LETTERS.map((l) => (
          <button
            key={l}
            onClick={() => setActive(l)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              l === active
                ? 'bg-accent text-white'
                : 'text-dim hover:text-text hover:bg-surface-2'
            }`}
          >
            <span>{l}</span>
            <span className={`ml-1.5 text-[10px] font-semibold ${l === active ? 'text-white/70' : 'text-dim/60'}`}>
              {LETTER_NAMES[l].split(' ')[0].toUpperCase()}
            </span>
            {isDirty(l) && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-warn inline-block" />}
          </button>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-text">Schedule {active} — {LETTER_NAMES[active]}</p>
          <span className="text-xs text-dim">{slots.filter(s => s.label && s.start && s.end).length} periods</span>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-[64px_1fr_1fr_36px] gap-2 px-2">
            <p className="text-[10px] font-bold text-dim uppercase tracking-wider">Label</p>
            <p className="text-[10px] font-bold text-dim uppercase tracking-wider">Start</p>
            <p className="text-[10px] font-bold text-dim uppercase tracking-wider">End</p>
            <span />
          </div>

          {slots.map((slot, i) => (
            <div key={i} className="grid grid-cols-[64px_1fr_1fr_36px] gap-2 items-center">
              <input
                type="text"
                value={slot.label}
                onChange={(e) => updateSlot(active, i, 'label', e.target.value)}
                placeholder="HR / 1"
                maxLength={4}
                className="px-3 py-2 rounded-xl border border-border bg-surface-2 text-sm text-center font-mono"
              />
              <input
                type="time"
                value={slot.start}
                onChange={(e) => updateSlot(active, i, 'start', e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-surface-2 text-sm"
              />
              <input
                type="time"
                value={slot.end}
                onChange={(e) => updateSlot(active, i, 'end', e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-surface-2 text-sm"
              />
              <button
                onClick={() => removeSlot(active, i)}
                className="w-9 h-9 rounded-xl border border-border bg-surface-2 text-dim hover:text-danger hover:border-danger transition-colors flex items-center justify-center text-xl leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => addSlot(active)}
          className="mt-3 w-full py-2 rounded-xl border border-dashed border-border-2 text-xs font-semibold text-dim hover:text-text hover:border-border transition-colors"
        >
          + Add Period
        </button>
      </div>

      <SaveBar dirty={isDirty(active)} saving={saving} saved={saved} error={error} onSave={save} />
    </div>
  )
}

function Skeleton() {
  return (
    <div className="card p-6 animate-pulse space-y-3">
      {[1,2,3,4,5].map((i) => <div key={i} className="h-10 bg-surface-2 rounded-xl" />)}
    </div>
  )
}
