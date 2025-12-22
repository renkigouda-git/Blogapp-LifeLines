// src/components/VerifyBanner.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function VerifyBanner({ user }) {
  // user comes from auth context; assumes user.banned === true if not verified
  if (!user || !user.banned) return null;

  return (
    <div
      style={{
        background: "var(--danger)",
        color: "#fff",
        padding: "10px",
        textAlign: "center",
        fontWeight: "bold",
      }}
    >
      Your email is not verified.{" "}
      <Link
        to="/resend-verification"
        style={{ color: "#fff", textDecoration: "underline" }}
      >
        Resend verification email
      </Link>
    </div>
  );
}
