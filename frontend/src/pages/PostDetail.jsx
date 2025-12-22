 // src/pages/PostDetail.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../api'
import dayjs from 'dayjs'
import { useAuth } from '../hooks/useAuth'
import BackButton from '../components/BackButton'
import BookmarkButton from '../components/BookmarkButton'
import PostSeriesTagsEditor from '../components/PostSeriesTagsEditor' // <-- added import
import Seo from '../components/Seo.jsx'
import { recordPostView } from '../utils/analytics'   // 🔍 NEW

export default function PostDetail(){
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const { user } = useAuth()
  const nav = useNavigate()

  const load = async () => {
    const p = await api.get(`/api/posts/${id}`)
    setPost(p.data)
    try {
      const c = await api.get(`/api/posts/${id}/comments`)
      setComments(Array.isArray(c.data) ? c.data : (c.data.content || []))
    } catch {
      setComments([])
    }
  }

  useEffect(() => { load() }, [id])

  // 🔍 NEW: count a view whenever the post data is loaded
  useEffect(() => {
    if (post && post.id) {
      recordPostView(post.id, post.title)
    }
  }, [post])

  const canDelete = user && post && (String(post.author).trim() === String(user.name).trim() || user.role === 'ADMIN')

  const addComment = async () => {
    const t = text.trim()
    if (!t) return
    setBusy(true)
    try {
      await api.post(`/api/posts/${id}/comments`, { text: t })
      setText('')
      await load()
    } finally {
      setBusy(false)
    }
  }

  const delPost = async () => {
    if (!confirm('Delete this post?')) return
    await api.delete(`/api/posts/${id}`)
    nav('/posts')
  }

  if (!post) return <div className="container"><div className="alert">Loading…</div></div>

  // prepare HTML: ensure <a> opens in new tab and has safe rel attributes
  const rawHtml = post.content || ''
  const htmlWithTargets = rawHtml.replace(/<a\s+/gi, '<a target="_blank" rel="noopener noreferrer" ')

  // SEO summary for meta description
  const summary = (post.content || '')
    .replace(/<[^>]+>/g, '')
    .slice(0, 150)
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <div className="container">
      <Seo
        title={post.title}
        description={summary || `Read “${post.title}” on BlogApp.`}
        type="article"
        image={post.coverImageUrl || undefined}
      />

      <div className="back-row">
        <BackButton to={-1} label="Back" />
      </div>
      <div className="small">{post.createdAt ? dayjs(post.createdAt).format('DD MMM YYYY') : ''} • by {post.author}</div>
      <h1>{post.title}</h1>
      {post.coverImageUrl && (
        <div className="post-thumb" style={{height:260, margin:'1rem 0'}}>
          <img src={post.coverImageUrl} alt={post.title}/>
        </div>
      )}

      {/* Render content as HTML so links (and other HTML) become clickable.
          We only modify rendering here; no other logic was changed. */}
      <div
        className="post-content"
        style={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}
        dangerouslySetInnerHTML={{ __html: (post.content || '').replace(/\n/g, '<br/>').replace(/<a\s+/gi, '<a target="_blank" rel="noopener noreferrer" ') }}
      />

      <div className="flex gap" style={{marginTop:'.6rem'}}>
        <BookmarkButton
          large
          post={{
            id: post.id,
            title: post.title,
            summary: (post.content || '').slice(0, 140),
            coverImageUrl: post.coverImageUrl || null,
          }}
        />

        {canDelete && <button className="btn btn-danger" onClick={delPost}>Delete</button>}
        <Link className="btn btn-ghost" to="/posts">Back</Link>
      </div>

      {/* ---------- Admin: Series & Tags editor ---------- */}
      {user && user.role === 'ADMIN' && (
        <PostSeriesTagsEditor
          postId={post.id}
          initialSeriesId={post.series?.id}   // will work if backend includes series; OK if undefined
          initialTags={post.tags || []}       // will work if backend includes tags array
          onSaved={() => { load() }}          // reload post after mapping saved
        />
      )}
      {/* ------------------------------------------------- */}

      <h3 style={{marginTop:'1.4rem'}}>Comments</h3>
      {comments.length === 0 && <div className="alert small">Be the first to say something kind.</div>}
      <div className="grid" style={{gap:'.6rem'}}>
        {comments.map(c => (
          <div key={c.id} className="card">
            <div className="small">{c.createdAt ? dayjs(c.createdAt).format('DD MMM, HH:mm') : ''} • {c.authorName}</div>
            <div>{c.text}</div>
          </div>
        ))}
      </div>

      {user ? (
        <div className="card" style={{marginTop:'1rem'}}>
          <textarea
            className="input"
            placeholder="Write a kind comment…"
            value={text}
            onChange={e=>setText(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addComment} disabled={busy} style={{marginTop:'.6rem'}}>
            {busy ? 'Adding…' : 'Add comment'}
          </button>
        </div>
      ) : (
        <div className="small alert" style={{marginTop:'.8rem'}}>Please login to comment.</div>
      )}
    </div>
  )
}
