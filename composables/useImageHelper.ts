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
 * Generate a clean, offline SVG avatar data URI with initials in Archeris brand colors
 */
export const generateInitialsAvatar = (name: string): string => {
  const initials = name
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
 * Get the provided image URL or a local avatar if null/empty
 * @param url - The image URL to check
 * @param name - Optional name to generate an initials avatar
 */
export const useImageOrDefault = (
  url: string | null | undefined,
  name?: string
): string => {
  if (url?.trim()) {
    return getImageUrl(url)
  }

  // If name provided, generate offline brand initials avatar
  if (name?.trim()) {
    return generateInitialsAvatar(name)
  }

  // Fallback to default avatar if no name
  return '/avatar-default.svg'
}

/**
 * Get full image URL by handling relative paths from API
 */
export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  const config = useRuntimeConfig()
  const apiBase = (config.public?.apiBase as string) || 'http://localhost:8001'

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