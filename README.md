# Caramel Chaos Party — Complete (Static Export + Netlify Functions + Supabase + Admin + Persistent Checklist)

## Env vars (Netlify → Site settings → Environment variables)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE`
- `ADMIN_TOKEN` (for /admin)

## Supabase SQL
```sql
create extension if not exists pgcrypto;
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  count integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.claims (
  item text primary key,
  claimed boolean not null default false,
  updated_at timestamptz not null default now()
);
```

## Build
- Next.js `output: 'export'` in `next.config.js` → `next build` outputs to `out/`
- Netlify publishes `out/` and uses functions from `netlify/functions`
