import { query, ensureSchema } from './_db_util.js';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

function randomCode(len=6) {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let out='';
  for (let i=0;i<len;i++) out += chars[Math.floor(Math.random()*chars.length)];
  return out;
}

export const handler = async (event, context) => {
  try {
    await ensureSchema();
    const data = JSON.parse(event.body||'{}');
    const { fullName, email, mobile, signature, channel, fingerprint } = data;
    if (!fullName || !signature || !channel) {
      return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Missing required fields' }) };
    }
    if (channel==='sms' && !mobile) return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Mobile required' }) };
    if (channel==='email' && !email) return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Email required' }) };

    // Create or find attendee
    const resAtt = await query(
      `INSERT INTO attendees(name, email, mobile)
       VALUES ($1,$2,$3)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [fullName, email||null, mobile||null]
    );
    let attendeeId;
    if (resAtt.rowCount === 0) {
      // Find existing by email or mobile
      const lookup = await query(
        `SELECT id FROM attendees WHERE (email=$1 AND $1 IS NOT NULL) OR (mobile=$2 AND $2 IS NOT NULL) ORDER BY id DESC LIMIT 1`,
        [email||null, mobile||null]
      );
      attendeeId = lookup.rows[0]?.id;
    } else {
      attendeeId = resAtt.rows[0].id;
    }

    const code = randomCode(6);
    const contact = channel==='sms' ? mobile : email;
    const payload = { attendeeId, fullName, email, mobile, signature, fingerprint, waiver_version:'v7' };
    const expires = new Date(Date.now() + 1000*60*10); // 10 minutes

    await query(
      `INSERT INTO verifications(contact, channel, code, payload, expires_at)
       VALUES ($1,$2,$3,$4,$5)`,
      [contact, channel, code, payload, expires.toISOString()]
    );

    if (channel==='email') {
      if (!process.env.SENDGRID_API_KEY && !process.env.SMTP_HOST) {
        // allow local dev without sending
        console.log('Email disabled: no SENDGRID_API_KEY or SMTP');
      } else {
        let transporter;
        if (process.env.SMTP_HOST) {
          transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: +(process.env.SMTP_PORT||587),
            secure: false,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          });
        } else {
          // SendGrid via SMTP (recommended to set SMTP_* envs) or nodemailer-sendgrid (not used to keep deps small)
          transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY }
          });
        }
        await transporter.sendMail({
          from: process.env.FROM_EMAIL || 'no-reply@example.com',
          to: email,
          subject: 'Your RSVP Verification Code',
          text: `Your verification code is: ${code}`
        });
      }
    } else if (channel==='sms') {
      if (!process.env.TWILIO_SID) {
        console.log('SMS disabled: no TWILIO_SID');
      } else {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
        await client.messages.create({
          from: process.env.TWILIO_FROM,
          to: mobile,
          body: `Your RSVP verification code is: ${code}`
        });
      }
    }

    return { statusCode: 200, body: JSON.stringify({ ok:true }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ ok:false, error: e.message }) };
  }
};
