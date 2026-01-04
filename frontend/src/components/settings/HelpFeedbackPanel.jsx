// src/components/settings/HelpFeedbackPanel.jsx
import React, { useState } from "react";
import { api } from "../../api";

export default function HelpFeedbackPanel() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const sendFeedback = async () => {
    if (!message.trim()) {
      alert("Please write your message before sending.");
      return;
    }

    setSending(true);
    try {
      await api.post("/contact", {
        message,
      });
      alert("Thanks for your feedback! 🙌");
      setMessage("");
    } catch (e) {
      alert(
        "Could not send feedback to server. Please try again later."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="settings-panel">
      <h2>Help & feedback</h2>
      <p className="muted">
        Found a bug, have a question, or an idea to improve BlogApp?
        Let us know.
      </p>

      <div className="settings-card">
        <div className="form-row">
          <label>Your message</label>
          <textarea
            className="settings-feedback-input"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue, suggestion, or feedback…"
          />
        </div>

        <div className="settings-footer">
          <button
            className="btn primary"
            onClick={sendFeedback}
            disabled={sending}
          >
            {sending ? "Sending…" : "Send feedback"}
          </button>
        </div>
      </div>
    </section>
  );
}
