// src/components/Seo.jsx
import React from 'react'
import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'LIFELINES'

export default function Seo({
  title,
  description,
  type = 'website',
  image,
  url,
}) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Write what you feel`

  const desc =
    description ||
    'LIFELINES is a calm blog space to write what you feel, save your moments and share them with the world.'

  const canonical =
    url ||
    (typeof window !== 'undefined' ? window.location.href : undefined)

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}
