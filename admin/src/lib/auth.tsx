import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

const INVITE_KEY = 'pst.invite'

type AuthCtx = {
  user: User | null
  loading: boolean
  gateError: string | null
  clearGateError: () => void
  signInWithGoogle: () => Promise<string | null>
  signUpWithGoogle: (code: string, email: string) => Promise<string | null>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

function friendlyAuthError(raw: string): string {
  const text = decodeURIComponent(raw.replace(/\+/g, ' '))
  if (/signups? not allowed/i.test(text) || /user not allowed/i.test(text)) {
    return 'This Google account has not been invited. Use an invite code to create an account.'
  }
  if (/provider is not enabled/i.test(text)) {
    return 'Google sign-in is not enabled on this project yet.'
  }
  return text
}

function takeRedirectError(): string | null {
  const search = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const raw = search.get('error_description') || hash.get('error_description') || search.get('error') || hash.get('error')
  if (!raw) return null
  const url = new URL(window.location.href)
  url.searchParams.delete('error')
  url.searchParams.delete('error_code')
  url.searchParams.delete('error_description')
  url.hash = ''
  window.history.replaceState({}, '', url.pathname + url.search)
  return friendlyAuthError(raw)
}

async function startGoogle(email?: string): Promise<string | null> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        prompt: 'select_account',
        ...(email ? { login_hint: email } : {}),
      },
    },
  })
  return error ? friendlyAuthError(error.message) : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [gateError, setGateError] = useState<string | null>(takeRedirectError)
  const run = useRef(0)

  useEffect(() => {
    const settle = async (sessionUser: User | null) => {
      const id = ++run.current
      if (!sessionUser) {
        if (id === run.current) {
          setUser(null)
          setLoading(false)
        }
        return
      }

      const { data: alreadyAdmin, error: adminError } = await supabase.rpc('is_admin')
      if (id !== run.current) return
      if (adminError) {
        setGateError('Could not verify this account. Try signing in again.')
        await supabase.auth.signOut()
        return
      }
      if (alreadyAdmin) {
        sessionStorage.removeItem(INVITE_KEY)
        setUser(sessionUser)
        setGateError(null)
        setLoading(false)
        return
      }

      const { error: redeemError } = await supabase.rpc('redeem_invite')
      if (id !== run.current) return
      const { data: adminNow } = await supabase.rpc('is_admin')
      if (id !== run.current) return

      if (!redeemError && adminNow) {
        sessionStorage.removeItem(INVITE_KEY)
        setUser(sessionUser)
        setGateError(null)
        setLoading(false)
        return
      }

      setUser(null)
      setGateError(
        redeemError
          ? 'Could not finish signup. Sign in with Google again in a moment.'
          : 'This Google account has not been invited. Use an invite code to create an account.',
      )
      setLoading(false)
      await supabase.auth.signOut()
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setUser(null)
        setLoading(false)
        return
      }
      void settle(data.session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void settle(session?.user ?? null)
    })

    const verifySession = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        await supabase.auth.signOut()
        return
      }
      const { data: admin } = await supabase.rpc('is_admin')
      if (!admin) await supabase.auth.signOut()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void verifySession()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', verifySession)

    return () => {
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', verifySession)
    }
  }, [])

  const signInWithGoogle = async (): Promise<string | null> => {
    sessionStorage.removeItem(INVITE_KEY)
    setGateError(null)
    return startGoogle()
  }

  const signUpWithGoogle = async (code: string, email: string): Promise<string | null> => {
    setGateError(null)
    const { data, error } = await supabase.functions.invoke('start-signup', {
      body: { code: code.trim(), email: email.trim() },
    })
    if (error) return 'Could not check that invite code. Try again.'
    if (!data?.ok) return (data?.error as string) || 'That invite code is not valid.'
    sessionStorage.setItem(INVITE_KEY, code.trim().toUpperCase())
    return startGoogle(email.trim().toLowerCase())
  }

  const logout = async () => {
    sessionStorage.removeItem(INVITE_KEY)
    await supabase.auth.signOut()
  }

  return (
    <Ctx.Provider value={{
      user,
      loading,
      gateError,
      clearGateError: () => setGateError(null),
      signInWithGoogle,
      signUpWithGoogle,
      logout,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}
