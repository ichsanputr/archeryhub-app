// Theme management composable
import { useState, watch, computed } from '#imports'

export type ThemeValue = 'dark' | 'light'

export const useTheme = () => {
  const theme = useState<ThemeValue>('app.theme', () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark' || stored === 'light') {
        return stored
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    }
    return 'light'
  })

  const isDark = computed(() => theme.value === 'dark')

  const setTheme = (newTheme: ThemeValue): void => {
    theme.value = newTheme
    if (import.meta.client) {
      localStorage.setItem('theme', newTheme)
      updateDocumentClass(newTheme)
    }
  }

  const toggleTheme = (): void => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  const updateDocumentClass = (currentTheme: ThemeValue): void => {
    if (import.meta.client) {
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const initializeTheme = (): void => {
    if (import.meta.client) {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark' || stored === 'light') {
        theme.value = stored
      }
      updateDocumentClass(theme.value)
    }
  }

  watch(theme, (newTheme) => {
    updateDocumentClass(newTheme)
  })

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    initializeTheme
  }
}
