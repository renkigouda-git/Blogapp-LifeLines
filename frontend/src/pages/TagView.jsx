// src/pages/TagView.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import dayjs from 'dayjs'
import { getTagImage } from '../data/imageMap'

const hasTag = (post, tag) => {
  const needle = `#${tag}`.toLowerCase()
  const src = `${post.title || ''} ${post.content || ''}`.toLowerCase()
  return src.includes(needle)
}

export default function TagView() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hero, setHero] = useState(null)
  const [tagObj, setTagObj] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        // Prefer backend tag endpoint which returns { tag, posts }
        try {
          const r = await api.get(`/api/tags/${slug}`)
          if (!cancelled) {
            setTagObj(r.data.tag || null)
            const list = Array.isArray(r.data.posts) ? r.data.posts : []
            list.sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0))
            setPosts(list)
            const firstCover = list.find(p => p.coverImageUrl && p.coverImageUrl.trim())
            setHero(firstCover ? firstCover.coverImageUrl : getTagImage(slug))
            return
          }
        } catch (err) {
          console.warn('tag endpoint failed, falling back to posts fetch', err?.message || err)
        }

        // FALLBACK: fetch posts and filter by #tag marker (old behaviour)
        const r2 = await api.get('/api/posts?page=0&size=200')
        const list2 = Array.isArray(r2.data) ? r2.data : (r2.data.content || [])
        const filtered = list2.filter(p => hasTag(p, slug))
        if (!cancelled) {
          filtered.sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0))
          setPosts(filtered)
          const firstCover = filtered.find(p => p.coverImageUrl && p.coverImageUrl.trim())
          setHero(firstCover ? firstCover.coverImageUrl : getTagImage(slug))
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
      <div style={{ marginBottom: '.9rem' }}>
        <div className="big-story" style={{ borderRadius: 12, overflow: 'hidden' }}>
          {hero ? (
            <img className="big-img" src={hero} alt={`Tag ${slug}`} onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=fallback }} />
          ) : (
            <div className="big-img--placeholder" style={{ height: 180 }} />
          )}
          <div style={{ padding: '.9rem .2rem' }}>
            <h1 style={{ margin: '.6rem 0' }}>{tagObj ? `#${tagObj.name}` : `Tag: #${slug}`}</h1>
            <div className="small">Posts for this topic.</div>
          </div>
        </div>
      </div>

      {loading && <div className="alert">Loading…</div>}
      {!loading && posts.length === 0 && <div className="alert">No posts for this tag yet.</div>}

      <div className="grid cols-2" style={{ marginTop: '.8rem' }}>
        {posts.map(p => (
          <Link key={p.id} className="card" to={`/posts/${p.id}`}>
            <div className="small">{p.createdAt ? dayjs(p.createdAt).format('DD MMM YYYY') : ''} • {p.author}</div>
            <h3>{p.title}</h3>
            <p className="small">{(p.content || '').slice(0,140)}{(p.content||'').length>140?'…':''}</p>
          </Link>
        ))}
      </div>

      <div style={{marginTop:'1rem'}}><Link className="btn" to="/tags">← All tags</Link></div>
    </main>
  )
}
