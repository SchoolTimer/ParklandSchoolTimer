import { createClient } from 'jsr:@supabase/supabase-js@2'

// Called before Google sign-in, by someone who is not logged in yet.
// The invite code is the credential. verify_jwt is off for that reason.
// Public signups stay disabled: this prepares one confirmed user for the
// invited email, and Google links onto that user when the emails match.

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

type AuthUser = { id: string; email?: string; app_metadata?: Record<string, unknown> }

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: cors })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' })

  let body: { code?: string; email?: string } = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const code = (body.code ?? '').trim().toUpperCase()
  const email = (body.email ?? '').trim().toLowerCase()

  if (!/^PHS-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
    return json({ ok: false, error: 'Enter a valid invite code.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Enter the Google email you will use.' })
  }

  const url = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !serviceKey) return json({ ok: false, error: 'Signup is not configured.' }, 500)

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: invite, error: inviteError } = await admin
    .from('invite_codes')
    .select('id, used_at, revoked, expires_at, reserved_user_id')
    .eq('code', code)
    .maybeSingle()

  if (inviteError || !invite) return json({ ok: false, error: 'That invite code is not valid.' })
  if (invite.used_at || invite.revoked) return json({ ok: false, error: 'That invite code has already been used.' })
  if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) {
    return json({ ok: false, error: 'That invite code has expired.' })
  }

  const found = await fetch(`${url}/auth/v1/admin/users?filter=${encodeURIComponent(email)}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  })
  const foundJson = await found.json().catch(() => ({}))
  const listed = (Array.isArray(foundJson) ? foundJson : foundJson.users ?? []) as AuthUser[]
  let user = listed.find((row) => row.email?.toLowerCase() === email)

  if (user) {
    const { data: existingAdmin } = await admin
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()
    if (existingAdmin) {
      return json({ ok: false, error: 'That Google account is already an admin. Sign in instead.' })
    }
  } else {
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      app_metadata: { invite_pending: true },
    })
    if (createError || !created.user) {
      return json({ ok: false, error: 'Could not prepare that account. Try again.' })
    }
    user = { id: created.user.id, email, app_metadata: { invite_pending: true } }
  }

  if (invite.reserved_user_id && invite.reserved_user_id !== user.id) {
    const { data: reservedAdmin } = await admin
      .from('admins')
      .select('user_id')
      .eq('user_id', invite.reserved_user_id)
      .maybeSingle()
    if (!reservedAdmin) {
      const { data: prev } = await admin.auth.admin.getUserById(invite.reserved_user_id)
      if (prev.user?.app_metadata?.invite_pending === true) {
        await admin.auth.admin.deleteUser(invite.reserved_user_id)
      }
    }
  }

  const { error: updateError } = await admin
    .from('invite_codes')
    .update({ reserved_email: email, reserved_user_id: user.id })
    .eq('id', invite.id)

  if (updateError) return json({ ok: false, error: 'Could not reserve that invite. Try again.' })
  return json({ ok: true })
})
