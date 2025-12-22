// src/pages/Series.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Series() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  // fallback image generator for a slug
  const fallbackFor = (slug) =>
    `https://source.unsplash.com/1200x600/?${encodeURIComponent(
      slug.replace(/[-_]/g, " ")
    )}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/series");
        // backend may return array or page-like object
        let list = [];
        if (Array.isArray(res.data)) list = res.data;
        else if (res.data && Array.isArray(res.data.content)) list = res.data.content;
        else if (res.data && Array.isArray(res.data.series)) list = res.data.series;
        // guard: map to minimal shape
        const mapped = (list || []).map((s) => {
          const slug = s.slug || s.name?.toLowerCase().replace(/\s+/g, "-") || "";
          const img = s.imageUrl || s.image_url || s.img || fallbackFor(slug);
          return {
            id: s.id,
            slug,
            title: s.name || s.title || slug.replace(/-/g, " "),
            blurb: s.blurb || s.description || "",
            img,
          };
        });
        if (!cancelled) setSeries(mapped);
      } catch (err) {
        console.error("Failed to fetch series", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container page">
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1>Series</h1>
          <p style={{ marginTop: 0 }}>Multi-part stories grouped together.</p>
        </div>
        <Link className="btn" to="/admin/series/new">+ Add series</Link>
      </div>

      {loading && <div className="alert">Loading series…</div>}

      <div className="grid cols-3" style={{ gap: "1rem", marginTop: ".8rem" }}>
        {series.map((s) => (
          <Link
            key={s.slug || s.id}
            to={`/series/${s.slug}`}
            className="card mag-card"
            style={{ padding: 0 }}
          >
            <div className="mag-thumb" style={{ height: 180, overflow: "hidden" }}>
              <img
                src={s.img}
                alt={s.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'><rect width='100%' height='100%' fill='%23eef3fb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='%23707b8a'>No image</text></svg>`;
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div className="mag-card-body">
              <h3 className="mag-title">{s.title}</h3>
              {s.blurb && <p className="small" style={{ marginTop: ".25rem" }}>{s.blurb}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
