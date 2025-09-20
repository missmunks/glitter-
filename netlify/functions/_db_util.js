import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false
});

export async function query(q, params=[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(q, params);
    return res;
  } finally {
    client.release();
  }
}

export async function ensureSchema() {
  // Create tables if they do not exist
  await query(`
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
  `);
}
