// src/components/settings/GeneralSettingsPanel.jsx
import React from "react";
import SettingRow from "./SettingRow";
import ToggleSwitch from "./ToggleSwitch";

export default function GeneralSettingsPanel({ prefs, updatePref }) {
  if (!prefs) return null; // defensive

  return (
    <section className="settings-panel">
      <h2>General</h2>
      <p className="muted">Basic behaviour of BlogApp on this device.</p>

      <div className="settings-card">
        <SettingRow
          icon={"💻"}
          title="Start BlogApp at login"
          subtitle="Remember this browser and show BlogApp when you sign in."
          right={<ToggleSwitch checked={!!prefs.startAtLogin} onChange={(v) => updatePref("startAtLogin", v)} />}
        />

        <hr className="sep" />

        <SettingRow
          icon={"🌐"}
          title="App language"
          subtitle="Using your system language by default."
          right={<span className="muted">System default</span>}
        />

        <hr className="sep" />

        <SettingRow
          icon={"😄"}
          title="Smart emoji"
          subtitle={<>Replace :) and {"<3"} with emoji while you write posts and comments.</>}
          right={<ToggleSwitch checked={!!prefs.emojiReplace} onChange={(v) => updatePref("emojiReplace", v)} />}
        />

        <SettingRow
          icon={"📝"}
          title="Warn before closing editor"
          subtitle="Ask before leaving a page with unsaved changes."
          right={<ToggleSwitch checked={!!prefs.editorConfirm} onChange={(v) => updatePref("editorConfirm", v)} />}
        />
      </div>
    </section>
  );
}
