// Composable for managing event context in dashboard
import { ref, computed, onMounted } from 'vue'

const currentEvent = ref(null)

// Initialize from localStorage if in browser
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('archery_current_event')
    if (saved) {
      currentEvent.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to parse saved event', e)
  }
}

export const useEventContext = () => {
  const setEvent = (event) => {
    currentEvent.value = event
    if (typeof window !== 'undefined') {
      localStorage.setItem('archery_current_event', JSON.stringify(event))
    }
  }

  const clearEvent = () => {
    currentEvent.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('archery_current_event')
    }
  }

  const isEventMode = computed(() => {
    return currentEvent.value !== null
  })

  const eventTitle = computed(() => {
    return currentEvent.value?.name || null
  })

  return {
    currentEvent: computed(() => currentEvent.value),
    setEvent,
    clearEvent,
    isEventMode,
    eventTitle
  }
}
