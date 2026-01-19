// Global Authentication middleware
export default defineNuxtRouteMiddleware(async (to, from) => {
    // Only run on client side for now as SSR auth depends on cookies/headers
    if (import.meta.server) return

    const { isLoggedIn, fetchUser, isUserLoading } = useAuth()

    // Protected routes:
    // 1. Dashboard and Profile
    // 2. Tournament registration and payment
    const isProtectedRoute =
        to.path.startsWith('/dashboard') ||
        to.path.startsWith('/profile') ||
        to.path.includes('/register') ||
        to.path.includes('/payment')

    // Exception: public payment status doesn't need auth (optional, but keep it for now)
    const isPublicRoute = to.path.startsWith('/auth') || to.path === '/' || to.path === '/tournaments'

    if (!isProtectedRoute || isPublicRoute) return

    // If user state hasn't been initialized yet, fetch it
    if (!isLoggedIn.value && !isUserLoading.value) {
        await fetchUser()
    }

    // Check if user is authenticated for protected routes
    if (!isLoggedIn.value) {
        // Store the intended destination for redirect after login
        const redirectPath = to.fullPath
        return navigateTo(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
})
