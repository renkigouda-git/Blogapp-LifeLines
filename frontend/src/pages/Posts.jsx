import React, { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api'
import PostCard from '../components/PostCard'
import BackButton from '../components/BackButton'   // ✅ ADDED

const deriveCategories = (items)=>{
  const tags = new Set()
  items.forEach(p=>{
    const source = `${p.title||''} ${p.content||''}`
    ;(source.match(/#\w+/g)||[]).forEach(t=> tags.add(t.toLowerCase()))
  })
  return ['all', ...Array.from(tags).sort()]
}

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('new')
  const [category, setCategory] = useState('all')
  const debounceRef = useRef(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/api/posts?page=0&size=48')
      const items = Array.isArray(res.data) ? res.data : (res.data.content || [])
      setPosts(items)
    } catch (e) {
      console.error(e)
      setError('Failed to load posts.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchPosts() }, [])

  const categories = useMemo(()=>deriveCategories(posts), [posts])

  const onSearch = (val) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setQ(val), 220)
  }

  const list = useMemo(() => {
    let data = posts
    if (category !== 'all') {
      const needle = category.toLowerCase()
      data = data.filter(p => (`${p.title||''} ${p.content||''}`).toLowerCase().includes(needle))
    }
    if (q.trim()) {
      const n = q.toLowerCase()
      data = data.filter(p => ((p.title||'')+(p.content||'')).toLowerCase().includes(n))
    }
    const byTime = (a, b) => {
      const ta = new Date(a.createdAt || 0).getTime()
      const tb = new Date(b.createdAt || 0).getTime()
      return sort === 'new' ? (tb - ta) : (ta - tb)
    }
    return [...data].sort(byTime)
  }, [posts, q, sort, category])

  const handleDeleted = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="container">

      {/* ✅ BACK BUTTON HERE */}
      <BackButton />

      <div className="flex space-between">
        <h2>All Posts</h2>
        <div className="flex gap">
          <div className="searchbar">
            <input className="input" placeholder="Search…" onChange={(e)=> onSearch(e.target.value)} />
          </div>
          <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All' : c}</option>)}
          </select>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="new">Newest</option>
            <option value="old">Oldest</option>
          </select>
        </div>
      </div>

      {loading && <div className="small" style={{marginTop:'1rem'}}>Loading posts…</div>}
      {error && <div className="alert" style={{marginTop:'1rem'}}>{error}</div>}

      {!loading && !error && list.length === 0 && (
        <div className="small" style={{marginTop:'1rem'}}>No posts found. Try a different search or category.</div>
      )}

      {!loading && !error && list.length > 0 && (
        <div className="grid cols-3" style={{ marginTop: '1rem' }}>
          {list.map(p => (
            <PostCard key={p.id} p={p} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  )
}
