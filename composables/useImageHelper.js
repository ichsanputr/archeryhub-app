import imagesData from '~/assets/images.json'

/**
 * Image Helper Composable
 * Provides functionality to get random placeholder images
 */

/**
 * Get a random image object from images.json
 * @returns {Object} Random image object
 */
export const useRandomImageItem = () => {
    const images = imagesData
    const randomIndex = Math.floor(Math.random() * images.length)
    return images[randomIndex]
}

/**
 * Get a random image download URL
 * @returns {string} Random image URL
 */
export const useRandomImage = () => {
    const item = useRandomImageItem()
    return item?.download_url || ''
}

/**
 * Get the provided image URL or a random one if null/empty
 * @param {string|null|undefined} url - The image URL to check
 * @returns {string} The original URL or a random one
 */
export const useImageOrDefault = (url) => {
    if (url && url.trim() !== '') {
        return url
    }
    return useRandomImage()
}
