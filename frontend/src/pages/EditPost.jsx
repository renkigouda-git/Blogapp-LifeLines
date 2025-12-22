import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import RichEditor from '../components/RichEditor'
import { useAuth } from '../hooks/useAuth'
import BackButton from '../components/BackButton'

export default function EditPost(){
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [coverImageUrl, setCover] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    api.get(`/api/posts/${id}`).then(res=>{
      const p = res.data
      setTitle(p.title||'')
      setContent(p.content||'')
      setCover(p.coverImageUrl||'')
      setLoading(false)
    })
  }, [id])

  const upload = async ()=>{
    if(!file) return
    const fd = new FormData(); fd.append('file', file)
    const {data} = await api.post('/api/files/upload', fd, { headers:{'Content-Type':'multipart/form-data'}})
    setCover(data.url || data)
  }

  const submit = async ()=>{
    try{
      await api.put(`/api/posts/${id}`, { title, content, coverImageUrl })
      nav(`/posts/${id}`)
    }catch{
      alert('Your backend may not support PUT yet. Ask me for a backend patch, or delete+recreate.')
    }
  }

  if(loading) return <div className="container"><div className="alert">Loading…</div></div>

  const canEdit = !!user

  if(!canEdit) return <div className="container"><div className="alert">Login required.</div></div>

  return (
    <div className="container">
      <h2>Edit post</h2>
      <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
        <div className="card">
          <label>Title</label>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
          <label style={{marginTop:'.6rem'}}>Content</label>
          <RichEditor value={content} onChange={setContent} />
          <label style={{marginTop:'.6rem'}}>Cover Image URL</label>
          <input className="input" value={coverImageUrl} onChange={e=>setCover(e.target.value)} placeholder="http://..." />
          <button className="btn btn-primary" onClick={submit} style={{marginTop:'.8rem'}}>Save</button>
        </div>
        <div className="back-row">
    <BackButton to={-1} label="Back" />
  </div>
        <div className="card">
          <label>Upload image (optional)</label>
          <input type="file" onChange={e=>setFile(e.target.files[0])}/>
          <button className="btn" onClick={upload} disabled={!file} style={{marginTop:'.6rem'}}>Upload</button>
          {coverImageUrl && <div className="post-thumb" style={{height:220, marginTop:'.8rem'}}><img src={coverImageUrl}/></div>}
        </div>
      </div>
    </div>
  )
}
