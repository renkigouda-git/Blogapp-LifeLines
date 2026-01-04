// src/components/settings/AppearanceSettingsPanel.jsx
import React from "react";
import { useAppearancePrefs } from "../../hooks/useAppearancePrefs";

export default function AppearanceSettingsPanel() {
  const { prefs, updatePref } = useAppearancePrefs();

  if (!prefs) return null;

  return (
    <section className="settings-panel">
      <h2>Appearance</h2>
      <p className="muted">
        Customize how BlogApp looks on this device.
      </p>

      <div className="settings-card">

        <div className="form-row">
          <label>App theme</label>
          <select
            value={prefs.appTheme}
            onChange={(e) => updatePref("appTheme", e.target.value)}
          >
            <option value="system">Match system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <hr className="sep" />

        <div className="form-row">
          <label>Card density</label>
          <select
            value={prefs.cardDensity}
            onChange={(e) =>
              updatePref("cardDensity", e.target.value)
            }
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </div>

        <hr className="sep" />

        <div className="form-row">
          <label>Interface animations</label>
          <select
            value={prefs.animationsEnabled ? "on" : "off"}
            onChange={(e) =>
              updatePref("animationsEnabled", e.target.value === "on")
            }
          >
            <option value="on">Enabled</option>
            <option value="off">Disabled</option>
          </select>
        </div>

      </div>
    </section>
  );
}
