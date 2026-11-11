-- Devvy Tech — database schema.
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

-- ----------------------------------------------------------------
-- Getting started progress (also in migrations/003_doc_progress.sql)
-- ----------------------------------------------------------------
create table if not exists public.doc_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  -- "<track>/<doc>/<part>/<step>", e.g. "full-stack/setup/git/check-git-works"
  step_key text not null check (char_length(step_key) <= 200),
  -- The OS the student picked in the docs, so totals match their steps
  os text check (os in ('mac', 'windows', 'linux')),
  done_at timestamptz not null default now(),
  primary key (user_id, step_key)
);

create index if not exists doc_progress_user_idx on public.doc_progress (user_id);

-- Students can only see and change their own ticks. Admin pages read with the secret key.
alter table public.doc_progress enable row level security;

drop policy if exists "Students read their own progress" on public.doc_progress;
create policy "Students read their own progress"
  on public.doc_progress for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Students add their own progress" on public.doc_progress;
create policy "Students add their own progress"
  on public.doc_progress for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "Students update their own progress" on public.doc_progress;
create policy "Students update their own progress"
  on public.doc_progress for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Students remove their own progress" on public.doc_progress;
create policy "Students remove their own progress"
  on public.doc_progress for delete to authenticated
  using (user_id = (select auth.uid()));
