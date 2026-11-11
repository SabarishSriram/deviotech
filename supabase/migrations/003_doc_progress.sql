-- Getting started progress: one row per step a student ticks as done.
-- Run once in Supabase → SQL Editor → New query → paste → Run.
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
