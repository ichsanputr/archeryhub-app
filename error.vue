<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { navigateTo } from '#app'
import { useHead } from '#app'

// Get error props
const props = defineProps({
  error: Object
})

// Handle different error types
const is404 = computed(() => props.error?.statusCode === 404)
const is500 = computed(() => props.error?.statusCode === 500)

// Error messages and suggestions
const errorConfig = computed(() => {
  if (is404.value) {
    return {
      title: "Page Not Found",
      subtitle: "The page you're looking for doesn't exist",
      description: "This could be because the URL was typed incorrectly, the page has been moved, or it never existed.",
      icon: "ph:file-x",
      suggestions: [
        { text: "Go back to homepage", action: "home", icon: "ph:house" },
        { text: "Read articles", action: "articles", icon: "ph:book-open" },
      ]
    }
  } else if (is500.value) {
    return {
      title: "Server Error",
      subtitle: "Something went wrong on our end",
      description: "We're experiencing technical difficulties. Please try again later or contact support if the problem persists.",
      icon: "ph:warning-circle",
      suggestions: [
        { text: "Try again", action: "refresh", icon: "ph:arrow-clockwise" },
        { text: "Go to homepage", action: "home", icon: "ph:house" },
      ]
    }
  } else {
    return {
      title: "Something went wrong",
      subtitle: `Error ${props.error?.statusCode || 'Unknown'}`,
      description: props.error?.statusMessage || "An unexpected error occurred.",
      icon: "ph:warning",
      suggestions: [
        { text: "Go back to homepage", action: "home", icon: "ph:house" },
        { text: "Try again", action: "refresh", icon: "ph:arrow-clockwise" }
      ]
    }
  }
})

// Handle actions
const handleAction = (action) => {
  switch (action) {
    case 'home':
      navigateTo('/')
      break
    case 'problems':
      navigateTo('/problem')
      break
    case 'articles':
      navigateTo('/article')
      break
    case 'leaderboard':
      navigateTo('/leaderboard')
      break
    case 'refresh':
      window.location.reload()
      break
    case 'contact':
      // You can implement contact logic here
      window.open('mailto:ichsanfadhil67@gmail.com', '_blank')
      break
    default:
      navigateTo('/')
  }
}

// SEO
useHead({
  title: `${errorConfig.value.title} - BudiBadu`,
  meta: [
    { name: 'description', content: errorConfig.value.description },
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl w-full text-center">
      <!-- Error Content -->
      <div class="mb-12">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {{ errorConfig.title }}
        </h1>
        
        <p class="text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
          {{ errorConfig.description }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-4">
        <!-- Primary Actions -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            v-for="(suggestion, index) in errorConfig.suggestions.slice(0, 2)"
            :key="index"
            @click="handleAction(suggestion.action)"
            class="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
            :class="index === 0 
              ? 'bg-orange-500 text-white shadow-lg hover:shadow-xl' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md'"
          >
            <Icon :ssr="true" :icon="suggestion.icon" class="w-5 h-5 mr-2" />
            {{ suggestion.text }}
          </button>
        </div>

        <!-- Secondary Actions -->
        <div v-if="errorConfig.suggestions.length > 2" class="flex flex-wrap gap-3 justify-center pt-4">
          <button
            v-for="(suggestion, index) in errorConfig.suggestions.slice(2)"
            :key="index + 2"
            @click="handleAction(suggestion.action)"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-yellow-600 transition-colors"
          >
            <Icon :ssr="true" :icon="suggestion.icon" class="w-4 h-4 mr-2" />
            {{ suggestion.text }}
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-sm text-gray-500">
        <p>
          If the problem persists, please 
          <button 
            @click="handleAction('contact')"
            class="text-yellow-600 hover:text-yellow-700 font-medium underline"
          >
            contact our support team
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add some animation to the error icon */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.error-icon {
  animation: float 3s ease-in-out infinite;
}

/* Add pulse animation for attention */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
</style>
