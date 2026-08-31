<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark p-4">
    <div class="max-w-md w-full text-center space-y-8">
      <div v-if="loading" class="space-y-4">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent">
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Connecting account...</h2>
        <div class="text-gray-500 dark:text-gray-400">Please wait a moment while we process your login.</div>
      </div>

      <div v-else-if="error" class="space-y-6">
        <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600">
          <span class="material-symbols-outlined text-4xl">error</span>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white font-display">Failed to Log In</h2>
        <div class="text-red-500 mb-6 font-body text-sm">{{ error }}</div>
        <NuxtLink to="/auth/login"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-navy font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined">arrow_back</span>
          Back to Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { t } = useI18n()
const { handleCallback, user, fetchProfileSSR } = useAuth()

useHead({
  title: computed(() => (t ? t('auth.connecting', 'Connecting Account...') : 'Connecting Account...') + ' - ArcheryHub')
})

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  // The backend may complete the OAuth flow server-side and redirect back to the app with ?token=...
  // Support both styles:
  // 1) Frontend-first: /auth/callback?code=...&state=... -> POST to API to exchange code
  // 2) API-first:       /auth/callback?token=...        -> store cookie and continue
  const token = route.query.token
  if (token && typeof token === 'string') {
    try {
      // Best-effort cookie set for local/dev flows (cannot set HttpOnly from JS).
      // In production the API may also set an HttpOnly cookie on .archeris.net.
      const secure = window.location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `auth_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax${secure}`

      // Load user state from cookie
      await fetchProfileSSR()

      const welcomeMsg = user.value?.full_name ? `Welcome back, ${user.value.full_name}!` : 'Login successful!'
      sessionStorage.setItem('auth_toast', welcomeMsg)

      let redirect = route.query.redirect || '/dashboard'
      if ((!route.query.redirect || redirect === '/dashboard') && user.value?.role === 'archer') {
        redirect = '/dashboard/archer/events'
      }
      window.location.href = redirect
      return
    } catch (err) {
      console.error('Token callback processing failed:', err)
      error.value = 'Failed to complete login.'
      loading.value = false
      return
    }
  }

  const code = route.query.code
  const state = route.query.state

  if (!code) {
    error.value = 'Authorization code not found.'
    loading.value = false
    return
  }

  try {
    await handleCallback(code, state)

    const welcomeMsg = user.value?.full_name ? `Welcome back, ${user.value.full_name}!` : 'Login successful!'
    sessionStorage.setItem('auth_toast', welcomeMsg)

    // Full page reload so auth state is restored from cookie/SSR
    let redirect = route.query.redirect || '/dashboard'
    if ((!route.query.redirect || redirect === '/dashboard') && user.value?.role === 'archer') {
      redirect = '/dashboard/archer/events'
    }
    window.location.href = redirect
  } catch (err) {
    const statusCode = err?.statusCode ?? err?.status
    const data = err?.data ?? err?.response?._data ?? {}
    if (statusCode === 404 && (data?.code === 'account_not_found' || data?.error)) {
      // Google login attempted with an email that doesn't exist in our system
      window.location.href = `/auth/login?error=account_not_found`
      return
    }
    if (statusCode === 409 && data?.already_registered) {
      const email = data.email || ''
      const userType = data.user_type || ''
      window.location.href = `/auth/already-registered?email=${encodeURIComponent(email)}&user_type=${encodeURIComponent(userType)}`
      return
    }
    console.error('Callback processing failed:', err)
    error.value = err?.data?.error || err?.message || 'An error occurred while connecting to Google.'
  } finally {
    loading.value = false
  }
})
</script>
