// Simple device fingerprint (hash of UA + timezone + screen size)
async function fingerprint() {
  const data = [
    navigator.userAgent,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset()
  ].join('|');
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function fetchWaiver() {
  const res = await fetch('/.netlify/functions/waiver_text');
  const data = await res.json();
  document.getElementById('waiverText').textContent = data.text;
}

async function sendCode() {
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const mobile = document.getElementById('mobile').value.trim();
  const signature = document.getElementById('signature').value.trim();
  const agree = document.getElementById('agree').checked;
  const channel = document.getElementById('channel').value;

  if (!fullName || !signature || !agree) {
    alert('Please fill name, signature, and agree to Waiver v7.');
    return;
  }
  if (channel === 'sms' && !mobile) { alert('Mobile is required for SMS.'); return; }
  if (channel === 'email' && !email) { alert('Email is required for Email verification.'); return; }

  const fp = await fingerprint();
  const res = await fetch('/.netlify/functions/send_verification', {
    method:'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ fullName, email, mobile, signature, channel, fingerprint:fp })
  });
  const data = await res.json();
  if (data.ok) {
    document.getElementById('verifyArea').classList.remove('hidden');
    document.getElementById('verifyMsg').textContent = 'Code sent. Check your ' + (channel==='sms'?'phone':'email') + '.';
  } else {
    alert('Error: ' + data.error);
  }
}

async function verifyCode() {
  const code = document.getElementById('code').value.trim();
  const res = await fetch('/.netlify/functions/verify_code', {
    method:'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ code })
  });
  const data = await res.json();
  if (data.ok) {
    document.getElementById('verifyMsg').textContent = 'Success! RSVP confirmed and Waiver v7 signed.';
  } else {
    document.getElementById('verifyMsg').textContent = 'Verification failed: ' + data.error;
  }
}

document.getElementById('btnSendCode').addEventListener('click', sendCode);
document.getElementById('btnVerify').addEventListener('click', verifyCode);
fetchWaiver();
