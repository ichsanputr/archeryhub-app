<template>
    <div class="space-y-6">
        <!-- Filters -->
        <div class="space-y-4">
            <!-- Cari Atlet -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div class="relative w-full">
                    <Icon icon="ph:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                    <input v-model="searchQuery" type="text" placeholder="Cari atlet atau klub..."
                        class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm text-sm">
                </div>
            </div>

            <!-- Tipe / Divisi -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Tipe / Divisi</p>
                <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <button v-for="cat in categories" :key="cat" @click="activeCategory = cat; currentPage = 1"
                        class="px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap shadow-sm border"
                        :class="activeCategory === cat ? 'bg-navy text-primary border-navy' : 'bg-white text-gray-500 border-gray-100 hover:border-navy hover:text-navy'">
                        {{ cat }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Athletes Grid -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
            <div v-for="i in 6" :key="i" class="h-48 bg-white rounded-2xl animate-pulse border border-gray-100"></div>
        </div>

        <div v-else-if="athletes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="athlete in athletes" :key="athlete.id"
                class="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-primary transition-all hover:shadow-md">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-50 bg-gray-100 shrink-0">
                        <img :src="athlete.photo" :alt="athlete.name" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <div class="flex items-center gap-1">
                            <NuxtLink :to="`/archers/${athlete.id}`"
                                class="font-bold text-navy truncate hover:text-primary transition-colors">
                                {{ athlete.name }}
                            </NuxtLink>
                            <Icon v-if="athlete.verified" icon="ph:check-circle-fill" class="text-blue-500 text-sm" />
                        </div>
                        <p class="text-xs text-gray-500 font-medium">{{ athlete.club }}</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                    <span
                        class="px-2 py-1 bg-gray-50 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">{{
                            athlete.division }}</span>
                    <span
                        class="px-2 py-1 bg-gray-50 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">{{
                            athlete.category }}</span>
                </div>

                <div class="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div class="flex items-center gap-1 text-gray-400">
                        <Icon icon="ph:trophy" class="text-sm" />
                        <span class="text-[10px] font-bold">{{ athlete.rank === '-' ? 'Belum ada ranking' : `Rank ${athlete.rank}` }}</span>
                    </div>
                    <NuxtLink :to="`/archers/${athlete.id}`"
                        class="text-primary font-bold text-xs hover:underline flex items-center gap-1">
                        Profil <Icon icon="ph:arrow-square-out" class="text-sm" />
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div v-else class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <Icon icon="ph:users-three" class="text-6xl text-gray-200 mb-4 mx-auto" />
            <p class="text-gray-500 font-medium">Belum ada peserta yang terdaftar untuk kategori ini.</p>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-8">
            <button @click="currentPage--" :disabled="currentPage === 1"
                class="p-2 rounded-lg border border-gray-100 text-gray-400 hover:text-navy transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <Icon icon="ph:caret-left" />
            </button>
            <button v-for="i in totalPages" :key="i" @click="currentPage = i"
                class="w-10 h-10 rounded-lg border font-bold text-sm"
                :class="currentPage === i ? 'bg-navy text-primary border-navy' : 'border-gray-100 text-gray-400 hover:text-navy'">
                {{ i }}
            </button>
            <button @click="currentPage++" :disabled="currentPage === totalPages"
                class="p-2 rounded-lg border border-gray-100 text-gray-400 hover:text-navy transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <Icon icon="ph:caret-right" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const route = useRoute()
const { get } = useApi()
const slug = route.params.slug

const activeCategory = ref('Semua')
const searchQuery = ref('')
const athletes = ref([])
const totalPages = ref(1)
const currentPage = ref(1)
const isLoading = ref(true)
const categories = ref(['Semua'])

// Fetch available categories from participants
const fetchCategories = async () => {
    try {
        // Fetch all participants to get unique division+gender combinations
        const response = await get(`/events/${slug}/participants`, { query: { limit: 1000, offset: 0 } })
        const participants = response?.participants || []
        
        // Build unique category list from actual participants
        const categorySet = new Set(['Semua'])
        participants.forEach(p => {
            if (p.division_name && p.gender_division_name) {
                categorySet.add(`${p.division_name} ${p.gender_division_name}`)
            }
        })
        categories.value = Array.from(categorySet).sort()
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

const fetchParticipants = async () => {
    isLoading.value = true
    try {
        // Calculate offset from page number
        const limit = 12
        const offset = (currentPage.value - 1) * limit
        
        const params = {
            limit: limit,
            offset: offset,
        }
        if (searchQuery.value) {
            params.search = searchQuery.value
        }
        if (activeCategory.value !== 'Semua') {
            params.category = activeCategory.value
        }

        // Build query string manually to ensure params are passed correctly
        const queryString = new URLSearchParams()
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryString.append(key, String(params[key]))
            }
        })
        const queryStr = queryString.toString()
        const url = `/events/${slug}/participants${queryStr ? '?' + queryStr : ''}`
        
        console.log('[AthletesTab] Fetching participants with params:', params, 'URL:', url)
        const response = await get(url)

        // API returns { participants: [], total: number, limit: number, offset: number }
        const participants = response?.participants || []
        
        if (participants && participants.length > 0) {
            athletes.value = participants.map(p => ({
                id: p.id || p.archer_id,
                name: p.full_name || 'Archery Athlete',
                club: p.club_name || 'Independent',
                photo: p.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN1PKK-zE7gHxiw_aZW8rQ0RXGOUpoAcMX2PerB54W68JgnLtpC0teJYHN1wn5e5Hh5e7o7hzPx_gF8FzvqgkTykuPW2RnCBPrctcfBT9awfftTun8hn_I_2ZdxlhEv7PrrhUSinekRNDYnLyMPUAORFdirFzIiXQuRgcjinT9Jt1Bm_tkVNee3C9NqqYUBs1lYfaFEzgXRZeUvKrEP8FnQOWtp5St5c_s1o-sIV5ALK6iV0TBRUhB2AFDYY_qRHsVDugx540fhIw',
                division: p.division_name || 'N/A',
                category: `${p.category_name || ''}${p.event_type_name ? ' - ' + p.event_type_name : ''}${p.gender_division_name ? ' - ' + p.gender_division_name : ''}`.trim() || 'N/A',
                rank: p.rank || '-',
                verified: false // TODO: Add verification status to API response
            }))
            const total = response?.total || 0
            totalPages.value = Math.ceil(total / limit) || 1
        } else {
            athletes.value = []
            totalPages.value = 1
        }
    } catch (error) {
        console.error('Failed to fetch participants:', error)
        athletes.value = []
        totalPages.value = 1
    } finally {
        isLoading.value = false
    }
}

watch(activeCategory, () => {
    // Reset to page 1 when category changes
    currentPage.value = 1
    fetchParticipants()
})

watch(currentPage, () => {
    fetchParticipants()
})

let searchTimeout
watch(searchQuery, () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        currentPage.value = 1
        fetchParticipants()
    }, 500)
})

onMounted(() => {
    fetchCategories()
    fetchParticipants()
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
