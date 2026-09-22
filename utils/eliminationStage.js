/**
 * Helper to get stage and round names for elimination brackets according to World Archery standards.
 */

export const getRoundNameByNo = (roundNo, bracketSize = 8) => {
    const size = parseInt(bracketSize) || 8
    const totalRounds = Math.max(1, Math.round(Math.log2(size)))
    const r = parseInt(roundNo) || 1
    const roundFromEnd = totalRounds - r + 1

    if (roundFromEnd === 1) return 'Finals'
    if (roundFromEnd === 2) return 'Semifinal'
    if (roundFromEnd === 3) return 'Quarterfinal'
    if (roundFromEnd === 4) return '1/8 Final'
    if (roundFromEnd === 5) return '1/16 Final'
    if (roundFromEnd === 6) return '1/32 Final'
    return `Round ${r}`
}

export const getMatchStageBadge = (match, bracketSize = 8) => {
    if (!match) return { label: 'Match', shortLabel: 'M', isFinal: false, isBronze: false, isSemi: false }
    
    const size = parseInt(bracketSize) || 8
    const totalRounds = Math.max(1, Math.round(Math.log2(size)))
    const rNo = parseInt(match.round_no) || 1
    const matchNo = parseInt(match.match_no) || 1
    const roundFromEnd = totalRounds - rNo + 1

    // Final round contains Gold match and Bronze match
    if (roundFromEnd === 1) {
        // In a tournament bracket with 3rd place match, the last match number of the event is Bronze match
        // Total main matches = size - 1. Gold = size - 1. Bronze = size.
        // Or if matchNo is even in the final 2-match round
        const isBronze = match.is_bronze === true || matchNo === size || (matchNo % 2 === 0 && rNo === totalRounds)
        if (isBronze) {
            return {
                label: 'Bronze Medal Match',
                idLabel: 'Perebutan Juara 3',
                shortLabel: 'Bronze Match',
                isFinal: false,
                isBronze: true,
                isSemi: false,
                colorClass: 'bg-amber-500/10 text-amber-900 border-amber-500/30'
            }
        }
        return {
            label: 'Gold Medal Final',
            idLabel: 'Grand Final (Emas)',
            shortLabel: 'Gold Final',
            isFinal: true,
            isBronze: false,
            isSemi: false,
            colorClass: 'bg-amber-400/20 text-amber-950 border-amber-400/50'
        }
    }

    if (roundFromEnd === 2) {
        return {
            label: 'Semifinal',
            idLabel: 'Semifinal',
            shortLabel: 'Semifinal',
            isFinal: false,
            isBronze: false,
            isSemi: true,
            colorClass: 'bg-blue-50 text-blue-700 border-blue-200'
        }
    }

    if (roundFromEnd === 3) {
        return {
            label: 'Quarterfinal',
            idLabel: 'Perempat Final (8 Besar)',
            shortLabel: 'Quarterfinal',
            isFinal: false,
            isBronze: false,
            isSemi: false,
            colorClass: 'bg-purple-50 text-purple-700 border-purple-200'
        }
    }

    if (roundFromEnd === 4) {
        return {
            label: '1/8 Final',
            idLabel: 'Babak 16 Besar (1/8 Final)',
            shortLabel: '1/8 Final',
            isFinal: false,
            isBronze: false,
            isSemi: false,
            colorClass: 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    if (roundFromEnd === 5) {
        return {
            label: '1/16 Final',
            idLabel: 'Babak 32 Besar (1/16 Final)',
            shortLabel: '1/16 Final',
            isFinal: false,
            isBronze: false,
            isSemi: false,
            colorClass: 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    return {
        label: `Round ${rNo}`,
        idLabel: `Babak ${rNo}`,
        shortLabel: `R${rNo}`,
        isFinal: false,
        isBronze: false,
        isSemi: false,
        colorClass: 'bg-slate-100 text-slate-700 border-slate-200'
    }
}
