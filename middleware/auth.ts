/**
 * Route middleware: protect pages that use definePageMeta({ middleware: ['auth'] }).
 * Redirects to /auth/login if user is not logged in.
 * Server-side redirects are also handled by server/middleware/auth.global.ts.
 */
export default defineNuxtRouteMiddleware((to) => {
  const user = useState<unknown>('auth.user', () => null)
  if (!user.value) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }
})
