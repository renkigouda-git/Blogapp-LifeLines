import React from "react";
import "./PasswordStrengthBar.css";

export default function PasswordStrengthBar({ password = "" }) {
  const getStrength = () => {
    let score = 0;

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>~+=_\-]/.test(password)) score++;

    return score; // 0 → 5
  };

  const score = getStrength();

  const strengthLabel = [
    "Too Weak",
    "Weak",
    "Medium",
    "Strong",
    "Very Strong",
  ][score] || "Too Weak";

  return (
    <div className="psb-wrapper">
      <div className="psb-bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`psb-bar ${score >= i ? `level-${i}` : ""}`}
          />
        ))}
      </div>
      {password && (
        <div className="psb-label">
          {strengthLabel}
        </div>
      )}
    </div>
  );
}
