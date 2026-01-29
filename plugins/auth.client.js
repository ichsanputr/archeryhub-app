import { useAuth } from '~/composables/useAuth'

// Client-side auth initialization plugin
export default defineNuxtPlugin(async () => {
  // Only run on client-side
  if (import.meta.client) {
    const { initializeAuth } = useAuth()

    // Initialize authentication state on client-side
    await initializeAuth()
  }
})