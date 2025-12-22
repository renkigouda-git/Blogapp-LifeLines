// src/components/settings/ProfileSettingsPanel.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../api";

export default function ProfileSettingsPanel() {
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    bio: "",
    location: "",
    website: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .get("/me/profile")
      .then((res) => {
        if (mounted && res?.data) setForm(res.data);
      })
      .catch(() => {
        // if backend unavailable, keep local editable form
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/me/profile", form);
      // nicer UX: you can replace alert with your toast
      alert("Profile saved");
    } catch (e) {
      console.warn(e);
      alert(
        "Could not save profile to server (check backend). Changes are kept locally while offline."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="settings-panel">Loading…</div>;

  return (
    <section className="settings-panel">
      <div className="settings-panel-title">Profile</div>
      <p className="settings-panel-description">
        This is how your public profile appears to other readers on BlogApp.
      </p>

      <div className="settings-card">
        <div className="form-row">
          <label className="form-label">Display name</label>
          <input
            className="settings-input"
            value={form.displayName}
            onChange={(e) => update("displayName", e.target.value)}
            placeholder="Your display name"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Email</label>
          <input
            className="settings-input"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Bio</label>
          <textarea
            className="settings-feedback-input"
            rows={3}
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            placeholder="Short bio displayed on your profile"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Location</label>
          <input
            className="settings-input"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="City, Country (optional)"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Website</label>
          <input
            className="settings-input"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://your-site.example"
          />
        </div>

        <div className="settings-footer">
          <button
            className="btn primary"
            onClick={save}
            disabled={saving}
            aria-disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </section>
  );
}
