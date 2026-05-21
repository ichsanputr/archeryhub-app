import { ref, computed } from 'vue'

const LS_KEY_LOCALE = 'dashboard_locale'
const LS_KEY_MESSAGES = (loc: string) => `dashboard_messages_${loc}`

export function useDashboardI18n(defaultLocale = 'en') {
  const locale = ref<string>(defaultLocale)
  const messages = ref<Record<string, any> | null>(null)

  if (process.client) {
    const saved = localStorage.getItem(LS_KEY_LOCALE)
    if (saved) locale.value = saved
  }

  async function loadMessages(loc = locale.value) {
    if (!process.client) return
    const cached = localStorage.getItem(LS_KEY_MESSAGES(loc))
    if (cached) {
      try {
        messages.value = JSON.parse(cached)
        return
      } catch (e) {
        // fallthrough to reload
      }
    }

    try {
      // lazy import packaged dashboard-local messages stored separately
      const mod = await import(`~/dashboard_locales/${loc}.json`)
      messages.value = (mod && (mod.default || mod)) || {}
      try {
        localStorage.setItem(LS_KEY_MESSAGES(loc), JSON.stringify(messages.value))
      } catch (e) {
        // ignore localStorage quota errors
      }
    } catch (e) {
      messages.value = {}
    }
  }

  function setLocale(loc: string) {
    locale.value = loc
    if (process.client) {
      try { localStorage.setItem(LS_KEY_LOCALE, loc) } catch {}
    }
    loadMessages(loc)
  }

  function t(path: string, fallback = ''): string {
    if (!messages.value) return fallback
    const parts = path.split('.')
    let cur: any = messages.value
    for (const p of parts) {
      if (cur && p in cur) cur = cur[p]
      else return fallback
    }
    return typeof cur === 'string' ? cur : fallback
  }

  // initial load on client
  if (process.client) loadMessages()

  return {
    locale: computed(() => locale.value),
    setLocale,
    t,
    loadMessages,
  }
}

export default useDashboardI18n
