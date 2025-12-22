// src/components/settings/HelpFeedbackPanel.jsx
import React, { useState } from "react";
import { api } from "../../api";

export default function HelpFeedbackPanel() {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    if (!text.trim()) { alert("Write something first"); return; }
    setSending(true);
    try {
      await api.post("/feedback", { message: text });
      alert("Thanks — feedback sent");
      setText("");
    } catch (e) {
      alert("Feedback not sent to server (backend may be offline). Your feedback remains local.");
      console.warn(e);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="settings-panel">
      <h2>Help & feedback</h2>
      <p className="muted">Found a bug or have an idea? Tell us what you think.</p>

      <div className="settings-card">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe your issue or suggestion…" className="settings-feedback-input" rows={5} />
        <div className="settings-footer">
          <button className="btn primary" onClick={send} disabled={sending}>
            {sending ? "Sending…" : "Send feedback"}
          </button>
        </div>
      </div>
    </section>
  );
}
