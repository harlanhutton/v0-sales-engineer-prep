create table if not exists public.action_items (
  id text primary key,
  category text not null check (category in ('vercel', 'technical', 'sales', 'narrative')),
  title text not null,
  description text not null default '',
  priority text not null check (priority in ('high', 'medium', 'low')) default 'medium',
  due_context text,
  is_completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.action_items disable row level security;
