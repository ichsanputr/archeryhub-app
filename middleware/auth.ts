// Authentication middleware - redirects unauthenticated users to login
export default defineNuxtRouteMiddleware(async (to, from) => {
    // Only run on client side
    if (import.meta.server) return

    const { isLoggedIn, fetchUser, isUserLoading } = useAuth()

    // If user state hasn't been initialized yet, fetch it
    if (!isLoggedIn.value && !isUserLoading.value) {
        await fetchUser()
    }

    // After fetching, check if user is logged in
    if (!isLoggedIn.value) {
        // Store the intended destination for redirect after login
        const redirectPath = to.fullPath
        return navigateTo(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
})
