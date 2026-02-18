<template>
  <NuxtLayout>
    <NuxtPage :page-key="pageKey" />
  </NuxtLayout>
</template>

<script setup>
import { useTheme } from '~/composables/useTheme'

defineOptions({
  name: 'App'
})

const route = useRoute()

// Force page to remount when route changes (fixes blank page on browser back / touchpad back)
const pageKey = computed(() => route.fullPath)

// Initialize theme at app level
const { initializeTheme } = useTheme()
onMounted(() => {
  initializeTheme()
})
</script>