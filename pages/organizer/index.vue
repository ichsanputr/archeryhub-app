<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20 relative overflow-hidden">
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-30"></div>
            </div>
            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary text-sm font-bold mb-6">
                        <Icon icon="ph:buildings-bold" />
                        Penyelenggara Panahan Indonesia
                    </div>
                    <h1 class="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">
                        Temukan Penyelenggara Panahan
                    </h1>
                    <p class="text-lg text-blue-200 max-w-xl">
                        Jelajahi federasi, asosiasi, dan penyelenggara event panahan terpercaya di Indonesia.
                    </p>
                </div>
            </div>
        </section>

        <!-- Search & Filter -->
        <section class="container mx-auto px-4 max-w-7xl -mt-8 relative z-20">
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                    <BaseInput v-model="searchQuery" placeholder="Cari nama penyelenggara..." icon="ph:magnifying-glass" />
                </div>
                <BaseButton variant="primary" icon="ph:funnel" @click="doSearch">
                    Cari
                </BaseButton>
            </div>
        </section>

        <!-- Organizers List -->
        <section class="container mx-auto px-4 max-w-7xl py-16">
            <div v-if="isLoading" class="flex justify-center items-center py-20">
                <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div v-else-if="organizers.length === 0" class="text-center py-20">
                <Icon icon="ph:buildings" class="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 class="text-xl font-bold text-gray-500">Tidak ada penyelenggara ditemukan</h3>
                <p class="text-gray-400 mt-2">Coba gunakan kata kunci lain</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink v-for="org in organizers" :key="org.id" :to="`/organizer/${org.slug || org.id}`"
                    class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all overflow-hidden group">
                    <!-- Banner -->
                    <div class="h-24 bg-gradient-to-r from-navy to-blue-900 relative">
                        <img v-if="org.banner_url" :src="org.banner_url"
                            class="w-full h-full object-cover opacity-60" />
                    </div>

                    <!-- Content -->
                    <div class="p-6 -mt-10 relative">
                        <!-- Logo -->
                        <div class="w-16 h-16 rounded-xl bg-white border-2 border-white shadow-sm overflow-hidden mb-4">
                            <img :src="useImageOrDefault(org.avatar_url, org.name)"
                                class="w-full h-full object-cover" />
                        </div>

                        <div class="flex items-start justify-between gap-2 mb-3">
                            <div>
                                <h3
                                    class="text-lg font-black text-navy group-hover:text-primary transition-colors leading-tight">
                                    {{ org.name }}
                                </h3>
                                <p v-if="org.acronym" class="text-sm text-gray-400 font-bold">{{ org.acronym }}</p>
                            </div>
                            <span v-if="org.status === 'active'"
                                class="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full ">
                                <Icon icon="ph:seal-check-fill" />
                                Verified
                            </span>
                        </div>

                        <p class="text-sm text-gray-500 line-clamp-2 mb-4">
                            {{ org.description || 'Penyelenggara panahan Indonesia' }}
                        </p>

                        <div class="flex items-center gap-4 text-xs text-gray-400">
                            <span v-if="org.city" class="flex items-center gap-1">
                                <Icon icon="ph:map-pin" />
                                {{ org.city }}
                            </span>
                            <span v-if="org.type" class="flex items-center gap-1">
                                <Icon icon="ph:tag" />
                                {{ typeLabels[org.type] || org.type }}
                            </span>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
    layout: 'landing'
})

useHead({
    title: 'Penyelenggara Panahan - Archeris.net',
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

useSeoMeta({
    title: 'Penyelenggara Panahan - Archeris.net',
    description: 'Temukan federasi, asosiasi, dan penyelenggara event panahan terpercaya di Indonesia.',
    ogTitle: 'Penyelenggara Panahan - Archeris.net',
    ogDescription: 'Temukan federasi, asosiasi, dan penyelenggara event panahan terpercaya di Indonesia.'
})

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

const searchQuery = ref('')

const typeLabels = {
    federation: 'Federasi',
    association: 'Asosiasi',
    committee: 'Komite',
    sponsor: 'Sponsor',
    other: 'Lainnya'
}

const { data: orgData, pending: isLoading, refresh } = await useAsyncData(
    'organizers',
    () => {
        const params = new URLSearchParams()
        if (searchQuery.value) {
            params.append('search', searchQuery.value)
        }
        return $fetch(`${apiBaseUrl}/organizers?${params.toString()}`)
    },
    { server: true }
)

const organizers = computed(() => orgData.value?.organizers || orgData.value?.data?.organizers || [])

const doSearch = () => {
    refresh()
}
</script>
