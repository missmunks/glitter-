import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home(){
  const [name, setName] = useState('')
  const [count, setCount] = useState(1)
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [claimed, setClaimed] = useState({})
  const [newItem, setNewItem] = useState('')

  const itemsSeed = [
`Apple slices (red + green varieties)`,
`Pear wedges`,
`Marshmallows (giant, mini, or rainbow swirl)`,
`Rice Krispie treats (cut in fun shapes)`,
`Pretzel rods, pretzel twists, pretzel sticks`,
`Angel food cake cubes`,
`Pound cake bites`,
`Graham crackers / Teddy Grahams`,
`Mini donuts or donut holes`,
`Waffle cone chunks`,
`Brownie bites`,
`Potato chips (kettle style, Ruffles, or even Pringles!)`,
`Cheese cubes (the brave combo — caramel + sharp cheddar is surprisingly good)`,
`Twinkies or Little Debbie snack cakes`,
`Dried fruits: mango, apricots, figs, banana chips, cranberries`,
`Frozen banana slices`,
`Mini pancakes or waffles`,
`Churro bites`,
`Popcorn balls / caramel corn clusters`,
`Fortune cookies (crunch + caramel = wow)`,
`Rice cakes (break into pieces)`,
`Saltines or Ritz crackers (sweet + salty)`,
`Pita chips or graham pita chips`,
`Bugles (caramel “cones”)`,
`Cinnamon rolls (mini or cut-up pieces)`,
`Cornbread cubes (sticky-sweet + southern twist)`
  ]

  const [items, setItems] = useState(itemsSeed)

  async function loadAll(){
    try{
      setError('')
      const [rsvpRes, claimsRes] = await Promise.all([
        fetch('/.netlify/functions/rsvp'),
        fetch('/.netlify/functions/checklist')
      ])
      const rsvpData = await rsvpRes.json()
      const claimsData = await claimsRes.json()
      setGuests(rsvpData.rows || [])
      const map = {}
      const serverItems = new Set()
      for(const row of (claimsData.rows||[])){
        map[row.item] = !!row.claimed
        serverItems.add(row.item)
      }
      // merge server items (including any custom additions) into local list
      const merged = Array.from(new Set([...serverItems, ...itemsSeed]))
      setItems(merged)
      setClaimed(map)
    }catch(e){ setError('Could not load data (ensure functions are deployed via Git)') }
  }
  useEffect(()=>{ loadAll() }, [])

  async function submit(e){
    e.preventDefault()
    if(!name) return
    setLoading(true); setError('')
    try{
      const res = await fetch('/.netlify/functions/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, count: Number(count)||1 })
      })
      if(!res.ok) throw new Error('Save failed')
      setName(''); setCount(1); await loadAll()
    }catch{ setError('Could not save RSVP') } finally { setLoading(false) }
  }

  async function toggle(item){
    const next = !claimed[item]
    setClaimed(p=>({ ...p, [item]: next }))
    try{
      await fetch('/.netlify/functions/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, claimed: next })
      })
    }catch{}
  }

  async function addItem(e){
    e.preventDefault()
    const item = newItem.trim()
    if(!item) return
    setNewItem('')
    setItems(prev => prev.includes(item) ? prev : [...prev, item])
    setClaimed(p=>({ ...p, [item]: false }))
    try{
      await fetch('/.netlify/functions/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, claimed: false })
      })
    }catch{}
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-yellow-50 to-pink-50">
      {/* Background art kept away from text zones */}
      <div className="bg-art pointer-events-none select-none absolute inset-0 -z-10">
        <img src="/img/paint-splat.svg" className="absolute -top-10 -left-6 w-60 opacity-70 rotate-12" alt="" />
        <img src="/img/glitter.svg" className="absolute top-24 right-6 w-64 opacity-60" alt="" />
        <img src="/img/zipline.svg" className="absolute top-6 left-2 w-72 opacity-80" alt="" />
        <img src="/img/fountain.svg" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 opacity-70" alt="" />
        <img src="/img/marshmallow.svg" className="absolute top-24 left-1/4 w-16 opacity-80" alt="" />
        <img src="/img/sprinkles.svg" className="absolute bottom-24 right-1/3 w-40 opacity-70" alt="" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold mb-1">🍏 Caramel Chaos Party 🎉</h1>
          <p className="text-center text-base mb-3">Sunday, October 21 — Bring a pumpkin to paint + a topping to share!</p>
          <div className="flex justify-center gap-3">
            <a className="px-4 py-2 rounded-full bg-emerald-600 text-white" href="sms:+18054235433?body=Hi!%20Question%20about%20the%20Caramel%20Chaos%20Party">Text us</a>
            <a className="px-4 py-2 rounded-full bg-indigo-600 text-white" href="mailto:mucktruck@duck.com?subject=Caramel%20Chaos%20Party%20Question">Email us</a>
          </div>
        </div>

        <section className="section-card backdrop-blur p-6 rounded-2xl shadow-xl border-4 border-pink-300 rotate-1">
          <h2 className="text-2xl font-bold mb-3">RSVP</h2>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name" className="border p-2 rounded" />
            <input type="number" min="1" value={count} onChange={e=>setCount(e.target.value)} placeholder="# of people" className="border p-2 rounded" />
            <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded" disabled={loading}>{loading ? 'Saving...' : 'Add RSVP'}</button>
          </form>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <ul className="mt-4 space-y-1">
            {guests.map((g,i)=>(<li key={i}>✅ {g.name} {g.count>1 && <span>(+{g.count-1})</span>}</li>))}
          </ul>
        </section>

        <section className="section-card backdrop-blur p-6 rounded-2xl shadow-xl border-4 border-yellow-300 -rotate-1">
          <h2 className="text-2xl font-bold mb-3">Suggestions to Bring</h2>
          <form onSubmit={addItem} className="flex gap-2 mb-4">
            <input value={newItem} onChange={e=>setNewItem(e.target.value)} placeholder="Add your own item (persists)" className="border p-2 rounded flex-1" />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Add</button>
          </form>
          <ul className="space-y-2">
            {items.map((item)=>(
              <li key={item} className="flex items-center gap-2">
                <input type="checkbox" checked={!!claimed[item]} onChange={()=>toggle(item)} />
                <span className={claimed[item] ? 'line-through opacity-70' : ''}>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="text-center space-x-4">
          <Link href="/release" className="text-blue-600 underline">⚠️ Release of Liability</Link>
          <Link href="/admin" className="text-purple-700 underline font-semibold">Admin</Link>
        </div>
      </main>
    </div>
  )
}
