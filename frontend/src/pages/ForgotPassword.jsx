// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { api } from "../api";
import DevLinkPopup from "../components/DevLinkPopup.jsx";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const isDev = import.meta.env.DEV;
  const [devResetLink, setDevResetLink] = useState("");

  const submit = async (e) => {
    e?.preventDefault?.();
    setMsg("");
    setErr("");
    setDevResetLink("");

    if (!email.trim()) {
      setErr("Email is required.");
      return;
    }

    setBusy(true);
    try {
      const res = await api.post("/api/password/forgot", { email });

      setMsg(res.data.message || "If your email exists, a reset link was sent.");

      // ⭐ DEV: show reset link
      if (isDev && res.data?.resetLink) {
        setDevResetLink(res.data.resetLink);
      }

    } catch (e) {
      setErr("Server error while sending reset link.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page fade-in" style={{ maxWidth: 520 }}>
      <h2>Forgot password</h2>
      <p className="small">Enter your account email. We will send a reset link if available.</p>

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
        {busy ? "Sending…" : "Send reset link"}
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

      {/* ⭐ DEV MODE RESET LINK POPUP */}
      {isDev && devResetLink && (
        <DevLinkPopup title="DEV Reset Link" link={devResetLink} />
      )}
    </div>
  );
}
