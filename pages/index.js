import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home(){
  const [name, setName] = useState('')
  const [count, setCount] = useState(1)
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load(){
    try{
      setError('')
      const res = await fetch('/.netlify/functions/rsvp')
      const data = await res.json()
      setGuests(data.rows || [])
    }catch(e){
      setError('Could not load RSVPs')
    }
  }

  useEffect(()=>{ load() }, [])

  async function submit(e){
    e.preventDefault()
    if(!name) return
    setLoading(true)
    setError('')
    try{
      const res = await fetch('/.netlify/functions/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, count: Number(count)||1 })
      })
      if(!res.ok){ throw new Error('Save failed') }
      setName(''); setCount(1)
      await load()
    }catch(e){
      setError('Could not save RSVP')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 relative overflow-hidden p-6">
      {/* Chaotic background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-6 left-6 text-6xl rotate-12">🎨</div>
        <div className="absolute bottom-10 right-10 text-7xl animate-bounce">✨</div>
        <div className="absolute top-1/3 left-1/2 text-8xl -rotate-12">🍎</div>
        <div className="absolute bottom-8 left-1/4 text-5xl animate-spin">🌳🙃</div>
        <div className="absolute top-1/2 right-1/4 text-6xl">⚖️👧👦</div>
        <div className="absolute bottom-5 right-5 text-6xl rotate-6">💥</div>
      </div>

      <main className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-2">🍏 Caramel Chaos Party 🎉</h1>
        <p className="text-center mb-6 text-lg">Sunday, October 21 — Bring a pumpkin to paint + a topping to share!</p>

        <section className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl mb-6 border-4 border-pink-300 rotate-1">
          <h2 className="text-2xl font-bold mb-3">RSVP</h2>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name" className="border p-2 rounded" />
            <input type="number" min="1" value={count} onChange={e=>setCount(e.target.value)} placeholder="# of people" className="border p-2 rounded" />
            <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded" disabled={loading}>{loading ? 'Saving...' : 'Add RSVP'}</button>
          </form>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <ul className="mt-4 space-y-1">
            {guests.map((g,i)=>(
              <li key={i}>✅ {g.name} {g.count>1 && <span>(+{g.count-1})</span>}</li>
            ))}
          </ul>
        </section>

        <section className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl mb-6 border-4 border-yellow-300 -rotate-1">
          <h2 className="text-2xl font-bold mb-3">Suggestions to Bring</h2>
          <Checklist />
        </section>

        <div className="text-center space-x-4">
          <Link href="/release" className="text-blue-600 underline">⚠️ Release of Liability</Link>
          <Link href="/admin" className="text-purple-700 underline font-semibold">Admin</Link>
        </div>
      </main>
    </div>
  )
}

function Checklist(){
  const [claimed, setClaimed] = useState({})
  const items = [
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
  return (
    <ul className="space-y-2">
      {items.map((item)=>(
        <li key={item} className="flex items-center gap-2">
          <input type="checkbox" checked={!!claimed[item]} onChange={()=>setClaimed(p=>({...p,[item]:!p[item]}))} />
          <span className={claimed[item] ? 'line-through opacity-70' : ''}>{item}</span>
        </li>
      ))}
    </ul>
  )
}
