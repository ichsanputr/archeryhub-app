export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser, isLoggedIn } = useAuth()

  // If already have user, allow
  if (user?.value) return

  // Try to fetch current user (client-side only)
  if (import.meta.client) {
    await fetchUser()
    if (isLoggedIn.value) return
  }

  // Not authenticated: redirect to login
  return navigateTo('/auth/login')
})
