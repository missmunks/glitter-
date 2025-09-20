
import { useEffect, useState } from 'react'
import Link from 'next/link'

const itemsSeed = [
  "Apple slices",
  "Pear wedges",
  "Marshmallows",
  "Rice Krispie treats",
  "Pretzel rods",
  "Pretzel twists",
  "Pretzel sticks",
  "Angel food cake cubes",
  "Pound cake bites",
  "Graham crackers",
  "Teddy Grahams",
  "Mini donuts",
  "Donut holes",
  "Waffle cone chunks",
  "Brownie bites",
  "Potato chips",
  "Cheese cubes",
  "Twinkies",
  "Little Debbie snack cakes",
  "Dried mango",
  "Dried apricots",
  "Dried figs",
  "Banana chips",
  "Dried cranberries",
  "Frozen banana slices",
  "Mini pancakes",
  "Mini waffles",
  "Churro bites",
  "Popcorn balls",
  "Caramel corn clusters",
  "Fortune cookies",
  "Rice cakes",
  "Saltines",
  "Ritz crackers",
  "Pita chips",
  "Graham pita chips",
  "Bugles",
  "Cinnamon rolls",
  "Cornbread cubes",
  "Chopped peanuts",
  "Almonds",
  "Pecans",
  "Cashews",
  "Walnuts",
  "Crushed Oreos",
  "Crumbled graham crackers",
  "Crushed pretzels",
  "Granola",
  "Toffee bits",
  "Corn flakes",
  "Fruity Pebbles",
  "Fruit Loops",
  "Cap\u2019n Crunch",
  "Lucky Charms marshmallows",
  "Rainbow sprinkles",
  "Star sprinkles",
  "Heart sprinkles",
  "Nerds",
  "Pop Rocks",
  "Skittles minis",
  "M&Ms",
  "Cotton candy bits",
  "Edible glitter",
  "Luster dust",
  "Sour gummy worms",
  "Gummy bears",
  "Mini marshmallows",
  "Shredded coconut",
  "White chocolate chips",
  "Dark chocolate chips",
  "Butterscotch chips",
  "Cinnamon sugar",
  "Crushed candy canes",
  "Caramel drizzle",
  "Cookie crumbs",
  "Nilla wafers",
  "Biscoff",
  "Chocolate chip cookies",
  "Churro dust",
  "Reeses Pieces",
  "Peanut butter cups",
  "Dried cranberry bits",
  "Crushed banana chips",
  "Marshmallow fluff drizzle",
  "Strawberries",
  "Pineapple chunks",
  "Grapes",
  "Orange wedges",
  "Clementine segments",
  "Kiwi slices",
  "Raspberries",
  "Blackberries",
  "Dried dates",
  "Coconut chunks",
  "Chips Ahoy",
  "Mini chocolate chip cookies",
  "Shortbread cookies",
  "Biscotti",
  "Cheesecake cubes",
  "Mini churros",
  "Mini Pop-Tarts",
  "Stroopwafels",
  "Pringles",
  "Cocoa Pebbles",
  "Apple Jacks",
  "Swedish Fish",
  "Sour Patch Kids",
  "Twizzlers",
  "Candy canes",
  "Lollipops",
  "Eggo bites",
  "Pancake bites",
  "Pop-Tarts chunks",
  "Ice cream cones",
  "Mini muffins",
  "Cereal bars",
  "Granola bars",
  "Puffed rice cakes",
  "S\u2019mores station"
];

export default function Home(){
  const [name, setName] = useState('')
  const [count, setCount] = useState(1)
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [claimed, setClaimed] = useState({})
  const [items, setItems] = useState(itemsSeed)
  const [newItem, setNewItem] = useState('')
  const [saveState, setSaveState] = useState('') // '', 'saving', 'saved', 'error'

  async function loadAll(){
    try{
      setError('')
      const [rsvpRes, claimsRes] = await Promise.all([
        fetch('/.netlify/functions/rsvp'),
        fetch('/.netlify/functions/checklist')
      ])
      if(!rsvpRes.ok || !claimsRes.ok) throw new Error('Functions not reachable')
      const rsvpData = await rsvpRes.json()
      const claimsData = await claimsRes.json()
      setGuests(rsvpData.rows || [])
      const map = {}
      const serverItems = new Set()
      for(const row of (claimsData.rows||[])){ map[row.item] = !!row.claimed; serverItems.add(row.item) }
      setItems(Array.from(new Set([...serverItems, ...itemsSeed])))
      setClaimed(map)
    }catch(e){ setError('Could not load from database. Check Netlify env keys & functions.'); }
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
    setSaveState('saving')
    try{
      const res = await fetch('/.netlify/functions/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, claimed: next })
      })
      if(!res.ok) throw new Error('bad')
      setSaveState('saved')
      setTimeout(()=>setSaveState(''),1500)
    }catch(e){
      setSaveState('error')
      setClaimed(p=>({ ...p, [item]: !next }))
    }
  }

  async function addItem(e){
    e.preventDefault()
    const item = newItem.trim()
    if(!item) return
    setNewItem('')
    if(!items.includes(item)) setItems(prev=>[...prev, item])
    setClaimed(p=>({ ...p, [item]: false }))
    setSaveState('saving')
    try{
      const res = await fetch('/.netlify/functions/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, claimed: false })
      })
      if(!res.ok) throw new Error('bad')
      setSaveState('saved')
      setTimeout(()=>setSaveState(''),1500)
    }catch(e){
      setSaveState('error')
      setItems(prev=>prev.filter(x=>x!==item))
      const cp = {...claimed}; delete cp[item]; setClaimed(cp)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-yellow-50 to-pink-50">
      {/* Decorative background only (no text overlap) */}
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
          <h1 className="text-5xl md:text-6xl font-extrabold mb-1">🍏 Caramel Apple / Pumpkin Art / Chaos 🎉</h1>
          <p className="text-center text-base mb-3">Sunday, October 21 — Bring a pumpkin to paint + a topping to share!</p>
          <div className="flex justify-center gap-3">
            <a className="px-4 py-2 rounded-full bg-emerald-600 text-white" href="sms:+18054235433?body=Hi!%20Question%20about%20the%20Caramel%20Apple%20/%20Pumpkin%20Art%20/%20Chaos%20party">Text</a>
            <a className="px-4 py-2 rounded-full bg-indigo-600 text-white" href="mailto:mucktruck@duck.com?subject=Caramel%20Apple%20/%20Pumpkin%20Art%20/%20Chaos%20Question">Email</a>
          </div>
        </div>

        <section className="section-card backdrop-blur p-6 rounded-2xl shadow-xl border-4 border-pink-300 rotate-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold mb-3">RSVP</h2>
            <div className="flex items-center gap-2">
              {saveState==='saving' && <span className="badge bg-yellow-200 text-yellow-900">Saving…</span>}
              {saveState==='saved' && <span className="badge bg-green-200 text-green-900">Saved</span>}
              {saveState==='error' && <span className="badge bg-red-200 text-red-900">Not saved</span>}
            </div>
          </div>
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
