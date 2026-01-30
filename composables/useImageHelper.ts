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
  url: string | null | undefined
): string => {
  if (url?.trim()) {
    return url
  }
  return useRandomImage()
}
