import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../hooks/useAuth'

function Avatar({ name='', size=56 }){
  const initials = String(name).trim().split(' ').filter(Boolean).slice(0,2).map(w=>w[0]?.toUpperCase()).join('') || 'U'
  return (
    <div
      style={{
        width:size, height:size, borderRadius:'50%',
        background:'var(--primary)', color:'#000',
        display:'grid', placeItems:'center', fontWeight:800
      }}
      aria-label={`Avatar ${initials}`}
    >{initials}</div>
  )
}

export default function Dashboard(){
  const { user } = useAuth()
  const nav = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let off = false
    ;(async () => {
      try{
        const r = await api.get('/api/posts?page=0&size=200')
        const list = Array.isArray(r.data) ? r.data : (r.data.content || [])
        const mine = user ? list.filter(p => String(p.author).trim() === String(user.name).trim()) : []
        if(!off) setPosts(mine)
      } finally { if(!off) setLoading(false) }
    })()
    return () => { off = true }
  }, [user])

  const stats = useMemo(() => {
    const total = posts.length
    const withCovers = posts.filter(p => !!p.coverImageUrl).length
    const longreads = posts.filter(p => (p.content||'').length >= 600).length
    return { total, withCovers, longreads }
  }, [posts])

  const remove = async (id) => {
    if(!confirm('Delete this post?')) return
    await api.delete(`/api/posts/${id}`)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="container page">
      {/* Header */}
      <div className="card" style={{display:'grid', gridTemplateColumns:'64px 1fr', gap:'1rem', alignItems:'center'}}>
        <Avatar name={user?.name} size={64} />
        <div>
          <div className="small" style={{color:'var(--sub)'}}>Welcome back</div>
          <h2 style={{margin:'.1rem 0'}}>{user?.name}</h2>
          <div className="small" style={{color:'var(--sub)'}}>{user?.email}</div>
        </div>
      </div>

      {/* Quick actions + Stats */}
      <div className="dashboard-grid" style={{marginTop:'1rem'}}>
        <div className="card">
          <h3 style={{marginTop:0}}>Quick actions</h3>
          <div className="flex gap" style={{flexWrap:'wrap'}}>
            <button className="btn btn-primary" onClick={()=> nav('/posts/new')}>Write post</button>
            <Link className="btn btn-ghost" to="/me">Profile</Link>
            <Link className="btn btn-ghost" to="/posts">Browse posts</Link>
          </div>
        </div>

        <div className="card">
          <h3 style={{marginTop:0}}>Your stats</h3>
          <div className="flex gap" style={{flexWrap:'wrap'}}>
            <div className="stat"><div className="stat-num">{stats.total}</div><div className="stat-label">Posts</div></div>
            <div className="stat"><div className="stat-num">{stats.withCovers}</div><div className="stat-label">With cover</div></div>
            <div className="stat"><div className="stat-num">{stats.longreads}</div><div className="stat-label">Long reads</div></div>
          </div>
        </div>
      </div>

      {/* Your posts */}
      <div className="card" style={{marginTop:'1rem'}}>
        <div className="flex space-between" style={{marginBottom:'.6rem'}}>
          <h3 style={{margin:0}}>Your posts</h3>
          <Link className="btn" to="/posts/new">New post</Link>
        </div>

        {loading && <div className="small">Loading…</div>}

        {!loading && posts.length === 0 && (
          <div className="alert small">No posts yet. Click <b>New post</b> to write your first one!</div>
        )}

        {!loading && posts.length > 0 && (
          <div className="grid cols-3">
            {posts.map(p => (
              <div className="card" key={p.id}>
                <div className="small" style={{color:'var(--sub)'}}>{p.createdAt?.slice(0,10) || ''}</div>
                <h3 style={{margin:'.3rem 0'}}>{p.title}</h3>
                <div className="flex gap">
                  <Link className="btn" to={`/posts/${p.id}`}>Open</Link>
                  <Link className="btn btn-ghost" to={`/posts/${p.id}/edit`}>Edit</Link>
                  <button className="btn btn-danger" onClick={()=> remove(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

