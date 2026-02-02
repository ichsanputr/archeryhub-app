/**
 * Helper to calculate public-facing event status based on dates
 * Returns: 'Mendatang' (Upcoming), 'Ongoing', or 'Selesai' (Completed)
 */
export const useEventStatus = () => {
    const getPublicStatus = (event) => {
        if (!event) return 'Mendatang'

        const now = new Date()
        const startDate = event.start_date ? new Date(event.start_date) : null
        const endDate = event.end_date ? new Date(event.end_date) : null

        // If no dates, consider upcoming
        if (!startDate && !endDate) return 'Mendatang'

        // If event has ended
        if (endDate && now > endDate) {
            return 'Selesai'
        }

        // If event is ongoing
        if (startDate && now >= startDate) {
            if (!endDate || now <= endDate) {
                return 'Ongoing'
            }
        }

        // Event hasn't started yet
        return 'Mendatang'
    }

    const getPublicStatusClass = (status) => {
        const classes = {
            'Mendatang': 'bg-blue-50 text-blue-700 border-blue-100',
            'Ongoing': 'bg-primary/10 text-primary-dark border-primary/20',
            'Selesai': 'bg-gray-50 text-gray-500 border-gray-100'
        }
        return classes[status] || 'bg-gray-50 text-gray-500 border-gray-100'
    }

    const getPublicStatusDotClass = (status) => {
        const classes = {
            'Mendatang': 'bg-blue-500',
            'Ongoing': 'bg-primary animate-pulse',
            'Selesai': 'bg-gray-300'
        }
        return classes[status] || 'bg-gray-300'
    }

    return {
        getPublicStatus,
        getPublicStatusClass,
        getPublicStatusDotClass
    }
}
