// src/utils/notificationsApi.js
import { api } from '../api';

const EVENT_NAME = 'notif:changed';

// Small helper: tell everyone that notifications changed
function emitChange(detail) {
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: detail || {} }));
  }
}

/** Get full list of notifications (for Notifications page) */
export async function fetchNotifications() {
  const r = await api.get('/api/notifications');
  // backend returns [{ id, title, message, link, createdAt, read }]
  return Array.isArray(r.data) ? r.data : (r.data.content || []);
}

/** Get unread count (used by navbar badge) */
export async function fetchUnreadCount() {
  const r = await api.get('/api/notifications/unread-count');
  // backend can return { unread: 3 } or just 3 – handle both
  const raw = r.data;
  const n =
    typeof raw === 'object' && raw !== null && 'unread' in raw
      ? Number(raw.unread)
      : Number(raw);
  return Number.isNaN(n) ? 0 : n;
}

/** Mark ALL notifications as read */
export async function markAllRead() {
  await api.post('/api/notifications/mark-all-read');
  const unread = await fetchUnreadCount();
  console.log('[notif] markAllRead -> unread =', unread);
  emitChange({ unread });
}

/** Mark a single notification as read */
export async function markRead(id) {
  await api.post(`/api/notifications/${id}/read`);
  const unread = await fetchUnreadCount();
  console.log('[notif] markRead -> unread =', unread);
  emitChange({ unread });
}

/** Admin: create a broadcast notification */
export async function createNotification(payload) {
  const r = await api.post('/api/notifications', payload);
  const unread = await fetchUnreadCount();
  console.log('[notif] createNotification -> unread =', unread);
  emitChange({ unread });
  return r.data;
}

/** Admin: delete a notification completely */
export async function deleteNotification(id) {
  await api.delete(`/api/notifications/${id}`);
  const unread = await fetchUnreadCount();
  console.log('[notif] deleteNotification -> unread =', unread);
  emitChange({ unread });
}

// Export the event name so Navbar can subscribe
export const NOTIF_EVENT = EVENT_NAME;
