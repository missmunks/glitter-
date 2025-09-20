import { query, ensureSchema } from './_db_util.js';

export const handler = async (event) => {
  try {
    await ensureSchema();
    const { code } = JSON.parse(event.body||'{}');
    if (!code) return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Missing code' }) };

    const now = new Date().toISOString();
    const res = await query(
      `SELECT * FROM verifications WHERE code=$1 AND used=false AND expires_at > $2 ORDER BY id DESC LIMIT 1`,
      [code, now]
    );
    if (res.rowCount === 0) return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Invalid or expired code' }) };

    const ver = res.rows[0];
    const payload = ver.payload;

    // Upsert attendee again to ensure ID
    let attendeeId = payload.attendeeId;
    if (!attendeeId) {
      const ins = await query(`INSERT INTO attendees(name, email, mobile) VALUES ($1,$2,$3) RETURNING id`,
        [payload.fullName, payload.email||null, payload.mobile||null]);
      attendeeId = ins.rows[0].id;
    }

    // Create waiver record (capture IP from headers via Netlify)
    const ip = process.env.NETLIFY === 'true' ? (process.env.CONTEXT_IP || '') : '';
    await query(
      `INSERT INTO waivers(attendee_id, waiver_version, ip, fingerprint, signature_name)
       VALUES ($1,$2,$3,$4,$5)`,
      [attendeeId, payload.waiver_version, '', payload.fingerprint||null, payload.signature||null]
    );

    // Create RSVP
    await query(`INSERT INTO rsvps(attendee_id, status) VALUES ($1,'confirmed')`, [attendeeId]);

    // Mark code as used
    await query(`UPDATE verifications SET used=true WHERE id=$1`, [ver.id]);

    return { statusCode: 200, body: JSON.stringify({ ok:true }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ ok:false, error:e.message }) };
  }
};
