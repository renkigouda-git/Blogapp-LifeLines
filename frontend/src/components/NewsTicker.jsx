import React from 'react'

export default function NewsTicker({ items }) {
  const list = Array.isArray(items) ? items : []
  if (!list.length) return null
  return (
    <div className="ticker">
      <div className="ticker-track">
        {list.concat(list).map((t, i) => (
          <span key={i} className="ticker-item">🔥 {t}</span>
        ))}
      </div>
    </div>
  )
}
