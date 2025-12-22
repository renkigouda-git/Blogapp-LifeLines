// src/pages/Contact.jsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import BackButton from '../components/BackButton'
import { api } from '../api'         // your api wrapper (already in project)

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General / Ask a question' },
  { value: 'support', label: 'Support / Help' },
  { value: 'bug', label: 'Report a bug' },
  { value: 'partnership', label: 'Partnership / Business' },
  { value: 'feedback', label: 'Feedback / Ideas' },
]

function isValidEmail(e) {
  if (!e) return false
  // simple but effective email check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())
}

export default function Contact() {
  const { user } = useAuth() // your existing hook that provides { user, token, ... }

  // form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('general')

  // UI state
  const [sending, setSending] = useState(false)
  const [sentOk, setSentOk] = useState(false)
  const [error, setError] = useState('')        // server or validation error

  // Prefill name/email from logged-in Google user (if available)
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name)
      if (user.email) setEmail(user.email)
    }
  }, [user])

  // client-side validation before submit
  function validate() {
    if (!message || message.trim().length < 3) {
      setError('Please enter a message (at least 3 characters).')
      return false
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.')
      return false
    }
    // name optional but prefer something
    if (!name || !name.trim()) {
      setError('Please enter your name.')
      return false
    }
    setError('')
    return true
  }

  async function handleSend(ev) {
    ev?.preventDefault?.()
    if (!validate()) return

    setSending(true)
    setError('')
    setSentOk(false)

    try {
      // use your api wrapper or fetch; api is configured to set Authorization header if token exists
      const payload = {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || null,
        message: message.trim(),
        category,
      }

      // If your api wrapper is axios instance -> use /api/contact (relative)
      // If baseURL is '', this posts to same host + port 8080 if proxied; adjust if you use VITE_API_BASE
      const res = await api.post('/api/contact', payload, {
        headers: { 'Content-Type': 'application/json' }
      })

      // success: backend usually returns { status:'ok', id: ... }
      if (res?.data && (res.data.status === 'ok' || res.status === 200 || res.status === 201)) {
        setSentOk(true)
        setMessage('')      // keep name/email in place
        setSubject('')
      } else {
        setError('Unexpected server response')
        console.warn('contact unexpected response', res)
      }
    } catch (e) {
      console.error('send contact error', e)
      // try to produce a friendly message
      const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Network error'
      setError(String(msg))
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Contact</h1>
        <BackButton />
      </div>

      <p className="sub">We love hearing from you. Use the form below — logged-in name and email are prefilled.</p>

      <form className="card" onSubmit={handleSend} style={{ maxWidth: 920, padding: 20 }}>
        <label className="sub">Name</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />

        <label className="sub" style={{ marginTop: '.6rem' }}>Email</label>
        <input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />

        <div style={{ display: 'flex', gap: 12, marginTop: '.6rem' }}>
          <div style={{ flex: 1 }}>
            <label className="sub">Subject</label>
            <input className="input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Short subject (optional)" />
          </div>

          <div style={{ width: 240 }}>
            <label className="sub">Category</label>
            <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <label className="sub" style={{ marginTop: '.6rem' }}>Message</label>
        <textarea className="input" style={{ minHeight: 160 }} value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your message..." />

        {error && (
          <div style={{ marginTop: 12, padding: 12, background: '#fff0f0', borderRadius: 8, color: '#b00020' }}>
            {error}
          </div>
        )}

        {sentOk && (
          <div style={{ marginTop: 12, padding: 12, background: '#f0fff6', borderRadius: 8, color: '#017a12' }}>
            Message sent — thank you!
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <button className="btn btn-primary" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send'}
          </button>
          <button
            type="button"
            className="btn"
            style={{ marginLeft: 10 }}
            onClick={() => { setMessage(''); setSubject(''); setError(''); setSentOk(false) }}
          >
            Clear
          </button>
        </div>
      </form>

      <p className="small" style={{ marginTop: 28 }}>For legal or privacy inquiries, email <a className="link" href="mailto:privacy@lifelines.example">privacy@lifelines.example</a>.</p>
    </main>
  )
}
