/**
 * String Helper Composable
 */

/**
 * Convert a string to Title Case (e.g. "cheating-daddy" -> "Cheating Daddy")
 * Replaces hyphens/underscores with spaces and capitalizes first letter of each word
 * @param str - The string to convert
 * @returns The title cased string
 */
export const useTitleCase = (str: string | null | undefined): string => {
  if (!str) return ''

  const withSpaces = str.replace(/[-_]/g, ' ')
  return withSpaces
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).to() + word.slice(1))
    .join(' ')
}

/**
 * Convert a string to a URL-friendly slug
 * @param str - The string to convert
 * @returns The slugified string
 */
export const useStringHelper = () => {
  const slugify = (str: string | null | undefined): string => {
    if (!str) return ''

    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  return { slugify }
}
