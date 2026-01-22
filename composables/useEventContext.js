// Composable for managing event context in dashboard
import { ref, computed } from 'vue'

const currentEvent = ref(null)

export const useEventContext = () => {
  const setEvent = (event) => {
    currentEvent.value = event
  }

  const clearEvent = () => {
    currentEvent.value = null
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
