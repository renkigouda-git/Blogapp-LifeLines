// src/components/PostSeriesTagsEditor.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function PostSeriesTagsEditor({
  postId,
  initialSeriesId = null,
  initialTags = [],
  onSaved = () => {}
}) {
  const [seriesList, setSeriesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(initialSeriesId || null);
  const [selectedTags, setSelectedTags] = useState(new Set((initialTags || []).map(t => t.id)));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [sRes, tRes] = await Promise.all([api.get("/api/series"), api.get("/api/tags")]);
        const sList = Array.isArray(sRes.data) ? sRes.data : (sRes.data?.content || sRes.data?.series || []);
        const tList = Array.isArray(tRes.data) ? tRes.data : (tRes.data?.content || tRes.data?.tags || []);
        if (!mounted) return;
        setSeriesList(sList || []);
        setTagsList(tList || []);
      } catch (e) {
        console.error("Failed load series/tags", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setSelectedSeries(initialSeriesId || null);
    setSelectedTags(new Set((initialTags || []).map(t => t.id)));
  }, [initialSeriesId, initialTags]);

  const toggleTag = (id) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // replace existing saveSeries/saveTags with these
   // ===== Replace saveSeries with this =====
const saveSeries = async () => {
  setBusy(true);
  try {
    const payload = { seriesId: selectedSeries };
    console.log("Saving series:", payload, "to", `/api/posts/${postId}/series`);
    const res = await api.put(`/api/posts/${postId}/series`, payload);
    console.log("saveSeries response:", res.status, res.data);

    // 1st alert: show server response
    alert('Series -> Server response: ' + (res.data ? JSON.stringify(res.data) : `status ${res.status}`));

    // refetch the post to confirm mapping persisted
    try {
      const p = await api.get(`/api/posts/${postId}`);
      console.log('Series -> Refetched post:', p.data);
      if (p.data && (p.data.series || p.data.seriesId || p.data.seriesIds)) {
        alert('Series -> Confirmed: post has series: ' + JSON.stringify(p.data.series || p.data.seriesId || p.data.seriesIds));
      } else {
        alert('Series -> Note: post does NOT include series after save. Check console.');
      }
    } catch (e) {
      console.error('Series -> Failed to fetch post after save', e);
      alert('Series -> Saved but failed to re-fetch post: ' + (e?.response?.status || e.message));
    }

    onSaved && onSaved();
  } catch (err) {
    console.error("saveSeries error:", err);
    const status = err?.response?.status;
    const data = err?.response?.data;
    alert(`Series -> Failed to save\nstatus: ${status}\nresponse: ${JSON.stringify(data)}`);
  } finally {
    setBusy(false);
  }
};

// ===== Replace saveTags with this =====
const saveTags = async () => {
  setBusy(true);
  try {
    const payload = { tagIds: Array.from(selectedTags) };
    console.log("Saving tags:", payload, "to", `/api/posts/${postId}/tags`);
    const res = await api.put(`/api/posts/${postId}/tags`, payload);
    console.log("saveTags response:", res.status, res.data);

    // 1st alert: show server response
    alert('Tags -> Server response: ' + (res.data ? JSON.stringify(res.data) : `status ${res.status}`));

    // refetch the post to confirm mapping persisted
    try {
      const p = await api.get(`/api/posts/${postId}`);
      console.log('Tags -> Refetched post:', p.data);
      // try common fields
      const hasTags = p.data && (p.data.tagIds || p.data.tags || (Array.isArray(p.data.tags) && p.data.tags.length > 0));
      if (hasTags) {
        alert('Tags -> Confirmed: post has tags: ' + JSON.stringify(p.data.tagIds || p.data.tags));
      } else {
        alert('Tags -> Note: post does NOT include tags after save. Check console.');
      }
    } catch (e) {
      console.error('Tags -> Failed to fetch post after save', e);
      alert('Tags -> Saved but failed to re-fetch post: ' + (e?.response?.status || e.message));
    }

    onSaved && onSaved();
  } catch (err) {
    console.error("saveTags error:", err);
    const status = err?.response?.status;
    const data = err?.response?.data;
    alert(`Tags -> Failed to save\nstatus: ${status}\nresponse: ${JSON.stringify(data)}`);
  } finally {
    setBusy(false);
  }
};



  return (
    <div className="pst-editor card" style={{ marginTop: "1rem", padding: "1.2rem" }}>
      {/* SERIES SECTION */}
      <section className="pst-section">
        <div className="pst-section-header">
          <div className="pst-heading heading-series">Series</div>
          <div style={{ marginLeft: "auto" }}>
            <button className="btn btn-gradient" onClick={saveSeries} disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        <div className="pst-pills-row">
          {seriesList.map(s => (
            <button
              key={s.id}
              type="button"
              className={`pill pill-series ${Number(selectedSeries) === Number(s.id) ? "selected" : ""}`}
              onClick={() => setSelectedSeries(s.id)}
              title={s.name}
            >
              {s.name}
            </button>
          ))}
        </div>
      </section>

      {/* TAGS SECTION */}
      <section className="pst-section" style={{ marginTop: "1.25rem" }}>
        <div className="pst-section-header">
          <div className="pst-heading heading-tags">Tags</div>
          <div style={{ marginLeft: "auto" }}>
            <button className="btn btn-gradient" onClick={saveTags} disabled={busy}>
              {busy ? "Saving…" : "Save tags"}
            </button>
          </div>
        </div>

        <div className="pst-pills-row">
          {tagsList.map(t => (
            <button
              key={t.id}
              type="button"
              className={`pill pill-tag ${selectedTags.has(t.id) ? "selected" : ""}`}
              onClick={() => toggleTag(t.id)}
              title={t.name || t.label}
            >
              {t.name || t.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
