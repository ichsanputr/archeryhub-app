<script setup>
import { Icon } from '@iconify/vue'

// Define component name
defineOptions({
  name: 'ProblemHeader'
})

import { ref, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  isTestLoading: {
    type: Boolean,
    default: false
  },
  isSubmitLoading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['run-code', 'submit-code'])

// Timer functionality
const elapsedTime = ref(0)
const timerInterval = ref(null)

const startTimer = () => {
  timerInterval.value = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

// Methods
const runCode = () => {
  emit('run-code')
}

const submitCode = () => {
  emit('submit-code')
}
</script>

<template>
  <div class="shadow-sm border-b flex-shrink-0 bg-white">
    <div class="max-w-full mx-auto">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-14 py-2 sm:py-0 gap-2 sm:gap-0 px-4">
        <!-- Logo/Brand -->
        <div class="flex items-center cursor-pointer" @click="navigateTo('/')">
          <Icon :ssr="true" icon="logos:rust" class="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          <div class="text-base sm:text-lg font-semibold text-gray-900">
            <span class="inline">Rust Challenges</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <div class="flex items-center text-xs sm:text-sm text-gray-600">
            <Icon :ssr="true" icon="ph:timer" class="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span class="hidden xs:inline">{{ formatTime(elapsedTime) }}</span>
            <span class="xs:hidden">{{ Math.floor(elapsedTime / 60) }}:{{ (elapsedTime % 60).toString().padStart(2, '0')
              }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="runCode" :disabled="props.isTestLoading"
              class="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-md flex items-center">
              <v-progress-circular v-if="props.isTestLoading" size="12" width="2" color="white" indeterminate
                class="mr-1" />
              <Icon :ssr="true" v-else icon="ph:play-fill" class="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
              <span class="hidden sm:inline">{{ props.isTestLoading ? 'Testing...' : 'Test' }}</span>
            </button>
            <button @click="submitCode" :disabled="props.isSubmitLoading"
              class="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-md flex items-center">
              <v-progress-circular v-if="props.isSubmitLoading" size="12" width="2" color="white" indeterminate
                class="mr-1" />
              <Icon :ssr="true" v-else icon="ph:check" class="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
              <span class="hidden sm:inline">{{ props.isSubmitLoading ? 'Submitting...' : 'Submit' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>