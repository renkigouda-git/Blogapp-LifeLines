// src/pages/Search.jsx
import React from 'react'
import { useLocation, Link } from 'react-router-dom'

function useQuery(){ return new URLSearchParams(useLocation().search) }

export default function Search(){
  const q = useQuery().get('q') || ''
  return (
    <div className="container page">
      <h2>Search</h2>
      <p className="sub">Results for: <strong>{q}</strong></p>
      <div className="card" style={{padding:'1rem'}}>
        <p>No results yet. Try another query.</p>
        <Link className="link" to="/posts">Go to Posts</Link>
      </div>
    </div>
  )
}
