// src/pages/TopicView.jsx
import React from 'react'
import { useParams, Link } from 'react-router-dom'

export default function TopicView(){
  const { slug } = useParams()
  return (
    <div className="container page">
      <h2>#{slug}</h2>
      <p className="sub">Curated posts in <strong>{slug}</strong>.</p>

      <div className="grid" style={{display:'grid', gap:'1rem', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))'}}>
        {[1,2,3].map(i=>(
          <div className="card" key={i} style={{padding:'1rem'}}>
            <h4 style={{margin:0}}>Sample post {i}</h4>
            <Link className="link" to={`/posts/${i}`}>Open</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
