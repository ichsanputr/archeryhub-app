<template>
  <div>
    <AppThemeLoader v-if="isDashboard" :loading="isThemeLoading" />
    <NuxtLayout>
      <NuxtPage :page-key="pageKey" />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useTheme } from '~/composables/useTheme'
import { useAuth } from '~/composables/useAuth'

defineOptions({
  name: 'App'
})

const route = useRoute()

// Force page to remount when route changes (fixes blank page on browser back / touchpad back)
const pageKey = computed(() => route.fullPath)
const isDashboard = computed(() => route.path.startsWith('/dashboard'))

// Initialize theme and auth at app level
const { initializeTheme, removeTheme, isThemeLoading } = useTheme()
const { initializeAuth } = useAuth()

onMounted(async () => {
  await initializeAuth()
  if (isDashboard.value) {
    initializeTheme()
  } else {
    isThemeLoading.value = false
  }
})

// Watch for dashboard navigation to apply/remove theme
watch(isDashboard, (newVal) => {
  if (newVal) {
    initializeTheme()
  } else {
    removeTheme()
    isThemeLoading.value = false
  }
})
</script>