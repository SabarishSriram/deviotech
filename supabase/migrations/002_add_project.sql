-- Adds the project an admin assigns to a student (one of their track's three).
-- Run once in Supabase → SQL Editor if you created the table before this change.
alter table public.applications add column if not exists project text;
