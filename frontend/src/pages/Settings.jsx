// src/pages/Settings.jsx
import React, { useState } from "react";
import { useSettingsPrefs } from "../hooks/useSettingsPrefs";
import { useAuth } from "../hooks/useAuth";

import GeneralSettingsPanel from "../components/settings/GeneralSettingsPanel";
import ProfileSettingsPanel from "../components/settings/ProfileSettingsPanel";
import NotificationsSettingsPanel from "../components/settings/NotificationsSettingsPanel";
import AppearanceSettingsPanel from "../components/settings/AppearanceSettingsPanel";
import HelpFeedbackPanel from "../components/settings/HelpFeedbackPanel";
import AccountSettingsPanel from "../components/settings/AccountSettingsPanel";
import PrivacySettingsPanel from "../components/settings/PrivacySettingsPanel";

import "../styles/settings.css"; // ✅ relative path

const SIDEBAR = [
  { key: "general", label: "General" },
  { key: "account", label: "Account" },
  { key: "profile", label: "Profile" },
  { key: "notifications", label: "Notifications" },
  { key: "appearance", label: "Appearance" },
  { key: "privacy", label: "Privacy" },
  { key: "help", label: "Help & feedback" },
];

export default function Settings() {
  const [selected, setSelected] = useState("general");
  const { prefs, updatePref, saveToServer, loading, saving } =
    useSettingsPrefs();

  // Get real logged-in user; fall back to Admin if undefined
  const { user } = useAuth() || {};
  const currentUser = user || { name: "Admin", email: "admin@local" };
  const initialLetter = (currentUser.name || "A").charAt(0).toUpperCase();

  const onSave = async () => {
    try {
      await saveToServer();
      alert("Saved to server ✅");
    } catch (e) {
      alert(
        "Save failed (server may be down). Your latest settings are still stored in this browser."
      );
    }
  };

  const resetLocal = () => {
    localStorage.removeItem("blogapp:prefs");
    window.location.reload();
  };

  const renderPanel = () => {
    switch (selected) {
      case "general":
        return <GeneralSettingsPanel prefs={prefs} updatePref={updatePref} />;

      case "account":
        return <AccountSettingsPanel />;

      case "profile":
        return <ProfileSettingsPanel />;

      case "notifications":
        return (
          <NotificationsSettingsPanel prefs={prefs} updatePref={updatePref} />
        );

      case "appearance":
        return (
          <AppearanceSettingsPanel prefs={prefs} updatePref={updatePref} />
        );

      case "privacy":
        return <PrivacySettingsPanel />;

      case "help":
        return <HelpFeedbackPanel />;

      default:
        return <div className="settings-panel">Choose a section</div>;
    }
  };

  return (
    <main className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <p className="muted">
          All preferences here are stored for your BlogApp account. Some are
          stored on this device, others on the server.
        </p>
      </header>

      <section className="settings-shell">
        {/* LEFT SIDE: avatar + tabs */}
        <aside className="settings-sidebar">
          {/* Avatar + name + email at the top */}
          <div className="settings-user-header">
            <div className="settings-avatar-circle">{initialLetter}</div>
            <div className="settings-user-text">
              <div className="settings-user-name">
                {currentUser.name || "Admin"}
              </div>
              <div className="settings-user-email">
                {currentUser.email || "admin@local"}
              </div>
            </div>
          </div>

          {/* Tabs list – one below another */}
          <nav className="settings-tabs-column">
            {SIDEBAR.map((s) => (
              <button
                key={s.key}
                className={
                  "settings-tab-pill" +
                  (s.key === selected ? " settings-tab-pill-active" : "")
                }
                onClick={() => setSelected(s.key)}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* RIGHT SIDE: active panel */}
        <section className="settings-main">
          <div className="settings-main-card">
            {loading ? (
              <p className="muted">Loading preferences…</p>
            ) : (
              renderPanel()
            )}

            <div className="settings-actions">
              <button className="btn secondary" onClick={resetLocal}>
                Reset local
              </button>
              <button
                className="btn primary"
                onClick={onSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
