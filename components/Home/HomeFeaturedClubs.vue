<template>
    <section class="bg-[#f8fafc] py-16 md:py-20 border-y border-gray-200 relative z-10">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-lg sm:text-2xl font-black text-navy mb-2 font-display">Klub Pilihan</h2>
                    <p class="text-gray-500 text-xs sm:text-sm hidden sm:block">Cek klub panahan keren di sekitar
                        kamu.</p>
                </div>
                <NuxtLink to="/clubs"
                    class="text-navy hover:text-primary font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 group">
                    <span class="hidden sm:inline">Cek Semua Klub</span>
                    <span class="sm:hidden">Semua Klub</span>
                    <span
                        class="material-symbols-outlined text-base sm:text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                </NuxtLink>
            </div>

            <div v-if="loading" class="flex items-center justify-center py-20">
                <Icon icon="ph:circle-notch-bold" class="text-4xl text-primary animate-spin" />
            </div>

            <template v-else>
                <div
                    class="flex flex-nowrap items-center gap-3 mb-8 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                    <button v-for="region in regions" :key="region"
                        class="px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex-shrink-0"
                        :class="activeRegion === region ? 'bg-primary text-navy shadow-md' : 'bg-slate-200/70 text-navy hover:bg-slate-300'"
                        @click="activeRegion = region">
                        {{ region }}
                    </button>
                </div>

                <div v-if="filteredClubs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="club in filteredClubs" :key="club.name"
                        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-sm hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center relative group">
                        <div v-if="club.verified"
                            class="absolute top-3 right-3 bg-primary text-navy px-2 py-0.5 rounded text-[10px] font-bold  tracking-wider flex items-center gap-1 shadow-sm">
                            <span class="material-symbols-outlined text-[14px] fill-1">verified</span> Verifikasi
                        </div>
                        <div
                            class="w-20 h-20 rounded-2xl bg-navy/5 text-navy flex items-center justify-center mb-4 transition-transform duration-300 overflow-hidden">
                            <img v-if="club.logo_url" :src="useImageOrDefault(club.logo_url)" :alt="club.name"
                                class="w-full h-full object-cover" />
                            <span v-else class="material-symbols-outlined text-4xl">{{ club.icon }}</span>
                        </div>
                        <h3 class="text-base sm:text-lg font-bold text-navy mb-1 font-display">{{ club.name }}</h3>
                        <div class="flex items-center gap-1 text-gray-500 text-xs sm:text-sm mb-6">
                            <span class="material-symbols-outlined text-sm sm:text-base">location_on</span>
                            <span>{{ club.location }}</span>
                        </div>
                        <NuxtLink :to="`/clubs/${club.slug}`"
                            class="w-full mt-auto py-2.5 px-4 bg-primary hover:bg-primary-hover text-navy font-bold text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
                            Cek Profil
                        </NuxtLink>
                    </div>
                </div>
                <div v-else class="text-center py-16">
                    <Icon icon="ph:shield-slash-light" class="text-7xl text-gray-200 mb-4 mx-auto" />
                    <p class="text-sm text-gray-400 font-medium">Belum ada klub di wilayah ini.</p>
                </div>
            </template>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

const regions = ['Semua Wilayah', 'DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'DI Yogyakarta', 'Banten', 'Bali']
const activeRegion = ref('Semua Wilayah')

const provinceToRegion = {
    'DKI Jakarta': 'DKI Jakarta',
    'Jawa Barat': 'Jawa Barat',
    'Jawa Timur': 'Jawa Timur',
    'DI Yogyakarta': 'DI Yogyakarta',
    'Banten': 'Banten',
    'Bali': 'Bali'
}

const { data: clubsResponse, pending: loading } = await useAsyncData(
    'featured-clubs',
    () => $fetch(`${apiBaseUrl}/clubs`, {
        query: { limit: '20' }
    })
)

const clubs = computed(() => {
    const clubsData = clubsResponse.value?.data || []
    return clubsData.map(club => ({
        slug: club.slug,
        name: club.name,
        location: club.city ? `${club.city}${club.province ? ', ' + club.province : ''}` : (club.province || ''),
        icon: 'target',
        verified: club.verification_status === 'verified',
        logo_url: club.logo_url,
        region: provinceToRegion[club.province] || club.province || 'Semua Wilayah'
    }))
})

const filteredClubs = computed(() => {
    if (activeRegion.value === 'Semua Wilayah') return clubs.value
    return clubs.value.filter(club => club.region === activeRegion.value)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
