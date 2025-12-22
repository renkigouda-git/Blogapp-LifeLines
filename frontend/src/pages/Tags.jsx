// src/pages/Tags.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackFor = (slug) =>
    `https://source.unsplash.com/800x480/?${encodeURIComponent(slug.replace(/[-_]/g, " "))}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/tags");
        let list = [];
        if (Array.isArray(res.data)) list = res.data;
        else if (res.data && Array.isArray(res.data.content)) list = res.data.content;
        else if (res.data && Array.isArray(res.data.tags)) list = res.data.tags;

        const mapped = (list || []).map((t) => {
          const slug = t.slug || t.name?.toLowerCase().replace(/\s+/g, "-") || "";
          const img = t.imageUrl || t.image_url || t.img || fallbackFor(slug);
          return {
            id: t.id,
            slug,
            label: t.name || t.label || slug.replace(/-/g, " "),
            img,
          };
        });
        if (!cancelled) setTags(mapped);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="container page">
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1>Tags</h1>
          <p style={{ marginTop: 0 }}>Explore posts by topic.</p>
        </div>
        <Link className="btn" to="/admin/tags/new">+ Add tag</Link>
      </div>

      {loading && <div className="alert">Loading tags…</div>}

      <div className="grid cols-3" style={{ marginTop: ".8rem" }}>
        {tags.map((t) => (
          <Link to={`/tag/${t.slug}`} key={t.slug || t.id} className="card mag-card" style={{ padding: 0 }}>
            <div className="mag-thumb" style={{ height: 180, overflow: "hidden" }}>
              <img
                src={t.img}
                alt={t.label}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='480'><rect width='100%' height='100%' fill='%23eef3fb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='%23707b8a'>No image</text></svg>`;
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div className="mag-card-body">
              <h3 className="mag-title">#{t.label}</h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
