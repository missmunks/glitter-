# Caramel Chaos Party — Static Export + Netlify Functions + Supabase (with Admin)

- Uses Next.js **output: 'export'** (no `next export` CLI needed).
- Netlify publishes **out/**.
- RSVP API is **/.netlify/functions/rsvp** (uses Supabase Service Role on the server).
- Admin page at **/admin** (requires `ADMIN_TOKEN`).

## Env vars (Netlify → Site settings → Environment variables)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE`
- `ADMIN_TOKEN` (choose any long random string)

## Supabase SQL
```sql
create extension if not exists pgcrypto;
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  count integer not null default 1,
  created_at timestamptz not null default now()
);
```

## Build
Netlify runs `npm run build` and publishes `out/` (generated automatically by Next due to `output: 'export'`).

