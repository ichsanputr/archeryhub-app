<template>
    <div class="min-h-screen bg-slate-50 font-body text-navy">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24 text-white">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/60"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
            </div>

            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-xs sm:text-sm font-bold tracking-widest mb-6">
                        <Icon icon="ph:buildings-bold" class="text-base sm:text-lg" />
                        <span>{{ t('organizers_page.badge', 'Penyelenggara Panahan Indonesia') }}</span>
                    </div>
                    <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                        {{ t('organizers_page.title', 'Temukan Penyelenggara Panahan') }}
                    </h1>
                    <p class="text-white/80 text-sm md:text-lg leading-relaxed max-w-xl">
                        {{ t('organizers_page.description', 'Jelajahi federasi, asosiasi, dan penyelenggara event panahan terpercaya di Indonesia.') }}
                    </p>
                </div>
            </div>
        </section>

        <!-- Search & Filter Bar -->
        <section class="container mx-auto px-4 max-w-7xl -mt-8 relative z-20">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 flex flex-col md:flex-row gap-4 items-center">
                <div class="flex-1 w-full">
                    <BaseInput v-model="searchQuery" :placeholder="t('organizers_page.search_placeholder', 'Cari nama penyelenggara, kota, atau akronim...')" icon="ph:magnifying-glass"
                        @keyup.enter="doSearch" />
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto shrink-0">
                    <BaseButton variant="primary" icon="ph:magnifying-glass-bold" @click="doSearch" class="h-11 px-6 font-bold w-full md:w-auto">
                        {{ t('organizers_page.search_button', 'Cari') }}
                    </BaseButton>
                    <BaseButton v-if="searchQuery" variant="white" icon="ph:x-bold" @click="resetSearch" class="h-11 px-4 font-bold shrink-0">
                        {{ t('organizers_page.reset_button', 'Reset') }}
                    </BaseButton>
                </div>
            </div>
        </section>

        <!-- Organizers List -->
        <section class="container mx-auto px-4 max-w-7xl py-12 md:py-16">
            <!-- Loading Skeleton -->
            <PublicCardSkeleton v-if="isLoading" :count="6" />

            <!-- Empty State -->
            <div v-else-if="organizers.length === 0" class="py-16 px-6 text-center max-w-sm mx-auto">
                <div class="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                    <Icon icon="ph:buildings" class="text-3xl" />
                </div>
                <h3 class="text-lg font-bold text-navy mb-1">{{ t('organizers_page.empty_title', 'Penyelenggara Tidak Ditemukan') }}</h3>
                <p class="text-sm text-slate-500 font-medium leading-relaxed mb-6">{{ t('organizers_page.empty_description', 'Belum ada penyelenggara yang sesuai dengan kriteria pencarian Anda.') }}</p>
                <BaseButton v-if="searchQuery" variant="outline" size="sm" @click="resetSearch">
                    {{ t('organizers_page.reset_button', 'Hapus Filter') }}
                </BaseButton>
            </div>

            <!-- Organizers Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink v-for="org in organizers" :key="org.id" :to="`/organizer/${org.slug || org.id}`"
                    class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 overflow-hidden group flex flex-col justify-between">
                    <div>
                        <!-- Banner -->
                        <div class="h-24 bg-gradient-to-r from-navy to-slate-900 relative overflow-hidden">
                            <img v-if="org.banner_url" :src="org.banner_url"
                                class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                        </div>

                        <!-- Content -->
                        <div class="p-6 -mt-10 relative">
                            <!-- Logo -->
                            <div class="w-16 h-16 rounded-xl bg-white border-2 border-white shadow-md overflow-hidden mb-4 shrink-0">
                                <img :src="useImageOrDefault(org.avatar_url, org.name)"
                                    class="w-full h-full object-cover" />
                            </div>

                            <div class="flex items-start justify-between gap-2 mb-3">
                                <div class="min-w-0">
                                    <h3
                                        class="text-lg font-bold text-navy group-hover:text-primary transition-colors leading-tight truncate">
                                        {{ org.name }}
                                    </h3>
                                    <p v-if="org.acronym" class="text-xs text-slate-400 font-bold mt-0.5">{{ org.acronym }}</p>
                                </div>
                                <span v-if="org.status === 'active'"
                                    class="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 shrink-0">
                                    <Icon icon="ph:seal-check-fill" class="text-xs" />
                                    {{ t('organizers_page.verified_badge', 'Verified') }}
                                </span>
                            </div>

                            <p class="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                                {{ org.description || t('organizers_page.badge', 'Penyelenggara panahan Indonesia') }}
                            </p>
                        </div>
                    </div>

                    <div class="px-6 pb-6 pt-0 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
                        <span v-if="org.city" class="flex items-center gap-1.5 truncate">
                            <Icon icon="ph:map-pin" class="text-slate-400 shrink-0" />
                            <span class="truncate">{{ org.city }}</span>
                        </span>
                        <span v-else class="text-slate-300">Indonesia</span>
                        
                        <span v-if="org.type" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 font-bold text-[11px]">
                            {{ formatType(org.type) }}
                        </span>
                    </div>
                </NuxtLink>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
    layout: 'landing'
})

const { t } = useI18n()
const apiBaseUrl = useApiBaseUrl()

useHead({
    title: computed(() => t('organizers_page.title', 'Archery Organizers') + ' - Archeris.net'),
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

const searchQuery = ref('')

const formatType = (type) => {
    if (!type) return ''
    return t(`organizers_page.types.${type}`, type)
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

const organizers = computed(() => orgData.value?.organizers || orgData.value?.data?.organizers || orgData.value?.data || [])

const doSearch = () => {
    refresh()
}

const resetSearch = () => {
    searchQuery.value = ''
    refresh()
}
</script>
