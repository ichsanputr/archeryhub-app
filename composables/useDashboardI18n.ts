import { ref, computed, watch } from 'vue'
import enMessages from '../dashboard_locales/en.json'
import idMessages from '../dashboard_locales/id.json'

const LS_KEY_LOCALE = 'dashboard_locale'

const localeMap: Record<string, any> = {
  en: enMessages,
  id: idMessages,
}

// Global shared reactive state
const globalLocale = ref<string>('en')
let isInitialized = false

export function useDashboardI18n(defaultLocale = 'en') {
  if (!isInitialized) {
    if (process.client) {
      try {
        const saved = localStorage.getItem(LS_KEY_LOCALE)
        if (saved && (saved === 'en' || saved === 'id')) {
          globalLocale.value = saved
        }
      } catch (e) {}
    }
    isInitialized = true
  }

  // Sync with global nuxt app i18n if available
  try {
    const maybeUseNuxt = (globalThis as any).useNuxtApp || (typeof useNuxtApp === 'function' ? useNuxtApp : undefined)
    const nuxt = maybeUseNuxt ? (maybeUseNuxt as any)() : undefined
    const globalI18n = nuxt && (nuxt.$i18n || nuxt.app?.$i18n)
    if (globalI18n) {
      const currentNuxtLocale = typeof globalI18n.locale === 'string'
        ? globalI18n.locale
        : (globalI18n.locale?.value || globalI18n.locale)
      if (currentNuxtLocale && (currentNuxtLocale === 'en' || currentNuxtLocale === 'id')) {
        globalLocale.value = currentNuxtLocale
      }
      if (process.client && globalI18n.locale && typeof globalI18n.locale === 'object' && 'value' in globalI18n.locale) {
        watch(() => (globalI18n.locale as any).value, (v: string) => {
          if (v && (v === 'en' || v === 'id') && v !== globalLocale.value) {
            setLocale(v)
          }
        })
      }
    }
  } catch (e) {}

  function setLocale(loc: string) {
    globalLocale.value = loc
    if (process.client) {
      try { localStorage.setItem(LS_KEY_LOCALE, loc) } catch {}
    }
  }

  function t(path: string, paramsOrDefault?: any, fallback = ''): string {
    let params: Record<string, any> | undefined = undefined
    let defaultVal = fallback

    if (typeof paramsOrDefault === 'object' && paramsOrDefault !== null) {
      params = paramsOrDefault
    } else if (typeof paramsOrDefault === 'string') {
      defaultVal = paramsOrDefault
    }

    const currentMsg = localeMap[globalLocale.value] || localeMap.en || {}
    let result: any = undefined

    if (currentMsg) {
      const parts = path.split('.')
      let cur: any = currentMsg
      for (const p of parts) {
        if (cur && typeof cur === 'object' && p in cur) cur = cur[p]
        else {
          cur = null
          break
        }
      }
      if (typeof cur === 'string') {
        result = cur
      }
    }

    // If missing in current locale, try English fallback before defaultVal
    if (result === undefined && globalLocale.value !== 'en' && localeMap.en) {
      const parts = path.split('.')
      let cur: any = localeMap.en
      for (const p of parts) {
        if (cur && typeof cur === 'object' && p in cur) cur = cur[p]
        else {
          cur = null
          break
        }
      }
      if (typeof cur === 'string') {
        result = cur
      }
    }

    if (result === undefined) {
      result = defaultVal
    }

    if (params && typeof result === 'string') {
      Object.keys(params).forEach(key => {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(params[key]))
      })
    }

    return result
  }

  return {
    locale: computed(() => globalLocale.value),
    setLocale,
    t,
    loadMessages: async () => {},
  }
}

export default useDashboardI18n
