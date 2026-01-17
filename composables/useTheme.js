// Theme management composable
import { useState, watch } from '#imports'

export const useTheme = () => {
    const theme = useState('app.theme', () => {
        // On client, check localStorage first
        if (import.meta.client) {
            const stored = localStorage.getItem('theme')
            if (stored === 'dark' || stored === 'light') {
                return stored
            }
            // Check system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark'
            }
        }
        // Default to light
        return 'light'
    })

    const isDark = computed(() => theme.value === 'dark')

    const setTheme = (newTheme) => {
        theme.value = newTheme
        if (import.meta.client) {
            localStorage.setItem('theme', newTheme)
            updateDocumentClass(newTheme)
        }
    }

    const toggleTheme = () => {
        setTheme(theme.value === 'dark' ? 'light' : 'dark')
    }

    const updateDocumentClass = (currentTheme) => {
        if (import.meta.client) {
            if (currentTheme === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        }
    }

    // Initialize theme on client
    const initializeTheme = () => {
        if (import.meta.client) {
            const stored = localStorage.getItem('theme')
            if (stored === 'dark' || stored === 'light') {
                theme.value = stored
            }
            updateDocumentClass(theme.value)
        }
    }

    // Watch for theme changes
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
