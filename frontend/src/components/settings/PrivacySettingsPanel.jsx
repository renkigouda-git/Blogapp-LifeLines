// src/components/settings/PrivacySettingsPanel.jsx
import React, { useState } from "react";

export default function PrivacySettingsPanel() {
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [commentsAccess, setCommentsAccess] = useState("everyone");

  const handleSave = () => {
    // For now, just store in localStorage so it "feels" real
    const v = { profileVisibility, commentsAccess };
    localStorage.setItem("blogapp:privacy", JSON.stringify(v));
    alert("Privacy preferences saved on this device (no server yet).");
  };

  return (
    <section className="settings-panel">
      <h2>Privacy & safety</h2>
      <p className="muted">
        Control who can see your profile and interact with your posts.
      </p>

      <div className="settings-card">
        <div className="form-row">
          <label>Profile visibility</label>
          <select
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="followers">Only followers</option>
            <option value="private">Only me</option>
          </select>
          <span className="muted small">
            This is a UI-only setting for now; backend filtering can be added
            later.
          </span>
        </div>

        <div className="form-row">
          <label>Who can comment on my posts</label>
          <select
            value={commentsAccess}
            onChange={(e) => setCommentsAccess(e.target.value)}
          >
            <option value="everyone">Everyone</option>
            <option value="followers">Only followers</option>
            <option value="disabled">No one (comments off)</option>
          </select>
        </div>

        <div className="settings-footer">
          <button className="btn primary" onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>
    </section>
  );
}
