/**
 * Google Maps helper utility for parsing embed iframes, embed URLs, and standard maps links.
 */

/**
 * Extracts a valid Google Maps embed URL from either:
 * - A full HTML <iframe> snippet (e.g. copied via Google Maps "Embed a map" / "Sematkan peta")
 * - A direct embed URL (https://www.google.com/maps/embed?pb=...)
 * - A standard Google Maps share link (https://maps.app.goo.gl/..., https://goo.gl/maps/...)
 * - Or coordinates / search query
 */
export function extractGmapsEmbedUrl(input: string | null | undefined, fallbackQuery?: string): string | null {
  if (!input || !input.trim()) {
    if (fallbackQuery && fallbackQuery.trim()) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery.trim())}&output=embed`
    }
    return null
  }

  const trimmed = input.trim()

  // 1. Check if input contains an <iframe> tag and extract src
  const iframeMatch = trimmed.match(/<iframe[^>]+src=["']([^"']+)["']/i)
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1].trim()
  }

  // 2. If it's already an embed URL
  if (trimmed.includes('google.com/maps/embed') || (trimmed.includes('maps.google.com') && trimmed.includes('output=embed'))) {
    return trimmed
  }

  // 3. If it has coordinates in query param (e.g. ?q=-6.123,106.123)
  const coordsMatch = trimmed.match(/[?&]q=([^&]+)/)
  if (coordsMatch && coordsMatch[1]) {
    const query = decodeURIComponent(coordsMatch[1])
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
  }

  // 4. If it's a URL or search query, wrap with google maps search embed
  try {
    const url = new URL(trimmed)
    if (url.hostname.includes('google.com') || url.hostname.includes('goo.gl')) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`
    }
  } catch {
    // If not a valid URL, treat as search query (e.g. venue name / address)
    return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`
  }

  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`
}

/**
 * Returns a direct browser link to open Google Maps in a new tab.
 */
export function getDirectGmapsUrl(input: string | null | undefined, venue?: string, address?: string): string | null {
  if (input && input.trim()) {
    const trimmed = input.trim()
    // If user pasted iframe, extract src
    const iframeMatch = trimmed.match(/<iframe[^>]+src=["']([^"']+)["']/i)
    const rawUrl = iframeMatch && iframeMatch[1] ? iframeMatch[1].trim() : trimmed

    // If it's not an embed URL, we can link directly
    if (!rawUrl.includes('/maps/embed')) {
      return rawUrl
    }
  }

  const query = [venue, address].filter(Boolean).map(s => s?.trim()).filter(Boolean).join(', ')
  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  }

  return null
}
