// src/pages/PublicProfile.jsx
import React from 'react'
import { useParams } from 'react-router-dom'

export default function PublicProfile(){
  const { username } = useParams()
  return (
    <div className="container page">
      <h2>@{username}</h2>
      <p className="sub">Public profile page.</p>
      <div className="card" style={{padding:'1rem'}}>Posts by @{username} will appear here.</div>
    </div>
  )
}
