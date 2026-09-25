export default defineNuxtRouteMiddleware((to) => {
  const localeCodes = ['en', 'id']
  const segments = to.path.split('/').filter(Boolean)

  // Redirect legacy prefixed routes (e.g. /id/events -> /events, /id -> /)
  if (segments.length >= 1 && localeCodes.includes(segments[0])) {
    const cleanPath = '/' + segments.slice(1).join('/')
    return navigateTo({
      path: cleanPath || '/',
      query: to.query,
      hash: to.hash
    }, { replace: true })
  }

  // Handle locale: always default to English
  const nuxtApp = useNuxtApp()
  const i18n = (nuxtApp as any).$i18n

  if (i18n) {
    if (process.client) {
      try {
        localStorage.removeItem('dashboard_locale')
      } catch (e) {}
    }
  }
})

