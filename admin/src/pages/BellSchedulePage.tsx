import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SectionFooter } from '../components/shared'
import type { ScheduleLetter } from '../lib/types'

type Slot = { label: string; start: string; end: string }
type TableRow = { id: string; letter: ScheduleLetter; name: string; slots: Slot[] }

const LETTERS: ScheduleLetter[] = ['A', 'B', 'C', 'D']
const LETTER_NAMES: Record<ScheduleLetter, string> = {
  A: 'Regular', B: 'Homeroom', C: 'Early Dismissal', D: '2-Hour Delay',
}
const LETTER_DESC: Record<ScheduleLetter, string> = {
  A: 'Standard 9-period day',
  B: 'Homeroom + 9 periods',
  C: 'Periods 1, 2, 3, 8, 9 only',
  D: 'Starts at 9:40 AM',
}

const DEFAULTS: Record<ScheduleLetter, Slot[]> = {
  A: [
    {label:'1',start:'07:40',end:'08:29'},{label:'2',start:'08:33',end:'09:17'},
    {label:'3',start:'09:21',end:'10:05'},{label:'4',start:'10:09',end:'10:53'},
    {label:'5',start:'10:57',end:'11:41'},{label:'6',start:'11:45',end:'12:29'},
    {label:'7',start:'12:33',end:'13:17'},{label:'8',start:'13:21',end:'14:05'},
    {label:'9',start:'14:09',end:'14:53'},
  ],
  B: [
    {label:'HR',start:'07:40',end:'07:50'},{label:'1',start:'07:54',end:'08:37'},
    {label:'2',start:'08:41',end:'09:24'},{label:'3',start:'09:28',end:'10:11'},
    {label:'4',start:'10:15',end:'10:58'},{label:'5',start:'11:02',end:'11:45'},
    {label:'6',start:'11:49',end:'12:32'},{label:'7',start:'12:36',end:'13:19'},
    {label:'8',start:'13:23',end:'14:06'},{label:'9',start:'14:10',end:'14:53'},
  ],
  C: [
    {label:'1',start:'07:40',end:'08:20'},{label:'2',start:'08:24',end:'09:00'},
    {label:'3',start:'09:04',end:'09:40'},{label:'8',start:'09:44',end:'10:20'},
    {label:'9',start:'10:24',end:'11:00'},
  ],
  D: [
    {label:'1',start:'09:40',end:'10:09'},{label:'2',start:'10:13',end:'10:39'},
    {label:'3',start:'10:43',end:'11:09'},{label:'4',start:'11:13',end:'11:43'},
    {label:'5',start:'11:47',end:'12:17'},{label:'6',start:'12:21',end:'12:51'},
    {label:'7',start:'12:55',end:'13:25'},{label:'8',start:'13:29',end:'14:09'},
    {label:'9',start:'14:13',end:'14:53'},
  ],
}

export function BellScheduleSection() {
  const [rows, setRows]     = useState<Record<ScheduleLetter, TableRow | null>>({A:null,B:null,C:null,D:null})
  const [drafts, setDrafts] = useState<Record<ScheduleLetter, Slot[]>>({A:DEFAULTS.A,B:DEFAULTS.B,C:DEFAULTS.C,D:DEFAULTS.D})
  const [active, setActive] = useState<ScheduleLetter>('A')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    supabase.from('bell_schedules').select('*').then(({ data, error }) => {
      if (error) { setError(error.message); setLoading(false); return }
      const r = {A:null,B:null,C:null,D:null} as Record<ScheduleLetter, TableRow | null>
      const d = {A:DEFAULTS.A,B:DEFAULTS.B,C:DEFAULTS.C,D:DEFAULTS.D} as Record<ScheduleLetter, Slot[]>
      for (const row of (data ?? [])) {
        r[row.letter as ScheduleLetter] = row
        d[row.letter as ScheduleLetter] = row.slots ?? DEFAULTS[row.letter as ScheduleLetter]
      }
      setRows(r); setDrafts(d); setLoading(false)
    })
  }, [])

  const updateSlot = (l: ScheduleLetter, i: number, f: keyof Slot, v: string) =>
    setDrafts((d) => { const n=[...d[l]]; n[i]={...n[i],[f]:v}; return {...d,[l]:n} })
  const addSlot    = (l: ScheduleLetter) => setDrafts((d) => ({...d,[l]:[...d[l],{label:'',start:'',end:''}]}))
  const removeSlot = (l: ScheduleLetter, i: number) => setDrafts((d) => ({...d,[l]:d[l].filter((_,idx)=>idx!==i)}))
  const isDirty    = (l: ScheduleLetter) => !rows[l] || JSON.stringify(drafts[l]) !== JSON.stringify(rows[l]!.slots ?? [])

  const save = async () => {
    setSaving(true); setError(null)
    const slots = drafts[active].filter((s) => s.label && s.start && s.end)
    const row = rows[active]
    const payload = { letter: active, name: LETTER_NAMES[active], slots, last_updated: new Date().toISOString() }
    const { error } = row
      ? await supabase.from('bell_schedules').update(payload).eq('id', row.id)
      : await supabase.from('bell_schedules').insert(payload)
    if (error) setError(error.message)
    else { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    setSaving(false)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Schedule type cards */}
      <div className="grid grid-cols-4 gap-3">
        {LETTERS.map((l) => (
          <button
            key={l}
            onClick={() => setActive(l)}
            className={`card p-4 text-left transition-all duration-150 hover:border-accent/40 ${
              active === l ? 'border-accent bg-accent-soft' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className={`text-xl font-black leading-none ${active === l ? 'text-accent' : 'text-text'}`}>{l}</span>
              {isDirty(l) && !loading && (
                <span className="w-2 h-2 rounded-full bg-warn shrink-0 mt-0.5" />
              )}
            </div>
            <p className={`text-xs font-semibold leading-none ${active === l ? 'text-accent' : 'text-text'}`}>{LETTER_NAMES[l]}</p>
            <p className="text-[10px] text-dim mt-1 leading-snug">{LETTER_DESC[l]}</p>
          </button>
        ))}
      </div>

      {/* Editor card */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-dim uppercase tracking-widest">Schedule {active} — {LETTER_NAMES[active]}</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-2 text-dim">
            {drafts[active].filter(s => s.label && s.start && s.end).length} periods
          </span>
        </div>

        {loading ? (
          <div className="p-5 space-y-2 animate-pulse">
            {[1,2,3,4,5].map((i) => <div key={i} className="h-10 bg-surface-2 rounded-xl" />)}
          </div>
        ) : (
          <div className="p-5">
            <div className="grid grid-cols-[52px_1fr_1fr_36px] gap-2 px-1 mb-2">
              {['Period','Start','End',''].map((h,i) => (
                <p key={i} className="text-[10px] font-bold text-dim uppercase tracking-wider">{h}</p>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              {drafts[active].map((slot, i) => (
                <div key={i} className="grid grid-cols-[52px_1fr_1fr_36px] gap-2 items-center">
                  <input
                    type="text" value={slot.label}
                    onChange={(e) => updateSlot(active, i, 'label', e.target.value)}
                    placeholder="1" maxLength={4}
                    className="px-2 py-2 rounded-xl border border-border bg-surface-2 text-sm text-center font-mono font-bold hover:border-border-2 focus:border-accent transition-colors"
                  />
                  <input
                    type="time" value={slot.start}
                    onChange={(e) => updateSlot(active, i, 'start', e.target.value)}
                    className="px-3 py-2 rounded-xl border border-border bg-surface-2 text-sm hover:border-border-2 focus:border-accent transition-colors"
                  />
                  <input
                    type="time" value={slot.end}
                    onChange={(e) => updateSlot(active, i, 'end', e.target.value)}
                    className="px-3 py-2 rounded-xl border border-border bg-surface-2 text-sm hover:border-border-2 focus:border-accent transition-colors"
                  />
                  <button
                    onClick={() => removeSlot(active, i)}
                    className="h-9 w-9 rounded-xl border border-border bg-surface-2 text-dim hover:text-danger hover:border-danger transition-colors flex items-center justify-center text-lg leading-none"
                  >×</button>
                </div>
              ))}
            </div>

            <button
              onClick={() => addSlot(active)}
              className="w-full py-2 rounded-xl border border-dashed border-border-2 text-xs font-semibold text-dim hover:text-text hover:border-accent hover:bg-accent-soft transition-colors mb-4"
            >+ Add Period</button>

            <SectionFooter dirty={isDirty(active)} saving={saving} saved={saved} error={error} onSave={save} />
          </div>
        )}
      </div>
    </div>
  )
}
