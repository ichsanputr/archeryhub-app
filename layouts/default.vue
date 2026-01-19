<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
import { useTheme } from '~/composables/useTheme'

defineOptions({
  name: 'DefaultLayout'
})

// Initialize theme
const { initializeTheme } = useTheme()
onMounted(() => {
  initializeTheme()
})
</script>
