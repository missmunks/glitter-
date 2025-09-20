# Event RSVP + Waiver v7 (Netlify Functions + Postgres)

## What you get
- Frontend with RSVP form that **cannot submit** without confirming Waiver v7
- **SMS/Email code verification** to prevent fake/blank entries
- **Device fingerprint** + IP logging hook for anti-spoof
- Admin page to view signed waivers (requires ADMIN_TOKEN)
- Full SQL schema for Postgres (use Supabase/Neon/Render or any hosted Postgres)

## Quick Deploy (Netlify)
1) Create a Postgres DB (e.g., Supabase). Get the `DATABASE_URL`.
2) On Netlify, create a new site from this folder.
3) Set environment variables:
   - `DATABASE_URL` = your Postgres connection string
   - `PGSSLMODE` = `require` (if your host needs SSL)
   - `ADMIN_TOKEN` = a strong random string (for /admin)
   - For Email (choose one):
     - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`
     - or `SENDGRID_API_KEY` and `FROM_EMAIL`
   - For SMS (optional): `TWILIO_SID`, `TWILIO_AUTH`, `TWILIO_FROM`
4) Deploy. Visit `/` for the RSVP form, `/admin` for waivers (enter ADMIN_TOKEN).

## How it works
- User fills name + signature, reads Waiver v7, checks agree box.
- Chooses SMS or Email verification.
- Backend generates a 6-char code, sends via Twilio or email (or no-op if not configured—still usable in dev via logs).
- User enters code → backend verifies → creates Waiver (v7) + RSVP.

## Capture IP
In `verify_code.js`, adjust to read:
```js
const ip = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || event.headers['x-forwarded-for'] || '';
```
Then pass `ip` into the INSERT for `waivers`.

## Enforce "no RSVP without Waiver"
The flow only creates RSVP **after** successful code verification and waiver agreement, so you’re covered.

## Notes
- SQLite on Netlify is not persistent. Use hosted Postgres.
- This template keeps things tiny/clear; feel free to add rate limiting and CAPTCHA if you see abuse.
