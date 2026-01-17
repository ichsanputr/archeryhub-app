<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useTheme } from '~/composables/useTheme'

defineOptions({
  name: 'App'
})

// Initialize theme at app level
const { initializeTheme } = useTheme()
onMounted(() => {
  initializeTheme()
})
</script>