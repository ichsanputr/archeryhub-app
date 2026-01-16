/**
 * String Helper Composable
 */

/**
 * Convert a string to Title Case (e.g. "cheating-daddy" -> "Cheating Daddy")
 * Replaces hyphens/underscores with spaces and capitalizes first letter of each word
 * @param {string} str - The string to convert
 * @returns {string} The title cased string
 */
export const useTitleCase = (str) => {
  if (!str) return ''
  
  // Replace hyphens and underscores with spaces
  const withSpaces = str.replace(/[-_]/g, ' ')
  
  // Capitalize first letter of each word
  return withSpaces.split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
