import { query, ensureSchema } from './_db_util.js';

export const handler = async (event) => {
  try {
    await ensureSchema();
    const token = event.headers['x-admin-token'];
    if (!token || token !== (process.env.ADMIN_TOKEN||'')) {
      return { statusCode: 401, body: JSON.stringify({ ok:false, error:'Unauthorized' }) };
    }
    const res = await query(`
      SELECT w.agreed_at, w.waiver_version, w.ip, w.fingerprint, a.name, a.email, a.mobile
      FROM waivers w
      JOIN attendees a ON a.id = w.attendee_id
      ORDER BY w.agreed_at DESC
      LIMIT 1000
    `);
    return { statusCode: 200, body: JSON.stringify({ ok:true, rows: res.rows }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ ok:false, error:e.message }) };
  }
};
