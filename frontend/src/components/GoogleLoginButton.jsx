// src/components/GoogleLoginButton.jsx
import React, { useState } from 'react';

// Accept either VITE_API_URL or VITE_API_BASE; default to 8080
const RAW_BASE =
  (import.meta.env.VITE_API_URL ||
   import.meta.env.VITE_API_BASE ||
   'http://localhost:8080');

// normalize -> no trailing slash
const API_BASE = String(RAW_BASE).replace(/\/+$/, '');

// allow override with VITE_GOOGLE_OAUTH_URL, else build from base
const OAUTH_URL =
  (import.meta.env.VITE_GOOGLE_OAUTH_URL &&
   String(import.meta.env.VITE_GOOGLE_OAUTH_URL).trim()) ||
  `${API_BASE}/oauth2/authorization/google`;

export default function GoogleLoginButton({ className = '', onBeforeRedirect }) {
  const [busy, setBusy] = useState(false);

  const go = () => {
    if (busy) return;
    setBusy(true);
    try { onBeforeRedirect?.(); } catch (_) {}
    // Full page redirect so cookies + OAuth flow work correctly
    window.location.assign(OAUTH_URL);
  };

  return (
    <button
      type="button"
      className={`btn btn-ghost ${className}`}
      onClick={go}
      disabled={busy}
      title="Continue with Google"
      aria-label="Continue with Google"
    >
      {busy ? 'Redirecting…' : 'Continue with Google'}
    </button>
  );
}
