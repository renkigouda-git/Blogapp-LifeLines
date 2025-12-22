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
    "live.com"
  ];

  const [name, domainPart] = value.split("@");

  if (!name) return null;

  // Prevent blank suggestion box
  if (domainPart && domains.every(d => !d.startsWith(domainPart))) return null;

  const suggestions = domains
    .filter((d) => d.startsWith(domainPart || ""))
    .map((d) => `${name}@${d}`);

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
