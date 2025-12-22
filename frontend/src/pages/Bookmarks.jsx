// src/pages/Bookmarks.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api"; // optional enrichment

export default function Bookmarks() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    readFromStorage();
    // keep in sync with other tabs
    const onStorage = (e) => {
      if (e.key === "bookmarks") readFromStorage();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function parseSaved() {
    try {
      const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  async function enrichBookmarksIfNeeded(list, signal) {
    const needs = list.filter((it) => !it.coverImageUrl && it.id);
    if (needs.length === 0) return list;
    const results = await Promise.all(
      needs.map(async (it) => {
        try {
          const r = await api.get(`/api/posts/${it.id}`);
          if (signal?.aborted) return it;
          if (r?.data) {
            const p = r.data;
            return {
              ...it,
              title: it.title || p.title,
              summary: it.summary || (p.content || "").slice(0, 140),
              coverImageUrl: p.coverImageUrl || it.coverImageUrl || null,
            };
          }
        } catch {
          // ignore
        }
        return it;
      })
    );
    const byId = {};
    for (const r of results) byId[String(r.id)] = r;
    const merged = list.map((it) => (byId[String(it.id)] ? byId[String(it.id)] : it));
    return merged;
  }

  async function readFromStorage() {
    const saved = parseSaved();
    setItems(saved);

    const controller = new AbortController();
    const signal = controller.signal;
    try {
      const enriched = await enrichBookmarksIfNeeded(saved, signal);
      if (!signal.aborted) {
        setItems(enriched);
        try {
          localStorage.setItem("bookmarks", JSON.stringify(enriched));
        } catch {}
      }
    } catch {}
    return () => controller.abort();
  }

  function remove(id) {
    const next = items.filter((x) => String(x.id) !== String(id));
    setItems(next);
    localStorage.setItem("bookmarks", JSON.stringify(next));
  }

  return (
    <main className="container page">
      <h1>Bookmarks</h1>
      <p>Your saved reading list.</p>

      {items.length === 0 && (
        <div className="card empty">
          <p>No bookmarks yet.</p>
          <Link to="/posts" className="btn btn-primary">
            Browse posts
          </Link>
        </div>
      )}

      <div className="bookmark-list" style={{ display: "grid", gap: "1rem" }}>
        {items.map((b) => (
          <div
            className="card bookmark-card"
            key={b.id}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {b.coverImageUrl ? (
              <div
                className="thumb"
                style={{
                  width: 120,
                  height: 80,
                  overflow: "hidden",
                  borderRadius: 12,
                  background: "#0002",
                }}
              >
                <img
                  src={b.coverImageUrl}
                  alt={b.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "";
                  }}
                />
              </div>
            ) : (
              <div style={{ width: 120 }} />
            )}

            <div>
              <h3 style={{ margin: "0 0 .25rem" }}>{b.title}</h3>
              {b.summary && (
                <p className="small" style={{ margin: "0 0 .5rem" }}>
                  {b.summary}
                </p>
              )}

              <div className="flex gap">
                <Link className="btn btn-primary" to={`/posts/${b.id}`}>
                  Read
                </Link>
                <button className="btn btn-ghost" onClick={() => remove(b.id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
