import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

type Invite = {
  id: string
  code: string
  note: string | null
  created_at: string
  used_at: string | null
  revoked: boolean
  reserved_email: string | null
  expires_at: string | null
}

function isExpired(row: Invite) {
  return !row.used_at && !!row.expires_at && new Date(row.expires_at).getTime() <= Date.now()
}

type Member = {
  user_id: string
  email: string | null
  created_at: string
}

function statusOf(row: Invite): { label: string; className: string } {
  if (row.used_at) return { label: 'Used', className: 'text-dim' }
  if (row.revoked) return { label: 'Revoked', className: 'text-danger' }
  if (isExpired(row)) return { label: 'Expired', className: 'text-danger' }
  if (row.reserved_email) return { label: 'Waiting for Google', className: 'text-warn' }
  return { label: 'Ready', className: 'text-success' }
}

export function InvitesSection() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Invite[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [freshCode, setFreshCode] = useState<string | null>(null)

  const load = async () => {
    const [invites, people] = await Promise.all([
      supabase
        .from('invite_codes')
        .select('id, code, note, created_at, used_at, revoked, reserved_email, expires_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('admins')
        .select('user_id, email, created_at')
        .order('created_at', { ascending: true }),
    ])
    if (invites.error) setError(invites.error.message)
    else setRows(invites.data ?? [])
    if (people.error) setError(people.error.message)
    else setMembers(people.data ?? [])
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const create = async () => {
    setCreating(true)
    setError(null)
    const { data, error } = await supabase.rpc('create_invite', { p_note: note })
    if (error) setError(error.message)
    else {
      setFreshCode(data)
      setNote('')
      await load()
    }
    setCreating(false)
  }

  const revoke = async (id: string) => {
    setError(null)
    const { error } = await supabase.rpc('revoke_invite', { p_id: id })
    if (error) setError(error.message)
    else await load()
  }

  const copy = async (code: string) => {
    await navigator.clipboard.writeText(code)
  }

  const removeMember = async (member: Member) => {
    const name = member.email || 'this member'
    const ok = window.confirm(`Remove ${name}? They will lose access and need a new invite to sign in again.`)
    if (!ok) return
    setRemovingId(member.user_id)
    setError(null)
    const { error } = await supabase.rpc('remove_admin', { p_user_id: member.user_id })
    if (error) setError(error.message)
    else await load()
    setRemovingId(null)
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-text">Admins</p>
          <p className="text-xs text-dim mt-1">Removing someone deletes their sign-in. They cannot get back in with the old invite.</p>
        </div>
        {members.length === 0 ? (
          <p className="p-5 text-sm text-dim">No admins yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {members.map((member) => {
              const isYou = member.user_id === user?.id
              return (
                <li key={member.user_id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text truncate">{member.email || 'Unknown account'}</p>
                    <p className="text-[11px] text-dim mt-0.5">{isYou ? 'You' : 'Administrator'}</p>
                  </div>
                  {isYou ? (
                    <span className="text-[11px] font-semibold text-dim">You</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void removeMember(member)}
                      disabled={removingId === member.user_id}
                      className="text-[11px] font-semibold text-dim hover:text-danger disabled:opacity-40"
                    >
                      {removingId === member.user_id ? 'Removing…' : 'Remove'}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="card p-5 flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-text">New invite</p>
          <p className="text-xs text-dim mt-1">Each code works for 24 hours and can create one admin account.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note, optional (name or role)"
            className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-surface-2 text-sm text-text placeholder:text-dim"
          />
          <button
            type="button"
            onClick={() => void create()}
            disabled={creating}
            className="px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 disabled:opacity-40"
          >
            {creating ? 'Creating…' : 'Create code'}
          </button>
        </div>
        {freshCode && (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-accent-soft border border-accent/20 px-3 py-2.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">New code</p>
              <p className="text-sm font-bold tracking-widest text-text">{freshCode}</p>
            </div>
            <button type="button" onClick={() => void copy(freshCode)} className="text-xs font-semibold text-accent">
              Copy
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      <div className="card overflow-hidden">
        {rows.length === 0 ? (
          <p className="p-5 text-sm text-dim">No invite codes yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => {
              const status = statusOf(row)
              return (
                <li key={row.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold tracking-widest text-text">{row.code}</p>
                    <p className="text-[11px] text-dim mt-0.5 truncate">
                      {row.note || 'No note'}
                      {row.reserved_email ? ` · ${row.reserved_email}` : ''}
                      {row.expires_at && !row.used_at
                        ? ` · ${isExpired(row) ? 'Expired' : 'Expires'} ${new Date(row.expires_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
                        : ''}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold ${status.className}`}>{status.label}</span>
                  {!row.used_at && !row.revoked && !isExpired(row) && (
                    <button
                      type="button"
                      onClick={() => void revoke(row.id)}
                      className="text-[11px] font-semibold text-dim hover:text-danger"
                    >
                      Revoke
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
