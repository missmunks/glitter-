# Caramel Chaos Party — v2
- Persistent checklist (including **custom additions**) via Supabase `claims` table.
- Removed images: teeter-totter, hot dog, bottom fruit.
- No text overlays on images (cards are opaque and elevated).
- Release page: one long string of unique text, gradually shrinking inline; includes non-liability for tree falls, injuries, and sticky/lost items.
- Replaced address with **Text us** (SMS) + **Email** buttons.

## Supabase SQL (run once)
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
## Netlify env vars
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE
- ADMIN_TOKEN (for /admin)
