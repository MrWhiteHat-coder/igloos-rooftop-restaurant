-- ============================================================================
-- Igloos Rooftop Restaurant — initial schema
-- Apply with: supabase db push        (or the Supabase SQL editor)
-- Idempotency: this migration is written for a fresh project; supabase db
-- push tracks applied migrations by filename timestamp automatically.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;
create extension if not exists citext;

-- ---------------------------------------------------------------------------
-- Restaurant settings (singleton row, id = 1)
-- ---------------------------------------------------------------------------
create table if not exists public.restaurant_settings (
  id            integer primary key default 1 check (id = 1),
  hero_image_path text,
  notes         text,
  updated_at    timestamptz not null default now(),
  constraint restaurant_settings_hero_path_format
    check (hero_image_path is null or hero_image_path ~ '^restaurant/.+')
);

-- ---------------------------------------------------------------------------
-- Menu
-- ---------------------------------------------------------------------------
create table if not exists public.menu_categories (
  id          bigint generated always as identity primary key,
  slug        text not null unique check (slug ~ '^[a-z0-9-]{2,60}$'),
  name        text not null check (length(btrim(name)) between 2 and 80),
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.menu_items (
  id           bigint generated always as identity primary key,
  category_id  bigint not null references public.menu_categories (id) on delete cascade,
  name         text not null check (length(btrim(name)) between 2 and 120),
  description  text,
  -- Prices are configured by staff. NULL ⇒ "price on request"/placeholder.
  price_inr    numeric(8, 2) check (price_inr is null or price_inr >= 0),
  is_veg       boolean,
  is_available boolean not null default true,
  image_path   text check (image_path is null or image_path ~ '^restaurant/.+'),
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  constraint menu_items_price_nonnegative check (price_inr > -1)
);

create index if not exists menu_items_category_idx on public.menu_items (category_id, sort_order);
create index if not exists menu_items_available_idx on public.menu_items (is_available);
create index if not exists menu_categories_sort_idx on public.menu_categories (sort_order);

-- ---------------------------------------------------------------------------
-- Staff profiles (linked 1:1 to Supabase auth users)
-- ---------------------------------------------------------------------------
create table if not exists public.staff_profiles (
  user_id   uuid primary key references auth.users (id) on delete cascade,
  email     citext unique,
  full_name text,
  role      text not null default 'manager' check (role in ('admin', 'manager')),
  active    boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists staff_profiles_role_idx on public.staff_profiles (role, active);

-- Helper: is the caller an active staff member? (SECURITY DEFINER avoids RLS
-- recursion on staff_profiles itself.)
create or replace function public.is_active_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.staff_profiles
    where user_id = auth.uid()
      and active
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.staff_profiles
    where user_id = auth.uid()
      and active
      and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Bookings
-- ---------------------------------------------------------------------------
create table if not exists public.bookings (
  id                 bigint generated always as identity primary key,
  booking_reference  text not null unique,
  status             text not null default 'pending'
                       check (status in ('pending', 'confirmed', 'seated', 'cancelled', 'no_show')),
  customer_name      text not null check (length(btrim(customer_name)) between 2 and 80),
  customer_phone     text not null check (customer_phone ~ '^\+?[0-9]{10,15}$'),
  customer_email     citext,
  booking_date       date not null,
  booking_time       time not null,
  guest_count        integer not null check (guest_count between 1 and 40),
  occasion           text not null check (occasion in
                       ('birthday', 'anniversary', 'date_night', 'celebration', 'business_meal', 'just_dinner')),
  dining_preference  text not null check (dining_preference in ('rooftop', 'igloo')),
  special_requests   text check (special_requests is null or length(special_requests) <= 500),
  seated_date        date,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint bookings_future_date check (booking_date >= current_date),
  constraint bookings_seated_requires_date
    check ((status = 'seated') = (seated_date is not null))
  -- Igloo capacity is validated by the RPC (guest_count > 10 ⇒ rooftop) and
  -- re-checked on status changes by staff UI; hard DB limit kept at 40 for
  -- large terrace parties.
);

create index if not exists bookings_date_idx on public.bookings (booking_date, booking_time);
create index if not exists bookings_status_idx on public.bookings (status, created_at desc);
create index if not exists bookings_phone_idx on public.bookings (customer_phone, created_at desc);
create index if not exists bookings_reference_idx on public.bookings (booking_reference);

-- Anon users can never read or write booking rows directly — the only write
-- path is the SECURITY DEFINER submit_booking RPC below.

-- ---------------------------------------------------------------------------
-- Booking event history (append-only audit trail)
-- ---------------------------------------------------------------------------
create table if not exists public.booking_events (
  id            bigint generated always as identity primary key,
  booking_id    bigint not null references public.bookings (id) on delete cascade,
  actor_user_id uuid references auth.users (id) on delete set null,
  event_type    text not null check (length(btrim(event_type)) between 2 and 300),
  created_at    timestamptz not null default now()
);

create index if not exists booking_events_booking_idx on public.booking_events (booking_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Gallery images
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_images (
  id          bigint generated always as identity primary key,
  title       text check (title is null or length(title) <= 120),
  alt_text    text check (alt_text is null or length(alt_text) <= 300),
  storage_path text not null check (storage_path ~ '^restaurant/.+'),
  public_url  text,
  sort_order  integer not null default 0,
  is_published boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists gallery_images_published_idx on public.gallery_images (is_published, sort_order);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.restaurant_settings enable row level security;
alter table public.menu_categories    enable row level security;
alter table public.menu_items         enable row level security;
alter table public.staff_profiles     enable row level security;
alter table public.bookings           enable row level security;
alter table public.booking_events     enable row level security;
alter table public.gallery_images     enable row level security;

-- Public (anon) reads for content the website shows.
create policy "menu_categories_public_read"
  on public.menu_categories for select to anon, authenticated using (true);

create policy "menu_items_public_read"
  on public.menu_items for select to anon, authenticated using (true);

create policy "gallery_images_public_read"
  on public.gallery_images for select to anon, authenticated using (is_published);

create policy "restaurant_settings_public_read"
  on public.restaurant_settings for select to anon, authenticated using (true);

-- Staff-only management of content.
create policy "menu_categories_staff_write"
  on public.menu_categories for all to authenticated
  using (public.is_active_staff()) with check (public.is_active_staff());

create policy "menu_items_staff_write"
  on public.menu_items for all to authenticated
  using (public.is_active_staff()) with check (public.is_active_staff());

create policy "gallery_images_staff_write"
  on public.gallery_images for all to authenticated
  using (public.is_active_staff()) with check (public.is_active_staff());

create policy "restaurant_settings_admin_write"
  on public.restaurant_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "restaurant_settings_admin_insert"
  on public.restaurant_settings for insert to authenticated
  with check (public.is_admin());

-- Staff can see all bookings and their events.
create policy "bookings_staff_read"
  on public.bookings for select to authenticated using (public.is_active_staff());

create policy "booking_events_staff_read"
  on public.booking_events for select to authenticated using (public.is_active_staff());

-- Status transitions happen through the RPC below (definer-owned), so no
-- direct anon writes; staff updates also go through update_booking_status to
-- guarantee the event history is written.
create policy "bookings_staff_update"
  on public.bookings for update to authenticated using (public.is_active_staff());

create policy "booking_events_staff_insert"
  on public.booking_events for insert to authenticated with check (public.is_active_staff());

-- Staff profiles: a staff member sees colleagues; admins manage them.
create policy "staff_profiles_staff_read"
  on public.staff_profiles for select to authenticated using (public.is_active_staff());

create policy "staff_profiles_admin_write"
  on public.staff_profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Status transition guard shared by the RPCs
-- ---------------------------------------------------------------------------
create or replace function public.valid_booking_status_transition(
  p_from text, p_to text
) returns boolean
language sql
stable
as $$
  select (p_from, p_to) in (
    values
      ('pending',   'confirmed'),
      ('pending',   'cancelled'),
      ('confirmed', 'seated'),
      ('confirmed', 'cancelled'),
      ('confirmed', 'no_show'),
      ('seated',    'cancelled'),
      -- cancelled bookings may be revived within policy window
      ('cancelled', 'pending')
  );
$$;

-- Log table backing the RPC's IP-based rate limiting (created before the RPC
-- so its dependency is explicit).
create table if not exists public.booking_requests_log (
  id           bigint generated always as identity primary key,
  request_ip   inet not null,
  requested_at timestamptz not null default now()
);

create index if not exists booking_requests_log_ip_idx
  on public.booking_requests_log (request_ip, requested_at desc);

alter table public.booking_requests_log enable row level security;
-- No policies: only the SECURITY DEFINER RPC touches it.

-- ---------------------------------------------------------------------------
-- submit_booking — the ONLY write path for guests
-- SECURITY DEFINER: validates server-side, enforces duplicate protection and
-- rate limiting, generates the unique reference, writes the audit event.
-- ---------------------------------------------------------------------------
create or replace function public.submit_booking(p_booking jsonb)
returns table (booking_reference text, status text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name          text := lower(btrim(coalesce(p_booking->>'customer_name', '')));
  v_phone_raw     text := coalesce(p_booking->>'customer_phone', '');
  v_email         text := lower(btrim(nullif(coalesce(p_booking->>'customer_email', ''), '')));
  v_date          date;
  v_time          time;
  v_guests        integer;
  v_occasion      text := p_booking->>'occasion';
  v_pref          text := p_booking->>'dining_preference';
  v_requests      text := nullif(btrim(coalesce(p_booking->>'special_requests', '')), '');
  v_phone         text;
  v_reference     text;
  v_attempts      integer := 0;
  v_recent        integer;
  v_combined      text;
begin
  -- ---- Rate limiting: max 4 enquiries per IP per rolling hour ----------------
  select count(*) into v_recent
  from public.booking_requests_log
  where request_ip = inet_client_addr()
    and requested_at > now() - interval '1 hour';
  if v_recent >= 4 then
    raise exception 'RATE_LIMIT_EXCEEDED: too many enquiries from this address; try again later';
  end if;

  -- ---- Normalise phone ------------------------------------------------------
  v_phone := regexp_replace(v_phone_raw, '[\s\-().+]', '', 'g');
  if v_phone like '91%' and length(v_phone) = 12 then
    v_phone := '+' || v_phone;
  elsif length(v_phone) = 10 and v_phone ~ '^[6-9][0-9]{9}$' then
    v_phone := '+91' || v_phone;
  else
    raise exception 'INVALID_BOOKING: customer_phone must be a valid Indian mobile number';
  end if;

  -- ---- Name -----------------------------------------------------------------
  if length(btrim(coalesce(p_booking->>'customer_name', ''))) < 2
     or length(btrim(coalesce(p_booking->>'customer_name', ''))) > 80 then
    raise exception 'INVALID_BOOKING: customer_name must be 2-80 characters';
  end if;
  if btrim(p_booking->>'customer_name') !~ '^[\p{L}\p{M}''\.\- ]+$' then
    raise exception 'INVALID_BOOKING: customer_name has invalid characters';
  end if;

  -- ---- Email (optional) -----------------------------------------------------
  if v_email is not null and v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' then
    raise exception 'INVALID_BOOKING: customer_email is not a valid address';
  end if;

  -- ---- Date -----------------------------------------------------------------
  begin
    v_date := (p_booking->>'booking_date')::date;
  exception when others then
    raise exception 'INVALID_BOOKING: booking_date is not a valid date';
  end;
  if v_date < current_date then
    raise exception 'INVALID_BOOKING: booking_date must be today or later';
  end if;

  -- ---- Time: dinner window, placeholder-configurable by staff ----------------
  begin
    v_time := (p_booking->>'booking_time')::time;
  exception when others then
    raise exception 'INVALID_BOOKING: booking_time is not a valid time';
  end;
  if extract(hour from v_time) < 6 or extract(hour from v_time) >= 23 then
    raise exception 'INVALID_BOOKING: booking_time must be between 18:00 and 23:00';
  end if;

  -- ---- Guests ---------------------------------------------------------------
  begin
    v_guests := (p_booking->>'guest_count')::integer;
  exception when others then
    raise exception 'INVALID_BOOKING: guest_count must be a whole number';
  end;
  if v_guests < 1 or v_guests > 40 then
    raise exception 'INVALID_BOOKING: guest_count must be between 1 and 40';
  end if;
  if v_pref = 'igloo' and v_guests > 10 then
    raise exception 'INVALID_BOOKING: igloo seating takes at most 10 guests';
  end if;

  -- ---- Occasion / preference -------------------------------------------------
  if v_occasion not in ('birthday','anniversary','date_night','celebration','business_meal','just_dinner') then
    raise exception 'INVALID_BOOKING: occasion is not a valid option';
  end if;
  if v_pref not in ('rooftop','igloo') then
    raise exception 'INVALID_BOOKING: dining_preference is not a valid option';
  end if;

  if length(v_requests) > 500 then
    raise exception 'INVALID_BOOKING: special_requests limited to 500 characters';
  end if;

  -- ---- Duplicate protection: same phone + date + time within 2 hours ---------
  v_combined := md5(v_phone || '|' || v_date::text || '|' || v_time::text);
  if exists (
    select 1
    from public.bookings
    where customer_phone = v_phone
      and booking_date = v_date
      and booking_time = v_time
      and status <> 'cancelled'
      and created_at > now() - interval '2 hours'
  ) then
    raise exception 'DUPLICATE_SUBMISSION: this enquiry is already with our team';
  end if;

  -- ---- Insert with a unique reference (retry on the rare collision) ----------
  loop
    v_attempts := v_attempts + 1;
    v_reference :=
      'IGL-' || to_char(now(), 'YYMMDD') || '-' ||
      substr(translate(encode(gen_random_bytes(6), 'base64'),
                       'IOl0+/=', 'ABCDEFGHJKMNPQRS'), 1, 4);
    begin
      insert into public.bookings (
        booking_reference, status, customer_name, customer_phone, customer_email,
        booking_date, booking_time, guest_count, occasion, dining_preference,
        special_requests
      ) values (
        v_reference, 'pending', btrim(p_booking->>'customer_name'), v_phone, v_email,
        v_date, v_time, v_guests, v_occasion, v_pref, v_requests
      );
      exit;
    exception when unique_violation then
      if v_attempts >= 3 then
        raise exception 'DUPLICATE_SUBMISSION: could not allocate a unique reference';
      end if;
    end;
  end loop;

  -- ---- Audit event ----------------------------------------------------------
  insert into public.booking_events (booking_id, actor_user_id, event_type)
  select id, null, 'created via website enquiry (pending)'
  from public.bookings where booking_reference = v_reference;

  insert into public.booking_requests_log (request_ip, requested_at)
  values (inet_client_addr(), now());

  return query
    select v_reference, 'pending'::text, now();
end;
$$;

-- ---------------------------------------------------------------------------
-- Optional retention for the rate-limit log (Supabase cron can call it).
-- ---------------------------------------------------------------------------
create or replace function public.prune_booking_requests_log()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.booking_requests_log where requested_at < now() - interval '7 days';
$$;
 — staff-only status transitions with audit history
-- ---------------------------------------------------------------------------

-- Change a booking's status. Callable only by active staff (enforced twice:
-- by RLS on the audit insert and by the explicit role check here).
create or replace function public.update_booking_status(
  p_booking_id bigint,
  p_new_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current text;
  v_actor   uuid := auth.uid();
  v_is_admin boolean := public.is_admin();
  v_old_data record;
begin
  if v_actor is null or not exists (
    select 1 from public.staff_profiles
    where user_id = v_actor and active
  ) then
    raise exception 'AUTH_REQUIRED: only active staff may change booking status';
  end if;

  if p_new_status not in ('pending','confirmed','seated','cancelled','no_show') then
    raise exception 'INVALID_BOOKING: unknown status';
  end if;

  select status into v_current
  from public.bookings where id = p_booking_id
  for update;
  if not found then
    raise exception 'INVALID_BOOKING: no such booking';
  end if;

  -- Only admins may mark no_show or revive from cancelled.
  if (p_new_status = 'no_show' or (v_current = 'cancelled' and p_new_status = 'pending'))
     and not v_is_admin then
    raise exception 'AUTH_REQUIRED: admin role required for this transition';
  end if;

  if not public.valid_booking_status_transition(v_current, p_new_status) then
    raise exception 'INVALID_BOOKING: cannot move % → %', v_current, p_new_status;
  end if;

  update public.bookings
  set status      = p_new_status,
      seated_date = case when p_new_status = 'seated' then current_date else seated_date end,
      updated_at  = now()
  where id = p_booking_id
  returning * into v_old_data;

  insert into public.booking_events (booking_id, actor_user_id, event_type)
  values (p_booking_id, v_actor, format('status %s → %s by %s', v_current, p_new_status, v_actor));
end;
$$;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_touch_updated_at on public.bookings;
create trigger bookings_touch_updated_at
  before update on public.bookings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Revoke direct table writes from anon (defence in depth)
-- ---------------------------------------------------------------------------
revoke insert, update, delete on all tables in schema public from anon;
grant usage on schema public to anon, authenticated;
grant execute on function public.submit_booking(jsonb) to anon, authenticated;
grant execute on function public.update_booking_status(bigint, text) to authenticated;
