// src/components/settings/NotificationsSettingsPanel.jsx
import React from "react";
import SettingRow from "./SettingRow";
import ToggleSwitch from "./ToggleSwitch";

export default function NotificationsSettingsPanel({ prefs, updatePref }) {
  if (!prefs) return null;

  return (
    <section className="settings-panel">
      <h2>Notifications</h2>
      <p className="muted">
        Control how BlogApp notifies you about activity and updates.
      </p>

      <div className="settings-card">

        {/* Admin announcements */}
        <SettingRow
          icon="📣"
          title="Admin announcements"
          subtitle="Important updates, feature releases, and system notices."
          right={
            <ToggleSwitch
              checked={!!prefs.notifyAdminAnnouncements}
              onChange={(v) =>
                updatePref("notifyAdminAnnouncements", v)
              }
            />
          }
        />

        <hr className="settings-separator" />

        {/* Comment notifications */}
        <SettingRow
          icon="💬"
          title="Comments on my posts"
          subtitle="Get notified when someone comments on your posts."
          right={
            <ToggleSwitch
              checked={!!prefs.notifyComments}
              onChange={(v) => updatePref("notifyComments", v)}
            />
          }
        />

        <hr className="settings-separator" />

        {/* Email summary */}
        <div className="form-row">
          <label>Email summary</label>

          <select
            value={prefs.notifyEmailDigest || "off"}
            onChange={(e) =>
              updatePref("notifyEmailDigest", e.target.value)
            }
          >
            <option value="off">Off</option>
            <option value="daily">Daily summary</option>
            <option value="weekly">Weekly summary</option>
          </select>

          <span className="muted small">
            You’ll receive one email summarizing recent activity instead of multiple notifications.
          </span>
        </div>

        <div className="settings-footer">
          <span className="muted small">
            Changes take effect after clicking <b>Save changes</b>.
          </span>
        </div>
      </div>
    </section>
  );
}
