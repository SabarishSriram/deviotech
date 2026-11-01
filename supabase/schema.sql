-- Devio Tech — database schema.
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  college text not null,
  year text not null,
  github text not null,
  linkedin text,
  track text not null,
  skill_level text not null,
  motivation text not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'session_booked', 'paid', 'active', 'completed', 'rejected')),
  -- Project slug the admin assigns after the 1:1 (one of the track's three)
  project text,
  -- Set when an admin creates the student's portal login
  user_id uuid references auth.users (id) on delete set null
);

create index if not exists applications_created_at_idx on public.applications (created_at desc);
create index if not exists applications_email_idx on public.applications (lower(email));
create index if not exists applications_user_id_idx on public.applications (user_id);

-- Row Level Security: nobody can read or write through the public API by default.
-- The website writes applications server-side with the secret key (which bypasses RLS),
-- and students can only ever read their own application.
alter table public.applications enable row level security;

drop policy if exists "Students read their own application" on public.applications;
create policy "Students read their own application"
  on public.applications
  for select
  to authenticated
  using (user_id = (select auth.uid()));
