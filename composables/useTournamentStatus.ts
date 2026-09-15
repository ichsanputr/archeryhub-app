/**
 * Helper to calculate public-facing event status based on dates
 * Returns: 'Mendatang' (Upcoming), 'Ongoing', or 'Selesai' (Completed)
 */
export interface TournamentStatusInput {
    start_date?: string | Date | null
    end_date?: string | Date | null
    [key: string]: any
}

export type TournamentStatus = 'Mendatang' | 'Ongoing' | 'Selesai'

export type EventStatusInput = TournamentStatusInput
export type EventStatus = TournamentStatus

export const useTournamentStatus = () => {
    const getPublicStatus = (tournament: TournamentStatusInput | null | undefined): TournamentStatus => {
        if (!tournament) return 'Mendatang'

        const now = new Date()
        const startDate = tournament.start_date ? new Date(tournament.start_date) : null
        const endDate = tournament.end_date ? new Date(tournament.end_date) : null

        // If no dates, consider upcoming
        if (!startDate && !endDate) return 'Mendatang'

        // If tournament has ended
        if (endDate && now > endDate) {
            return 'Selesai'
        }

        // If tournament is ongoing
        if (startDate && now >= startDate) {
            if (!endDate || now <= endDate) {
                return 'Ongoing'
            }
        }

        // Tournament hasn't started yet
        return 'Mendatang'
    }

    const getPublicStatusClass = (status: TournamentStatus | string): string => {
        const classes: Record<string, string> = {
            'Mendatang': 'bg-blue-50 text-blue-700 border-blue-100',
            'Ongoing': 'bg-primary/10 text-primary-dark border-primary/20',
            'Selesai': 'bg-gray-50 text-gray-500 border-gray-100'
        }
        return classes[status] || 'bg-gray-50 text-gray-500 border-gray-100'
    }

    const getPublicStatusDotClass = (status: TournamentStatus | string): string => {
        const classes: Record<string, string> = {
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

// Backward-compatible alias
export const useEventStatus = useTournamentStatus
