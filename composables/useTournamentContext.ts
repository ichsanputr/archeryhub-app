import { ref, computed } from 'vue'

export interface TournamentContextData {
  name?: string
  id?: string
  [key: string]: unknown
}

const currentTournament = ref<TournamentContextData | null>(null)

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('archery_current_event') || localStorage.getItem('archery_current_tournament')
    if (saved) {
      currentTournament.value = JSON.parse(saved) as TournamentContextData
    }
  } catch {
    console.error('Failed to parse saved tournament')
  }
}

export const useTournamentContext = () => {
  const setTournament = (tournament: TournamentContextData | null) => {
    currentTournament.value = tournament
    if (typeof window !== 'undefined') {
      if (tournament) {
        localStorage.setItem('archery_current_tournament', JSON.stringify(tournament))
        localStorage.setItem('archery_current_event', JSON.stringify(tournament))
      } else {
        localStorage.removeItem('archery_current_tournament')
        localStorage.removeItem('archery_current_event')
      }
    }
  }

  const clearTournament = () => {
    currentTournament.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('archery_current_tournament')
      localStorage.removeItem('archery_current_event')
    }
  }

  const isTournamentMode = computed(() => currentTournament.value !== null)
  const tournamentTitle = computed(() => currentTournament.value?.name ?? null)

  return {
    currentTournament: computed(() => currentTournament.value),
    currentEvent: computed(() => currentTournament.value),
    setTournament,
    setEvent: setTournament,
    clearTournament,
    clearEvent: clearTournament,
    isTournamentMode,
    isEventMode: isTournamentMode,
    tournamentTitle,
    eventTitle: tournamentTitle
  }
}

// Backward-compatible alias
export const useEventContext = useTournamentContext
