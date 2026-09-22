import imagesData from '~/assets/images.json'

/**
 * Image Helper Composable
 * Provides functionality to get random placeholder images and local avatars
 */

export interface ImageItem {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

const images = imagesData as ImageItem[]

/**
 * Get a random image object from images.json
 */
export const useRandomImageItem = (): ImageItem => {
  const randomIndex = Math.floor(Math.random() * images.length)
  return images[randomIndex]
}

/**
 * Get a random image download URL
 */
export const useRandomImage = (): string => {
  const item = useRandomImageItem()
  return item?.download_url ?? ''
}

/**
 * Generate a Dicebear avatar URL based on the name/seed
 */
export const generateDicebearAvatar = (name?: string | null, style: string = 'avataaars'): string => {
  const cleanName = (typeof name === 'string' ? name.trim() : '') || 'Archer'
  const seed = encodeURIComponent(cleanName)
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`
}

/**
 * Generate a clean, offline SVG avatar data URI with initials in Archeris brand colors
 */
export const generateInitialsAvatar = (name: string): string => {
  const initials = (name || '')
    .trim()
    .split(/\s+/)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'A'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="#0f172a" rx="50"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="38" font-weight="800" fill="#ccff00">${initials}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/**
 * Get the provided image URL or a Dicebear avatar if null/empty
 * @param url - The image URL to check
 * @param name - Optional name to generate a custom Dicebear avatar
 * @param style - Optional Dicebear style (default: avataaars)
 */
export const useImageOrDefault = (
  url: string | null | undefined,
  name?: string | null,
  style: string = 'avataaars'
): string => {
  if (url && typeof url === 'string' && url.trim()) {
    return getImageUrl(url)
  }

  // If name provided, generate rich Dicebear avatar
  if (name && typeof name === 'string' && name.trim()) {
    return generateDicebearAvatar(name, style)
  }

  // Fallback to default avatar if no name
  return `https://api.dicebear.com/9.x/${style}/svg?seed=Archer`
}

/**
 * Get full image URL by handling relative paths from API
 */
export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  const apiBase = useApiBaseUrl()

  // If URL has localhost/127.0.0.1 from local database seed, rewrite to current environment's apiBase
  if (url.includes('localhost:') || url.includes('127.0.0.1:')) {
    const filename = url.split('/').pop() || ''
    return `${apiBase}/media/${filename}`
  }

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url
  if (url.startsWith('/')) {
    return `${apiBase}${url}`
  }
  if (!url.startsWith('uploads/') && !url.startsWith('media/')) {
    return `${apiBase}/media/${url}`
  }
  return `${apiBase}/${url}`
}