# Igloos — Supabase + Netlify setup guide

This project is production-oriented: nothing is faked, and any unverified
business fact is clearly flagged as a **placeholder**. Follow these steps in
order.

---

## 1. Create the Supabase project

1. Create a project at <https://supabase.com> (region: ap-south-1 / Mumbai is
   closest to Chennai).
2. Note the **Project URL** and **anon public key** from Settings → API.
3. The `service_role` key is NOT used by this application anywhere. Never put
   it in Netlify env vars or the repo.

## 2. Apply the database migrations

Either:

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

Or paste the two migration files, in order, into the Supabase dashboard SQL
editor:

1. `supabase/migrations/20261016000000_initial_schema.sql`
2. `supabase/migrations/20261016000001_seed_and_storage.sql`

What they create:

| Object                      | Purpose                                     |
| --------------------------- | ------------------------------------------- |
| `restaurant_settings`       | Singleton settings row (hero image, notes)  |
| `menu_categories`, `menu_items` | Searchable menu, availability, prices   |
| `bookings`                  | Reservation enquiries with reference + status |
| `booking_events`            | Append-only audit trail of status changes   |
| `booking_requests_log`      | IP log used for per-hour rate limiting      |
| `gallery_images`            | Photo gallery rows backed by Storage        |
| `staff_profiles`            | Staff account registry (role: admin/manager) |
| `storage.buckets: restaurant` | Public-read media bucket, staff-only write |

Also applied:

- **Row Level Security on every table.** Anonymous users can only read menu,
  published gallery rows and settings. Bookings are invisible to anon and only
  readable by active staff (`staff_profiles` intersection with `auth.uid()`).
- **`submit_booking(p_booking jsonb)`** — the only guest write path. It is a
  SECURITY DEFINER function that validates every field server-side
  (name/phone/email/date/time/guests/occasion/preference/requests), enforces
  the duplicate rule (same phone + date + time within 2 hours) and rate limit
  (4 enquiries per IP per rolled hour), generates the unique
  `IGL-YYMMDD-XXXX` reference with collision retry, and writes the audit event.
  Constraint violations on direct inserts are still impossible because RLS
  blocks direct anon writes entirely.
- **`update_booking_status(p_booking_id, p_new_status)`** — staff-only RPC with
  a state-machine transition table; admins-only transitions (`no_show`,
  reopening a cancelled booking); every call is recorded in `booking_events`
  with the acting user id.

## 3. Provision the first staff account

1. Supabase dashboard → Authentication → Users → **Add user**
   (email + password, "auto-confirm").
2. SQL editor:

   ```sql
   insert into public.staff_profiles (user_id, email, full_name, role)
   values ('<auth.users uuid>', 'staff@example.com', 'Full Name', 'admin');
   ```

Repeat with role `manager` for desk staff. Managers can read/confirm bookings
but cannot mark no-shows, reopen cancellations, or edit restaurant settings.

## 4. Storage

The bucket `restaurant` is created public-read with staff-only writes by the
second migration. All paths live under the `restaurant/` prefix:

- `restaurant/hero/…` — homepage/hero imagery (admin Settings tab)
- `restaurant/gallery/…` — gallery photos (admin Gallery tab)

## 5. Netlify

1. Push this repository to GitHub and connect it in Netlify.
2. Netlify reads `netlify.toml` automatically:
   - Build command `npm run build`, publish directory `dist`.
   - SPA redirect `/* → /index.html` for client routes.
   - Security headers (X-Frame-Options, nosniff, referrer policy).
   - Node 22.
3. Site settings → Environment variables:

   ```
   VITE_SUPABASE_URL = https://<ref>.supabase.co
   VITE_SUPABASE_ANON_KEY = <anon key>
   ```

4. In `supabase/config.toml`, uncomment and extend `additional_redirect_urls`
   with your Netlify domains (preview + production), then re-run
   `supabase db push` if config drift matters to Auth redirects.

## 6. Replacing placeholder business data

- Address/phone/email/hours/WhatsApp: `src/lib/config.ts` (`SITE` object).
  WhatsApp number format: international, digits only (e.g. `9198XXXXXXXXXX`).
- Menu content: admin console → Menu (prices intentionally blank until staff
  enter real ones; blank saves as "price on request").
- Gallery: admin console → Gallery (upload real photographs).
- Hero: admin console → Settings → Hero image.
- Service-hour placeholders that also exist in SQL: `submit_booking` time
  window (18:00–23:00) and igloo capacity (10 guests) in both
  `src/lib/bookingValidation.ts` and the migration.

## 7. Verification checklist (execute before launch)

- [ ] Anon visit: menu loads seeded placeholder data.
- [ ] Anonymous booking submit → success card with `IGL-…` reference, status Pending.
- [ ] Submit the same enquiry twice within 2 hours → duplicate error.
- [ ] Submit 4 within an hour from one IP → rate-limit error on the next.
- [ ] WhatsApp button opens wa.me with encoded reference text.
- [ ] Booking remains Pending after WhatsApp is opened.
- [ ] Signed-out visitor gets shown the login at `/admin`; `/admin` redirects to `/admin/login`.
- [ ] Non-staff auth user sees "Not authorised".
- [ ] Staff can confirm → seated → cancel transitions; event trail records actor.
- [ ] Manager role cannot mark no-show (server rejects).
- [ ] Menu item create/edit/delete reflects on the public menu.
- [ ] Gallery upload + publish flow reflects on the public gallery.
- [ ] No requests in the site bundle reference the service_role key.
