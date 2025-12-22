// src/components/settings/NotificationsSettingsPanel.jsx
import React from "react";
import SettingRow from "./SettingRow";
import ToggleSwitch from "./ToggleSwitch";

export default function NotificationsSettingsPanel({ prefs, updatePref }) {
  return (
    <section className="settings-panel">
      <h2>Notifications</h2>
      <p className="muted">Choose how BlogApp keeps you updated about posts and activity.</p>

      <div className="settings-card">
        <SettingRow
          icon={"📣"}
          title="Admin announcements"
          subtitle="News, feature updates, and important messages from BlogApp."
          right={<ToggleSwitch checked={!!prefs.notifyAdminAnnouncements} onChange={(v) => updatePref("notifyAdminAnnouncements", v)} />}
        />

        <SettingRow
          icon={"💬"}
          title="Comments on my posts"
          subtitle="Get notified when someone comments on your posts."
          right={<ToggleSwitch checked={!!prefs.notifyComments} onChange={(v) => updatePref("notifyComments", v)} />}
        />

        <div className="form-row">
          <label>Email digest</label>
          <select value={prefs.notifyEmailDigest || "off"} onChange={(e) => updatePref("notifyEmailDigest", e.target.value)}>
            <option value="off">Off</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div className="settings-footer">
          <button className="btn primary" onClick={() => alert("Use Save on the right to save all changes (or Save changes button below).")}>Save changes</button>
        </div>
      </div>
    </section>
  );
}
