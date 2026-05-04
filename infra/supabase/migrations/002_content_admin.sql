create table if not exists staff_content_permissions (
  id uuid primary key default gen_random_uuid(),
  staff_profile_id uuid not null unique references staff_profiles(id) on delete cascade,
  can_edit_menu boolean not null default false,
  can_edit_reviews boolean not null default false,
  can_manage_content_permissions boolean not null default false,
  is_active boolean not null default true,
  created_by uuid references staff_profiles(id) on delete set null,
  updated_by uuid references staff_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists seasonal_menus (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  payload jsonb not null,
  valid_from date,
  valid_to date,
  published_at timestamptz,
  created_by uuid references staff_profiles(id) on delete set null,
  updated_by uuid references staff_profiles(id) on delete set null,
  published_by uuid references staff_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists site_reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  language text not null check (language in ('bg', 'en')),
  review_text text not null,
  source text not null default 'Google',
  review_date date,
  relative_date_label text,
  source_url text,
  keyword_tags text[] not null default '{}',
  is_featured boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references staff_profiles(id) on delete set null,
  updated_by uuid references staff_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists seasonal_menus_single_draft_idx
  on seasonal_menus ((status))
  where status = 'draft';

create index if not exists seasonal_menus_public_idx
  on seasonal_menus (status, published_at desc, updated_at desc);

create index if not exists site_reviews_public_idx
  on site_reviews (language, is_featured, is_active, sort_order, created_at desc);

create index if not exists staff_content_permissions_staff_idx
  on staff_content_permissions (staff_profile_id, is_active);

drop trigger if exists staff_content_permissions_touch_updated_at on staff_content_permissions;
create trigger staff_content_permissions_touch_updated_at before update on staff_content_permissions
for each row execute function touch_updated_at();

drop trigger if exists seasonal_menus_touch_updated_at on seasonal_menus;
create trigger seasonal_menus_touch_updated_at before update on seasonal_menus
for each row execute function touch_updated_at();

drop trigger if exists site_reviews_touch_updated_at on site_reviews;
create trigger site_reviews_touch_updated_at before update on site_reviews
for each row execute function touch_updated_at();

create or replace function has_content_permission(permission_key text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from staff_content_permissions permission
    join staff_profiles profile on profile.id = permission.staff_profile_id
    where profile.auth_user_id = auth.uid()
      and profile.is_active
      and permission.is_active
      and case permission_key
        when 'can_edit_menu' then permission.can_edit_menu
        when 'can_edit_reviews' then permission.can_edit_reviews
        when 'can_manage_content_permissions' then permission.can_manage_content_permissions
        else false
      end
  );
$$;

create or replace function can_manage_content_permissions_for_staff(target_staff_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from restaurant_memberships membership
    where membership.staff_profile_id = target_staff_profile_id
      and membership.is_active
      and (
        has_restaurant_role(membership.restaurant_id, array['owner']::booking_role[])
        or (
          has_content_permission('can_manage_content_permissions')
          and is_restaurant_member(membership.restaurant_id)
        )
      )
  );
$$;

alter table staff_content_permissions enable row level security;
alter table seasonal_menus enable row level security;
alter table site_reviews enable row level security;

drop policy if exists "Members can read related content permissions" on staff_content_permissions;
create policy "Members can read related content permissions" on staff_content_permissions
for select to authenticated
using (
  exists (
    select 1
    from restaurant_memberships membership
    where membership.staff_profile_id = staff_content_permissions.staff_profile_id
      and membership.is_active
      and is_restaurant_member(membership.restaurant_id)
  )
);

drop policy if exists "Content managers can manage content permissions" on staff_content_permissions;
create policy "Content managers can manage content permissions" on staff_content_permissions
for all to authenticated
using (can_manage_content_permissions_for_staff(staff_profile_id))
with check (can_manage_content_permissions_for_staff(staff_profile_id));

drop policy if exists "Public can read published seasonal menus" on seasonal_menus;
create policy "Public can read published seasonal menus" on seasonal_menus
for select to anon, authenticated
using (status = 'published');

drop policy if exists "Public can read featured reviews" on site_reviews;
create policy "Public can read featured reviews" on site_reviews
for select to anon, authenticated
using (is_active and is_featured);
