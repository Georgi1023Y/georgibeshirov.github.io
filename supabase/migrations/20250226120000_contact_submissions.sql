-- Portfolio contact: rows are written only from Edge Functions (service role) or
-- you may attach a Database Webhook to a second notify-only function.
-- Public anon must NOT insert directly if you use the submit-contact function pattern.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

comment on table public.contact_submissions is 'Messages from the site contact form.';

-- Baseline: no RLS policy for anonymous users — the submit-contact Edge Function
-- uses the service role, which bypasses RLS. If you add policies later, e.g. allow
-- insert for anon, keep strict column limits and use rate limiting.
alter table public.contact_submissions enable row level security;

-- Optional: read access for the dashboard (authenticated) — uncomment to use:
-- create policy "Allow authenticated read" on public.contact_submissions
--   for select to authenticated using (true);

-- Grant: authenticated users (if you use service role in SQL editor) can manage.
-- If you previously used "contact_form_submissions" with Cyrillic column names, migrate data
-- and drop the old table after deploying this one.
