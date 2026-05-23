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

create table if not exists regular_menu_files (
  id uuid primary key default gen_random_uuid(),
  locale text not null unique check (locale in ('bg', 'en')),
  filename text not null,
  content_type text not null default 'application/pdf',
  content_base64 text not null,
  byte_size integer not null check (byte_size > 0),
  sha256 text not null check (char_length(sha256) = 64),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists regular_menu_files_active_idx
  on regular_menu_files (locale, is_active);

drop trigger if exists regular_menu_files_touch_updated_at on regular_menu_files;
create trigger regular_menu_files_touch_updated_at before update on regular_menu_files
for each row execute function touch_updated_at();

alter table regular_menu_files enable row level security;

revoke all on table regular_menu_files from anon, authenticated;
grant select, insert, update on table regular_menu_files to service_role;
