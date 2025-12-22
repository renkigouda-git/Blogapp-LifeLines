// src/pages/NewPost.jsx
import React, { useState } from 'react'
import { api, uploadFile } from '../api'
import { useNavigate } from 'react-router-dom'
import RichEditor from '../components/RichEditor'
import BackButton from '../components/BackButton'

export default function NewPost(){
  const [title,setTitle]=useState('')
  const [content,setContent]=useState('')
  const [coverImageUrl,setCover]=useState('')
  const [file,setFile]=useState(null)
  const [msg,setMsg]=useState('')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()

  const upload = async ()=>{
    if(!file) return
    setMsg('Uploading image…')
    try {
      const fd = new FormData(); fd.append('file', file)
      const data = await uploadFile(fd) // uses helper that tries multiple endpoints
      const url = data?.url || data
      if (url) {
        setCover(url)
        setMsg('Image uploaded.')
      } else {
        setMsg('Upload returned no url.')
      }
    } catch (e) {
      console.error(e)
      setMsg('Upload failed.')
    }
  }
  const submit = async ()=>{
    if (!title) { alert('Title required'); return }
    setBusy(true)
    try {
      const payload = { title, content, coverImageUrl: coverImageUrl || null }
      const { data } = await api.post('/api/posts', payload)
      nav(`/posts/${data.id}`)
    } catch (err) {
      console.error(err)
      alert('Failed to publish post.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <h2>Write a post</h2>
      <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
        <div className="card">
          <label>Title</label>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
          <label style={{marginTop:'.6rem'}}>Content</label>
          <RichEditor value={content} onChange={setContent} />
          <label style={{marginTop:'.6rem'}}>Cover Image URL</label>
          <input className="input" value={coverImageUrl} onChange={e=>setCover(e.target.value)} placeholder="http://..." />
          <button className="btn btn-primary" onClick={submit} style={{marginTop:'.8rem'}} disabled={busy}>{busy ? 'Publishing…' : 'Publish'}</button>
        </div>

        <div className="card">
          <BackButton to={-1} label="Back" />
          <label>Upload image (optional)</label>
          <input type="file" onChange={e=>setFile(e.target.files[0])}/>
          <button className="btn" onClick={upload} disabled={!file} style={{marginTop:'.6rem'}}>Upload</button>
          {msg && <div className="small alert" style={{marginTop:'.6rem'}}>{msg}</div>}
          {coverImageUrl && <div className="post-thumb" style={{height:220, marginTop:'.8rem'}}><img src={coverImageUrl} alt="cover"/></div>}
        </div>
      </div>
    </div>
  )
}
