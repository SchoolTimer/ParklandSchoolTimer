import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SaveBar } from '../components/SaveBar'
import { SectionHeader } from '../components/SectionHeader'

type RawMenuItem = { product: { name: string } }
type Row = { id: string; breakfast: RawMenuItem[]; lunch: RawMenuItem[] }

function toNames(items: RawMenuItem[]): string[] {
  return (items ?? []).map((i) => i?.product?.name ?? '').filter(Boolean)
}

function toJsonb(names: string[]): RawMenuItem[] {
  return names.map((n) => ({ product: { name: n } }))
}

export function FoodMenuPage() {
  const [row, setRow]             = useState<Row | null>(null)
  const [breakfast, setBreakfast] = useState<string[]>([''])
  const [lunch, setLunch]         = useState<string[]>([''])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('foodmenus')
      .select('*')
      .eq('id', 'current')
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') {
          setError(error.message)
        } else if (data) {
          setRow(data)
          const b = toNames(data.breakfast)
          const l = toNames(data.lunch)
          setBreakfast(b.length ? b : [''])
          setLunch(l.length ? l : [''])
        }
        setLoading(false)
      })
  }, [])

  const cleanList = (list: string[]) => list.map((s) => s.trim()).filter(Boolean)

  const dirty = (() => {
    if (!row) return true
    const b = cleanList(breakfast)
    const l = cleanList(lunch)
    return JSON.stringify(b) !== JSON.stringify(toNames(row.breakfast ?? [])) ||
           JSON.stringify(l) !== JSON.stringify(toNames(row.lunch ?? []))
  })()

  const save = async () => {
    setSaving(true)
    setError(null)
    const payload = {
      breakfast: toJsonb(cleanList(breakfast)),
      lunch: toJsonb(cleanList(lunch)),
      last_updated: new Date().toISOString(),
    }
    const { error } = row
      ? await supabase.from('foodmenus').update(payload).eq('id', 'current')
      : await supabase.from('foodmenus').insert({ id: 'current', ...payload })
    if (error) { setError(error.message) }
    else { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    setSaving(false)
  }

  if (loading) return <Skeleton />

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Food Menu"
        description="Edit today's breakfast and lunch items. Each line is one menu item."
      />
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface-2 text-xs text-dim">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-warn">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        This data auto-updates every day at <span className="font-semibold text-text mx-1">4:00 AM EST</span> — manual changes here will be overwritten at the next refresh.
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MenuSection label="Breakfast" items={breakfast} setItems={setBreakfast} />
        <MenuSection label="Lunch"     items={lunch}     setItems={setLunch} />
      </div>

      <SaveBar dirty={dirty} saving={saving} saved={saved} error={error} onSave={save} />
    </div>
  )
}

function MenuSection({
  label, items, setItems,
}: {
  label: string
  items: string[]
  setItems: (v: string[]) => void
}) {
  const update = (i: number, val: string) => {
    const next = [...items]
    next[i] = val
    setItems(next)
  }
  const add = () => setItems([...items, ''])
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i))

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-dim uppercase tracking-wider">{label}</p>
        <span className="text-xs text-dim">{items.filter(Boolean).length} items</span>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`${label} item…`}
              className="flex-1 px-3 py-2 rounded-xl border border-border bg-surface-2 text-sm"
            />
            {items.length > 1 && (
              <button
                onClick={() => remove(i)}
                className="w-8 h-9 rounded-xl border border-border bg-surface-2 text-dim hover:text-danger hover:border-danger transition-colors flex items-center justify-center text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="mt-3 w-full py-2 rounded-xl border border-dashed border-border-2 text-xs font-semibold text-dim hover:text-text hover:border-border transition-colors"
      >
        + Add Item
      </button>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1,2].map((i) => (
        <div key={i} className="card p-5 animate-pulse space-y-3">
          {[1,2,3].map((j) => <div key={j} className="h-9 bg-surface-2 rounded-xl" />)}
        </div>
      ))}
    </div>
  )
}
