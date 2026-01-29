import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Only apply to auth pages (login/register)
  if (!to.path.startsWith('/auth')) return

  const auth = useAuth()
  const isLoggedIn = !!auth.user?.value

  if (isLoggedIn) {
    return navigateTo('/dashboard')
  }
})
