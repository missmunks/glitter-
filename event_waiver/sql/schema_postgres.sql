-- Postgres schema (compatible with Supabase/Neon/Render/etc.)
CREATE TABLE IF NOT EXISTS attendees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  mobile TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS waivers (
  id SERIAL PRIMARY KEY,
  attendee_id INTEGER REFERENCES attendees(id),
  waiver_version TEXT NOT NULL,
  agreed_at TIMESTAMPTZ DEFAULT now(),
  ip TEXT,
  fingerprint TEXT,
  signature_name TEXT
);

CREATE TABLE IF NOT EXISTS rsvps (
  id SERIAL PRIMARY KEY,
  attendee_id INTEGER REFERENCES attendees(id),
  status TEXT DEFAULT 'confirmed'
);

CREATE TABLE IF NOT EXISTS verifications (
  id SERIAL PRIMARY KEY,
  contact TEXT NOT NULL,
  channel TEXT NOT NULL,
  code TEXT NOT NULL,
  payload JSONB,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verifications_contact ON verifications(contact);
