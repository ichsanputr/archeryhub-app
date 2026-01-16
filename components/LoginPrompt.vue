<script setup>
import { Icon } from '@iconify/vue'

// Define component name
defineOptions({
  name: 'LoginPrompt'
})

const props = defineProps({
  message: {
    type: String,
    default: 'Please login to continue'
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const { addToast } = useToast()

const showLoginPrompt = () => {
  const toastId = addToast({
    message: props.message,
    type: 'warning',
    duration: props.duration,
    action: {
      label: 'Login',
      onClick: () => {
        navigateTo('/auth/login')
        removeToast(toastId)
      }
    }
  })
}

const removeToast = (id) => {
  const { removeToast: removeToastFn } = useToast()
  removeToastFn(id)
}

// Expose the function for external use
defineExpose({
  showLoginPrompt
})
</script>

<template>
  <!-- This component doesn't render anything directly -->
  <!-- It provides a function to show login prompts -->
</template>
