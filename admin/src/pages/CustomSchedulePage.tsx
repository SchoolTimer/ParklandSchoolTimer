import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SectionFooter } from '../components/shared'

type Slot = { label: string; start: string; end: string }
type CustomSchedule = {
  id: string
  name: string
  slots: Slot[]
  enabled: boolean
  last_updated: string | null
}

const EMPTY_SLOT: Slot = { label: '', start: '', end: '' }

export function CustomScheduleSection() {
  const [list, setList]       = useState<CustomSchedule[]>([])
  const [activeId, setActive] = useState<string | null>(null)
  const [draftName, setName]  = useState('')
  const [draftSlots, setSlots] = useState<Slot[]>([{ ...EMPTY_SLOT }])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const active = list.find((s) => s.id === activeId) ?? null
  const isNew  = activeId === 'new'

  useEffect(() => { void load() }, [])

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('custom_schedules')
      .select('*')
      .order('last_updated', { ascending: false })
    if (error) setError(error.message)
    setList((data ?? []) as CustomSchedule[])
    setLoading(false)
  }

  function selectSchedule(id: string) {
    setError(null); setSaved(false)
    if (id === 'new') {
      setActive('new'); setName(''); setSlots([{ ...EMPTY_SLOT }])
      return
    }
    const row = list.find((s) => s.id === id)
    if (!row) return
    setActive(id); setName(row.name); setSlots(row.slots.length ? row.slots : [{ ...EMPTY_SLOT }])
  }

  const dirty =
    isNew
      ? draftName.trim().length > 0 || draftSlots.some((s) => s.label || s.start || s.end)
      : !!active && (draftName !== active.name || JSON.stringify(draftSlots) !== JSON.stringify(active.slots))

  const updateSlot = (i: number, f: keyof Slot, v: string) =>
    setSlots((d) => { const n = [...d]; n[i] = { ...n[i], [f]: v }; return n })
  const addSlot    = () => setSlots((d) => [...d, { ...EMPTY_SLOT }])
  const removeSlot = (i: number) => setSlots((d) => d.filter((_, idx) => idx !== i))

  async function save() {
    if (!draftName.trim()) { setError('Name is required'); return }
    setSaving(true); setError(null)
    const slots = draftSlots.filter((s) => s.label && s.start && s.end)
    const payload = { name: draftName.trim(), slots, last_updated: new Date().toISOString() }

    if (isNew) {
      const { data, error } = await supabase
        .from('custom_schedules')
        .insert({ ...payload, enabled: false })
        .select()
        .single()
      if (error) setError(error.message)
      else if (data) {
        setSaved(true); setTimeout(() => setSaved(false), 2500)
        await load()
        setActive(data.id)
      }
    } else if (active) {
      const { error } = await supabase
        .from('custom_schedules')
        .update(payload)
        .eq('id', active.id)
      if (error) setError(error.message)
      else { setSaved(true); setTimeout(() => setSaved(false), 2500); await load() }
    }
    setSaving(false)
  }

  async function toggleEnabled(row: CustomSchedule) {
    setError(null)
    if (row.enabled) {
      const { error } = await supabase.from('custom_schedules').update({ enabled: false }).eq('id', row.id)
      if (error) { setError(error.message); return }
    } else {
      const { error: e1 } = await supabase.from('custom_schedules').update({ enabled: false }).neq('id', row.id)
      if (e1) { setError(e1.message); return }
      const { error: e2 } = await supabase.from('custom_schedules').update({ enabled: true }).eq('id', row.id)
      if (e2) { setError(e2.message); return }
    }
    await load()
  }

  async function remove(row: CustomSchedule) {
    if (!confirm(`Delete "${row.name}"? This can't be undone.`)) return
    const { error } = await supabase.from('custom_schedules').delete().eq('id', row.id)
    if (error) { setError(error.message); return }
    if (activeId === row.id) setActive(null)
    await load()
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Schedule list */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-dim uppercase tracking-widest">Your Custom Schedules</p>
            <p className="text-[11px] text-dim mt-1">Enable one to override the regular bell schedule in the API response.</p>
          </div>
          <button
            onClick={() => selectSchedule('new')}
            className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-90 transition-opacity"
          >+ New Schedule</button>
        </div>

        {loading ? (
          <div className="p-5 space-y-2 animate-pulse">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-surface-2 rounded-xl" />)}
          </div>
        ) : list.length === 0 && !isNew ? (
          <div className="p-8 text-center">
            <p className="text-sm text-dim">No custom schedules yet.</p>
            <p className="text-xs text-dim/60 mt-1">Click "New Schedule" to create one.</p>
          </div>
        ) : (
          <div className="p-3 space-y-1.5">
            {list.map((row) => {
              const isActive = activeId === row.id
              return (
                <div
                  key={row.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                    isActive ? 'border-accent bg-accent-soft' : 'border-border hover:border-border-2'
                  }`}
                >
                  <button onClick={() => selectSchedule(row.id)} className="flex-1 text-left min-w-0">
                    <p className={`text-sm font-bold truncate ${isActive ? 'text-accent' : 'text-text'}`}>{row.name}</p>
                    <p className="text-[11px] text-dim mt-0.5">
                      {row.slots.length} period{row.slots.length === 1 ? '' : 's'}
                      {row.enabled && <span className="ml-2 text-success font-semibold">• Active</span>}
                    </p>
                  </button>
                  <button
                    onClick={() => toggleEnabled(row)}
                    className={`shrink-0 relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      row.enabled ? 'bg-success' : 'bg-surface-2 border border-border'
                    }`}
                    title={row.enabled ? 'Disable' : 'Enable'}
                  >
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transform transition-transform ${
                      row.enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
                    }`} />
                  </button>
                  <button
                    onClick={() => remove(row)}
                    className="h-8 w-8 rounded-xl border border-border bg-surface-2 text-dim hover:text-danger hover:border-danger transition-colors flex items-center justify-center text-lg leading-none"
                    title="Delete"
                  >×</button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Editor card */}
      {(isNew || active) && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-xs font-bold text-dim uppercase tracking-widest mb-2">
              {isNew ? 'New Schedule' : 'Edit Schedule'}
            </p>
            <input
              type="text" value={draftName}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pep Rally Day"
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-2 text-sm font-bold hover:border-border-2 focus:border-accent transition-colors"
            />
          </div>

          <div className="p-5">
            <div className="grid grid-cols-[52px_1fr_1fr_36px] gap-2 px-1 mb-2">
              {['Period', 'Start', 'End', ''].map((h, i) => (
                <p key={i} className="text-[10px] font-bold text-dim uppercase tracking-wider">{h}</p>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              {draftSlots.map((slot, i) => (
                <div key={i} className="grid grid-cols-[52px_1fr_1fr_36px] gap-2 items-center">
                  <input
                    type="text" value={slot.label}
                    onChange={(e) => updateSlot(i, 'label', e.target.value)}
                    placeholder="1" maxLength={4}
                    className="px-2 py-2 rounded-xl border border-border bg-surface-2 text-sm text-center font-mono font-bold hover:border-border-2 focus:border-accent transition-colors"
                  />
                  <input
                    type="time" value={slot.start}
                    onChange={(e) => updateSlot(i, 'start', e.target.value)}
                    className="px-3 py-2 rounded-xl border border-border bg-surface-2 text-sm hover:border-border-2 focus:border-accent transition-colors"
                  />
                  <input
                    type="time" value={slot.end}
                    onChange={(e) => updateSlot(i, 'end', e.target.value)}
                    className="px-3 py-2 rounded-xl border border-border bg-surface-2 text-sm hover:border-border-2 focus:border-accent transition-colors"
                  />
                  <button
                    onClick={() => removeSlot(i)}
                    className="h-9 w-9 rounded-xl border border-border bg-surface-2 text-dim hover:text-danger hover:border-danger transition-colors flex items-center justify-center text-lg leading-none"
                  >×</button>
                </div>
              ))}
            </div>

            <button
              onClick={addSlot}
              className="w-full py-2 rounded-xl border border-dashed border-border-2 text-xs font-semibold text-dim hover:text-text hover:border-accent hover:bg-accent-soft transition-colors mb-4"
            >+ Add Period</button>

            <SectionFooter dirty={dirty} saving={saving} saved={saved} error={error} onSave={save} />
          </div>
        </div>
      )}
    </div>
  )
}
