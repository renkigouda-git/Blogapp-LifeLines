// src/api.js
import axios from 'axios';

// FIX: If VITE_API_BASE is empty, use backend default http://localhost:8080
const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:8080").trim();

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: true,
});

// Attach JWT token from localStorage (if present)
api.interceptors.request.use((config) => {
  try {
    const t = localStorage.getItem('token');
    if (t) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${t}` };
    }
  } catch (e) {
    // ignore storage errors
  }
  return config;
}, (err) => Promise.reject(err));

// Response interceptor: only redirect for protected endpoints (not public GETs)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const req = err?.config || {};
    const reqMethod = (req.method || '').toLowerCase();
    const reqUrl = (req.url || '').toLowerCase();
    const base = (import.meta.env.VITE_API_BASE || '').toLowerCase();
    let path = reqUrl;
    if (base && path.startsWith(base)) path = path.slice(base.length);
    if (!path.startsWith('/')) path = '/' + path;

    const isPublicGet = reqMethod === 'get' && (
      path.startsWith('/api/posts') ||
      path.startsWith('/api/series') ||
      path.startsWith('/api/tags') ||
      path.startsWith('/api/files') ||
      path.startsWith('/swagger-ui') ||
      path.startsWith('/v3/api-docs')
    );

    if (req && req.headers && req.headers['x-skip-auth-redirect']) {
      return Promise.reject(err);
    }

    if (status === 401 && !isPublicGet) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {}
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        // do a location replace to avoid adding extra history
        window.location.replace('/login');
      }
    }

    return Promise.reject(err);
  }
);

/* --- Helpers with safe fallbacks --- */

// Try multiple endpoints for series list (some backends expose /api/series, some expose /api/posts/series-list etc.)
export async function getSeries() {
  const candidates = [
    '/api/series',
    '/api/posts/series-list',
    '/api/posts/series',
    '/api/series-list', // fallback
  ];
  for (const p of candidates) {
    try {
      const r = await api.get(p, { headers: { 'x-skip-auth-redirect': '1' } });
      if (r && r.data) return r.data;
    } catch (e) {
      // try next
    }
  }
  return []; // safe default
}

// Try multiple endpoints for tag list
export async function getTags() {
  const candidates = [
    '/api/tags',
    '/api/posts/tag-list',
    '/api/posts/tags',
    '/api/tag-list',
  ];
  for (const p of candidates) {
    try {
      const r = await api.get(p, { headers: { 'x-skip-auth-redirect': '1' } });
      if (r && r.data) return r.data;
    } catch (e) {
      // try next
    }
  }
  return [];
}

// File upload helper (many backends use /api/files or /api/files/upload)
export async function uploadFile(formData) {
  const candidates = ['/api/files', '/api/files/upload', '/api/upload', '/api/files/upload/'];
  for (const p of candidates) {
    try {
      const r = await api.post(p, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (r && r.data) {
        // many backends return { url: '...' } - return r.data as-is
        return r.data;
      }
    } catch (e) {
      // try next
    }
  }
  throw new Error('File upload failed (no working endpoint)');
}

// Map post <-> series/tags endpoints (these match the backend controller you showed)
export async function mapPostToSeries(postId, seriesId) {
  const r = await api.put(`/api/posts/${postId}/series`, { seriesId });
  return r.data;
}

export async function mapPostToTags(postId, tagIds) {
  const r = await api.put(`/api/posts/${postId}/tags`, { tagIds });
  return r.data;
}

export async function createSeries(payload) {
  // payload expected to contain name, slug, image_url (we keep as-is)
  const r = await api.post('/api/series', payload);
  return r.data;
}
export async function updateSeries(id, payload) {
  const r = await api.put(`/api/series/${id}`, payload);
  return r.data;
}

export async function createTag(payload) {
  const r = await api.post('/api/tags', payload);
  return r.data;
}
export async function updateTag(id, payload) {
  const r = await api.put(`/api/tags/${id}`, payload);
  return r.data;
}

export default api;
