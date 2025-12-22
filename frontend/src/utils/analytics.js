// src/utils/analytics.js

const PAGE_KEY = 'analytics:pages';
const POST_KEY = 'analytics:posts';

function safeLoad(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function safeSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/** Track a page view by pathname, e.g. "/posts", "/magazine" */
export function recordPageView(pathname) {
  if (!pathname) return;
  const map = safeLoad(PAGE_KEY);
  map[pathname] = (map[pathname] || 0) + 1;
  safeSave(PAGE_KEY, map);
}

/** Track a post view by ID + title (title is for display only) */
export function recordPostView(id, title) {
  if (!id) return;
  const key = String(id);
  const map = safeLoad(POST_KEY);
  const existing = map[key] || { id, title: title || '' };
  const next = {
    ...existing,
    title: title || existing.title || '',
    count: (existing.count || 0) + 1,
  };
  map[key] = next;
  safeSave(POST_KEY, map);
}

/** Read everything, sorted by most viewed */
export function getAnalyticsSummary() {
  const pageMap = safeLoad(PAGE_KEY);
  const postMap = safeLoad(POST_KEY);

  const pages = Object.entries(pageMap)
    .map(([path, count]) => ({ path, count: Number(count) || 0 }))
    .sort((a, b) => b.count - a.count);

  const posts = Object.values(postMap)
    .map(p => ({ ...p, count: Number(p.count) || 0 }))
    .sort((a, b) => b.count - a.count);

  return { pages, posts };
}
