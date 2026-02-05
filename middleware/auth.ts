export default defineNuxtRouteMiddleware((to, from) => {
    const { isLoggedIn } = useAuth()

    if (!isLoggedIn.value) {
        if (import.meta.client) {
            return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
        }
        return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
})
