// src/components/settings/AppearanceSettingsPanel.jsx
import React from "react";

export default function AppearanceSettingsPanel({ prefs, updatePref }) {
  return (
    <section className="settings-panel">
      <h2>Appearance</h2>
      <p className="muted">Pick the look and feel of BlogApp.</p>

      <div className="settings-card">
        <div className="form-row">
          <label>App theme</label>
          <select value={prefs.appTheme} onChange={(e) => updatePref("appTheme", e.target.value)}>
            <option value="system">Match system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="form-row">
          <label>Card density</label>
          <select value={prefs.cardDensity} onChange={(e) => updatePref("cardDensity", e.target.value)}>
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </div>

        <div className="settings-footer">
          <button className="btn primary" onClick={() => alert("Appearance changes are applied locally. Click Save to persist to server.")}>Apply</button>
        </div>
      </div>
    </section>
  );
}
