// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e?.preventDefault?.();
    setMsg("");
    setErr("");

    if (!email.trim()) {
      setErr("Email is required.");
      return;
    }

    setBusy(true);
    try {
      const res = await api.post("/api/password/forgot", { email });

      setMsg("If your email exists, an OTP has been sent.");
      setTimeout(() => navigate("/reset-password", { state: { email } }), 800);

    } catch (e) {
      setErr("Server error while sending reset link.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page fade-in" style={{ maxWidth: 520 }}>
      <h2>Forgot password</h2>
      <p className="small">Enter your account email. We will send an OTP if available.</p>
      <input
        className="input"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginTop: ".6rem" }}
      />

      <button
        className="btn"
        onClick={submit}
        disabled={busy}
        style={{ marginTop: ".8rem" }}
      >
        {busy ? "Sending…" : "Send OTP"}
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
