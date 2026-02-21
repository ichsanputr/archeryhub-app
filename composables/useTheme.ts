import { computed, watch, ref } from 'vue'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

export interface ThemeColors {
  primary: string
  primaryHover: string
  sidebarBg: string
  sidebarText: string
  headerBg: string
  headerText: string
  accent: string
  motif: string
  motifOpacity: string
}

export const themes: Record<string, ThemeColors> = {
  default: {
    primary: '#D9FF00', // Neon Lime
    primaryHover: '#C2E600',
    sidebarBg: '#0f172a',
    sidebarText: '#94a3b8',
    headerBg: '#ffffff',
    headerText: '#0f172a',
    accent: '#D9FF00',
    motif: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
    motifOpacity: '0.2'
  },
  midnight: {
    primary: '#6366f1', // Indigo
    primaryHover: '#4f46e5',
    sidebarBg: '#1e1b4b',
    sidebarText: '#c7d2fe',
    headerBg: '#ffffff',
    headerText: '#1e1b4b',
    accent: '#818cf8',
    motif: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
    motifOpacity: '0.4'
  },
  emerald: {
    primary: '#10b981', // Emerald
    primaryHover: '#059669',
    sidebarBg: '#064e3b',
    sidebarText: '#a7f3d0',
    headerBg: '#ffffff',
    headerText: '#064e3b',
    accent: '#34d399',
    motif: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
    motifOpacity: '0.15'
  },
  crimson: {
    primary: '#ef4444', // Red
    primaryHover: '#dc2626',
    sidebarBg: '#450a0a',
    sidebarText: '#fecaca',
    headerBg: '#ffffff',
    headerText: '#450a0a',
    accent: '#f87171',
    motif: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 40px)',
    motifOpacity: '0.3'
  },
  sunset: {
    primary: '#f97316', // Orange
    primaryHover: '#ea580c',
    sidebarBg: '#431407',
    sidebarText: '#fed7aa',
    headerBg: '#ffffff',
    headerText: '#431407',
    accent: '#fb923c',
    motif: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
    motifOpacity: '0.5'
  },
  obsidian: {
    primary: '#d1d5db',
    primaryHover: '#9ca3af',
    sidebarBg: '#000000',
    sidebarText: '#9ca3af',
    headerBg: '#111827',
    headerText: '#ffffff',
    accent: '#4b5563',
    motif: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 20px)',
    motifOpacity: '0.4'
  }
}

export const useTheme = () => {
  const { user } = useAuth()
  const { get, put } = useApi()

  const currentTheme = useState('active-theme', () => 'default')
  const isSyncing = ref(false)
  const isThemeLoading = useState('theme-loading', () => true)

  const themeColors = computed(() => themes[currentTheme.value] || themes.default)

  const applyTheme = () => {
    if (import.meta.server) return

    const colors = themeColors.value
    const root = document.documentElement

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ?
        `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` :
        '0 0 0'
    }

    root.style.setProperty('--primary-color', colors.primary)
    root.style.setProperty('--primary-rgb', hexToRgb(colors.primary))
    root.style.setProperty('--primary-hover', colors.primaryHover)
    root.style.setProperty('--sidebar-bg', colors.sidebarBg)
    root.style.setProperty('--sidebar-bg-rgb', hexToRgb(colors.sidebarBg))
    root.style.setProperty('--sidebar-text', colors.sidebarText)
    root.style.setProperty('--header-bg', colors.headerBg)
    root.style.setProperty('--header-bg-rgb', hexToRgb(colors.headerBg))
    root.style.setProperty('--header-text', colors.headerText)
    root.style.setProperty('--accent-color', colors.accent)
    root.style.setProperty('--accent-rgb', hexToRgb(colors.accent))
    root.style.setProperty('--motif-pattern', colors.motif)
    root.style.setProperty('--motif-opacity', colors.motifOpacity)
  }

  const fetchThemeFromServer = async () => {
    if (!user.value) return

    try {
      const response = await get<{ dashboard_theme: string }>('/user/settings')
      if (response && response.dashboard_theme) {
        currentTheme.value = response.dashboard_theme
        applyTheme()
      }
    } catch (error) {
      console.warn('Failed to fetch theme from server:', error)
    }
  }

  const saveThemeToServer = async (themeName: string) => {
    if (!user.value) return

    isSyncing.value = true
    try {
      await put('/user/settings', {
        dashboard_theme: themeName
      })
    } catch (error) {
      console.error('Failed to save theme to server:', error)
    } finally {
      isSyncing.value = false
    }
  }

  const initializeTheme = async () => {
    isThemeLoading.value = true

    try {
      applyTheme()

      if (user.value) {
        await fetchThemeFromServer()
      }

      // Add a small delay for smoother transition
      if (import.meta.client) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } finally {
      isThemeLoading.value = false
    }

    watch(user, async (newUser) => {
      if (newUser) {
        await fetchThemeFromServer()
      } else {
        currentTheme.value = 'default'
        applyTheme()
      }
    })

    watch(currentTheme, (newTheme) => {
      applyTheme()
      saveThemeToServer(newTheme)
    })
  }

  const removeTheme = () => {
    if (import.meta.server) return
    const root = document.documentElement
    const props = [
      '--primary-color', '--primary-rgb', '--primary-hover',
      '--sidebar-bg', '--sidebar-bg-rgb', '--sidebar-text',
      '--header-bg', '--header-bg-rgb', '--header-text',
      '--accent-color', '--accent-rgb',
      '--motif-pattern', '--motif-opacity'
    ]
    props.forEach(p => root.style.removeProperty(p))
  }

  return {
    currentTheme,
    themeColors,
    applyTheme,
    initializeTheme,
    removeTheme,
    fetchThemeFromServer,
    saveThemeToServer,
    isSyncing,
    isThemeLoading,
    themes
  }
}
