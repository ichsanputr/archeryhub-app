<template>
    <div class="min-h-screen flex flex-col bg-gray-50 font-body text-navy overflow-x-clip" :class="{ 'dark': isDark }">
        <!-- Docs Header — always white -->
        <header
            class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm h-16 flex items-center">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
                <!-- Left: Logo + Docs badge -->
                <div class="flex items-center gap-3">
                    <NuxtLink to="/" class="flex items-center gap-2.5">
                        <div class="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                            <img src="/logo.png" alt="archeris.net" class="w-5 h-5 object-contain" />
                        </div>
                        <span class="text-lg font-black tracking-tight text-navy">Archeris</span>
                    </NuxtLink>
                    <div class="items-center gap-2">
                        <span class="text-gray-200 text-lg font-light select-none">/</span>
                        <NuxtLink to="/docs" class="text-sm font-bold text-gray-500 hover:text-navy transition-colors">
                            Docs</NuxtLink>
                    </div>
                </div>

                <!-- Right: Search button & Theme Toggle & Language switcher -->
                <div class="flex items-center gap-3">
                    <button
                        @click="searchDialog?.open()"
                        class="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-primary/10 text-gray-400 transition-all text-xs font-medium group"
                    >
                        <Icon icon="ph:magnifying-glass-bold" class="text-base group-hover:text-primary transition-colors" />
                        <span class="hidden sm:inline text-gray-500 transition-colors">Search documentation</span>
                        <kbd class="hidden md:inline-flex items-center px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-300 font-mono ml-1">Ctrl K</kbd>
                    </button>

                    <!-- Theme Toggle -->
                    <button v-if="isSlugPage"
                        @click="toggleDark"
                        class="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all flex items-center justify-center shrink-0 size-9"
                        :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
                    >
                        <Icon :icon="isDark ? 'ph:sun-bold' : 'ph:moon-bold'" class="text-lg text-navy" />
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'DocsLayout' })

const searchDialog = ref(null)
const route = useRoute()
const router = useRouter()

const isSlugPage = computed(() => route.path.startsWith('/docs/') && route.path !== '/docs')
const headerSearch = ref(route.query.q || '')

watch(() => route.query.q, (newQ) => {
    if (newQ !== undefined) {
        headerSearch.value = newQ
    }
})

watch(() => route.path, () => {
    updateDocumentClass()
})

const onSearchSubmit = () => {
    if (headerSearch.value.trim() !== '') {
        router.push({ path: '/docs', query: { q: headerSearch.value } })
    } else {
        router.push({ path: '/docs' })
    }
}

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
    if (isDark.value && isSlugPage.value) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

onMounted(() => {
    if (import.meta.client) {
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
        document.documentElement.classList.remove('dark')
    }
})
</script>

<style>
/* Clean light scrollbars for Docs */
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
</style>


