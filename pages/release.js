
import { useState, useEffect } from 'react'
import Link from 'next/link'

const AGREED_KEY = 'waiver_accepted_v3'

export default function Release(){ 
  const [checked, setChecked] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(()=>{ setReady(true) },[])
  function agree(){ localStorage.setItem(AGREED_KEY,'1'); window.location.href='/' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">⚠️ Release of Liability — Caramel Apple / Pumpkin Art / Chaos</h1>
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <p className="leading-relaxed text-base">By checking the box below and clicking I Agree, each participant and the parent or legal guardian of any minor attendee expressly acknowledges reading and understanding this Release of Liability, Assumption of Risk, and Indemnity Agreement, and voluntarily agrees to be bound. You understand that participation in Caramel Apple / Pumpkin Art / Chaos involves inherent risks including slips, trips, falls, contact with foods and craft supplies, and high‑energy play. To the fullest extent permitted by law, you release and forever discharge the hosts, organizers, volunteers, and property owners from any and all claims, demands, damages, costs, or causes of action arising out of ordinary negligence or the inherent risks of the activities. You assume all such risks on your own behalf and on behalf of any minor you accompany. You agree to supervise your minor at all times, ensure choices about food and crafts are appropriate, and immediately discontinue any activity you deem unsafe. You further agree to indemnify and hold harmless the released parties from any claim brought by or on behalf of your child. This includes, without limitation, injuries resulting from climbing or falling from trees, balancing on structures, using toy zip lines, running on uneven surfaces, or interacting with sticky, slippery, or messy materials. Hosts are not responsible for lost, stolen, damaged, or sticky personal property. You acknowledge that allergens may be present and that you are responsible for dietary decisions. Nothing here waives rights that cannot be waived by law; if any provision is unenforceable, the remainder remains in effect.</p>
          <p className="leading-relaxed"><span class='text-xl'>Also, please be advised that gravity continues </span><span class='text-lg'>to function even when caramel is delicious, </span><span class='text-base'>chocolate is mesmerizing, and glitter is persuasive; </span><span class='text-sm'>sprinkles possess migratory instincts; marshmallows expand when </span><span class='text-xs'>roasted and when opinions rise; children are </span><span class='text-[10px]'>experts in improvisation; paint may attempt friendship </span><span class='text-[8px]'>with sleeves; shoes may attempt friendship with </span><span class='text-[6px]'>melted sugar; and time may move in </span><span class='text-[5px]'>party minutes. Hydrate, breathe, snack, repeat. Further </span><span class='text-[4px]'>commentary: caution cones will attempt cosplay as </span><span class='text-[3px]'>unicorn horns; popcorn kernels will file for </span><span class='text-[2px]'>independence; napkins will unionize; and the chocolate </span><span class='text-[1px]'>fountain shall not be used to launder </span><span class='text-[1px]'>final micro‑print: intentionally unreadable.</span></p>
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
