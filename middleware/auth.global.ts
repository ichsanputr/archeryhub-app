import { useAuth } from '~/composables/useAuth'

// Global Authentication middleware
export default defineNuxtRouteMiddleware(async (to, from) => {
    const nuxtApp = useNuxtApp()
    const { isLoggedIn, fetchUser, isUserLoading, user } = useAuth()

    // Protected routes:
    // 1. Dashboard and Profile
    // 2. Tournament registration and payment
    const isProtectedRoute =
        to.path.startsWith('/dashboard') ||
        to.path.startsWith('/profile') ||
        (to.path.includes('/register') && !to.path.startsWith('/auth')) ||
        to.path.includes('/payment')

    // Exception: public routes
    const isPublicRoute = to.path.startsWith('/auth') || to.path === '/' || to.path === '/tournaments' || to.path === '/about'

    if (!isProtectedRoute || isPublicRoute) return

    // On server-side, check user from SSR context
    if (import.meta.server) {
        const ssrUser = nuxtApp.ssrContext?.event?.context?.user
        if (!ssrUser) {
            const redirectPath = to.fullPath
            return navigateTo(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`)
        }
        return
    }

    // On client-side, if user state hasn't been initialized yet, fetch it
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
