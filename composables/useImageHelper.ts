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
    // If it's already a full URL, return it
    if (url.startsWith('http')) return url
    // If it's a relative path, prepend API URL if needed (adjust based on your setup)
    return url
  }

  // If name provided, use DiceBear
  if (name?.trim()) {
    const seed = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`
  }

  // Fallback to random image if no name
  return useRandomImage()
}
