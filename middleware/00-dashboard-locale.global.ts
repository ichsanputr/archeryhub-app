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

  // Handle locale switching between public and dashboard
  const nuxtApp = useNuxtApp()
  const i18n = (nuxtApp as any).$i18n

  if (i18n) {
    if (to.path.startsWith('/dashboard')) {
      // In dashboard, restore dashboard locale preference if on client
      if (process.client) {
        try {
          const saved = localStorage.getItem('dashboard_locale')
          if (saved && (saved === 'en' || saved === 'id')) {
            if (i18n.locale.value !== saved) {
              i18n.locale.value = saved
            }
          }
        } catch (e) {
          // ignore
        }
      }
    } else {
      // In public / landing pages, force English
      if (typeof i18n.locale === 'object' && i18n.locale && 'value' in i18n.locale) {
        if (i18n.locale.value !== 'en') {
          i18n.locale.value = 'en'
        }
      } else if (typeof i18n.locale === 'string') {
        i18n.locale = 'en'
      }
    }
  }
})

