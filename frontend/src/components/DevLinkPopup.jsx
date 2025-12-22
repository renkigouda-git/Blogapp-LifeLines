import React from "react";

export default function DevLinkPopup({ title, link }) {
  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "1rem",
        background: "rgba(0,0,0,0.5)",
        border: "1px solid var(--info)",
        borderRadius: "8px",
        color: "var(--info)",
        fontSize: "0.9rem",
        wordBreak: "break-all"
      }}
    >
      <strong>{title}</strong>
      <br />
      <a className="link" href={link}>{link}</a>
    </div>
  );
}
