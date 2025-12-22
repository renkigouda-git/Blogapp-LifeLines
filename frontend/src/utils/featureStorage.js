// src/utils/featureStorage.js
const STORAGE_KEY = 'blogapp_feature_slots_v1';

/**
 * Expected slot shape (array):
 * [
 *   { id: 1, name: 'Homepage Hero', postId: 5, postTitle: '...' },
 *   { id: 2, name: "Editor's Pick", postId: 4, postTitle: '...' },
 *   ...
 * ]
 */

export function loadFeatureSlotsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error('featureStorage: load failed', e);
    return [];
  }
}

export function saveFeatureSlotsToStorage(slots = []) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
  } catch (e) {
    console.error('featureStorage: save failed', e);
  }
}

/**
 * Merge returned API slots with storage slots to keep local titles if backend doesn't return them.
 * If backend returns slots, prefer them. For pure-local save use saveFeatureSlotsToStorage.
 */
export function normalizeSlots(rawSlots) {
  if (!Array.isArray(rawSlots)) return [];
  return rawSlots.map(s => ({
    id: s.id,
    name: s.name || s.slotName || s.title || `Slot ${s.id || ''}`,
    postId: (s.postId === undefined ? (s.post && s.post.id) : s.postId) ?? null,
    postTitle: s.postTitle ?? (s.post && s.post.title) ?? null
  }));
}
