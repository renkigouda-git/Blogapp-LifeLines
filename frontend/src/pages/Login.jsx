// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";

// UI Components
import EmailSuggestion from "../ui/EmailSuggestion.jsx";
import FloatingInput from "../ui/FloatingInput.jsx";
import Tooltip from "../ui/Tooltip.jsx";
import PasswordStrengthBar from "../ui/PasswordStrengthBar.jsx";

export default function Login() {
  const { login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // ✅ Backend-compatible email validation
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // allow ANY domain
    if (!regex.test(email)) return "Enter a valid email address.";
    return "";
  }

  const isEmail = emailOrUsername.includes("@");
  const emailError = isEmail ? validateEmail(emailOrUsername) : "";

  const allValid = emailOrUsername.trim() && password.trim();

  const submit = async (e) => {
    e.preventDefault();
    if (!allValid || loading) return;

    setError("");
    setSuccess("");

    // Backend accepts only email, not username
    if (!emailOrUsername.includes("@")) {
      setError("Use email to login.");
      return;
    }

    // If email looks invalid, do NOT block request completely
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      setLoading(true);

      const res = await login(emailOrUsername.trim(), password.trim());

      if (res?.token) {
        setSuccess("Login successful! Redirecting…");
        setTimeout(() => nav("/dashboard"), 700);
      } else {
        setError("Invalid email or password.");
      }

    } catch (err) {
      const backendError = err?.response?.data?.error;

      // ⭐ HANDLE verify-email / email-not-verified (from backend)
      if (
        err?.response?.status === 403 &&
        (backendError === "verify-email" || backendError === "email-not-verified")
      ) {
        setError("Please verify your email first.");
        return;
      }

      // default error
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 560 }}>
      <h2>Login</h2>

      {/* Email Input */}
      <FloatingInput
        label="Email"
        value={emailOrUsername}
        onChange={(e) => {
          setEmailOrUsername(e.target.value.toLowerCase());
          setError("");
          setSuccess("");
        }}
      />

      {isEmail && emailError && (
        <p className="small" style={{ color: "var(--danger)" }}>
          {emailError}
        </p>
      )}

      <EmailSuggestion value={emailOrUsername} onSelect={setEmailOrUsername} />

      {/* Password */}
      <div style={{ marginTop: ".6rem", display: "flex", alignItems: "center" }}>
        <FloatingInput
          label="Password"
          type={showPwd ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
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

      {/* Login + Google */}
      <div
        className="flex"
        style={{ gap: ".6rem", marginTop: ".8rem", alignItems: "center" }}
      >
        <button
          className="btn btn-primary"
          onClick={submit}
          disabled={!allValid || loading}
        >
          {loading ? "Logging in…" : "Login"}
        </button>

        <GoogleLoginButton />
      </div>

      {error && (
        <p className="small" style={{ color: "var(--danger)", marginTop: ".6rem" }}>
          {error}
        </p>
      )}
      {success && (
        <p className="small" style={{ color: "var(--success)", marginTop: ".6rem" }}>
          {success}
        </p>
      )}

      <p className="small" style={{ marginTop: ".6rem" }}>
        <Link className="link" to="/forgot-password">
          Forgot password?
        </Link>{" "}
        ・{" "}
        <Link className="link" to="/resend-verification">
          Resend verification
        </Link>
      </p>

      <p className="small" style={{ marginTop: ".6rem" }}>
        No account? <Link className="link" to="/register">Create one</Link>
      </p>
    </div>
  );
}
