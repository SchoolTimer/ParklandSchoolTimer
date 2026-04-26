import { createClient, type PostgrestError, type AuthError } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables')
}

export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// If a PostgREST or Auth call fails because the JWT is expired/invalid,
// sign out so the AuthProvider listener kicks the user back to login.
export function isAuthExpiredError(error: PostgrestError | AuthError | null | undefined): boolean {
  if (!error) return false
  const code = (error as PostgrestError).code
  const msg  = error.message?.toLowerCase() ?? ''
  return (
    code === 'PGRST301' ||           // JWT expired
    code === '401' ||
    msg.includes('jwt expired') ||
    msg.includes('jwt is invalid') ||
    msg.includes('invalid token') ||
    msg.includes('refresh token not found')
  )
}

export async function handleAuthError(error: PostgrestError | AuthError | null | undefined): Promise<boolean> {
  if (isAuthExpiredError(error)) {
    await supabase.auth.signOut()
    return true
  }
  return false
}
