-- ============================================================================
-- Seed data + Storage bucket
-- Everything seeded here is PLACEHOLDER content: dishes, categories and
-- settings are examples to be replaced by staff through the admin console.
-- No prices are invented — seeded dishes deliberately have price_inr NULL so
-- the website renders "price on request" until real menu data is entered.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Storage bucket: single public bucket for all restaurant media
-- (path prefix rules below separate hero/menu/gallery usage)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('restaurant', 'restaurant', true)
on conflict (id) do update set public = true;

-- Anyone can READ objects (browser <img> usage).
create policy "restaurant_bucket_public_read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'restaurant');

-- Only active staff can upload/overwrite media.
create policy "restaurant_bucket_staff_write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'restaurant' and public.is_active_staff());

create policy "restaurant_bucket_staff_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'restaurant' and public.is_active_staff())
  with check (bucket_id = 'restaurant' and public.is_active_staff());

create policy "restaurant_bucket_staff_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'restaurant' and public.is_active_staff());

-- ---------------------------------------------------------------------------
-- Settings singleton
-- ---------------------------------------------------------------------------
insert into public.restaurant_settings (id, notes)
values (1, 'Placeholder settings row. Staff: edit menu, gallery and hero image in the admin console.')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Placeholder menu (clearly marked; prices intentionally NULL)
-- ---------------------------------------------------------------------------
insert into public.menu_categories (slug, name, description, sort_order) values
  ('starters',        'Small plates',   'Placeholder starters to be replaced by the team', 10),
  ('main-course',     'Main course',    'Placeholder mains to be replaced by the team',    20),
  ('dessert',         'Dessert theatre','Placeholder desserts to be replaced by the team', 30),
  ('mocktails-drinks','Mocktails',      'Placeholder drinks to be replaced by the team',   40)
on conflict (slug) do nothing;

insert into public.menu_items (category_id, name, description, price_inr, is_veg, is_available, sort_order)
select c.id, v.name, v.description, null, v.is_veg, true, v.sort
from (values
  ('starters', 'Placeholder · Fire-smoked starter',   'Replace with a real starter card in the admin console', true,  10),
  ('starters', 'Placeholder · Coastal seafood plate',  'Replace with a real starter card in the admin console', false, 20),
  ('main-course', 'Placeholder · Signature curry',     'Replace with a real main-course card in the admin console', true, 10),
  ('main-course', 'Placeholder · Grilled platter',     'Replace with a real main-course card in the admin console', false, 20),
  ('dessert', 'Placeholder · Rooftop dessert platter','Replace with a real dessert card in the admin console', true, 10),
  ('mocktails-drinks', 'Placeholder · Sparkling cooler','Replace with a real drinks card in the admin console', true, 10)
) as v(cat, name, description, is_veg, sort)
join public.menu_categories c on c.slug = v.cat
where not exists (
  select 1 from public.menu_items i join public.menu_categories cc on cc.id = i.category_id where cc.slug = v.cat
);
