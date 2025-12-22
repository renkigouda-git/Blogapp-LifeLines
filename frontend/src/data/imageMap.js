// src/data/imageMap.js
// Centralized image map for series & tags.
// Edit URLs here to change images everywhere.

const SERIES_IMAGES = {
  "javascript-mastery": "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
  "react-recipes":      "https://images.unsplash.com/photo-1555967520-4f9f6b7a3c3b?q=80&w=1600&auto=format&fit=crop",
  "rural-farming":      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop",
  "travel-diaries":     "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
}

const TAG_IMAGES = {
  tech:         "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
  travel:       "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
  farming:      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop",
  photography:  "https://images.unsplash.com/photo-1519183071298-a2962be54a04?q=80&w=1600&auto=format&fit=crop",
  lifestyle:    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop",
  education:    "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1600&auto=format&fit=crop",
  health:       "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=1600&auto=format&fit=crop",
  finance:      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop",
  ai:           "https://images.unsplash.com/photo-1555949963-aa79dcee9815?q=80&w=1600&auto=format&fit=crop",
  programming:  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop",
}

/**
 * Returns a best-effort series image URL for a slug.
 * If you prefer local images, return paths like "/img/series/javascript-mastery.jpg"
 */
export function getSeriesImage(slug) {
  if (!slug) return null
  return SERIES_IMAGES[slug] || null
}

/**
 * Returns a best-effort tag image URL for a tag slug.
 * If you prefer local images, return paths like "/img/tags/tech.jpg"
 */
export function getTagImage(slug) {
  if (!slug) return null
  return TAG_IMAGES[slug] || null
}

// default export (optional)
export default {
  getSeriesImage,
  getTagImage,
}
