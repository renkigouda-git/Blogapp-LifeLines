// src/pages/Browse.jsx
import React, { useEffect, useState } from 'react'
import ExternalLink from '../components/ExternalLink' // optional helper; or use <a>
import PostCard from '../components/PostCard'
import { api } from '../api'

const STATIC_PICKS = [
  {
    title: 'The Future of AI',
    blurb: 'Where AI is heading and why it matters.',
    href: 'https://medium.com/tag/ai',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop'
  },
  // ... keep your others if you want; trimmed here for brevity
];

export default function Browse(){
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      // try a few endpoints in order
      const candidates = [
        '/api/posts/featured',
        '/api/posts/expanded',
        '/api/posts', // generic fallback
      ];
      for (const url of candidates) {
        try {
          const r = await api.get(url, { headers: { 'x-skip-auth-redirect': '1' } });
          if (r && r.data && Array.isArray(r.data) && r.data.length > 0) {
            if (!mounted) return;
            setPosts(r.data);
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore and try next
        }
      }
      // no posts returned — show static picks
      if (mounted) {
        setPosts(null);
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="container page">
      <h2>Browse</h2>
      <p className="sub">Trending posts, editor’s picks, and people to follow.</p>

      {loading && <div className="card">Loading…</div>}
      {error && <div className="card" style={{color:'var(--danger)'}}>Error: {String(error)}</div>}

      {!loading && posts && (
        <div className="card-grid">
          {posts.map((p) => (
            <PostCard key={p.id || p.slug || Math.random()} p={p} />
          ))}
        </div>
      )}

      {!loading && !posts && (
        <>
          <div className="card-grid">
            {STATIC_PICKS.map((p, i) => (
              <article key={i} className="card hover">
                <a href={p.href} target="_blank" rel="noreferrer noopener" className="card-a">
                  <img className="cover" src={p.img} alt={p.title}/>
                  <div className="card-body">
                    <h3 className="card-title">{p.title}</h3>
                    <p className="card-sub">{p.blurb}</p>
                    <span className="link">Read →</span>
                  </div>
                </a>
              </article>
            ))}
          </div>
          <p className="sub" style={{marginTop:16}}>No featured posts from backend — showing curated picks.</p>
        </>
      )}
    </div>
  )
}
