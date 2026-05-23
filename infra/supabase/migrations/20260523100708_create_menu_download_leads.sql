create table if not exists menu_download_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null check (char_length(trim(email)) between 3 and 254),
  locale text not null check (locale in ('bg', 'en', 'it', 'es', 'el', 'de', 'ro', 'en-gb')),
  menu_locale text not null check (menu_locale in ('bg', 'en')),
  menu_requested boolean not null default true,
  extras_requested boolean not null default false,
  source text not null default 'menu_download_form',
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists menu_download_leads_created_idx
  on menu_download_leads (created_at desc);

create index if not exists menu_download_leads_email_idx
  on menu_download_leads (lower(email));

alter table menu_download_leads enable row level security;

revoke all on table menu_download_leads from anon, authenticated;
grant insert, select on table menu_download_leads to service_role;
