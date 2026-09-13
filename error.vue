<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center max-w-lg">
      <!-- Error Illustration -->
      <div class="relative mb-8">
        <div
          class="w-32 h-32 mx-auto bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/20">
          <div class="w-24 h-24 bg-navy rounded-full flex items-center justify-center">
            <Icon icon="ph:target" class="text-5xl text-primary" />
          </div>
        </div>
        <div
          class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
          {{ error?.statusCode || 404 }}
        </div>
      </div>

      <!-- Error Message -->
      <h1 class="text-3xl md:text-4xl font-black text-navy mb-4">
        {{ title }}
      </h1>
      <p class="text-gray-500 mb-8 leading-relaxed">
        {{ message }}
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink to="/">
          <BaseButton variant="primary" size="lg" icon="ph:house-bold">
            Back to Home
          </BaseButton>
        </NuxtLink>
        <button @click="handleError"
          class="flex items-center gap-2 text-gray-500 hover:text-navy transition-colors font-medium">
          <Icon icon="ph:arrow-counter-clockwise" />
          Try Again
        </button>
      </div>

      <!-- Helpful Links -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <p class="text-xs text-gray-400  tracking-widest font-bold mb-4">You might be looking for</p>
        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink to="/events"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-primary hover:text-navy transition-all">
            Tournaments
          </NuxtLink>
          <NuxtLink to="/clubs"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-primary hover:text-navy transition-all">
            Clubs
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

// Get error from Nuxt
const error = useError()

const title = computed(() => {
  const code = error.value?.statusCode
  switch (code) {
    case 404:
      return 'Page Not Found'
    case 403:
      return 'Access Denied'
    case 500:
      return 'An Error Occurred'
    default:
      return 'An Error Occurred'
  }
})

const message = computed(() => {
  const code = error.value?.statusCode
  switch (code) {
    case 404:
      return 'Sorry, the page you are looking for could not be found. It might have been moved or deleted.'
    case 403:
      return 'You do not have permission to access this page. Please log in or contact the administrator.'
    case 500:
      return 'An error occurred on the server. Our team is working to fix it.'
    default:
      return error.value?.message || 'An unknown error occurred.'
  }
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
