// src/components/SmartImg.jsx
import React, { useState } from 'react'

/**
 * SmartImg - small helper to pick a topic image from Unsplash.
 * props:
 *  - keywords (string) : comma or space separated search terms (e.g. "travel,landscape")
 *  - width, height (numbers) optional (defaults 800x480)
 *  - className (string)
 *  - alt (string)
 */
export default function SmartImg({ keywords = 'illustration', width = 800, height = 480, className = '', alt = '' }) {
  const [failed, setFailed] = useState(false)
  const q = Array.isArray(keywords) ? keywords.join(',') : String(keywords)
  const src = `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(q)}`
  const fallback = `https://via.placeholder.com/${width}x${height}.png?text=${encodeURIComponent((alt || q).slice(0,30))}`

  return (
    <img
      loading="lazy"
      src={failed ? fallback : src}
      alt={alt || q}
      className={className}
      onError={() => setFailed(true)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        borderRadius: 12,
      }}
    />
  )
}
