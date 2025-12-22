// src/hooks/useSettingsPrefs.js
import { useEffect, useState } from "react";
import { api } from "../api"; // <-- your axios wrapper, fallback described below

const LOCAL_KEY = "blogapp:prefs";

const DEFAULT_PREFS = {
  startAtLogin: false,
  emojiReplace: true,
  editorConfirm: true,
  appTheme: "system",        // "system" | "light" | "dark"
  cardDensity: "comfortable",// "compact" | "comfortable"
  animationsEnabled: true,
  notifyAdminAnnouncements: true,
  notifyComments: true,
  notifyEmailDigest: "off",  // "off" | "daily" | "weekly"
};

export function useSettingsPrefs() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // 1) instant local load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setPrefs((p) => ({ ...p, ...JSON.parse(raw) }));
    } catch (e) { /* ignore */ }
  }, []);

  // 2) try loading server copy
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/me/settings");
        if (mounted && res?.data) setPrefs((p) => ({ ...p, ...res.data }));
      } catch (e) {
        // backend might not be present — that's okay; we keep local prefs
        console.warn("Could not load settings from server:", e.message || e);
        setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // mirror to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(prefs));
    } catch {}
  }, [prefs]);

  const updatePref = (key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const saveToServer = async () => {
    setSaving(true);
    try {
      await api.put("/me/settings", prefs);
      // optimistic — if backend fails, local model still kept
    } catch (e) {
      console.warn("Failed to save settings:", e.message || e);
      setError(e);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  return { prefs, updatePref, saveToServer, loading, saving, error };
}
