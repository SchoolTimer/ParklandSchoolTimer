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
-- Enable RLS and allow all operations via anon key (the admin
-- password check is done client-side in the React app).
-- For stronger security, replace with a server-side check.
-- ============================================================

alter table daycycle         enable row level security;
alter table foodmenu         enable row level security;
alter table school_dates     enable row level security;
alter table bell_schedules   enable row level security;
alter table custom_schedules enable row level security;

-- Allow all operations (read + write) for anon users.
-- The admin password gate in the React app is the access control.
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
