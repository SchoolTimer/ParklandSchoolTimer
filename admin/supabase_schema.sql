-- ============================================================
-- Parkland School Timer — Admin Database Schema
-- Run this in your Supabase SQL Editor to set up all tables.
-- ============================================================

-- Day Cycle table
-- Stores today / tomorrow / next_day values like "1A", "3B", or "N/A"
create table if not exists daycycle (
  id           uuid primary key default gen_random_uuid(),
  today        text,
  tomorrow     text,
  next_day     text,
  last_updated timestamptz default now()
);

-- Food Menu table
-- Stores breakfast and lunch as arrays of strings
create table if not exists foodmenu (
  id           uuid primary key default gen_random_uuid(),
  breakfast    text[] not null default '{}',
  lunch        text[] not null default '{}',
  last_updated timestamptz default now()
);

-- School Dates table
-- Stores important dates for the school year
create table if not exists school_dates (
  id                 uuid primary key default gen_random_uuid(),
  school_year_start  date not null,
  school_year_end    date not null,
  seniors_last_day   date not null,
  last_updated       timestamptz default now()
);

-- Bell Schedules table
-- Stores each schedule type (A/B/C/D) with all period time slots
-- slots is a JSONB array of {label, start, end} objects
create table if not exists bell_schedules (
  id           uuid primary key default gen_random_uuid(),
  letter       text not null check (letter in ('A','B','C','D')),
  name         text not null,
  slots        jsonb not null default '[]',
  last_updated timestamptz default now(),
  unique (letter)
);

-- Custom Schedules table
-- Stores admin-defined modified schedules with a name and slot list.
-- Only one schedule may be enabled at a time (enforced by partial unique index).
-- When enabled = true, the API will surface this schedule in its response.
create table if not exists custom_schedules (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slots        jsonb not null default '[]',
  enabled      boolean not null default false,
  last_updated timestamptz default now()
);

create unique index if not exists custom_schedules_one_enabled
  on custom_schedules ((enabled)) where enabled = true;

-- ============================================================
-- Row Level Security (RLS)
-- The block below is the original open policy. It is replaced by
-- the "Google invite auth" section at the bottom of this file:
-- anyone can read, only invited admins can write.
-- ============================================================

alter table daycycle         enable row level security;
alter table foodmenu         enable row level security;
alter table school_dates     enable row level security;
alter table bell_schedules   enable row level security;
alter table custom_schedules enable row level security;

-- Allow all operations (read + write) for anon users.
-- Replaced by the Google invite policies at the bottom of this file.
create policy "anon_all" on daycycle         for all using (true) with check (true);
create policy "anon_all" on foodmenu         for all using (true) with check (true);
create policy "anon_all" on school_dates     for all using (true) with check (true);
create policy "anon_all" on bell_schedules   for all using (true) with check (true);
create policy "anon_all" on custom_schedules for all using (true) with check (true);

-- ============================================================
-- Optional: seed initial data
-- ============================================================

-- insert into school_dates (school_year_start, school_year_end, seniors_last_day)
-- values ('2025-08-15', '2026-06-09', '2026-06-03');

-- ============================================================
-- Google invite auth
-- Sign-in is Google. A new account is created only after
-- start-signup reserves a valid invite for that email.
-- Public reads stay open. Writes require an admin row.
-- ============================================================

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

create table if not exists public.invite_codes (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,
  note            text,
  created_at      timestamptz not null default now(),
  expires_at      timestamptz,
  used_at         timestamptz,
  used_by         uuid references auth.users (id) on delete set null,
  revoked         boolean not null default false,
  reserved_email  text,
  reserved_user_id uuid references auth.users (id) on delete set null
);

alter table public.admins enable row level security;
alter table public.invite_codes enable row level security;

revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;

revoke all on public.invite_codes from anon, authenticated;
grant select on public.invite_codes to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    auth.uid() is not null
    and exists (select 1 from public.admins where user_id = auth.uid()),
    false
  );
$$;

create or replace function public.redeem_invite()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite uuid;
begin
  if auth.uid() is null then
    return 'not_signed_in';
  end if;

  if exists (select 1 from public.admins where user_id = auth.uid()) then
    return 'ok';
  end if;

  select id into v_invite
  from public.invite_codes
  where reserved_user_id = auth.uid()
    and used_at is null
    and revoked = false
    and (expires_at is null or expires_at > now())
  order by created_at
  limit 1
  for update;

  if v_invite is null then
    if exists (select 1 from public.admins where user_id = auth.uid()) then
      return 'ok';
    end if;
    return 'not_invited';
  end if;

  update public.invite_codes
  set used_at = now(),
      used_by = auth.uid()
  where id = v_invite;

  insert into public.admins (user_id, email)
  values (auth.uid(), (select email from auth.users where id = auth.uid()))
  on conflict (user_id) do nothing;

  return 'ok';
end;
$$;

create or replace function public.create_invite(p_note text default null)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
begin
  if not public.is_admin() then
    raise exception 'Not an admin';
  end if;

  v_code := 'PHS-' || upper(substr(md5(gen_random_uuid()::text), 1, 4))
            || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4));

  insert into public.invite_codes (code, note, expires_at)
  values (
    v_code,
    nullif(btrim(coalesce(p_note, '')), ''),
    now() + interval '24 hours'
  );

  return v_code;
end;
$$;

create or replace function public.remove_admin(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  if not public.is_admin() then
    raise exception 'Not an admin';
  end if;

  if auth.uid() is null or p_user_id = auth.uid() then
    raise exception 'You cannot remove yourself';
  end if;

  if not exists (select 1 from public.admins where user_id = p_user_id) then
    raise exception 'That member was not found';
  end if;

  select count(*) into v_count from public.admins;
  if v_count <= 1 then
    raise exception 'The last admin cannot be removed';
  end if;

  delete from public.admins where user_id = p_user_id;

  update public.invite_codes
  set reserved_user_id = null,
      reserved_email = case when used_at is null then null else reserved_email end
  where reserved_user_id = p_user_id;

  update public.invite_codes
  set used_by = null
  where used_by = p_user_id;

  delete from auth.users where id = p_user_id;
end;
$$;

create or replace function public.revoke_invite(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not an admin';
  end if;

  update public.invite_codes
  set revoked = true
  where id = p_id
    and used_at is null;
end;
$$;

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

revoke all on function public.redeem_invite() from public, anon, authenticated;
grant execute on function public.redeem_invite() to authenticated;

revoke all on function public.create_invite(text) from public, anon, authenticated;
grant execute on function public.create_invite(text) to authenticated;

revoke all on function public.revoke_invite(uuid) from public, anon, authenticated;
grant execute on function public.revoke_invite(uuid) to authenticated;

revoke all on function public.remove_admin(uuid) from public, anon, authenticated;
grant execute on function public.remove_admin(uuid) to authenticated;

-- The invites_select policy calls is_admin(), so it has to be created
-- after that function exists. Recreate it here for a fresh database.
drop policy if exists invites_select on public.invite_codes;
create policy invites_select on public.invite_codes
  for select to authenticated
  using (public.is_admin());

drop policy if exists admins_select on public.admins;
create policy admins_select on public.admins
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

do $$
declare
  t text;
begin
  foreach t in array array[
    'bell_schedules',
    'custom_schedules',
    'daycycle',
    'daycycles',
    'foodmenu',
    'foodmenus',
    'school_dates'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists anon_all on public.%I', t);
    execute format('drop policy if exists public_read on public.%I', t);
    execute format('drop policy if exists admin_insert on public.%I', t);
    execute format('drop policy if exists admin_update on public.%I', t);
    execute format('drop policy if exists admin_delete on public.%I', t);
    execute format(
      'create policy public_read on public.%I for select to anon, authenticated using (true)',
      t
    );
    execute format(
      'create policy admin_insert on public.%I for insert to authenticated with check (public.is_admin())',
      t
    );
    execute format(
      'create policy admin_update on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())',
      t
    );
    execute format(
      'create policy admin_delete on public.%I for delete to authenticated using (public.is_admin())',
      t
    );
  end loop;
end $$;

insert into public.admins (user_id, email)
select id, email
from auth.users
where email = 'admin@schooltimer.net'
on conflict (user_id) do nothing;

insert into public.invite_codes (code, note, expires_at)
select
  'PHS-' || upper(substr(md5(gen_random_uuid()::text), 1, 4))
  || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4)),
  'First admin invite',
  now() + interval '24 hours'
where not exists (select 1 from public.invite_codes);
