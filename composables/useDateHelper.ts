import { useDateFormat } from '@vueuse/core'

export const useFormattedDate = (date: string | Date | null | undefined, format = 'MMMM DD, YYYY'): string => {
  if (!date) return 'Date not available'
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Invalid date'
    return useDateFormat(dateObj, format).value
  } catch {
    return 'Date not available'
  }
}

export const dateFormats = {
  full: 'dddd, MMMM DD, YYYY',
  long: 'MMMM DD, YYYY',
  medium: 'MMM DD, YYYY',
  short: 'MM/DD/YYYY',
  iso: 'YYYY-MM-DD',
  time: 'HH:mm:ss',
  dateTime: 'MMMM DD, YYYY HH:mm',
  relative: 'relative'
} as const

export type DateFormatKey = keyof typeof dateFormats

export const useFormattedDatePreset = (
  date: string | Date | null | undefined,
  formatKey: DateFormatKey = 'long'
): string => {
  const format = dateFormats[formatKey] ?? dateFormats.long
  return useFormattedDate(date, format)
}

export const useRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'Date not available'
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Invalid date'
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    if (diffDays > 0) return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
    if (diffHours > 0) return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
    if (diffMinutes > 0) return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`
    return 'Just now'
  } catch {
    return 'Date not available'
  }
}
