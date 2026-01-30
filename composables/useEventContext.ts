import { ref, computed } from 'vue'

interface EventContextData {
  name?: string
  id?: string
  [key: string]: unknown
}

const currentEvent = ref<EventContextData | null>(null)

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('archery_current_event')
    if (saved) {
      currentEvent.value = JSON.parse(saved) as EventContextData
    }
  } catch {
    console.error('Failed to parse saved event')
  }
}

export const useEventContext = () => {
  const setEvent = (event: EventContextData | null) => {
    currentEvent.value = event
    if (typeof window !== 'undefined') {
      if (event) {
        localStorage.setItem('archery_current_event', JSON.stringify(event))
      } else {
        localStorage.removeItem('archery_current_event')
      }
    }
  }

  const clearEvent = () => {
    currentEvent.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('archery_current_event')
    }
  }

  const isEventMode = computed(() => currentEvent.value !== null)
  const eventTitle = computed(() => currentEvent.value?.name ?? null)

  return {
    currentEvent: computed(() => currentEvent.value),
    setEvent,
    clearEvent,
    isEventMode,
    eventTitle
  }
}
