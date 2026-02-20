<template>
  <div>
    <AppThemeLoader :loading="isThemeLoading" />
    <NuxtLayout :key="pageKey">
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

// Initialize theme and auth at app level
const { initializeTheme, isThemeLoading } = useTheme()
const { initializeAuth } = useAuth()

onMounted(async () => {
  await initializeAuth()
  initializeTheme()
})
</script>