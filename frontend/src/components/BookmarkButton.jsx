// src/components/BookmarkButton.jsx
import React, { useEffect, useState } from "react";

function readSaved() {
  try {
    const s = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    return Array.isArray(s) ? s : [];
  } catch {
    return [];
  }
}

export default function BookmarkButton({ post, large = false }) {
  // post: { id, title, summary, coverImageUrl }
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const list = readSaved();
    setSaved(list.some((it) => String(it.id) === String(post.id)));
  }, [post.id]);

  function toggle() {
    const list = readSaved();
    const exists = list.find((it) => String(it.id) === String(post.id));
    let next;
    if (exists) {
      next = list.filter((it) => String(it.id) !== String(post.id));
      setSaved(false);
    } else {
      // keep title/summary/cover when available
      const entry = {
        id: post.id,
        title: post.title || "",
        summary: post.summary || "",
        coverImageUrl: post.coverImageUrl || null,
      };
      next = [entry, ...list];
      setSaved(true);
    }
    try {
      localStorage.setItem("bookmarks", JSON.stringify(next));
      // also emit storage event for same-tab listeners
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Saving bookmark failed", e);
    }
  }

  return (
    <button
      className={`btn btn-ghost ${large ? "bookmark-large" : ""}`}
      onClick={toggle}
      aria-pressed={saved}
      title={saved ? "Remove bookmark" : "Save bookmark"}
    >
      {saved ? "★ Saved" : "☆ Save"}
    </button>
  );
}
