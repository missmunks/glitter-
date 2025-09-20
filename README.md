# Caramel Chaos Party — MAX EDITION
- Fun art (paint splat, glitter, hot dogs, teeter totter, zip line, marshmallows, chocolate fountain)
- Persistent checklist via Supabase (`claims` table)
- RSVP storage + Admin with token
- Long waiver with gradual shrinking to tiny text

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

## Netlify env vars
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE
- ADMIN_TOKEN (for /admin)
