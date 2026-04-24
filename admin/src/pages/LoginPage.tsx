import { useState } from 'react'
import { useAuth } from '../lib/auth'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail]   = useState('')
  const [pw, setPw]         = useState('')
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const err = await login(email, pw)
    if (err) {
      setError('Incorrect email or password.')
      setPw('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-dim uppercase tracking-widest leading-none">Parkland HS</p>
            <p className="text-base font-bold text-text leading-none mt-0.5">Admin Portal</p>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-dim mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null) }}
              className={`w-full px-3 py-2.5 rounded-xl border bg-surface-2 text-sm text-text placeholder:text-dim ${
                error ? 'border-danger' : 'border-border'
              }`}
              placeholder="admin@parklandsd.org"
              autoFocus
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dim mb-1.5">Password</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(null) }}
              className={`w-full px-3 py-2.5 rounded-xl border bg-surface-2 text-sm text-text placeholder:text-dim ${
                error ? 'border-danger' : 'border-border'
              }`}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {error && <p className="text-[11px] text-danger mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!email || !pw || loading}
            className="py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
