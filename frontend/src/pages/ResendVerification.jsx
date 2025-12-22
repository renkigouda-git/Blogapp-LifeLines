import React, { useState } from "react";
import api from "../api";
import DevLinkPopup from "../components/DevLinkPopup.jsx";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [devLink, setDevLink] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setDevLink("");

    if (!email.trim()) {
      setErr("Email is required.");
      return;
    }

    setBusy(true);

    try {
      const res = await api.post(
        "/api/auth/resend-verification",
        { email },
        { headers: { "x-skip-auth-redirect": "1" } }   // ⭐ FIXED
      );

      setMsg("If that email exists, a verification link has been sent.");

      if (import.meta.env.DEV && res.data.verifyUrl) {
        setDevLink(res.data.verifyUrl);
      }

    } catch (error) {
      const code = error?.response?.data?.error;

      if (code === "already-verified") {
        setErr("Your account is already verified.");
      } else {
        setErr("Unable to resend verification. Try again later.");
      }

    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page fade-in" style={{ maxWidth: 520 }}>
      <h2>Resend verification</h2>

      <input
        className="input"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginTop: ".6rem" }}
      />

      <button className="btn" onClick={submit} disabled={busy} style={{ marginTop: ".8rem" }}>
        {busy ? "Sending…" : "Resend"}
      </button>

      {msg && <p className="small" style={{ color: "var(--success)", marginTop: ".6rem" }}>{msg}</p>}
      {err && <p className="small" style={{ color: "var(--danger)", marginTop: ".6rem" }}>{err}</p>}

      {import.meta.env.DEV && devLink && (
        <DevLinkPopup title="DEV Verify Link" link={devLink} />
      )}
    </div>
  );
}
