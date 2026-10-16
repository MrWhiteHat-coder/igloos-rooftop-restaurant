# Igloos Rooftop Restaurant — Website & Reservations

Premium restaurant website for **Igloos Rooftop Restaurant** (Chennai) with a live
reservation enquiry pipeline, staff-administered menu/gallery and a protected
admin console.

> **Business data status:** address, phone numbers, hours, prices and celebration
> package details in this repository are **configurable placeholders** until the
> restaurant verifies them. Nothing on the site invents official prices,
> testimonials or confirmed bookings.

## Stack

| Layer     | Choice                                              |
| --------- | --------------------------------------------------- |
| Frontend  | React + TypeScript + Vite + Tailwind CSS v4         |
| Database  | Supabase PostgreSQL (migrations in `supabase/`)     |
| Auth      | Supabase Auth (email/password, staff only)          |
| Files     | Supabase Storage (`restaurant` bucket)              |
| Hosting   | Netlify (`netlify.toml`, SPA build, security headers) |

## Quick start

```bash
npm install
cp .env.example .env   # fill in your Supabase URL + anon key
npm run dev            # http://localhost:5173
npm run test           # unit tests (references, validation, WhatsApp links)
npm run build          # typecheck + production build → dist/
```

## Environment variables (Netlify + local)

| Variable                  | Where it comes from            | Secret? |
| ------------------------- | ------------------------------ | ------- |
| `VITE_SUPABASE_URL`       | Supabase → Settings → API      | No      |
| `VITE_SUPABASE_ANON_KEY`  | Supabase → Settings → API      | No*     |

\* The **anon key is safe for the browser only because Row Level Security
policies restrict every table**. The `service_role` key must never enter this
repository, the repo history, or the frontend bundle.

Full setup path: **[docs/SETUP.md](docs/SETUP.md)** — Supabase project creation,
migrations, storage bucket, staff provisioning, Netlify build settings and
Launch Checklist.
