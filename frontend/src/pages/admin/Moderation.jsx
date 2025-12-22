import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { Link } from 'react-router-dom';

export default function Moderation() {
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN');

  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

    api.get('/api/admin/moderation')
      .then(res => {
        setItems(res.data || []);
        setError('');
      })
      .catch(() => setError('Failed to load moderation queue'));
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <main className="container page">
        <h1>Moderation</h1>
        <div className="alert">You don’t have permission to view this page.</div>
      </main>
    );
  }

  return (
    <main className="container page">
      <h1>Moderation queue</h1>
      <p className="small">Approve / reject / delete flagged posts and comments.</p>

      {error && <p className="alert">{error}</p>}
      {items.length === 0 && !error && <p>No items in queue.</p>}

      <ul className="list">
        {items.map(it => (
          <li key={it.id} className="card">
            <strong>{it.title || `${it.type} #${it.id}`}</strong>
            <p>{it.content}</p>
            <p className="small">
              Reporter: {it.reporter} • Status: {it.status}
            </p>
            <div className="btn-row">
              <button className="btn small" onClick={() => doAction(it.id, 'approve', setItems)}>Approve</button>
              <button className="btn small" onClick={() => doAction(it.id, 'reject', setItems)}>Reject</button>
              <button className="btn small" onClick={() => doAction(it.id, 'delete', setItems)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <Link className="btn" to="/admin">← Back to Admin</Link>
    </main>
  );
}

async function doAction(id, action, setItems) {
  try {
    const res = await api.post(`/api/admin/moderation/${id}/action`, { action });
    const updated = res.data;
    setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
  } catch (err) {
    console.error(err);
    alert('Action failed');
  }
}
