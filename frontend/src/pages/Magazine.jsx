// src/pages/Magazine.jsx

import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import MagazineHero from '../components/MagazineHero'
import ExternalLink from '../components/ExternalLink'
import SmartImg from "../components/SmartImg";
import { loadFeatureSlotsFromStorage, normalizeSlots } from '../utils/featureStorage'
import Seo from '../components/Seo.jsx'
import { parseICS } from "../utils/icsParser"

/* ---------- tiny helper: hide a broken <img> gracefully ---------- */
function SafeImg(props){
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return <img {...props} onError={() => setOk(false)} />
}
function isFutureEvent(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d >= today
}

/* ===================== Curated rails (your data + images) ===================== */
/* Each item: { text, href, img } — Unsplash CDN links are stable & hotlink-friendly */

const STUDENT_TIPS = [
  { text: 'How to take smart notes (Zettelkasten)', href: 'https://zettelkasten.de/posts/overview/', img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Active recall & spaced repetition', href: 'https://www.supermemo.com/en/archives1990-2015/english/ol/sm2', img: 'https://images.unsplash.com/photo-1517976487492-576ea6b2936d?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Free CS courses (OSS University)', href: 'https://github.com/ossu/computer-science', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Learn Git the easy way', href: 'https://learngitbranching.js.org/', img: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Scholarship search (global)', href: 'https://www.daad.de/en/learn-and-research-in-germany/scholarships/', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80&auto=format&fit=crop' },
]

const TEACHER_TIPS = [
  { text: 'Evidence-based teaching toolkit', href: 'https://educationendowmentfoundation.org.uk/tools/', img: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Create interactive lessons (H5P)', href: 'https://h5p.org/', img: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Free classroom slides/templates', href: 'https://slidesgo.com/', img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Formative checks with quizzes', href: 'https://quizizz.com/', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80&auto=format&fit=crop' },
]

const ENGINEER_TIPS = [
  { text: 'System design primer', href: 'https://github.com/donnemartin/system-design-primer', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Awesome DevOps roadmap', href: 'https://roadmap.sh/devops', img: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Web performance handbook', href: 'https://web.dev/fast/', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Clean code cheatsheet', href: 'https://github.com/ryanmcdermott/clean-code-javascript', img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80&auto=format&fit=crop' },
]

const DOCTOR_TIPS = [
  { text: 'BMJ Best Practice (clinical decisions)', href: 'https://bestpractice.bmj.com/', img: 'https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=1200&q=80&auto=format&fit=crop' },
  { text: 'PubMed quick search', href: 'https://pubmed.ncbi.nlm.nih.gov/', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80&auto=format&fit=crop' },
  { text: 'WHO guidelines & tools', href: 'https://www.who.int/tools', img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=80&auto=format&fit=crop' },
]

const FARMER_TIPS = [
  { text: 'FAO climate-smart agriculture', href: 'https://www.fao.org/climate-smart-agriculture', img: 'https://images.unsplash.com/photo-1500937386664-56f3d39eea3a?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Soil health basics', href: 'https://www.nrcs.usda.gov/resources/education-and-outreach/soil-education', img: 'https://images.unsplash.com/photo-1602338031660-b0f0e00b2b62?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Market prices (India AgMarkNet)', href: 'https://agmarknet.gov.in/', img: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1200&q=80&auto=format&fit=crop' },
]

const TRAVEL_PLACES = [
  { text: 'UNESCO World Heritage list', href: 'https://whc.unesco.org/en/list/', img: 'https://images.unsplash.com/photo-1473959383417-1a2296ffe360?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Lonely Planet — top destinations', href: 'https://www.lonelyplanet.com/best-in-travel', img: 'https://images.unsplash.com/photo-1511735643442-503bb3bd3480?w=1200&q=80&auto=format&fit=crop' },
  { text: 'AllTrails (hikes around you)', href: 'https://www.alltrails.com/', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop' },
]

const POPULAR_TOPICS = [
  { text: 'AI writing', href: 'https://openai.com/blog', img: 'https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Core Web Vitals', href: 'https://web.dev/vitals/', img: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200&q=80&auto=format&fit=crop' },
  { text: 'React Server Components', href: 'https://react.dev/learn', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80&auto=format&fit=crop' },
  { text: 'TypeScript 5+', href: 'https://www.typescriptlang.org/docs/', img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80&auto=format&fit=crop' },
  { text: 'CSS new features', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Design systems', href: 'https://atlassian.design/', img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80&auto=format&fit=crop' },
]

const SPORTS_LINKS = [
  { text: 'Live Cricket scores', href: 'https://www.espncricinfo.com/live-cricket-score', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Football (FIFA+)', href: 'https://www.fifa.com/fifaplus/en', img: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1200&q=80&auto=format&fit=crop' },
  { text: 'F1 news', href: 'https://www.formula1.com/en/latest/all', img: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200&q=80&auto=format&fit=crop' },
  { text: 'ESPN Top stories', href: 'https://www.espn.com/', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80&auto=format&fit=crop' },
]

const NATIONAL_INTL_LINKS = [
  { text: 'India — The Hindu', href: 'https://www.thehindu.com/', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop' },
  { text: 'India — Indian Express', href: 'https://indianexpress.com/', img: 'https://images.unsplash.com/photo-1516784039951-8b0404e37b7b?w=1200&q=80&auto=format&fit=crop' },
  { text: 'BBC World', href: 'https://www.bbc.com/news', img: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80&auto=format&fit=crop' },
  { text: 'AP News', href: 'https://apnews.com/', img: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Reuters', href: 'https://www.reuters.com/', img: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80&auto=format&fit=crop' },
]

const TRENDS_LINKS = [
  { text: 'AI research highlights', href: 'https://ai.google/discover/', img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Top tech trends (Gartner)', href: 'https://www.gartner.com/en/insights/top-technology-trends', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Our World in Data', href: 'https://ourworldindata.org/', img: 'https://images.unsplash.com/photo-1534759846116-57968a6b6c63?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Charts of the day', href: 'https://www.statista.com/chartoftheday/', img: 'https://images.unsplash.com/photo-1554224155-3a589877462f?w=1200&q=80&auto=format&fit=crop' },
]

const SOFTWARE_SKILLS_LINKS = [
  { text: 'Developer Roadmaps', href: 'https://roadmap.sh', img: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=1200&q=80&auto=format&fit=crop' },
  { text: 'FullStackOpen (free)', href: 'https://fullstackopen.com/en/', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Frontend Masters guides', href: 'https://frontendmasters.com/guides/learning-roadmap/', img: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=1200&q=80&auto=format&fit=crop' },
  { text: 'The Missing Semester (MIT)', href: 'https://missing.csail.mit.edu/', img: 'https://images.unsplash.com/photo-1488213650978-3dbf6c2f8135?w=1200&q=80&auto=format&fit=crop' },
]

/* ---------- News cards (thumbnails) ---------- */
const NEWS_ITEMS = [
  { text: 'Why long-form still wins on the web', href: 'https://www.niemanlab.org/collections/longform/', img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Photography tips for better covers', href: 'https://www.digitalphotomentor.com/blog-photography-tips/', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop' },
  { text: 'How to grow a writing community', href: 'https://www.feverbee.com/primers/', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop' },
  { text: 'Performance checklist for 2025', href: 'https://web.dev/fast/', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop' },
]




const hasTag = (post, tag) => {
  const src = `${post.title || ''} ${post.content || ''}`.toLowerCase()
  return src.includes(`#${String(tag).toLowerCase()}`)
}

/* ===================== Component ===================== */
export default function Magazine() {
  const [posts, setPosts]   = useState([])
  const [events, setEvents] = useState([])
  const [slots, setSlots]   = useState([])

  // Load posts
  useEffect(() => {
    (async () => {
      try {
        const r = await api.get('/api/posts?page=0&size=120')
        const list = Array.isArray(r.data) ? r.data : (r.data.content || [])
        setPosts([...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)))
      } catch (e) { console.error(e) }
    })()
  }, [])

  // Load feature slots (try backend endpoints, fallback to localStorage)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const endpoints = ['/api/features', '/api/feature-slots', '/api/admin/feature-slots', '/api/admin/features']
      for (const ep of endpoints) {
        try {
          const r = await api.get(ep)
          if (cancelled) return
          const data = Array.isArray(r.data) ? r.data : (r.data.content || [])
          setSlots(normalizeSlots(data))
          return
        } catch (err) {
          // try next
        }
      }
      // fallback to storage
      if (!cancelled) {
        setSlots(normalizeSlots(loadFeatureSlotsFromStorage()))
      }
    })()
    return () => { cancelled = true }
  }, [])
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

    // 🔑 dedupe key
    const key = `${e.title}-${e.date}`
    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
}, [events])

  // Hero & latest slices — prefer feature slots when present
  const { cover, spot, latest } = useMemo(() => {
    let coverPost = null
    let spotPosts = []

    if (posts.length && slots.length) {
      // hero logic: id===1, or name contains 'hero', or first slot with postId
      const heroSlot = slots.find(s => s.id === 1 && s.postId)
        || slots.find(s => s.name && /hero/i.test(s.name) && s.postId)
        || slots.find(s => s.postId)

      if (heroSlot) {
        coverPost = posts.find(p => p.id === heroSlot.postId) || null
      }

      const sideSlots = slots
        .filter(s => s.postId)
        .filter(s => !(s.id === 1 || (s.name && /hero/i.test(s.name))))
        .slice(0, 2)

      spotPosts = sideSlots
        .map(s => posts.find(p => p.id === s.postId))
        .filter(Boolean)
    }

    // fallback if no cover from slots
    if (!coverPost) {
      coverPost = posts.find(p => hasTag(p, 'featured')) || posts[0] || null
    }

    const remaining = posts.filter(p => !coverPost || p.id !== coverPost.id)

    // fallback if no side posts from slots
    if (!spotPosts.length) {
      spotPosts = remaining.filter(p => hasTag(p, 'spotlight')).slice(0, 2)
    }

    const latest = remaining
      .filter(p => !hasTag(p, 'featured') && !hasTag(p, 'spotlight'))
      .slice(0, 9)

    return { cover: coverPost, spot: spotPosts, latest }
  }, [posts, slots])

  /* ---- Card helper ---- */
  const CardGrid = ({ items }) => (
    <div className="grid cols-3">
      {items.map((n, i) => (
        <ExternalLink key={i} href={n.href} className="card" style={{ display: 'block' }}>
          {n.img && (
            <div style={{ height: 140, overflow: 'hidden', borderRadius: 12, marginBottom: '.6rem' }}>
              <SafeImg
                src={n.img}
                alt={n.text}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          )}
          {n.text} ↗
        </ExternalLink>
      ))}
    </div>
  )

  return (
    <div className="container page">
      <Seo
        title="Magazine"
        description="Curated cover stories, spotlights, events and useful links from the BlogApp community."
      />

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-track">
          {upcomingEvents.map((e, i) => (
            <span className="ticker-item" key={i}>🔥 {e.title} • {e.date}</span>
          ))}
        </div>
      </div>

      <h2>BlogApp Magazine</h2>

      {/* HERO */}
      <MagazineHero main={cover} side={spot} />

      {/* Quick actions */}
      <div className="flex gap" style={{ marginTop: '.8rem', flexWrap: 'wrap' }}>
        <Link to="/posts" className="btn">Browse</Link>
        <Link to="/posts/new" className="btn btn-primary">Write</Link>
      </div>

      {/* Upcoming */}
      <section className="mag-events">
        <h3 className="mag-section-title">Upcoming</h3>
        <div className="mag-chips">
          {upcomingEvents.map((e, i) => (
            <ExternalLink key={i} href={e.link || '#'} className="chip">
              {e.title} • {e.date} ↗
            </ExternalLink>
          ))}
        </div>
      </section>

      {/* Popular topics */}
      <section style={{ marginTop: '1rem' }}>
        <h3 className="mag-section-title">Popular right now</h3>
        <CardGrid items={POPULAR_TOPICS} />
      </section>

      {/* Sports */}
      <section style={{ marginTop: '1rem' }}>
        <h3 className="mag-section-title">Sports</h3>
        <CardGrid items={SPORTS_LINKS} />
      </section>

      {/* National & International */}
      <section style={{ marginTop: '1rem' }}>
        <h3 className="mag-section-title">National & International</h3>
        <CardGrid items={NATIONAL_INTL_LINKS} />
      </section>

      {/* Future & Trends */}
      <section style={{ marginTop: '1rem' }}>
        <h3 className="mag-section-title">Future & Trends</h3>
        <CardGrid items={TRENDS_LINKS} />
      </section>

      {/* Software Skills */}
      <section style={{ marginTop: '1rem' }}>
        <h3 className="mag-section-title">Build your software skills</h3>
        <CardGrid items={SOFTWARE_SKILLS_LINKS} />
      </section>

      {/* Student Corner */}
      <section style={{ marginTop: '1rem' }}>
        <h3 className="mag-section-title">Student Corner</h3>
        <CardGrid items={STUDENT_TIPS} />
      </section>

      {/* Pro corners */}
      <section style={{ marginTop: '1rem' }}>
        <h3 className="mag-section-title">For Teachers</h3>
        <CardGrid items={TEACHER_TIPS} />
      </section>

      <section style={{ marginTop: '1rem' }}>
        <h3 className="mag-section-title">For Engineers</h3>
        <CardGrid items={ENGINEER_TIPS} />
      </section>

      <section style={{ marginTop: '1rem' }}>
        <h3 className="mag-section-title">For Doctors</h3>
        <CardGrid items={DOCTOR_TIPS} />
      </section>

      <section style={{ marginTop: '1rem' }}>
        <h3 className="mag-section-title">For Farmers</h3>
        <CardGrid items={FARMER_TIPS} />
      </section>

      {/* Travel */}
      <section style={{ marginTop: '1rem' }}>
        <h3 className="mag-section-title">Travel & Places</h3>
        <CardGrid items={TRAVEL_PLACES} />
      </section>

      {/* In the news */}
      <section style={{ marginTop: '1rem' }}>
        <h3 className="mag-section-title">In the news</h3>
        <CardGrid items={NEWS_ITEMS} />
      </section>

      {/* Latest grid (image optional) */}
      <section style={{ marginTop: '1.2rem' }}>
        <h3 className="mag-section-title">Latest</h3>

        {latest.length === 0 && (
          <div className="small" style={{ marginTop: '.4rem' }}>
            No recent posts yet. Be the first to{' '}
            <Link className="link" to="/posts/new">write one</Link>.
          </div>
        )}

        {latest.length > 0 && (
          <div className="grid cols-3">
            {latest.map(p => {
              const noImg = !p.coverImageUrl
              return (
                <Link key={p.id} to={`/posts/${p.id}`} className={`card mag-card${noImg ? ' noimg' : ''}`}>
                  {noImg ? (
                    <div className="mag-card-body">
                      <div className="small mag-meta">
                        {(p.author || '—')} • {(p.createdAt || '').slice(0,10)}
                      </div>
                      <h3 className="mag-title">{p.title}</h3>
                      {!!p.content && (
                        <p className="small" style={{ marginTop: '.25rem' }}>
                          {(p.content || '').slice(0, 120)}
                          {(p.content || '').length > 120 ? '…' : ''}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mag-thumb">
                        <SafeImg src={p.coverImageUrl} alt={p.title} loading="lazy" />
                      </div>
                      <div className="mag-card-body">
                        <div className="small mag-meta">
                          {(p.author || '—')} • {(p.createdAt || '').slice(0,10)}
                        </div>
                        <h3 className="mag-title">{p.title}</h3>
                      </div>
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
