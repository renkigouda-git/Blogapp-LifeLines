export function parseICS(icsText) {
  const map = new Map()
  const blocks = icsText.split(/BEGIN:VEVENT/gi).slice(1)

  for (const raw of blocks) {
    const blk = raw.split(/END:VEVENT/gi)[0]

    const uid = (blk.match(/UID:(.*)/) || [])[1]?.trim()
    if (!uid) continue

    // Prefer RECURRENCE-ID date if present
    const dateRaw =
      (blk.match(/RECURRENCE-ID.*:(\d{8})/) || [])[1] ||
      (blk.match(/DTSTART.*:(\d{8})/) || [])[1]

    if (!dateRaw) continue

    const y = dateRaw.slice(0, 4)
    const m = dateRaw.slice(4, 6)
    const d = dateRaw.slice(6, 8)
    const date = `${y}-${m}-${d}`

    const summary = (blk.match(/SUMMARY:(.*)/) || [])[1]?.trim()
    if (!summary) continue

    const link =
      (blk.match(/X-GOOGLE-CONFERENCE:(.*)/) || [])[1]?.trim() ||
      (blk.match(/URL:(.*)/) || [])[1]?.trim() ||
      '#'

    const key = `${uid}-${date}`

    // ✅ RECURRENCE-ID overrides base RRULE
    if (!map.has(key) || blk.includes('RECURRENCE-ID')) {
      map.set(key, {
        title: summary, // ✅ emojis preserved
        date,
        link
      })
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return [...map.values()]
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}
