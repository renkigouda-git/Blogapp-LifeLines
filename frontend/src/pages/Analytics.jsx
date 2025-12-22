// src/pages/Analytics.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalyticsSummary } from '../utils/analytics';

export default function Analytics() {
  const [data, setData] = useState({ pages: [], posts: [] });

  useEffect(() => {
    setData(getAnalyticsSummary());
  }, []);

  const { pages, posts } = data;

  return (
    <div className="container page">
      <h1>Analytics</h1>
      <p className="small">
        Local-only stats stored in your browser (they don’t go to any server).
      </p>

      {/* Page views */}
      <section style={{ marginTop: '1.2rem' }}>
        <h2>Most visited pages</h2>
        {pages.length === 0 ? (
          <p className="small">No page views tracked yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Path</th>
                <th style={{ textAlign: 'right' }}>Views</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(p => (
                <tr key={p.path}>
                  <td>{p.path}</td>
                  <td style={{ textAlign: 'right' }}>{p.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Post views */}
      <section style={{ marginTop: '1.2rem' }}>
        <h2>Most read posts</h2>
        {posts.length === 0 ? (
          <p className="small">No post views tracked yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Post</th>
                <th style={{ textAlign: 'right' }}>Views</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td>
                    <Link className="link" to={`/posts/${p.id}`}>
                      {p.title || `Post #${p.id}`}
                    </Link>
                  </td>
                  <td style={{ textAlign: 'right' }}>{p.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div style={{ marginTop: '1.5rem' }}>
        <Link className="btn" to="/dashboard">← Back to dashboard</Link>
      </div>
    </div>
  );
}
