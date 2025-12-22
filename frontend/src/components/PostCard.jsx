// src/components/PostCard.jsx
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { useAuth } from '../hooks/useAuth'
import BookmarkButton from '../components/BookmarkButton';
import { api } from '../api'

export default function PostCard({ p, onDeleted }) {
  const { user } = useAuth()
  const [imgOk, setImgOk] = useState(true)
  const [busy, setBusy] = useState(false)

  const canManage = useMemo(() => {
    if (!user) return false
    // user.name vs p.author match
    return String(user.name).trim() === String(p.author || '').trim() || (user.role && user.role === 'ADMIN')
  }, [user, p.author])

  const handleDelete = async () => {
    if (!canManage || busy) return
    const sure = confirm(`Delete “${p.title}”? This cannot be undone.`)
    if (!sure) return
    try {
      setBusy(true)
      const res = await api.delete(`/api/posts/${p.id}`)
      if (res.status === 204 || res.status === 200) {
        onDeleted && onDeleted(p.id)
      } else {
        alert(`Delete failed (${res.status}).`)
      }
    } catch (e) {
      console.error(e)
      alert('Network error while deleting.')
    } finally {
      setBusy(false)
    }
  }

  const created = p.createdAt ? dayjs(p.createdAt).format('DD MMM YYYY') : ''

  return (
    <div className="card post-card fade-item">

      {p.coverImageUrl && imgOk && (
        <div className="post-thumb">
          <img
            loading="lazy"
            src={p.coverImageUrl}
            alt={p.title}
            onError={() => setImgOk(false)}
          />
        </div>
      )}

      <div className="small post-meta">
        {created}{created ? ' • ' : ''}by {p.author || 'Unknown'}
      </div>

      <h3 className="post-title">{p.title}</h3>

      <p className="small post-excerpt">
        {(p.content || '').slice(0, 140)}
        {(p.content || '').length > 140 ? '…' : ''}
      </p>

      <div className="flex gap" style={{alignItems:'center'}}>
        <Link className="btn" to={`/posts/${p.id}`}>Read</Link>

        <BookmarkButton
          post={{
            id: p.id,
            title: p.title,
            summary: (p.content || '').slice(0, 140),
            coverImageUrl: p.coverImageUrl || null,
          }}
        />

        {canManage && (
          <button className="btn btn-danger" onClick={handleDelete} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  )
}
