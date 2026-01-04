import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function AccountSettingsPanel() {
  const { user } = useAuth();

  if (!user) {
    return (
      <section className="settings-panel">
        <h2>Account</h2>
        <p className="muted">Unable to load account details.</p>
      </section>
    );
  }

  return (
    <section className="settings-panel">
      <h2>Account</h2>
      <p className="muted">
        Login identity and authentication details for your account.
      </p>
     <div className="settings-card account-card">
  {/* Email */}
  <div className="form-row spaced">
    <label>Email</label>
    <div className="static-text">{user.email}</div>
  </div>

  {/* Role */}
  <div className="form-row spaced">
    <label>Role</label>
    <div className="static-text">
      {user.role === "ADMIN" ? "Administrator" : "User"}
    </div>
  </div>

  {/* Account actions */}
  <div className="account-actions">
    <button
      className="btn secondary"
      onClick={() =>
        alert(
          'Use "Forgot password" on the login page to reset your password.'
        )
      }
    >
      Reset password
    </button>
  </div>
</div>    
    </section>
  );
}
