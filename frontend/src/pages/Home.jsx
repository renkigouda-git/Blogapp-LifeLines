// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import PostCard from '../components/PostCard'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import MagazineHero from '../components/MagazineHero'
import { loadFeatureSlotsFromStorage, normalizeSlots } from '../utils/featureStorage'
import Seo from '../components/Seo.jsx'
import { parseICS } from "../utils/icsParser"

export default function Home() {
  const [posts, setPosts] = useState([])
  const [q, setQ] = useState('')
  const [events, setEvents] = useState([])
  const [magOn, setMagOn] = useState(() => {
    const v = localStorage.getItem('magazineMode')
    return v ? v === 'on' : false
  })
  // 👉 NEW: feature slots fetched from backend or localStorage fallback
  const [slots, setSlots] = useState([])

  const { user } = useAuth()

  // posts
  useEffect(() => {
    let off = false
    ;(async () => {
      try {
        const r = await api.get('/api/posts?page=0&size=24')
        const list = Array.isArray(r.data) ? r.data : (r.data.content || [])
        if (!off) setPosts(list)
      } catch (e) {
        console.error('Load posts failed', e)
        if (!off) setPosts([])
      }
    })()
    return () => { off = true }
  }, [])

  // 👉 NEW: load feature slots once. Try backend endpoints and fallback to storage.
  useEffect(() => {
    let off = false
    ;(async () => {
      // try multiple endpoints (may differ across setups)
      const endpoints = ['/api/features', '/api/feature-slots', '/api/admin/feature-slots', '/api/admin/features']
      for (const e of endpoints) {
        try {
          const r = await api.get(e)
          if (off) return
          const data = Array.isArray(r.data) ? r.data : (r.data.content || [])
          setSlots(normalizeSlots(data))
          return
        } catch (err) {
          // continue to next endpoint
        }
      }
      // fallback to local storage
      const stored = loadFeatureSlotsFromStorage()
      if (!off) setSlots(normalizeSlots(stored))
    })()
    return () => { off = true }
  }, [])

  // events (REMOTE → local fallback), future-only, refresh every 30 min
  
useEffect(() => {
  async function loadCalendar() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/events/ics`,
        { cache: "no-store" }
      )
      const text = await res.text()
      const parsed = parseICS(text)
      setEvents(parsed)
    } catch (err) {
      console.error("Calendar load failed", err)
    }
  }

  loadCalendar()
}, [])
const upcomingEvents = useMemo(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const seen = new Set()

  return events.filter(e => {
    const d = new Date(e.date)
    if (Number.isNaN(d.getTime()) || d < today) return false

    // 🔑 unique key = title + date
    const key = `${e.title}-${e.date}`
    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
}, [events])

  // search
  const filtered = useMemo(() => {
    if (!q.trim()) return posts
    const n = q.toLowerCase()
    return posts.filter(p =>
      `${p.title || ''} ${p.content || ''}`.toLowerCase().includes(n)
    )
  }, [posts, q])

  // magazine slots
  const main = useMemo(() => {
    if (!posts.length) return null

    // try feature slots (slot id 1 considered hero, else first postId slot)
    const heroSlot =
      slots.find(s => s.id === 1 && s.postId) ||
      slots.find(s => s.name && /hero/i.test(s.name) && s.postId) ||
      slots.find(s => s.postId)

    if (heroSlot) {
      const heroPost = posts.find(p => p.id === heroSlot.postId)
      if (heroPost) return heroPost
    }

    // OLD logic (fallback if no slot set or post not found)
    const tag = /#featured/i
    const featured = posts.find(p => tag.test(`${p.title} ${p.content}`))
    if (featured) return featured
    const withCover = posts.find(p => p.coverImageUrl)
    return withCover || posts[0]
  }, [posts, slots])

  const side = useMemo(() => {
    if (!posts.length) return []

    // try feature slots for side cards (everything except hero slot)
    const sideSlots = slots
      .filter(s => s.postId)
      .filter(s => !(s.id === 1 || (s.name && /hero/i.test(s.name)))) // keep hero out
    const fromSlots = sideSlots
      .map(s => posts.find(p => p.id === s.postId))
      .filter(Boolean)
      .filter(p => p.id !== main?.id)
      .slice(0, 2)

    if (fromSlots.length) return fromSlots

    // OLD logic (fallback)
    const spotlight = posts
      .filter(p => /#spotlight/i.test(`${p.title} ${p.content}`) && p.id !== main?.id)
      .slice(0, 2)
    if (spotlight.length) return spotlight
    return posts.filter(p => p.id !== main?.id).slice(0, 2)
  }, [posts, main, slots])

  const toggleMag = () => {
    const next = !magOn
    setMagOn(next)
    localStorage.setItem('magazineMode', next ? 'on' : 'off')
  }

  return (
    <div className="container">
      <Seo
        title="Home"
        description="BlogApp is your calm corner of the internet to write what you feel, save your stories and share them with others."
      />
      <div className="flex gap" style={{ alignItems: 'center' }}>
  <input
    className="input"
    placeholder="Search posts…"
    value={q}
    onChange={(e) => setQ(e.target.value)}
    style={{ flex: 1 }}
  />
  <Link className="btn" to="/posts">Browse</Link>

  {user && (
    <Link className="btn btn-primary" to="/posts/new">Write</Link>
  )}

  <button className="btn btn-ghost" onClick={toggleMag}>
    Magazine: {magOn ? 'on' : 'off'}
  </button>
</div>

      {/* events row (future-only) */}
      {upcomingEvents.length > 0 && (
        <div className="card" style={{ marginTop: '.8rem' }}>
          <div className="small" style={{ marginBottom: '.4rem' }}>Upcoming</div>
          <div className="tags" style={{ gap: '.6rem', flexWrap: 'wrap' }}>
            {upcomingEvents.map((e, i) => (
              <a
                key={i}
                className="tag"
                href={e.link}
                target="_blank"
                rel="noopener noreferrer"
                title={e.title}
              >
                {e.title} • {e.date}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Magazine hero (only when ON and we have at least one post) */}
      {magOn && main && (
        <div style={{ marginTop: '1rem' }}>
          <MagazineHero main={main} side={side} />
        </div>
      )}

      {/* lead banner + CTA */ }
      <div className="header-hero" style={{ marginTop: '1.2rem' }}>
        <div>
          <span className="kicker">No ads • Free • Yours</span>
          <h1>
            Beautiful Blog — <span style={{ color: 'var(--primary)' }}>made for your voice</span>
          </h1>
          <p className="small">
            Write what you feel. Share what you know. A calm place for ideas with images,
            comments, and a friendly community.
          </p>
        </div>

        {/* Hide signup card if already logged in */}
        {!user && (
          <div className="card">
            <h3>Create account</h3>
            <p className="small">
              Be kind, add cover images, and control your words.
            </p>
            <Link className="btn btn-accent" to="/register">Create account</Link>
            <p className="small" style={{ marginTop: '.6rem' }}>
              Already have an account? <Link className="link" to="/login">Login</Link>
            </p>
          </div>
        )}
      </div>

      {/* posts list — ALWAYS rendered */}
      <h2 style={{ marginTop: '1.4rem' }}>Latest posts</h2>
      {filtered.length === 0 ? (
        <div className="alert small">No posts yet.</div>
      ) : (
        <div className="grid cols-3">
          {filtered.slice(0, 9).map(p => (
            <PostCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  )
}
