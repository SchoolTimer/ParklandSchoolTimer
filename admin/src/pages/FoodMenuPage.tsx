import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SectionFooter, WarnIcon } from '../components/shared'

type RawMenuItem = { product: { name: string } }
type Row = { id: string; breakfast: RawMenuItem[]; lunch: RawMenuItem[] }

function toNames(items: RawMenuItem[]): string[] {
  return (items ?? []).map((i) => i?.product?.name ?? '').filter(Boolean)
}
function toJsonb(names: string[]): RawMenuItem[] {
  return names.map((n) => ({ product: { name: n } }))
}

export function FoodMenuSection() {
  const [row, setRow]             = useState<Row | null>(null)
  const [breakfast, setBreakfast] = useState<string[]>([''])
  const [lunch, setLunch]         = useState<string[]>([''])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    supabase.from('foodmenus').select('*').eq('id', 'current').single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') setError(error.message)
        else if (data) {
          setRow(data)
          const b = toNames(data.breakfast); const l = toNames(data.lunch)
          setBreakfast(b.length ? b : ['']); setLunch(l.length ? l : [''])
        }
        setLoading(false)
      })
  }, [])

  const cleanList = (list: string[]) => list.map((s) => s.trim()).filter(Boolean)

  const dirty = !row ? true : (() => {
    return JSON.stringify(cleanList(breakfast)) !== JSON.stringify(toNames(row.breakfast ?? [])) ||
           JSON.stringify(cleanList(lunch))     !== JSON.stringify(toNames(row.lunch ?? []))
  })()

  const save = async () => {
    setSaving(true); setError(null)
    const payload = {
      breakfast: toJsonb(cleanList(breakfast)),
      lunch:     toJsonb(cleanList(lunch)),
      last_updated: new Date().toISOString(),
    }
    const { error } = row
      ? await supabase.from('foodmenus').update(payload).eq('id', 'current')
      : await supabase.from('foodmenus').insert({ id: 'current', ...payload })
    if (error) setError(error.message)
    else { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    setSaving(false)
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-warn/20 bg-warn/5 text-xs text-dim">
        <WarnIcon />
        <span>Auto-updates every day at <strong className="text-text font-semibold">4:00 AM EST</strong> — manual edits will be overwritten at next refresh.</span>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-border">
          <MenuColumn label="Breakfast" emoji="🥞" items={breakfast} setItems={setBreakfast} loading={loading} />
          <MenuColumn label="Lunch"     emoji="🍱" items={lunch}     setItems={setLunch}      loading={loading} />
        </div>
        <div className="px-5 pb-5 border-t border-border pt-4">
          <SectionFooter dirty={dirty} saving={saving} saved={saved} error={error} onSave={save} />
        </div>
      </div>
    </div>
  )
}

function MenuColumn({
  label, emoji, items, setItems, loading,
}: {
  label: string; emoji: string; items: string[]; setItems: (v: string[]) => void; loading: boolean
}) {
  const update = (i: number, val: string) => { const n = [...items]; n[i] = val; setItems(n) }
  const add    = () => setItems([...items, ''])
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i))

  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base leading-none">{emoji}</span>
        <p className="text-sm font-bold text-text">{label}</p>
        <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-2 text-dim">
          {items.filter(Boolean).length}
        </span>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[1,2,3].map((i) => <div key={i} className="h-9 bg-surface-2 rounded-xl" />)}
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => update(i, e.target.value)}
                  placeholder={`${label} item…`}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-surface-2 text-sm hover:border-border-2 focus:border-accent transition-colors"
                />
                {items.length > 1 && (
                  <button
                    onClick={() => remove(i)}
                    className="w-9 h-9 rounded-xl border border-border bg-surface-2 text-dim hover:text-danger hover:border-danger transition-colors flex items-center justify-center text-lg leading-none"
                  >×</button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={add}
            className="mt-3 w-full py-2 rounded-xl border border-dashed border-border-2 text-xs font-semibold text-dim hover:text-text hover:border-accent hover:bg-accent-soft transition-colors"
          >+ Add item</button>
        </>
      )}
    </div>
  )
}
