import { useDateFormat } from '@vueuse/core'

/**
 * Date formatting helper using Vue Use Core
 * @param {string|Date} date - The date to format
 * @param {string} format - The format string (default: 'MMMM DD, YYYY')
 * @returns {string} Formatted date string
 */
export const useFormattedDate = (date, format = 'MMMM DD, YYYY') => {
  if (!date) return 'Date not available'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date'
    }
    
    return useDateFormat(dateObj, format).value
  } catch (error) {
    console.warn('Date formatting error:', error)
    return 'Date not available'
  }
}

/**
 * Predefined date formats for common use cases
 */
export const dateFormats = {
  full: 'dddd, MMMM DD, YYYY', // Monday, January 15, 2024
  long: 'MMMM DD, YYYY', // January 15, 2024
  medium: 'MMM DD, YYYY', // Jan 15, 2024
  short: 'MM/DD/YYYY', // 01/15/2024
  iso: 'YYYY-MM-DD', // 2024-01-15
  time: 'HH:mm:ss', // 14:30:00
  dateTime: 'MMMM DD, YYYY HH:mm', // January 15, 2024 14:30
  relative: 'relative' // Special case for relative time
}

/**
 * Format date with predefined format
 * @param {string|Date} date - The date to format
 * @param {keyof dateFormats} formatKey - The predefined format key
 * @returns {string} Formatted date string
 */
export const useFormattedDatePreset = (date, formatKey = 'long') => {
  const format = dateFormats[formatKey] || dateFormats.long
  return useFormattedDate(date, format)
}

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const useRelativeTime = (date) => {
  if (!date) return 'Date not available'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date'
    }
    
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    if (diffDays > 0) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
    } else if (diffHours > 0) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`
    } else {
      return 'Just now'
    }
  } catch (error) {
    console.warn('Relative time formatting error:', error)
    return 'Date not available'
  }
}
