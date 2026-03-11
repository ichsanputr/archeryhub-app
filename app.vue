<template>
  <div>
    <AppThemeLoader v-if="isDashboard" :loading="isThemeLoading" />
    <NuxtLayout>
      <NuxtPage :page-key="pageKey" />
    </NuxtLayout>
    <SupportChatWidget v-if="showSupportChat" />
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
// We use path instead of fullPath to avoid unnecessary remounts when query parameters change
const pageKey = computed(() => route.path)
const isDashboard = computed(() => route.path.startsWith('/dashboard'))
const isMatchPage = computed(() => route.path.startsWith('/match'))
const isAuthPage = computed(() => ['/auth/login', '/auth/register'].includes(route.path))
const showSupportChat = computed(() => 
  !isDashboard.value && 
  !isMatchPage.value && 
  !isAuthPage.value && 
  !route.path.startsWith('/products/')
)

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
