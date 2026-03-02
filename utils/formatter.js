/**
 * Utility for formatting numbers and currencies to Indonesian locale (id-ID)
 */

/**
 * Formats a number with thousands separator (indonesian style)
 * Example: 150000 -> 150.000
 */
export const formatPrice = (price) => {
    if (price === undefined || price === null) return '0'
    return new Intl.NumberFormat('id-ID').format(price)
}

/**
 * Formats a number as IDR currency
 * Example: 150000 -> Rp 150.000
 */
export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount)
}

/**
 * Formats a date string to Indonesian format (DD MMM YYYY)
 * Example: 2026-03-02 -> 02 Mar 2026
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

/**
 * Formats time from a date string (HH:mm)
 */
export const formatTime = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    })
}
