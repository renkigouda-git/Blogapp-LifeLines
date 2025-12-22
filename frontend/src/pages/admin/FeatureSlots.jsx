// src/pages/FeatureSlots.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { Link } from 'react-router-dom';
import {
  loadFeatureSlotsFromStorage,
  saveFeatureSlotsToStorage,
  normalizeSlots,
} from '../../utils/featureStorage';

const TRY_GET_ENDPOINTS = [
  '/api/admin/feature-slots',
  '/api/feature-slots',
  '/api/features',
  '/api/admin/features',
];

export default function FeatureSlots() {
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN');

  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');
  const [usingBackend, setUsingBackend] = useState(false);
  const [posts, setPosts] = useState([]);        // ← all posts for picker
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Load feature slots
  useEffect(() => {
    if (!isAdmin) return;

    let cancelled = false;

    async function loadSlots() {
      // try backend endpoints in order
      for (const ep of TRY_GET_ENDPOINTS) {
        try {
          const res = await api.get(ep);
          if (cancelled) return;

          const data = Array.isArray(res.data)
            ? res.data
            : res.data.content || [];
          const ns = normalizeSlots(data);

          setSlots(ns);
          saveFeatureSlotsToStorage(ns); // mirror backend to localStorage
          setUsingBackend(true);
          setError('');
          return;
        } catch (err) {
          // try next endpoint
        }
      }

      // fallback to localStorage
      const stored = loadFeatureSlotsFromStorage();
      const ns = normalizeSlots(stored);
      setSlots(ns);
      setUsingBackend(false);
      setError('');
    }

    loadSlots();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  // Load posts for picker
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;

    async function loadPosts() {
      try {
        const res = await api.get('/api/posts?page=0&size=200');
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.content || [];
        if (!cancelled) {
          setPosts(
            [...list].sort(
              (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            )
          );
        }
      } catch (e) {
        console.error('Failed to load posts for picker', e);
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoadingPosts(false);
      }
    }

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <main className="container page">
        <h1>Feature slots</h1>
        <div className="alert">You don’t have permission to view this page.</div>
      </main>
    );
  }

  return (
    <main className="container page">
      <h1>Feature slots</h1>
      <p className="small">Assign posts by ID to featured positions.</p>

      {error && <p className="alert">{error}</p>}

      <div style={{ marginBottom: '.6rem' }}>
        <small>
          {usingBackend
            ? 'Using backend feature endpoints (also mirrored to this browser).'
            : 'Backend feature endpoints unavailable — using local browser storage only.'}
        </small>
      </div>

      {loadingPosts && (
        <p className="small" style={{ marginBottom: '.4rem' }}>
          Loading posts for picker…
        </p>
      )}

      {!loadingPosts && posts.length === 0 && (
        <p className="small" style={{ marginBottom: '.4rem' }}>
          No posts found yet. Create some posts to feature them here.
        </p>
      )}

      <ul className="list">
        {slots.map((slot) => (
          <li key={slot.id} className="card">
            <strong>{slot.name}</strong>
            <p>
              Post:&nbsp;
              {slot.postId ? slot.postTitle || `Post #${slot.postId}` : 'Empty'}
            </p>

            <AssignForm
              slot={slot}
              usingBackend={usingBackend}
              allSlots={slots}
              setAllSlots={setSlots}
              posts={posts}
            />
          </li>
        ))}
      </ul>

      <Link className="btn" to="/admin">
        ← Back to Admin
      </Link>
    </main>
  );
}

function AssignForm({ slot, usingBackend, allSlots, setAllSlots, posts }) {
  const [postId, setPostId] = useState(slot.postId || '');

  // small helper: when dropdown changes, sync field
  const handleSelectChange = (e) => {
    const value = e.target.value;
    setPostId(value);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const numeric = postId ? Number(postId) : null;
    let updated = {
      ...slot,
      postId: numeric,
      postTitle:
        posts.find((p) => p.id === numeric)?.title || slot.postTitle || null,
    };

    // try backend first (if available)
    if (usingBackend) {
      try {
        const res = await api.put(`/api/admin/feature-slots/${slot.id}`, {
          postId: numeric,
        });
        const updatedRaw = res.data;
        updated = {
          id: updatedRaw.id,
          name: updatedRaw.name || slot.name,
          postId:
            (updatedRaw.postId === undefined
              ? updatedRaw.post && updatedRaw.post.id
              : updatedRaw.postId) ?? numeric,
          postTitle:
            updatedRaw.postTitle ??
            (updatedRaw.post && updatedRaw.post.title) ??
            updated.postTitle,
        };
      } catch (err) {
        console.error('Backend save failed, falling back to localStorage', err);
        alert('Backend save failed — saved locally instead.');
      }
    }

    // Always update state + localStorage
    const next = allSlots.map((s) => (s.id === slot.id ? updated : s));
    setAllSlots(next);
    saveFeatureSlotsToStorage(next);
  }

  return (
    <form onSubmit={handleSubmit} className="inline-form" style={{ gap: '.4rem' }}>
      {/* Dropdown picker */}
      <select
        value={postId || ''}
        onChange={handleSelectChange}
        className="input"
        style={{ minWidth: 220 }}
      >
        <option value="">— Select post —</option>
        {posts.map((p) => (
          <option key={p.id} value={p.id}>
            #{p.id} — {p.title || '(untitled)'}
          </option>
        ))}
      </select>

      {/* Keep raw ID input as backup */}
      <input
        type="number"
        value={postId}
        onChange={(e) => setPostId(e.target.value)}
        placeholder="Post ID"
        className="input"
        style={{ width: 90 }}
      />

      <button className="btn small" type="submit">
        Save
      </button>
    </form>
  );
}
