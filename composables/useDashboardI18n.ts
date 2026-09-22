import { ref, computed, watch } from 'vue'
import enCommon from '../i18n/locales/en/common.json'
import enAuth from '../i18n/locales/en/auth.json'
import enDashboard from '../i18n/locales/en/dashboard.json'
import enTournaments from '../i18n/locales/en/tournaments.json'
import enArchers from '../i18n/locales/en/archers.json'
import enCommerce from '../i18n/locales/en/commerce.json'

import idCommon from '../i18n/locales/id/common.json'
import idAuth from '../i18n/locales/id/auth.json'
import idDashboard from '../i18n/locales/id/dashboard.json'
import idTournaments from '../i18n/locales/id/tournaments.json'
import idArchers from '../i18n/locales/id/archers.json'
import idCommerce from '../i18n/locales/id/commerce.json'

const LS_KEY_LOCALE = 'dashboard_locale'

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}

function deepMerge(target: any, source: any): any {
  const output = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = deepMerge(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

const enModules = [enCommon, enAuth, enDashboard, enTournaments, enArchers, enCommerce]
const idModules = [idCommon, idAuth, idDashboard, idTournaments, idArchers, idCommerce]

let enMessages: Record<string, any> = {}
for (const m of enModules) {
  enMessages = deepMerge(enMessages, m)
}

let idMessages: Record<string, any> = {}
for (const m of idModules) {
  idMessages = deepMerge(idMessages, m)
}

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
    if (loc !== 'en' && loc !== 'id') return
    globalLocale.value = loc
    if (process.client) {
      try { localStorage.setItem(LS_KEY_LOCALE, loc) } catch {}
      try {
        document.cookie = `i18n_redirected=${loc}; path=/; max-age=31536000`
      } catch {}
    }
    try {
      const maybeUseNuxt = (globalThis as any).useNuxtApp || (typeof useNuxtApp === 'function' ? useNuxtApp : undefined)
      const nuxt = maybeUseNuxt ? (maybeUseNuxt as any)() : undefined
      const globalI18n = nuxt && (nuxt.$i18n || nuxt.app?.$i18n)
      if (globalI18n) {
        if (typeof globalI18n.setLocale === 'function') {
          globalI18n.setLocale(loc)
        } else if (globalI18n.locale && typeof globalI18n.locale === 'object' && 'value' in globalI18n.locale) {
          globalI18n.locale.value = loc
        } else if (typeof globalI18n.locale === 'string') {
          globalI18n.locale = loc
        }
      }
    } catch (e) {}
  }

  function t(path: string, paramsOrDefault?: any, fallback = ''): string {
    let params: Record<string, any> | undefined = undefined
    let defaultVal = fallback

    if (typeof paramsOrDefault === 'object' && paramsOrDefault !== null) {
      params = paramsOrDefault
    } else if (typeof paramsOrDefault === 'string') {
      defaultVal = paramsOrDefault
    }

    const resolveInMap = (msg: any, pth: string): string | undefined => {
      if (!msg) return undefined
      const checkPath = (pStr: string) => {
        const parts = pStr.split('.')
        let cur: any = msg
        for (const p of parts) {
          if (cur && typeof cur === 'object' && p in cur) cur = cur[p]
          else return undefined
        }
        return typeof cur === 'string' ? cur : undefined
      }

      let res = checkPath(pth)
      if (res !== undefined) return res

      if (pth.startsWith('dashboard.')) {
        res = checkPath(pth.replace(/^dashboard\./, ''))
        if (res !== undefined) return res
      } else {
        res = checkPath('dashboard.' + pth)
        if (res !== undefined) return res
      }
      return undefined
    }

    const currentMsg = localeMap[globalLocale.value] || localeMap.en || {}
    let result = resolveInMap(currentMsg, path)

    // If missing in current locale, try English fallback before defaultVal
    if (result === undefined && globalLocale.value !== 'en' && localeMap.en) {
      result = resolveInMap(localeMap.en, path)
    }

    // Try global Nuxt i18n
    if (result === undefined) {
      try {
        const maybeUseNuxt = (globalThis as any).useNuxtApp || (typeof useNuxtApp === 'function' ? useNuxtApp : undefined)
        const nuxt = maybeUseNuxt ? (maybeUseNuxt as any)() : undefined
        const globalI18n = nuxt && (nuxt.$i18n || nuxt.app?.$i18n)
        if (globalI18n && typeof globalI18n.t === 'function') {
          const nuxtRes = globalI18n.t(path, params)
          if (nuxtRes && nuxtRes !== path) {
            result = nuxtRes
          }
        }
      } catch (e) {}
    }

    if (result === undefined) {
      result = defaultVal || path
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
