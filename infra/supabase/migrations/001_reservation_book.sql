-- Installable staff reservation book for The Friendly Bear Sofia.
-- Run in Supabase SQL editor or through the Supabase CLI.

create extension if not exists pgcrypto;

do $$
begin
  create type booking_role as enum ('owner', 'admin', 'manager', 'staff', 'viewer');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type next_reservation_warning_mode as enum ('from_start_time', 'from_end_time');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type sync_conflict_resolution as enum ('keep_server', 'keep_local', 'manual_merge', 'discard_local');
exception
  when duplicate_object then null;
end $$;

create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text not null default 'Europe/Sofia',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists staff_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null,
  role booking_role not null default 'staff',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists restaurant_memberships (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  staff_profile_id uuid not null references staff_profiles(id) on delete cascade,
  role booking_role not null default 'staff',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, staff_profile_id)
);

create table if not exists restaurant_tables (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  table_number text not null,
  display_label text,
  area text,
  capacity_min integer,
  capacity_max integer,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, table_number)
);

create table if not exists booking_settings (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null unique references restaurants(id) on delete cascade,
  opening_start_time time not null default time '12:00',
  last_bookable_start_time time not null default time '22:00',
  visible_end_time time not null default time '00:00',
  default_duration_minutes integer not null default 210,
  slot_step_minutes integer not null default 15,
  next_reservation_warning_mode next_reservation_warning_mode not null default 'from_start_time',
  prepare_popup_minutes_before integer not null default 15,
  auto_group_connected_tables boolean not null default true,
  allow_connected_table_reservations boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  reservation_date date not null,
  start_time time not null,
  end_time time not null,
  duration_minutes integer not null default 210,
  party_size integer not null check (party_size > 0),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  customer_language text,
  note text,
  source text not null default 'manual',
  external_source_id uuid,
  external_reservation_id text,
  raw_payload jsonb,
  last_imported_at timestamptz,
  created_by uuid references staff_profiles(id) on delete set null,
  updated_by uuid references staff_profiles(id) on delete set null,
  version integer not null default 1,
  last_mutation_id uuid,
  sync_origin_device_id text,
  deleted_at timestamptz,
  deleted_by uuid references staff_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reservation_tables (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  reservation_id uuid not null references reservations(id) on delete cascade,
  table_id uuid not null references restaurant_tables(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (reservation_id, table_id)
);

create table if not exists reservation_activity_log (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  reservation_id uuid references reservations(id) on delete set null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  performed_by uuid references staff_profiles(id) on delete set null,
  performed_at timestamptz not null default now(),
  device_id text,
  mutation_id uuid
);

create table if not exists sync_conflicts (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  reservation_id uuid references reservations(id) on delete set null,
  mutation_id uuid,
  local_payload jsonb not null,
  server_payload jsonb,
  base_version integer,
  server_version integer,
  created_by uuid references staff_profiles(id) on delete set null,
  device_id text,
  resolved_by uuid references staff_profiles(id) on delete set null,
  resolved_at timestamptz,
  resolution sync_conflict_resolution,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists external_reservation_sources (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  provider_name text not null,
  provider_type text not null,
  is_enabled boolean not null default false,
  last_sync_at timestamptz,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, provider_name)
);

create table if not exists phone_call_events (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  phone_number text not null,
  call_started_at timestamptz not null,
  call_ended_at timestamptz,
  status text not null check (status in ('active', 'ended', 'missed')),
  source text not null,
  created_at timestamptz not null default now()
);

create table if not exists booking_bug_reports (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  created_by uuid references staff_profiles(id) on delete set null,
  local_report_id text,
  selected_date date,
  screenshot_data_url text,
  screenshot_error text,
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists restaurant_memberships_staff_idx on restaurant_memberships (staff_profile_id, is_active);
create index if not exists restaurant_tables_restaurant_sort_idx on restaurant_tables (restaurant_id, sort_order);
create index if not exists reservations_restaurant_date_idx on reservations (restaurant_id, reservation_date, deleted_at);
create index if not exists reservation_tables_restaurant_reservation_idx on reservation_tables (restaurant_id, reservation_id);
create index if not exists sync_conflicts_restaurant_unresolved_idx on sync_conflicts (restaurant_id, resolved_at);
create index if not exists phone_call_events_restaurant_status_idx on phone_call_events (restaurant_id, status, call_started_at desc);
create index if not exists booking_bug_reports_restaurant_created_idx on booking_bug_reports (restaurant_id, created_at desc);

create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists restaurants_touch_updated_at on restaurants;
create trigger restaurants_touch_updated_at before update on restaurants
for each row execute function touch_updated_at();

drop trigger if exists staff_profiles_touch_updated_at on staff_profiles;
create trigger staff_profiles_touch_updated_at before update on staff_profiles
for each row execute function touch_updated_at();

drop trigger if exists restaurant_memberships_touch_updated_at on restaurant_memberships;
create trigger restaurant_memberships_touch_updated_at before update on restaurant_memberships
for each row execute function touch_updated_at();

drop trigger if exists restaurant_tables_touch_updated_at on restaurant_tables;
create trigger restaurant_tables_touch_updated_at before update on restaurant_tables
for each row execute function touch_updated_at();

drop trigger if exists booking_settings_touch_updated_at on booking_settings;
create trigger booking_settings_touch_updated_at before update on booking_settings
for each row execute function touch_updated_at();

drop trigger if exists reservations_touch_updated_at on reservations;
create trigger reservations_touch_updated_at before update on reservations
for each row execute function touch_updated_at();

drop trigger if exists sync_conflicts_touch_updated_at on sync_conflicts;
create trigger sync_conflicts_touch_updated_at before update on sync_conflicts
for each row execute function touch_updated_at();

drop trigger if exists external_reservation_sources_touch_updated_at on external_reservation_sources;
create trigger external_reservation_sources_touch_updated_at before update on external_reservation_sources
for each row execute function touch_updated_at();

create or replace function current_staff_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from staff_profiles
  where auth_user_id = auth.uid()
    and is_active
  limit 1;
$$;

create or replace function is_restaurant_member(target_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from restaurant_memberships membership
    join staff_profiles profile on profile.id = membership.staff_profile_id
    where membership.restaurant_id = target_restaurant_id
      and membership.is_active
      and profile.is_active
      and profile.auth_user_id = auth.uid()
  );
$$;

create or replace function has_restaurant_role(target_restaurant_id uuid, allowed_roles booking_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from restaurant_memberships membership
    join staff_profiles profile on profile.id = membership.staff_profile_id
    where membership.restaurant_id = target_restaurant_id
      and membership.is_active
      and profile.is_active
      and profile.auth_user_id = auth.uid()
      and (membership.role = any(allowed_roles) or profile.role = any(allowed_roles))
  );
$$;

create or replace function assert_can_write_reservations(target_restaurant_id uuid)
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  profile_id uuid;
begin
  profile_id := current_staff_profile_id();

  if profile_id is null or not has_restaurant_role(target_restaurant_id, array['owner','admin','manager','staff']::booking_role[]) then
    raise exception 'Not allowed to write reservations for restaurant %', target_restaurant_id using errcode = '42501';
  end if;

  return profile_id;
end;
$$;

create or replace function assert_bookable_start_time(target_restaurant_id uuid, target_start_time time)
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  settings_row booking_settings%rowtype;
begin
  select * into settings_row
  from booking_settings
  where restaurant_id = target_restaurant_id
  limit 1;

  if not found then
    return;
  end if;

  if target_start_time < settings_row.opening_start_time or target_start_time > settings_row.last_bookable_start_time then
    raise exception 'Reservation start time must be between % and %',
      settings_row.opening_start_time,
      settings_row.last_bookable_start_time
      using errcode = '22023';
  end if;
end;
$$;

create or replace function reservation_with_tables_payload(target_reservation_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select to_jsonb(r) || jsonb_build_object(
    'table_ids',
    coalesce(
      (
        select jsonb_agg(rt.table_id order by t.sort_order)
        from reservation_tables rt
        join restaurant_tables t on t.id = rt.table_id
        where rt.reservation_id = r.id
      ),
      '[]'::jsonb
    )
  )
  from reservations r
  where r.id = target_reservation_id;
$$;

create or replace function create_reservation(
  p_restaurant_id uuid,
  p_reservation_date date,
  p_table_ids uuid[],
  p_start_time time,
  p_duration_minutes integer,
  p_party_size integer,
  p_customer_name text,
  p_customer_phone text,
  p_note text default null,
  p_mutation_id uuid default gen_random_uuid(),
  p_device_id text default null,
  p_source text default 'manual',
  p_external_source_id uuid default null,
  p_external_reservation_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_id uuid;
  new_reservation_id uuid;
  target_table_id uuid;
begin
  profile_id := assert_can_write_reservations(p_restaurant_id);

  if array_length(p_table_ids, 1) is null then
    raise exception 'At least one table is required' using errcode = '22023';
  end if;

  perform assert_bookable_start_time(p_restaurant_id, p_start_time);

  insert into reservations (
    restaurant_id,
    reservation_date,
    start_time,
    end_time,
    duration_minutes,
    party_size,
    customer_name,
    customer_phone,
    note,
    source,
    external_source_id,
    external_reservation_id,
    created_by,
    updated_by,
    last_mutation_id,
    sync_origin_device_id
  )
  values (
    p_restaurant_id,
    p_reservation_date,
    p_start_time,
    (p_start_time + make_interval(mins => p_duration_minutes))::time,
    p_duration_minutes,
    p_party_size,
    p_customer_name,
    p_customer_phone,
    p_note,
    p_source,
    p_external_source_id,
    p_external_reservation_id,
    profile_id,
    profile_id,
    p_mutation_id,
    p_device_id
  )
  returning id into new_reservation_id;

  foreach target_table_id in array p_table_ids loop
    insert into reservation_tables (restaurant_id, reservation_id, table_id)
    select p_restaurant_id, new_reservation_id, target_table_id
    where exists (
      select 1
      from restaurant_tables
      where id = target_table_id
        and restaurant_id = p_restaurant_id
    );
  end loop;

  insert into reservation_activity_log (
    restaurant_id,
    reservation_id,
    action,
    new_value,
    performed_by,
    device_id,
    mutation_id
  )
  values (
    p_restaurant_id,
    new_reservation_id,
    'created',
    reservation_with_tables_payload(new_reservation_id),
    profile_id,
    p_device_id,
    p_mutation_id
  );

  return jsonb_build_object(
    'status', 'synced',
    'reservation', reservation_with_tables_payload(new_reservation_id)
  );
end;
$$;

create or replace function update_reservation(
  p_reservation_id uuid,
  p_base_version integer,
  p_payload jsonb,
  p_mutation_id uuid,
  p_device_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row reservations%rowtype;
  profile_id uuid;
  new_start_time time;
  new_duration_minutes integer;
  table_ids uuid[];
  conflict_id uuid;
begin
  select * into current_row
  from reservations
  where id = p_reservation_id
  for update;

  if not found then
    raise exception 'Reservation not found' using errcode = '02000';
  end if;

  profile_id := assert_can_write_reservations(current_row.restaurant_id);

  if current_row.version <> p_base_version then
    insert into sync_conflicts (
      restaurant_id,
      reservation_id,
      mutation_id,
      local_payload,
      server_payload,
      base_version,
      server_version,
      created_by,
      device_id
    )
    values (
      current_row.restaurant_id,
      p_reservation_id,
      p_mutation_id,
      p_payload,
      reservation_with_tables_payload(p_reservation_id),
      p_base_version,
      current_row.version,
      profile_id,
      p_device_id
    )
    returning id into conflict_id;

    return jsonb_build_object('status', 'conflict', 'conflict_id', conflict_id);
  end if;

  new_start_time := coalesce((p_payload->>'start_time')::time, current_row.start_time);
  new_duration_minutes := coalesce((p_payload->>'duration_minutes')::integer, current_row.duration_minutes);

  perform assert_bookable_start_time(current_row.restaurant_id, new_start_time);

  update reservations
  set
    reservation_date = coalesce((p_payload->>'reservation_date')::date, reservation_date),
    start_time = new_start_time,
    duration_minutes = new_duration_minutes,
    end_time = (new_start_time + make_interval(mins => new_duration_minutes))::time,
    party_size = coalesce((p_payload->>'party_size')::integer, party_size),
    customer_name = coalesce(p_payload->>'customer_name', customer_name),
    customer_phone = coalesce(p_payload->>'customer_phone', customer_phone),
    note = case when p_payload ? 'note' then p_payload->>'note' else note end,
    updated_by = profile_id,
    version = version + 1,
    last_mutation_id = p_mutation_id,
    sync_origin_device_id = p_device_id
  where id = p_reservation_id;

  if p_payload ? 'table_ids' then
    select array_agg(item.value::uuid) into table_ids
    from jsonb_array_elements_text(p_payload->'table_ids') as item(value);

    delete from reservation_tables where reservation_id = p_reservation_id;

    insert into reservation_tables (restaurant_id, reservation_id, table_id)
    select current_row.restaurant_id, p_reservation_id, table_id
    from unnest(table_ids) as table_id
    join restaurant_tables tables on tables.id = table_id
    where tables.restaurant_id = current_row.restaurant_id;
  end if;

  insert into reservation_activity_log (
    restaurant_id,
    reservation_id,
    action,
    old_value,
    new_value,
    performed_by,
    device_id,
    mutation_id
  )
  values (
    current_row.restaurant_id,
    p_reservation_id,
    'updated',
    to_jsonb(current_row),
    reservation_with_tables_payload(p_reservation_id),
    profile_id,
    p_device_id,
    p_mutation_id
  );

  return jsonb_build_object(
    'status', 'synced',
    'reservation', reservation_with_tables_payload(p_reservation_id)
  );
end;
$$;

create or replace function soft_delete_reservation(
  p_reservation_id uuid,
  p_base_version integer,
  p_mutation_id uuid,
  p_device_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row reservations%rowtype;
  profile_id uuid;
  conflict_id uuid;
begin
  select * into current_row
  from reservations
  where id = p_reservation_id
  for update;

  if not found then
    raise exception 'Reservation not found' using errcode = '02000';
  end if;

  profile_id := assert_can_write_reservations(current_row.restaurant_id);

  if current_row.version <> p_base_version then
    insert into sync_conflicts (
      restaurant_id,
      reservation_id,
      mutation_id,
      local_payload,
      server_payload,
      base_version,
      server_version,
      created_by,
      device_id
    )
    values (
      current_row.restaurant_id,
      p_reservation_id,
      p_mutation_id,
      jsonb_build_object('operation', 'delete'),
      reservation_with_tables_payload(p_reservation_id),
      p_base_version,
      current_row.version,
      profile_id,
      p_device_id
    )
    returning id into conflict_id;

    return jsonb_build_object('status', 'conflict', 'conflict_id', conflict_id);
  end if;

  update reservations
  set
    deleted_at = now(),
    deleted_by = profile_id,
    updated_by = profile_id,
    version = version + 1,
    last_mutation_id = p_mutation_id,
    sync_origin_device_id = p_device_id
  where id = p_reservation_id;

  insert into reservation_activity_log (
    restaurant_id,
    reservation_id,
    action,
    old_value,
    new_value,
    performed_by,
    device_id,
    mutation_id
  )
  values (
    current_row.restaurant_id,
    p_reservation_id,
    'deleted',
    to_jsonb(current_row),
    reservation_with_tables_payload(p_reservation_id),
    profile_id,
    p_device_id,
    p_mutation_id
  );

  return jsonb_build_object(
    'status', 'synced',
    'reservation', reservation_with_tables_payload(p_reservation_id)
  );
end;
$$;

create or replace function apply_reservation_mutation(p_mutation jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  operation text := p_mutation->>'operation';
  payload jsonb := p_mutation->'payload';
begin
  if operation = 'create' then
    return create_reservation(
      (payload->>'restaurant_id')::uuid,
      (payload->>'reservation_date')::date,
      (select array_agg(item.value::uuid) from jsonb_array_elements_text(payload->'table_ids') as item(value)),
      (payload->>'start_time')::time,
      (payload->>'duration_minutes')::integer,
      (payload->>'party_size')::integer,
      payload->>'customer_name',
      payload->>'customer_phone',
      payload->>'note',
      (p_mutation->>'mutation_id')::uuid,
      p_mutation->>'device_id',
      coalesce(payload->>'source', 'manual')
    );
  elsif operation = 'update' or operation = 'connect_tables' or operation = 'disconnect_tables' then
    return update_reservation(
      (p_mutation->>'entity_id')::uuid,
      (p_mutation->>'base_version')::integer,
      payload,
      (p_mutation->>'mutation_id')::uuid,
      p_mutation->>'device_id'
    );
  elsif operation = 'delete' then
    return soft_delete_reservation(
      (p_mutation->>'entity_id')::uuid,
      (p_mutation->>'base_version')::integer,
      (p_mutation->>'mutation_id')::uuid,
      p_mutation->>'device_id'
    );
  end if;

  raise exception 'Unsupported mutation operation %', operation using errcode = '22023';
end;
$$;

create or replace function resolve_sync_conflict(
  p_conflict_id uuid,
  p_resolution sync_conflict_resolution,
  p_manual_payload jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  conflict_row sync_conflicts%rowtype;
  profile_id uuid;
  payload_to_apply jsonb;
begin
  select * into conflict_row
  from sync_conflicts
  where id = p_conflict_id
  for update;

  if not found then
    raise exception 'Conflict not found' using errcode = '02000';
  end if;

  if not has_restaurant_role(conflict_row.restaurant_id, array['owner','admin','manager']::booking_role[]) then
    raise exception 'Not allowed to resolve conflicts' using errcode = '42501';
  end if;

  profile_id := current_staff_profile_id();
  payload_to_apply := case
    when p_resolution = 'manual_merge' then coalesce(p_manual_payload, conflict_row.local_payload)
    when p_resolution = 'keep_local' then conflict_row.local_payload
    else null
  end;

  if payload_to_apply is not null and conflict_row.reservation_id is not null then
    update reservations
    set
      start_time = coalesce((payload_to_apply->>'start_time')::time, start_time),
      duration_minutes = coalesce((payload_to_apply->>'duration_minutes')::integer, duration_minutes),
      end_time = (
        coalesce((payload_to_apply->>'start_time')::time, start_time) +
        make_interval(mins => coalesce((payload_to_apply->>'duration_minutes')::integer, duration_minutes))
      )::time,
      party_size = coalesce((payload_to_apply->>'party_size')::integer, party_size),
      customer_name = coalesce(payload_to_apply->>'customer_name', customer_name),
      customer_phone = coalesce(payload_to_apply->>'customer_phone', customer_phone),
      note = case when payload_to_apply ? 'note' then payload_to_apply->>'note' else note end,
      updated_by = profile_id,
      version = version + 1
    where id = conflict_row.reservation_id;
  end if;

  update sync_conflicts
  set
    resolved_by = profile_id,
    resolved_at = now(),
    resolution = p_resolution
  where id = p_conflict_id;

  insert into reservation_activity_log (
    restaurant_id,
    reservation_id,
    action,
    old_value,
    new_value,
    performed_by,
    mutation_id
  )
  values (
    conflict_row.restaurant_id,
    conflict_row.reservation_id,
    'resolved_conflict',
    conflict_row.server_payload,
    jsonb_build_object('resolution', p_resolution, 'manual_payload', p_manual_payload),
    profile_id,
    conflict_row.mutation_id
  );

  return jsonb_build_object('status', 'resolved', 'resolution', p_resolution);
end;
$$;

create or replace function get_reservation_admin_audit(
  p_restaurant_id uuid,
  p_reservation_date date default null
)
returns table (
  reservation_id uuid,
  restaurant_id uuid,
  reservation_date date,
  start_time time,
  end_time time,
  party_size integer,
  customer_name text,
  customer_phone text,
  note text,
  table_labels text[],
  created_by_staff_profile_id uuid,
  created_by_display_name text,
  created_by_role booking_role,
  created_by_auth_email text,
  created_at timestamptz,
  updated_by_staff_profile_id uuid,
  updated_by_display_name text,
  updated_by_role booking_role,
  updated_by_auth_email text,
  updated_at timestamptz,
  last_mutation_id uuid,
  sync_origin_device_id text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_restaurant_member(p_restaurant_id) then
    raise exception 'Not allowed to read reservation audit details' using errcode = '42501';
  end if;

  return query
  select
    r.id,
    r.restaurant_id,
    r.reservation_date,
    r.start_time,
    r.end_time,
    r.party_size,
    r.customer_name,
    r.customer_phone,
    r.note,
    coalesce(
      array_agg(coalesce(t.display_label, t.table_number) order by t.sort_order) filter (where t.id is not null),
      array[]::text[]
    ) as table_labels,
    created_profile.id,
    created_profile.display_name,
    null::booking_role,
    null::text,
    r.created_at,
    updated_profile.id,
    updated_profile.display_name,
    null::booking_role,
    null::text,
    r.updated_at,
    r.last_mutation_id,
    r.sync_origin_device_id
  from reservations r
  left join reservation_tables rt on rt.reservation_id = r.id
  left join restaurant_tables t on t.id = rt.table_id
  left join staff_profiles created_profile on created_profile.id = r.created_by
  left join staff_profiles updated_profile on updated_profile.id = r.updated_by
  where r.restaurant_id = p_restaurant_id
    and (p_reservation_date is null or r.reservation_date = p_reservation_date)
  group by
    r.id,
    created_profile.id,
    updated_profile.id
  order by r.reservation_date desc, r.start_time asc, r.created_at asc;
end;
$$;

create or replace function create_booking_bug_report(
  p_restaurant_id uuid,
  p_local_report_id text,
  p_selected_date date,
  p_screenshot_data_url text,
  p_screenshot_error text,
  p_state jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_id uuid;
  new_report_id uuid;
begin
  if not is_restaurant_member(p_restaurant_id) then
    raise exception 'Not allowed to create bug reports for restaurant %', p_restaurant_id using errcode = '42501';
  end if;

  profile_id := current_staff_profile_id();

  insert into booking_bug_reports (
    restaurant_id,
    created_by,
    local_report_id,
    selected_date,
    screenshot_data_url,
    screenshot_error,
    state
  )
  values (
    p_restaurant_id,
    profile_id,
    p_local_report_id,
    p_selected_date,
    p_screenshot_data_url,
    p_screenshot_error,
    coalesce(p_state, '{}'::jsonb)
  )
  returning id into new_report_id;

  return new_report_id;
end;
$$;

alter table restaurants enable row level security;
alter table staff_profiles enable row level security;
alter table restaurant_memberships enable row level security;
alter table restaurant_tables enable row level security;
alter table booking_settings enable row level security;
alter table reservations enable row level security;
alter table reservation_tables enable row level security;
alter table reservation_activity_log enable row level security;
alter table sync_conflicts enable row level security;
alter table external_reservation_sources enable row level security;
alter table phone_call_events enable row level security;
alter table booking_bug_reports enable row level security;

drop policy if exists "Members can read their restaurants" on restaurants;
create policy "Members can read their restaurants" on restaurants
for select to authenticated
using (is_active and is_restaurant_member(id));

drop policy if exists "Owners and admins can update restaurants" on restaurants;
create policy "Owners and admins can update restaurants" on restaurants
for update to authenticated
using (has_restaurant_role(id, array['owner','admin']::booking_role[]))
with check (has_restaurant_role(id, array['owner','admin']::booking_role[]));

drop policy if exists "Staff can read related profiles" on staff_profiles;
create policy "Staff can read related profiles" on staff_profiles
for select to authenticated
using (
  auth_user_id = auth.uid()
  or exists (
    select 1
    from restaurant_memberships mine
    join restaurant_memberships theirs on theirs.restaurant_id = mine.restaurant_id
    where mine.staff_profile_id = current_staff_profile_id()
      and theirs.staff_profile_id = staff_profiles.id
      and mine.is_active
      and theirs.is_active
  )
);

drop policy if exists "Owners and admins can manage staff profiles" on staff_profiles;
create policy "Owners and admins can manage staff profiles" on staff_profiles
for update to authenticated
using (
  exists (
    select 1
    from restaurant_memberships membership
    where membership.staff_profile_id = staff_profiles.id
      and has_restaurant_role(membership.restaurant_id, array['owner','admin']::booking_role[])
  )
)
with check (
  exists (
    select 1
    from restaurant_memberships membership
    where membership.staff_profile_id = staff_profiles.id
      and has_restaurant_role(membership.restaurant_id, array['owner','admin']::booking_role[])
  )
);

drop policy if exists "Members can read memberships" on restaurant_memberships;
create policy "Members can read memberships" on restaurant_memberships
for select to authenticated
using (is_restaurant_member(restaurant_id));

drop policy if exists "Owners and admins can manage memberships" on restaurant_memberships;
create policy "Owners and admins can manage memberships" on restaurant_memberships
for all to authenticated
using (has_restaurant_role(restaurant_id, array['owner','admin']::booking_role[]))
with check (has_restaurant_role(restaurant_id, array['owner','admin']::booking_role[]));

drop policy if exists "Members can read restaurant tables" on restaurant_tables;
create policy "Members can read restaurant tables" on restaurant_tables
for select to authenticated
using (is_restaurant_member(restaurant_id));

drop policy if exists "Owners and admins can manage restaurant tables" on restaurant_tables;
create policy "Owners and admins can manage restaurant tables" on restaurant_tables
for all to authenticated
using (has_restaurant_role(restaurant_id, array['owner','admin']::booking_role[]))
with check (has_restaurant_role(restaurant_id, array['owner','admin']::booking_role[]));

drop policy if exists "Members can read booking settings" on booking_settings;
create policy "Members can read booking settings" on booking_settings
for select to authenticated
using (is_restaurant_member(restaurant_id));

drop policy if exists "Owners and admins can manage booking settings" on booking_settings;
create policy "Owners and admins can manage booking settings" on booking_settings
for all to authenticated
using (has_restaurant_role(restaurant_id, array['owner','admin']::booking_role[]))
with check (has_restaurant_role(restaurant_id, array['owner','admin']::booking_role[]));

drop policy if exists "Members can read reservations" on reservations;
create policy "Members can read reservations" on reservations
for select to authenticated
using (is_restaurant_member(restaurant_id));

drop policy if exists "Members can read reservation tables" on reservation_tables;
create policy "Members can read reservation tables" on reservation_tables
for select to authenticated
using (is_restaurant_member(restaurant_id));

drop policy if exists "Members can read reservation activity" on reservation_activity_log;
create policy "Members can read reservation activity" on reservation_activity_log
for select to authenticated
using (is_restaurant_member(restaurant_id));

drop policy if exists "Managers can read sync conflicts" on sync_conflicts;
create policy "Managers can read sync conflicts" on sync_conflicts
for select to authenticated
using (has_restaurant_role(restaurant_id, array['owner','admin','manager']::booking_role[]));

drop policy if exists "Owners and admins can manage external sources" on external_reservation_sources;
create policy "Owners and admins can manage external sources" on external_reservation_sources
for all to authenticated
using (has_restaurant_role(restaurant_id, array['owner','admin']::booking_role[]))
with check (has_restaurant_role(restaurant_id, array['owner','admin']::booking_role[]));

drop policy if exists "Members can read phone calls" on phone_call_events;
create policy "Members can read phone calls" on phone_call_events
for select to authenticated
using (is_restaurant_member(restaurant_id));

drop policy if exists "Owners and admins can manage phone calls" on phone_call_events;
create policy "Owners and admins can manage phone calls" on phone_call_events
for all to authenticated
using (has_restaurant_role(restaurant_id, array['owner','admin']::booking_role[]))
with check (has_restaurant_role(restaurant_id, array['owner','admin']::booking_role[]));

drop policy if exists "Members can read own bug reports" on booking_bug_reports;
create policy "Members can read own bug reports" on booking_bug_reports
for select to authenticated
using (
  created_by = current_staff_profile_id()
  or has_restaurant_role(restaurant_id, array['owner','admin','manager']::booking_role[])
);

grant execute on function create_reservation(uuid, date, uuid[], time, integer, integer, text, text, text, uuid, text, text, uuid, text) to authenticated;
grant execute on function update_reservation(uuid, integer, jsonb, uuid, text) to authenticated;
grant execute on function soft_delete_reservation(uuid, integer, uuid, text) to authenticated;
grant execute on function apply_reservation_mutation(jsonb) to authenticated;
grant execute on function resolve_sync_conflict(uuid, sync_conflict_resolution, jsonb) to authenticated;
grant execute on function get_reservation_admin_audit(uuid, date) to authenticated;
grant execute on function create_booking_bug_report(uuid, text, date, text, text, jsonb) to authenticated;

do $$
declare
  realtime_table text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach realtime_table in array array[
      'reservations',
      'reservation_tables',
      'restaurant_tables',
      'booking_settings',
      'sync_conflicts'
    ]
    loop
      if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = realtime_table
      ) then
        execute format('alter publication supabase_realtime add table public.%I', realtime_table);
      end if;
    end loop;
  end if;
end;
$$;

with seed_restaurant as (
  insert into restaurants (name, slug, timezone)
  values ('The Friendly Bear Sofia', 'the-friendly-bear-sofia', 'Europe/Sofia')
  on conflict (slug) do update
  set name = excluded.name,
      timezone = excluded.timezone,
      is_active = true
  returning id
)
insert into booking_settings (
  restaurant_id,
  opening_start_time,
  last_bookable_start_time,
  visible_end_time,
  default_duration_minutes,
  slot_step_minutes,
  next_reservation_warning_mode,
  prepare_popup_minutes_before,
  auto_group_connected_tables,
  allow_connected_table_reservations
)
select
  id,
  time '12:00',
  time '22:00',
  time '00:00',
  210,
  15,
  'from_start_time',
  15,
  true,
  true
from seed_restaurant
on conflict (restaurant_id) do nothing;

update booking_settings
set visible_end_time = time '00:00'
where opening_start_time = time '12:00'
  and last_bookable_start_time = time '22:00'
  and visible_end_time = time '22:00';

with restaurant as (
  select id from restaurants where slug = 'the-friendly-bear-sofia'
),
tables(table_number, sort_order) as (
  values
    ('1', 1), ('2', 2), ('3', 3), ('4', 4), ('5', 5), ('6', 6), ('7', 7),
    ('8', 8), ('9', 9), ('10', 10), ('11', 11), ('12', 12), ('13', 13),
    ('14', 14), ('31', 15), ('32', 16), ('33', 17), ('34', 18),
    ('40', 19), ('41', 20), ('50', 21), ('51', 22), ('52', 23), ('54', 24)
)
insert into restaurant_tables (restaurant_id, table_number, display_label, sort_order, is_active)
select restaurant.id, tables.table_number, tables.table_number, tables.sort_order, true
from restaurant
cross join tables
on conflict (restaurant_id, table_number) do update
set display_label = excluded.display_label,
    sort_order = excluded.sort_order,
    is_active = true;
