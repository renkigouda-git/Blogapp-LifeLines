// src/pages/Register.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import GoogleLoginButton from "../components/GoogleLoginButton";

// UI Components
import EmailSuggestion from "../ui/EmailSuggestion.jsx";
import FloatingInput from "../ui/FloatingInput.jsx";
import Tooltip from "../ui/Tooltip.jsx";
import PasswordStrengthBar from "../ui/PasswordStrengthBar.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  // ⭐ DEV verify link
  const isDev = import.meta.env.DEV;
  const [devVerifyLink, setDevVerifyLink] = useState("");

  function validateEmail(email) {
    const regex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|icloud|outlook|hotmail|live|protonmail|zoho)\.com$/;
    if (!regex.test(email))
      return "Use a valid email (gmail, yahoo, icloud, outlook, etc.)";
    return "";
  }

  function validatePassword(pwd) {
    if (pwd.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(pwd)) return "Must contain an uppercase letter.";
    if (!/[a-z]/.test(pwd)) return "Must contain a lowercase letter.";
    if (!/[0-9]/.test(pwd)) return "Must contain a number.";
    if (!/[!@#$%^&*(),.?\":{}|<>~+=_\\-]/.test(pwd))
      return "Must contain a special character.";
    return "";
  }

  const emailError = email ? validateEmail(email) : "";
  const pwdError = password ? validatePassword(password) : "";
  const confirmError = confirm && confirm !== password ? "Passwords do not match." : "";

  const allValid =
    name.trim() &&
    email &&
    !emailError &&
    password &&
    !pwdError &&
    confirm &&
    !confirmError;

  const submit = async (e) => {
    e.preventDefault();
    if (!allValid || busy) return;

    setMsg("");
    setDevVerifyLink("");

    try {
      setBusy(true);

      // API call
      const res = await api.post("/api/auth/register", { name, email, password });

      // Success
      setMsg("Account created. Please verify your email.");

      // ⭐ backend sends verifyUrl
      if (isDev && res.data?.verifyUrl) {
        setDevVerifyLink(res.data.verifyUrl);
      }

      // ❌ NO REDIRECT to login
      // User must verify first

    } catch (err) {
      setMsg("Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 560 }}>
      <h2>Create account</h2>

      <form onSubmit={submit}>
        {/* NAME */}
        <FloatingInput
          label="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* EMAIL */}
        <div style={{ marginTop: ".6rem" }}>
          <FloatingInput
            label="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
          />
        </div>

        <EmailSuggestion value={email} onSelect={setEmail} />

        {email && emailError && (
          <p className="small" style={{ color: "var(--danger)" }}>{emailError}</p>
        )}

        {/* PASSWORD */}
        <div style={{ marginTop: ".6rem", display: "flex", alignItems: "center" }}>
          <FloatingInput
            label="Password"
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ flex: 1 }}
          />

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowPwd(!showPwd)}
            style={{ marginLeft: 10 }}
          >
            {showPwd ? "Hide" : "Show"}
          </button>
        </div>

        <PasswordStrengthBar password={password} />

        {password && pwdError && (
          <p className="small" style={{ color: "var(--danger)" }}>{pwdError}</p>
        )}

        {/* CONFIRM PASSWORD */}
        <div style={{ marginTop: ".6rem" }}>
          <FloatingInput
            label="Confirm password"
            type={showPwd ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {confirm && confirmError && (
          <p className="small" style={{ color: "var(--danger)" }}>{confirmError}</p>
        )}

        {/* SUBMIT */}
        <div className="flex" style={{ marginTop: ".8rem" }}>
          <button className="btn btn-primary" disabled={!allValid || busy}>
            {busy ? "Creating…" : "Create account"}
          </button>

          <GoogleLoginButton />
        </div>
      </form>

      {msg && (
        <p className="small" style={{ marginTop: ".6rem" }}>{msg}</p>
      )}

      {/* ⭐ DEV-MODE VERIFY LINK */}
      {isDev && devVerifyLink && (
        <p className="small" style={{ marginTop: ".6rem", color: "cyan" }}>
          <strong>DEV Verify Link:</strong><br />
          <a href={devVerifyLink} style={{ color: "cyan" }}>
            {devVerifyLink}
          </a>
        </p>
      )}

      <p className="small" style={{ marginTop: ".6rem" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
