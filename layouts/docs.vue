<template>
    <div class="min-h-screen flex flex-col bg-gray-50 font-body text-navy overflow-x-hidden">
        <!-- Docs Header — always white -->
        <header
            class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm h-16 flex items-center">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
                <!-- Left: Logo + Docs badge -->
                <div class="flex items-center gap-3">
                    <NuxtLink to="/" class="flex items-center gap-2.5">
                        <div class="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                            <img src="/logo.png" alt="Archeryhub.id" class="w-5 h-5 object-contain" />
                        </div>
                        <span class="text-lg font-black tracking-tight text-navy">Archeryhub<span
                                class="text-[#D9FF00]">.id</span></span>
                    </NuxtLink>
                    <div class="items-center gap-2">
                        <span class="text-gray-200 text-lg font-light select-none">/</span>
                        <NuxtLink to="/docs" class="text-sm font-bold text-gray-500 hover:text-navy transition-colors">
                            Docs</NuxtLink>
                    </div>
                </div>
            </div>
        </header>

        <main class="flex-grow pt-16">
            <slot />
        </main>

        <LayoutAppFooter />
        <BaseToast />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineOptions({ name: 'DocsLayout' })

const route = useRoute()
const router = useRouter()

const isSlugPage = computed(() => route.path.startsWith('/docs/') && route.path !== '/docs')
const headerSearch = ref(route.query.q || '')

watch(() => route.query.q, (newQ) => {
    if (newQ !== undefined) {
        headerSearch.value = newQ
    }
})

const onSearchSubmit = () => {
    if (headerSearch.value.trim() !== '') {
        router.push({ path: '/docs', query: { q: headerSearch.value } })
    } else {
        router.push({ path: '/docs' })
    }
}
</script>
