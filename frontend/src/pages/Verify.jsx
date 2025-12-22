// src/pages/Verify.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function Verify() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function run() {
      try {
        const res = await api.get(`/api/auth/verify/${token}`);

        if (res.data.status === "ok") {
          setStatus("ok");
        } else {
          setStatus("fail");
        }

      } catch (err) {
        const code = err?.response?.data?.error;
        if (code === "expired") setStatus("expired");
        else setStatus("fail");
      }
    }
    run();
  }, [token]);

  if (status === "loading") return (
    <div className="container page"><h2>Verifying…</h2></div>
  );

  if (status === "ok") return (
    <div className="container page">
      <h2>Email verified ✔</h2>
      <p>Your email has been verified. You may now login.</p>
      <Link className="btn" to="/login">Go to Login</Link>
    </div>
  );

  return (
    <div className="container page">
      <h2>Verification failed ❌</h2>
      <p>Token invalid or expired.</p>
      <Link className="btn" to="/resend-verification">Resend verification</Link>
    </div>
  );
}
