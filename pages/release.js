
import { useState, useEffect } from 'react'
import Link from 'next/link'

const AGREED_KEY = 'waiver_accepted_v3'

export default function Release(){ 
  const [checked, setChecked] = useState(false)
  const [ready, setReady] = useState(false)
  const [signerName, setSignerName] = useState('')
  useEffect(()=>{ setReady(true) },[])

  async function agree(){
    try {
      await fetch('/.netlify/functions/waiver-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signerName || 'Guest' })
      });
    } catch {}
    localStorage.setItem(AGREED_KEY,'1');
    window.location.href='/';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">⚠️ Release of Liability — Caramel Apple / Pumpkin Art / Chaos</h1>
        <div className="bg-white rounded-2xl shadow p-6 space-y-4 leading-relaxed text-base">
          <p><strong>Legally Binding (and friendly):</strong> By checking “I Agree,” each participant and any parent or legal guardian of a minor attendee confirms they have read and understood this Release of Liability, Assumption of Risk, and Indemnity Agreement, and agrees to be bound. You understand that participation in Caramel Apple / Pumpkin Art / Chaos involves inherent risks: slips, trips, falls, sticky floors, messy crafts, running children, and outdoor surfaces. To the fullest extent permitted by law, you release and hold harmless the hosts, organizers, volunteers, and property owners from claims arising from ordinary negligence or inherent risks. You accept responsibility for your own participation and for supervising any minor you accompany; you will choose foods and crafts that are appropriate, and you’ll stop any activity that seems unsafe. Injuries specifically contemplated include falling from trees, rough‑and‑tumble collisions, and encounters with caramel, chocolate, paint, sprinkles, glitter, or craft supplies. Hosts are not responsible for lost, stolen, damaged, or sticky personal items. Allergens may be present; you are responsible for dietary choices. Nothing here waives non‑waivable rights; if any provision is invalid, the rest remains in effect.</p>
          <p><strong>Plain‑English Notes:</strong> This is a fun, high‑energy, sticky situation. There will be laughter, glitter, and the occasional sprint. We do our best to keep things safe; you do your best to keep your tiny tornado safe.</p>
          <p><strong>Party Reality:</strong> Gravity remains operational; caramel is persuasive; chocolate is hypnotic; sprinkles migrate like colorful geese; glitter applies for permanent residency; marshmallows develop strong opinions when warmed; socks sometimes pursue diplomacy with fountains; paint negotiates with sleeves; and time moves in “party minutes.” Hydrate, breathe, snack, repeat.</p>
          <p><strong>Friendly Manners:</strong> Walkways clear, tools returned to their nests, chocolate fountain is not for washing action figures (we asked, it said no), and neighbors appreciate indoor voice levels outdoors.</p>
          <p><strong>Food Zone:</strong> Self‑serve buffet with lots of choices. Nuts, dairy, gluten, and dyes may exist. Read labels, ask questions, and when in doubt, choose a safe option. See the “I have an allergy!” section on the main page for guest‑shared notes.</p>

          <label className="block mb-3">
            <span className="text-sm font-medium">Your name (for the waiver record)</span>
            <input
              value={signerName}
              onChange={e=>setSignerName(e.target.value)}
              placeholder="Type your name"
              className="border p-2 rounded w-full mt-1"
            />
          </label>

          <label className="flex items-center gap-3 mt-2">
            <input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)} />
            <span className="font-medium">I have read and agree to the Release of Liability for myself and any minor I accompany.</span>
          </label>
          <div className="flex items-center gap-3">
            <button onClick={agree} disabled={!checked || !ready} className={`px-4 py-2 rounded bg-emerald-600 text-white ${(!checked||!ready)?'opacity-60 pointer-events-none':''}`}>I Agree</button>
            <Link href="/" className="underline text-blue-700">Back</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
