import { ref, computed } from 'vue'

export interface TourStep {
  target: string
  title: string
  description: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const activeTourId = ref<string | null>(null)
const tourSteps = ref<TourStep[]>([])
const currentStepIndex = ref<number>(0)
const isActive = ref<boolean>(false)

export function useTour() {
  const currentStep = computed(() => {
    if (!isActive.value || tourSteps.value.length === 0) return null
    return tourSteps.value[currentStepIndex.value] || null
  })

  const isFirstStep = computed(() => currentStepIndex.value === 0)
  const isLastStep = computed(() => currentStepIndex.value === tourSteps.value.length - 1)

  const startTour = (tourId: string, steps: TourStep[], force = false) => {
    if (import.meta.server) return

    // Check if already completed
    const completed = JSON.parse(localStorage.getItem('completed_tours') || '[]')
    if (completed.includes(tourId) && !force) {
      return
    }

    activeTourId.value = tourId
    tourSteps.value = steps
    currentStepIndex.value = 0
    isActive.value = true
  }

  const nextStep = () => {
    if (currentStepIndex.value < tourSteps.value.length - 1) {
      currentStepIndex.value++
    } else {
      finishTour()
    }
  }

  const prevStep = () => {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value--
    }
  }

  const skipTour = () => {
    saveTourCompletion()
    resetTour()
  }

  const finishTour = () => {
    saveTourCompletion()
    resetTour()
  }

  const saveTourCompletion = () => {
    if (activeTourId.value && import.meta.client) {
      const completed = JSON.parse(localStorage.getItem('completed_tours') || '[]')
      if (!completed.includes(activeTourId.value)) {
        completed.push(activeTourId.value)
        localStorage.setItem('completed_tours', JSON.stringify(completed))
      }
    }
  }

  const resetTour = () => {
    isActive.value = false
    activeTourId.value = null
    tourSteps.value = []
    currentStepIndex.value = 0
  }

  return {
    isActive,
    currentStepIndex,
    currentStep,
    isFirstStep,
    isLastStep,
    steps: tourSteps,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    finishTour,
    resetTour
  }
}
