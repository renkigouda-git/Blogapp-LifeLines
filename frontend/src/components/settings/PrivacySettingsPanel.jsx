// src/components/settings/PrivacySettingsPanel.jsx
import React from "react";

export default function PrivacySettingsPanel({ prefs, updatePref }) {
  if (!prefs) return null;

  return (
    <section className="settings-panel">
      <h2>Privacy & safety</h2>
      <p className="muted">
        Control who can see your profile and interact with your posts.
      </p>

      <div className="settings-card">
        {/* PROFILE VISIBILITY */}
        <div className="form-row">
          <label>Profile visibility</label>
          <select
            value={prefs.profileVisibility || "public"}
            onChange={(e) =>
              updatePref("profileVisibility", e.target.value)
            }
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <span className="muted small">
            Private profiles do not allow comments on posts.
          </span>
        </div>

        {/* COMMENT PERMISSION */}
        <div className="form-row">
          <label>Who can comment on my posts</label>
          <select
            value={prefs.commentPermission || "everyone"}
            onChange={(e) =>
              updatePref("commentPermission", e.target.value)
            }
          >
            <option value="everyone">Everyone</option>
            <option value="none">No one</option>
          </select>

          <span className="muted small">
            Admins can always comment regardless of this setting.
          </span>
        </div>

        <div className="settings-footer">
          <span className="muted small">
            Click <b>Save changes</b> to apply these settings.
          </span>
        </div>
      </div>
    </section>
  );
}
