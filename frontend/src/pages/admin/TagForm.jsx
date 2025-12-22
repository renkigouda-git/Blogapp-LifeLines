// src/pages/admin/TagForm.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, uploadFile } from '../../api'

export default function TagForm({ onCreated }) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()

  function toSlug(v){ return v.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]+/g,'') }

  async function handleSubmit(e){
    e.preventDefault()
    if (!name) return
    setBusy(true)
    try {
      let finalImageUrl = imageUrl || null
      if (imageFile) {
        const fd = new FormData(); fd.append('file', imageFile)
        const result = await uploadFile(fd)
        finalImageUrl = result?.url || result || finalImageUrl
      }
      const payload = { name, slug: slug || toSlug(name), image_url: finalImageUrl }
      try {
        const r = await api.post('/api/admin/tags', payload)
        if (onCreated) onCreated(r.data)
      } catch (e) {
        const r2 = await api.post('/api/tags', payload)
        if (onCreated) onCreated(r2.data)
      }
      nav('/admin')
    } catch (err) {
      console.error(err); alert('Failed to create tag')
    } finally { setBusy(false) }
  }

  return (
    <div className="container">
      <h2>Create Tag</h2>
      <form onSubmit={handleSubmit} className="card" style={{ padding: '1rem' }}>
        <label>Name</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} />
        <label>Slug (optional)</label>
        <input className="input" value={slug} onChange={e=>setSlug(e.target.value)} />
        <label>Image URL (or upload file)</label>
        <input className="input" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="https://..." />
        <label>Upload image (optional)</label>
        <input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files[0] || null)} />
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create'}</button>
        </div>
      </form>
    </div>
  )
}
