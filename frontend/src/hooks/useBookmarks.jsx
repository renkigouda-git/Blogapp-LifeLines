import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";

// Helpers
const storageKey = (uid) => `bookmarks:${uid || "guest"}`;

export function useBookmarks() {
  const { user } = useAuth(); // expects { id or email }
  const key = useMemo(() => storageKey(user?.id || user?.email || "guest"), [user]);

  const [ids, setIds] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // keep storage in sync when key or ids change
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {}
  }, [key, ids]);

  const isBookmarked = (id) => ids.includes(String(id));

  const add = (id) =>
    setIds((prev) => (prev.includes(String(id)) ? prev : [...prev, String(id)]));

  const remove = (id) =>
    setIds((prev) => prev.filter((x) => x !== String(id)));

  const toggle = (id) => (isBookmarked(id) ? remove(id) : add(id));

  const clearAll = () => setIds([]);

  return { ids, isBookmarked, add, remove, toggle, clearAll };
}
