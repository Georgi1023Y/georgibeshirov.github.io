create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

comment on table public.contact_messages is 'Messages submitted via portfolio contact portal.';

alter table public.contact_messages enable row level security;
