import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileSettingsPanel() {
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    location: "",
    social1: "",
    social2: "",
    social3: "",
    social4: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false); // ✅ added
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    // ✅ FIXED (removed extra `api`)
    api.get("/api/me/profile")
      .then((res) => {
        if (!mounted || !res?.data) return;

        setForm({
          displayName: res.data.displayName || "",
          bio: res.data.bio || "",
          location: res.data.location || "",
          social1: res.data.social1 || "",
          social2: res.data.social2 || "",
          social3: res.data.social3 || "",
          social4: res.data.social4 || "",
        });
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      // ✅ FIXED endpoint
      await api.put("/api/me/profile", {
        displayName: form.displayName,
        bio: form.bio,
        location: form.location,
        social1: form.social1,
        social2: form.social2,
        social3: form.social3,
        social4: form.social4,
      });
      alert("Profile saved ✅");
      setEditing(false);
    } catch {
      alert("Could not save profile. Try again later.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="settings-panel">
        <p className="muted">Loading profile…</p>
      </section>
    );
  }

  return (
    <section className="settings-panel">
      <h2>Profile</h2>
      <p className="muted">
        This is how your public profile appears to other readers.
      </p>

      <div className="settings-card">

        {/* ===== DISPLAY MODE ===== */}
        {!editing && (
          <>
            <div className="form-row">
              <label>Display name</label>
              <div className="static-text">{form.displayName}</div>
            </div>

            <div className="form-row">
              <label>Email</label>
              <div className="static-text">{user?.email}</div>
            </div>

            <div className="form-row">
              <label>Bio</label>
              <div className="static-text">
                {form.bio || "—"}
              </div>
            </div>

            <div className="form-row">
              <label>Location</label>
              <div className="static-text">
                {form.location || "—"}
              </div>
            </div>

            <div className="settings-footer">
              <button
                className="btn secondary"
                onClick={() => setEditing(true)}
              >
                Edit profile
              </button>
            </div>
          </>
        )}

        {/* ===== EDIT MODE ===== */}
        {editing && (
          <>
            <div className="form-row">
              <label>Display name</label>
              <input
                className="settings-input"
                value={form.displayName}
                onChange={(e) => update("displayName", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Email</label>
              <div className="static-text">{user?.email}</div>
            </div>

            <div className="form-row">
              <label>Bio</label>
              <textarea
                className="settings-textarea"
                rows={3}
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Location</label>
              <input
                className="settings-input"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Social profiles</label>

              <div className="social-grid">
                <input
                  className="settings-input"
                  value={form.social1}
                  onChange={(e) => update("social1", e.target.value)}
                  placeholder="Social account link 1"
                />
                <input
                  className="settings-input"
                  value={form.social2}
                  onChange={(e) => update("social2", e.target.value)}
                  placeholder="Social account link 2"
                />
                <input
                  className="settings-input"
                  value={form.social3}
                  onChange={(e) => update("social3", e.target.value)}
                  placeholder="Social account link 3"
                />
                <input
                  className="settings-input"
                  value={form.social4}
                  onChange={(e) => update("social4", e.target.value)}
                  placeholder="Social account link 4"
                />
              </div>
            </div>

            <div className="settings-footer">
              <button
                className="btn secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>

              <button
                className="btn primary"
                onClick={save}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save profile"}
              </button>
            </div>
          </>
        )}

      </div>
    </section>
  );
}
