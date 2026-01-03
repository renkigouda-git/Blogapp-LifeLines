// src/pages/Verify.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import OtpInput from "../ui/OtpInput.jsx";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // email | otp | success
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // resend timer
  const [cooldown, setCooldown] = useState(0);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (cooldown <= 0) return;

    const t = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [cooldown]);

  /* ---------------- SEND OTP ---------------- */
  const sendOtp = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!email.trim()) {
      setErr("Email is required.");
      return;
    }

    try {
      setBusy(true);
      await api.post("/api/auth/verify-otp/send", { email });
      setMsg("OTP sent to your email.");
      setStep("otp");
      setCooldown(30); // ⏱ 30 seconds
    } catch {
      setErr("Unable to send OTP. Try again later.");
    } finally {
      setBusy(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtp = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!otp.trim()) {
      setErr("OTP is required.");
      return;
    }

    try {
      setBusy(true);
      await api.post("/api/auth/verify-otp/confirm", {
        email,
        otp,
      });
      setStep("success");
    } catch {
      setErr("Invalid or expired OTP.");
    } finally {
      setBusy(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const resendOtp = async () => {
    if (cooldown > 0) return;

    setErr("");
    setMsg("");

    try {
      setBusy(true);
      await api.post("/api/auth/verify-otp/send", { email });
      setMsg("OTP resent to your email.");
      setCooldown(30);
    } catch {
      setErr("Unable to resend OTP.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 420 }}>
      <h2>Email Verification</h2>

      {/* STEP 1: EMAIL */}
      {step === "email" && (
        <form onSubmit={sendOtp}>
          <input
            className="input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
          />

          <button
            className="btn btn-primary"
            disabled={busy}
            style={{ marginTop: ".6rem" }}
          >
            {busy ? "Sending…" : "Send OTP"}
          </button>
        </form>
      )}

      {/* STEP 2: OTP */}
      {step === "otp" && (
        <form onSubmit={verifyOtp}>
          <p className="small">
            Enter the OTP sent to <strong>{email}</strong>
          </p>

          <OtpInput value={otp} onChange={setOtp} />

          <button
            className="btn btn-primary"
            disabled={busy}
            style={{ marginTop: ".6rem" }}
          >
            {busy ? "Verifying…" : "Verify OTP"}
          </button>

          <div style={{ marginTop: ".6rem" }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={resendOtp}
              disabled={cooldown > 0 || busy}
            >
              {cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : "Resend OTP"}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: SUCCESS */}
      {step === "success" && (
        <>
          <p>Email verified successfully ✔</p>
          <Link className="btn" to="/login">
            Go to Login
          </Link>
        </>
      )}

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
