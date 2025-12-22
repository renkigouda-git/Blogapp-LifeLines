// src/pages/Admin.jsx
import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Admin() {
  const { user } = useAuth()
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN')

  // ---- NEW: notification form state ----
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [busy, setBusy] = useState(false)
  const [okMsg, setOkMsg] = useState('')
  const [errMsg, setErrMsg] = useState('')

  if (!isAdmin) {
    return (
      <main className="container page">
        <h1>Admin</h1>
        <div className="alert">You don’t have permission to view this page.</div>
      </main>
    )
  }

  async function handleSend(e) {
    e.preventDefault()
    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      setErrMsg('Message is required.')
      setOkMsg('')
      return
    }

    setBusy(true)
    setErrMsg('')
    setOkMsg('')

    try {
      const payload = {
        title: title && title.trim().length ? title.trim() : undefined,
        message: trimmedMessage,
        link: link && link.trim().length ? link.trim() : undefined,
      }

      await api.post('/api/notifications', payload)
      setOkMsg('Notification sent ✔')
      setTitle('')
      setMessage('')
      setLink('')
    } catch (err) {
      console.error(err)
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        'Failed to send notification.'
      setErrMsg(String(msg))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="container page">
      <h1>Admin</h1>
      <p className="small">Moderation • users • posts • reports • feature slots</p>

      <div className="grid cols-3">
        <div className="card">
          <h3>Moderation queue</h3>
          <p>Flagged posts & comments.</p>
          <Link className="btn" to="/admin/moderation">Open</Link>
        </div>
        <div className="card">
          <h3>Users</h3>
          <p>Ban/unban, roles, resets.</p>
          <Link className="btn" to="/admin/users">Open</Link>
        </div>
        <div className="card">
          <h3>Feature slots</h3>
          <p>Pick “Editor’s Picks” for Browse/Magazine.</p>
          <Link className="btn" to="/admin/features">Open</Link>
        </div>
      </div>

      <p className="small" style={{ marginTop: '.8rem' }}>
        These panels are placeholders so we don’t touch your other backend areas. We’ve added a real
        notification sender below which uses your /api/notifications endpoint.
      </p>

      {/* ---- NEW: Send notification UI ---- */}
      <section style={{ marginTop: '1.8rem', maxWidth: 640 }}>
        <h2>Send notification</h2>
        <p className="small">
          Create a broadcast notification visible to <b>all users</b> on the Notifications page.
        </p>

        <form className="card" style={{ marginTop: '.8rem' }} onSubmit={handleSend}>
          <div className="field">
            <label className="small">Title (optional)</label>
            <input
              className="input"
              placeholder="Announcement, Update, Maintenance…"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="field" style={{ marginTop: '.6rem' }}>
            <label className="small">Message *</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Write the main notification message…"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>

          <div className="field" style={{ marginTop: '.6rem' }}>
            <label className="small">Link (optional)</label>
            <input
              className="input"
              placeholder="/posts/1 or https://example.com"
              value={link}
              onChange={e => setLink(e.target.value)}
            />
            <p className="small" style={{ opacity: 0.7, marginTop: '.25rem' }}>
              If you set a link, the <b>Open</b> button in the notification will go there.
            </p>
          </div>

          {errMsg && (
            <div className="alert small" style={{ marginTop: '.6rem', color: 'var(--danger, #b3261e)' }}>
              {errMsg}
            </div>
          )}
          {okMsg && (
            <div className="alert small" style={{ marginTop: '.6rem', color: 'var(--success, #0a7a3d)' }}>
              {okMsg}
            </div>
          )}

          <div className="flex" style={{ marginTop: '.8rem', gap: '.6rem', alignItems: 'center' }}>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send notification'}
            </button>
            <span className="small" style={{ opacity: 0.7 }}>
              Use this carefully — every user will see it.
            </span>
          </div>
        </form>
      </section>

      <Link className="btn" to="/" style={{ marginTop: '1.8rem' }}>← Back</Link>
    </main>
  )
}
