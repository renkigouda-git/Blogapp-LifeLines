// src/pages/SeriesDetail.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import dayjs from 'dayjs'
import { getSeriesImage } from '../data/imageMap'

const hasSeries = (post, slug) => {
  const s = `#series:${slug}`.toLowerCase()
  const src = `${post.title || ''} ${post.content || ''}`.toLowerCase()
  return src.includes(s)
}

export default function SeriesDetail() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hero, setHero] = useState(null)
  const [series, setSeries] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        // Prefer backend series endpoint which returns { series, posts }
        try {
          const r = await api.get(`/api/series/${slug}`)
          // backend returns { series: {...}, posts: [...] } (as you saw in Postman)
          if (!cancelled) {
            setSeries(r.data.series || null)
            const list = Array.isArray(r.data.posts) ? r.data.posts : []
            // sort newest first
            list.sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0))
            setPosts(list)
            const firstCover = list.find(p => p.coverImageUrl && p.coverImageUrl.trim())
            setHero(firstCover ? firstCover.coverImageUrl : getSeriesImage(slug))
            return
          }
        } catch (err) {
          // If series endpoint is missing or fails, fall back to old logic below
          console.warn('series endpoint failed, falling back to posts fetch', err?.message || err)
        }

        // FALLBACK: fetch all posts and filter by #series:slug marker (old behaviour)
        const r2 = await api.get('/api/posts?page=0&size=200')
        const list2 = Array.isArray(r2.data) ? r2.data : (r2.data.content || [])
        const filtered = list2.filter(p => hasSeries(p, slug))
        if (!cancelled) {
          filtered.sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0))
          setPosts(filtered)
          const firstCover = filtered.find(p => p.coverImageUrl && p.coverImageUrl.trim())
          setHero(firstCover ? firstCover.coverImageUrl : getSeriesImage(slug))
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [slug])

  const fallback = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='420'><rect width='100%' height='100%' fill='%23eef3fb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='%23707b8a'>No image</text></svg>"

  return (
    <main className="container page">
      {/* Hero */}
      <div style={{ marginBottom: '.9rem' }}>
        <div className="big-story" style={{ borderRadius: 12, overflow: 'hidden' }}>
          {hero ? (
            <img
              className="big-img"
              src={hero}
              alt={`Series ${slug}`}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallback }}
            />
          ) : (
            <div className="big-img--placeholder" style={{ height: 220 }} />
          )}
          <div style={{ padding: '.9rem .2rem' }}>
            <h1 style={{ margin: '.6rem 0' }}>{series ? series.name : `Series: ${slug.replace(/-/g,' ')}`}</h1>
            <div className="small">Multi-part stories grouped together.</div>
          </div>
        </div>
      </div>

      {loading && <div className="alert">Loading…</div>}
      {!loading && posts.length === 0 && (
        <div className="alert">No posts yet in this series.</div>
      )}

      <div className="grid cols-2" style={{ marginTop: '.8rem' }}>
        {posts.map(p => (
          <Link key={p.id} className="card" to={`/posts/${p.id}`}>
            <div className="small">{p.createdAt ? dayjs(p.createdAt).format('DD MMM YYYY') : ''} • {p.author}</div>
            <h3>{p.title}</h3>
            <p className="small">{(p.content || '').slice(0,140)}{(p.content||'').length>140?'…':''}</p>
          </Link>
        ))}
      </div>

      <div style={{marginTop:'1rem'}}><Link className="btn" to="/series">← All series</Link></div>
    </main>
  )
}
