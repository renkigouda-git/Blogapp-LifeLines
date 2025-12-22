import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setMsg("");
    setErr("");

    if (!password || !confirm) {
      setErr("Both fields are required.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }

    try {
      setBusy(true);
      await api.post(`/api/password/reset/${token}`, { password });
      setMsg("Password updated successfully. Redirecting…");
      setTimeout(() => nav("/login"), 1500);
    } catch (e) {
      setErr("Invalid or expired reset token.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page fade-in" style={{ maxWidth: 520 }}>
      <h2>Reset password</h2>
      <p className="small">Set a new password for your account.</p>

      <input
        className="input"
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginTop: ".6rem" }}
      />

      <input
        className="input"
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        style={{ marginTop: ".6rem" }}
      />

      <button
        className="btn"
        onClick={submit}
        disabled={busy}
        style={{ marginTop: ".8rem" }}
      >
        {busy ? "Resetting…" : "Reset password"}
      </button>

      {msg && (
        <p className="small" style={{ color: "var(--success)", marginTop: ".6rem" }}>
          {msg}
        </p>
      )}

      {err && (
        <p className="small" style={{ color: "var(--danger)", marginTop: ".6rem" }}>
          {err}
        </p>
      )}
    </div>
  );
}
