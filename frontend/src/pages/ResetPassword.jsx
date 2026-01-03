// src/pages/ResetPassword.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";
import PasswordStrengthBar from "../ui/PasswordStrengthBar.jsx";
import OtpInput from "../ui/OtpInput.jsx";

export default function ResetPassword() {
  const location = useLocation();
  const email = location.state?.email || "";
  const nav = useNavigate();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false); // 👁️ NEW
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // 🔁 resend timer
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // ⏱ countdown logic
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  // 🔁 resend OTP
  const resendOtp = async () => {
    try {
      setCanResend(false);
      setTimer(30);
      await api.post("/api/password/forgot", { email });
      setMsg("OTP resent to your email.");
      setErr("");
    } catch {
      setErr("Unable to resend OTP.");
    }
  };

  // ✅ submit reset
  const submit = async () => {
    setErr("");
    setMsg("");

    if (!otp.trim()) {
      setErr("OTP is required.");
      return;
    }
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
      await api.post("/api/password/verify-otp", { email, otp });
      await api.post("/api/password/reset", { email, password });

      setMsg("Password updated successfully. Redirecting…");
      setTimeout(() => nav("/login"), 1500);
    } catch {
      setErr("Invalid or expired OTP.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page fade-in" style={{ maxWidth: 520 }}>
      <h2>Reset password</h2>
      <p className="small">Set a new password for your account.</p>

      {/* OTP */}
      <OtpInput value={otp} onChange={setOtp} />

      {/* NEW PASSWORD */}
      <div style={{ marginTop: ".6rem", display: "flex", alignItems: "center" }}>
        <input
          className="input"
          type={showPwd ? "text" : "password"}
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setShowPwd(!showPwd)}
          style={{ marginLeft: 8 }}
        >
          {showPwd ? "Hide" : "Show"}
        </button>
      </div>
      <PasswordStrengthBar password={password} />
      {/* CONFIRM PASSWORD */}
      <input
        className="input"
        type={showPwd ? "text" : "password"}
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        style={{ marginTop: ".6rem" }}
      />

      <button
        className="btn btn-primary"
        onClick={submit}
        disabled={busy}
        style={{ marginTop: ".8rem" }}
      >
        {busy ? "Resetting…" : "Reset password"}
      </button>

      {/* ⏱ RESEND */}
      <div style={{ marginTop: ".6rem" }}>
        {canResend ? (
          <button className="btn btn-ghost" onClick={resendOtp}>
            Resend OTP
          </button>
        ) : (
          <p className="small">Resend OTP in {timer}s</p>
        )}
      </div>

      {msg && <p className="small" style={{ color: "var(--success)" }}>{msg}</p>}
      {err && <p className="small" style={{ color: "var(--danger)" }}>{err}</p>}
    </div>
  );
}
