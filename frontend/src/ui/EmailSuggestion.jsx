import React from "react";
import "./EmailSuggestion.css";

export default function EmailSuggestion({ value = "", onSelect }) {
  if (!value.includes("@")) return null;

  const domains = [
    "gmail.com",
    "outlook.com",
    "yahoo.com",
    "hotmail.com",
    "icloud.com",
    "protonmail.com",
    "zoho.com",
    "live.com",
  ];

  const [name, domainPart = ""] = value.split("@");

  if (!name) return null;

  // ✅ IMPORTANT FIX:
  // If user already typed a FULL valid domain → no suggestions
  if (domains.includes(domainPart)) return null;

  const suggestions = domains
    .filter((d) => d.startsWith(domainPart))
    .map((d) => `${name}@${d}`);

  if (suggestions.length === 0) return null;

  return (
    <div className="email-suggest-box">
      {suggestions.map((s) => (
        <div
          key={s}
          className="email-suggest-item"
          onClick={() => onSelect(s)}
        >
          {s}
        </div>
      ))}
    </div>
  );
}
