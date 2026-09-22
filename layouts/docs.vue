<template>
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 font-body text-navy dark:text-slate-100 overflow-x-clip transition-colors duration-200" :class="{ 'dark': isDark }">
        <!-- Docs Header -->
        <header
            class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-sm h-16 flex items-center transition-colors duration-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
                <!-- Left: Logo + Docs badge -->
                <div class="flex items-center gap-3">
                    <NuxtLink to="/" class="flex items-center gap-2.5 group">
                        <img src="/logo.png" alt="Archeris" class="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105" />
                        <span class="text-lg font-black tracking-tight text-navy dark:text-white">Archeris</span>
                    </NuxtLink>
                    <div class="flex items-center gap-2">
                        <span class="text-gray-200 dark:text-slate-700 text-lg font-light select-none">/</span>
                        <NuxtLink to="/docs" class="text-sm font-bold text-gray-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors">
                            Docs</NuxtLink>
                    </div>
                </div>

                <!-- Right: Search button, Language Switcher & Theme Toggle -->
                <div class="flex items-center gap-2 sm:gap-3">
                    <button
                        @click="searchDialog?.open()"
                        class="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-primary/10 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-400 transition-all text-xs font-medium group cursor-pointer border border-transparent dark:border-slate-700"
                    >
                        <Icon icon="ph:magnifying-glass-bold" class="text-base group-hover:text-primary transition-colors" />
                        <span class="hidden sm:inline text-gray-500 dark:text-slate-300 transition-colors">{{ locale === 'id' ? 'Cari dokumentasi' : 'Search documentation' }}</span>
                        <kbd class="hidden md:inline-flex items-center px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded text-xs text-gray-400 dark:text-slate-400 font-mono ml-1">Ctrl K</kbd>
                    </button>

                    <!-- Language Switcher -->
                    <div class="relative" ref="langMenuRef">
                        <button
                            @click="showLangMenu = !showLangMenu"
                            class="flex items-center gap-1.5 px-2.5 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all text-xs font-bold text-gray-700 dark:text-slate-300 border border-transparent dark:border-slate-700 cursor-pointer"
                            :title="locale === 'id' ? 'Ganti Bahasa' : 'Switch Language'"
                        >
                            <Icon :icon="langFlags[locale] || 'circle-flags:us'" class="text-base rounded-full shrink-0" />
                            <span class="font-black uppercase text-[11px]">{{ locale || 'EN' }}</span>
                            <Icon icon="ph:caret-down-bold" class="text-[10px] text-gray-400 dark:text-slate-500 transition-transform duration-200" :class="{ 'rotate-180': showLangMenu }" />
                        </button>

                        <Transition
                            enter-active-class="transition duration-150 ease-out"
                            enter-from-class="opacity-0 translate-y-1 scale-95"
                            enter-to-class="opacity-100 translate-y-0 scale-100"
                            leave-active-class="transition duration-100 ease-in"
                            leave-from-class="opacity-100 translate-y-0 scale-100"
                            leave-to-class="opacity-0 translate-y-1 scale-95"
                        >
                            <div v-if="showLangMenu" class="absolute right-0 top-full mt-1.5 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden py-1 z-50">
                                <button
                                    v-for="l in supportedLocales"
                                    :key="l.code"
                                    @click="switchLocale(l.code)"
                                    class="flex items-center gap-2.5 w-full px-3 py-2 text-xs transition-colors cursor-pointer"
                                    :class="locale === l.code ? 'bg-primary/15 text-navy dark:text-primary font-black' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 font-medium'"
                                >
                                    <Icon :icon="langFlags[l.code]" class="text-sm rounded-full shrink-0" />
                                    <span class="flex-1 text-left">{{ l.name }}</span>
                                    <Icon v-if="locale === l.code" icon="ph:check-bold" class="text-xs text-primary" />
                                </button>
                            </div>
                        </Transition>
                    </div>

                    <!-- Theme Toggle -->
                    <button
                        @click="toggleDark"
                        class="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-yellow-400 transition-all flex items-center justify-center shrink-0 size-9 cursor-pointer border border-transparent dark:border-slate-700"
                        :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
                    >
                        <Icon :icon="isDark ? 'ph:sun-bold' : 'ph:moon-bold'" class="text-lg text-navy dark:text-yellow-400" />
                    </button>
                </div>
            </div>
        </header>

        <DocSearchDialog ref="searchDialog" />

        <main class="flex-grow pt-16">
            <slot />
        </main>

        <LayoutAppFooter />
        <BaseToast />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import DocSearchDialog from '~/components/layout/DocSearchDialog.vue'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'DocsLayout' })

const searchDialog = ref(null)
const route = useRoute()
const router = useRouter()

// Language switcher
const { locale, setLocale, setLocaleCookie, loadLocaleMessages } = useI18n()
const showLangMenu = ref(false)
const langMenuRef = ref(null)
const supportedLocales = [
    { code: 'en', name: 'English' },
    { code: 'id', name: 'Indonesia' }
]
const langFlags = {
    en: 'circle-flags:us',
    id: 'circle-flags:id'
}

const switchLocale = async (code) => {
    if (typeof loadLocaleMessages === 'function') {
        await loadLocaleMessages(code)
    }
    if (typeof setLocale === 'function') {
        await setLocale(code)
    } else {
        locale.value = code
    }
    if (typeof setLocaleCookie === 'function') {
        setLocaleCookie(code)
    }
    if (import.meta.client) {
        try {
            localStorage.setItem('docs_locale', code)
            localStorage.setItem('dashboard_locale', code)
        } catch (e) {}
    }
    showLangMenu.value = false
}

const handleClickOutside = (e) => {
    if (langMenuRef.value && !langMenuRef.value.contains(e.target)) {
        showLangMenu.value = false
    }
}

const headerSearch = ref(route.query.q || '')

watch(() => route.query.q, (newQ) => {
    if (newQ !== undefined) {
        headerSearch.value = newQ
    }
})

watch(() => route.path, () => {
    updateDocumentClass()
})

// Custom dark mode toggle
const isDark = ref(false)

const toggleDark = () => {
    isDark.value = !isDark.value
    if (import.meta.client) {
        localStorage.setItem('docs-theme', isDark.value ? 'dark' : 'light')
        updateDocumentClass()
    }
}

const updateDocumentClass = () => {
    if (!import.meta.client) return
    if (isDark.value) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

onMounted(() => {
    if (import.meta.client) {
        document.addEventListener('click', handleClickOutside)
        const saved = localStorage.getItem('docs-theme')
        if (saved === 'dark') {
            isDark.value = true
        } else {
            isDark.value = false
        }
        updateDocumentClass()
    }
})

onUnmounted(() => {
    if (import.meta.client) {
        document.removeEventListener('click', handleClickOutside)
        document.documentElement.classList.remove('dark')
    }
})
</script>

<style>
/* Clean scrollbars for Docs */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.scrollbar-styled::-webkit-scrollbar {
    width: 4px;
}
.scrollbar-styled::-webkit-scrollbar-track {
    background: transparent;
}
.scrollbar-styled::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
.dark .scrollbar-styled::-webkit-scrollbar-thumb {
    background: #334155;
}
</style>


