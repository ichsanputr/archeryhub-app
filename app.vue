<template>
  <div>
    <NetworkStatusBanner />
    <AppThemeLoader v-if="isDashboard" :loading="isThemeLoading" />
    <NuxtLayout>
      <NuxtPage :page-key="pageKey" />
    </NuxtLayout>
    <SupportChatWidget v-if="showSupportChat" />
    <BaseToast />
  </div>
</template>

<script setup>

defineOptions({
  name: 'App'
})

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})

useHead({
  htmlAttrs: {
    lang: head.value.htmlAttrs.lang,
    dir: head.value.htmlAttrs.dir
  },
  link: [...(head.value.link || [])],
  meta: [...(head.value.meta || [])]
})

const route = useRoute()
const router = useRouter()
const isPageLoading = useState('pageLoadingState', () => false)
const nuxtApp = useNuxtApp()

// Show loader on page transition (front page only)
router.beforeEach((to, from, next) => {
  const isDashboard = to.path.startsWith('/dashboard')
  const isDocs = to.path.startsWith('/docs')
  if (!isDashboard && !isDocs && to.path !== from.path) {
    isPageLoading.value = true
  }
  next()
})

// Hide loader when Nuxt has finished loading and mounting the page
nuxtApp.hook('page:finish', () => {
  setTimeout(() => {
    isPageLoading.value = false
  }, 1500)
})

// Safety fallback for aborted/errored navigations
router.afterEach(() => {
  setTimeout(() => {
    if (isPageLoading.value) {
      isPageLoading.value = false
    }
  }, 1500)
})

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
  !route.path.startsWith('/embed/')
)

// Initialize theme and auth at app level
const { initializeTheme, removeTheme, isThemeLoading } = useTheme()
const { initializeAuth } = useAuth()
const toast = useToast()

onMounted(async () => {
  await initializeAuth()
  if (import.meta.client) {
    try {
      const authToast = sessionStorage.getItem('auth_toast')
      if (authToast) {
        sessionStorage.removeItem('auth_toast')
        setTimeout(() => {
          toast.success(authToast)
        }, 300)
      }
    } catch {}
  }
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
