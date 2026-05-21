import { ref, computed, watch } from 'vue'

const LS_KEY_LOCALE = 'dashboard_locale'
const localeLoaders = import.meta.glob('../dashboard_locales/*.json')

export function useDashboardI18n(defaultLocale = 'en') {
  const locale = ref<string>(defaultLocale)
  const messages = ref<Record<string, any> | null>(null)

  // Try to read the app's global i18n locale (SSR + client). If found,
  // prefer it. Only fall back to `localStorage` when global i18n isn't available.
  let globalLocaleFound = false
  try {
    // Prefer composable `useNuxtApp()` when available in Nuxt runtime.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maybeUseNuxt = (globalThis as any).useNuxtApp || (typeof useNuxtApp === 'function' ? useNuxtApp : undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nuxt = maybeUseNuxt ? (maybeUseNuxt as any)() : undefined
    const globalI18n = nuxt && (nuxt.$i18n || nuxt.app?.$i18n || nuxt.$i18n)
    if (globalI18n) {
      if (typeof globalI18n.locale === 'string') {
        locale.value = globalI18n.locale
        globalLocaleFound = true
      } else if (globalI18n.locale && typeof globalI18n.locale.value === 'string') {
        locale.value = globalI18n.locale.value
        globalLocaleFound = true
      }
    }
  } catch (e) {
    // ignore safe failure
  }

  // Only use localStorage as a fallback when global i18n isn't present
  if (!globalLocaleFound && process.client) {
    try {
      const saved = localStorage.getItem(LS_KEY_LOCALE)
      if (saved) locale.value = saved
    } catch (e) {
      // ignore localStorage errors
    }
  }

  // If we did detect a global locale on the client, persist it to dashboard localStorage.
  if (process.client && globalLocaleFound) {
    try {
      localStorage.setItem(LS_KEY_LOCALE, locale.value)
    } catch (e) {
      // ignore
    }
  }

  // Watch for runtime changes to global i18n locale and update dashboard locale accordingly
  try {
    if (process.client) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nuxt = typeof useNuxtApp === 'function' ? (useNuxtApp() as any) : (globalThis as any).useNuxtApp && (globalThis as any).useNuxtApp()
      const globalI18n = nuxt && (nuxt.$i18n || nuxt.app?.$i18n)
      if (globalI18n && globalI18n.locale && typeof globalI18n.locale === 'object' && 'value' in globalI18n.locale) {
        watch(() => (globalI18n.locale as any).value, (v: string) => {
          if (v && v !== locale.value) {
            setLocale(v)
          }
        })
      }
    }
  } catch (e) {
    // ignore
  }

  async function loadMessages(loc = locale.value) {
    try {
      const loader = localeLoaders[`../dashboard_locales/${loc}.json`]
      if (!loader) {
        messages.value = {}
        return
      }
      const mod = await loader() as any
      messages.value = (mod && (mod.default || mod)) || {}
    } catch (e) {
      messages.value = {}
    }
  }

  function setLocale(loc: string) {
    locale.value = loc
    if (process.client) {
      try { localStorage.setItem(LS_KEY_LOCALE, loc) } catch {}
    }
    void loadMessages(loc)
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

  // initial load (server and client) using the resolved locale
  void loadMessages(locale.value)

  return {
    locale: computed(() => locale.value),
    setLocale,
    t,
    loadMessages,
  }
}

export default useDashboardI18n
