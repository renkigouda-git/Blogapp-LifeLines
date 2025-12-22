// src/components/settings/AccountSettingsPanel.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../api";

export default function AccountSettingsPanel() {
  const [data, setData] = useState({
    displayName: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("/me/profile")
      .then((res) => {
        if (!mounted || !res?.data) return;
        setData({
          displayName: res.data.displayName,
          email: res.data.email,
        });
      })
      .catch((e) => {
        console.warn("Account panel: failed to load profile", e);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="settings-panel">
        <h2>Account</h2>
        <p className="muted">Basic identity & login details.</p>
        <p>Loading…</p>
      </section>
    );
  }

  return (
    <section className="settings-panel">
      <h2>Account</h2>
      <p className="muted">
        Basic identity & login details for your BlogApp account.
      </p>

      <div className="settings-card">
        <div className="form-row">
          <label>Display name</label>
          <input value={data.displayName} readOnly />
          <span className="muted small">Change this in the Profile tab.</span>
        </div>

        <div className="form-row">
          <label>Email</label>
          <input value={data.email} readOnly />
          <span className="muted small">
            Used for login and notifications. Email change is not enabled in
            this demo.
          </span>
        </div>

        <div className="settings-footer">
          <button
            type="button"
            className="btn secondary"
            onClick={() => alert('To change password, use "Forgot password" on login.')}
          >
            Manage password
          </button>
        </div>
      </div>
    </section>
  );
}
