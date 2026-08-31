import imagesData from '~/assets/images.json'

/**
 * Image Helper Composable
 * Provides functionality to get random placeholder images
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
 * Get the provided image URL or a random one if null/empty
 * @param url - The image URL to check
 */
export const useImageOrDefault = (
  url: string | null | undefined,
  name?: string
): string => {
  if (url?.trim()) {
    return getImageUrl(url)
  }

  // If name provided, use DiceBear
  if (name?.trim()) {
    const seed = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`
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

  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) {
    return `${apiBase}${url}`
  }
  if (!url.startsWith('uploads/') && !url.startsWith('media/')) {
    return `${apiBase}/media/${url}`
  }
  return `${apiBase}/${url}`
}
