// src/pages/Notifications.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../hooks/useAuth';
import BackButton from '../components/BackButton';
import {
  fetchNotifications,
  markAllRead,
  markRead,
  deleteNotification,
} from '../utils/notificationsApi.js';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [busyAll, setBusyAll] = useState(false);
  const [busyDelete, setBusyDelete] = useState(null);
  const nav = useNavigate();
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN');

  // Load from backend
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const list = await fetchNotifications();
        if (!cancelled) setItems(list);
      } catch (e) {
        console.error('Load notifications failed', e);
        if (!cancelled) setItems([]);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const total = items.length;
  const unread = items.filter(n => !n.read).length;

  const handleMarkAll = async () => {
    if (!items.length || unread === 0) return;
    setBusyAll(true);
    // optimistic UI: flip everything to read
    setItems(prev => prev.map(n => ({ ...n, read: true })));

    try {
      await markAllRead();   // emits event -> navbar bell updates instantly
    } catch (e) {
      console.error(e);
      // if it failed, reload from backend to be safe
      try {
        const list = await fetchNotifications();
        setItems(list);
      } catch {}
    } finally {
      setBusyAll(false);
    }
  };

  const handleMarkOne = async (id) => {
    // optimistic: flip in UI first
    setItems(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await markRead(id);  // emits event with new unread count
    } catch (e) {
      console.error(e);
      // if failed, reload list to sync
      try {
        const list = await fetchNotifications();
        setItems(list);
      } catch {}
    }
  };

  const handleOpen = (n) => {
    if (!n.link) return;
    if (/^https?:\/\//i.test(n.link)) {
      window.open(n.link, '_blank', 'noopener,noreferrer');
    } else {
      nav(n.link);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm('Delete this notification for everyone?')) return;

    setBusyDelete(id);
    // optimistic remove
    setItems(prev => prev.filter(n => n.id !== id));
    try {
      await deleteNotification(id); // emits event, bell updates
    } catch (e) {
      console.error(e);
      // on error reload list
      try {
        const list = await fetchNotifications();
        setItems(list);
      } catch {}
    } finally {
      setBusyDelete(null);
    }
  };

  return (
    <main className="container page">
      <BackButton to="/dashboard" label="Back" />

      <h1>Notifications</h1>
      <p className="small">
        Signed in as <b>{user?.name}</b>
      </p>

      {/* Stats row */}
      <div className="grid cols-3" style={{ marginTop: '1rem' }}>
        <div className="card">
          <div className="small">Total</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 600 }}>{total}</div>
        </div>
        <div className="card">
          <div className="small">Unread</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 600 }}>{unread}</div>
        </div>
        <div className="card">
          <div className="small">Actions</div>
          <p className="small">Keep your inbox clean in one click.</p>
          <button
            className="btn"
            onClick={handleMarkAll}
            disabled={busyAll || unread === 0}
          >
            {busyAll ? 'Marking…' : 'Mark all as read'}
          </button>
        </div>
      </div>

      <h2 style={{ marginTop: '1.4rem' }}>Activity</h2>

      {items.length === 0 && (
        <div className="alert small" style={{ marginTop: '.6rem' }}>
          You&apos;re all caught up. No notifications yet.
        </div>
      )}

      {items.length > 0 && (
        <div style={{ marginTop: '.8rem', display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
          {items.map(n => {
            const isUnread = !n.read;
            return (
              <div
                key={n.id}
                className="card"
                style={{
                  borderLeft: isUnread ? '4px solid var(--primary)' : '4px solid transparent',
                  background: isUnread ? 'var(--cardAccent)' : undefined,
                }}
              >
                <div className="small" style={{ marginBottom: '.25rem' }}>
                  {n.createdAt ? dayjs(n.createdAt).format('DD MMM YYYY • HH:mm') : ''}
                </div>
                {n.title && <div style={{ fontWeight: 600 }}>{n.title}</div>}
                <div className="small" style={{ marginTop: '.25rem' }}>
                  {n.message}
                </div>
                <div style={{ marginTop: '.6rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                  {n.link && (
                    <button className="btn" onClick={() => handleOpen(n)}>
                      Open
                    </button>
                  )}
                  {isUnread && (
                    <button
                      className="btn btn-ghost"
                      onClick={() => handleMarkOne(n.id)}
                    >
                      Mark read
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(n.id)}
                      disabled={busyDelete === n.id}
                    >
                      {busyDelete === n.id ? 'Deleting…' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="small" style={{ marginTop: '1rem' }}>
        ←{' '}
        <button
          className="link"
          type="button"
          onClick={() => nav('/dashboard')}
        >
          Back to dashboard
        </button>
      </p>
    </main>
  );
}
