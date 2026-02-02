<template>
    <div class="space-y-6">
        <!-- Filters -->
        <div class="space-y-4">
            <!-- Cari Atlet -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div class="relative w-full">
                    <Icon icon="ph:magnifying-glass"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
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
        <div v-if="paginatedAthletes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
            <div v-for="athlete in paginatedAthletes" :key="athlete.id"
                class="group bg-white rounded-2xl p-5 pt-10 shadow-sm border border-gray-100 hover:border-primary transition-all hover:shadow-md relative mt-6">

                <!-- Avatar (Absolute Top Center) -->
                <div
                    class="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 shrink-0 z-10">
                    <img :src="athlete.photo" :alt="athlete.name" class="w-full h-full object-cover">
                </div>

                <div class="text-center mb-4 mt-2">
                    <div class="flex items-center justify-center gap-1 mb-1">
                        <NuxtLink v-if="athlete.username" :to="`/archers/${athlete.username}`"
                            class="font-bold text-navy hover:text-primary transition-colors text-lg line-clamp-2 leading-tight px-4"
                            :title="athlete.name">
                            {{ athlete.name }}
                        </NuxtLink>
                        <span v-else class="font-bold text-navy text-lg line-clamp-2 leading-tight px-4"
                            :title="athlete.name">
                            {{ athlete.name }}
                        </span>
                        <Icon v-if="athlete.verified" icon="ph:check-circle-fill"
                            class="text-blue-500 text-sm shrink-0" />
                    </div>
                    <p class="text-sm text-gray-500 font-medium">{{ athlete.club }}</p>
                </div>

                <div class="flex flex-wrap justify-center gap-2 mb-4">
                    <span
                        class="px-2 py-1 bg-gray-50 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider text-center">{{
                            athlete.division }}</span>
                    <span
                        class="px-2 py-1 bg-gray-50 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider text-center">{{
                            athlete.category }}</span>
                </div>

                <div class="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div class="flex items-center gap-1 text-gray-400">
                        <div>
                            <Icon icon="ph:trophy" class="text-sm" />
                        </div>
                        <div class="text-[10px] mt-0.5 font-bold">{{ athlete.rank === '-' ? 'Belum ada ranking' : `Rank
                            ${athlete.rank}` }}</div>
                    </div>
                    <NuxtLink v-if="athlete.username" :to="`/archers/${athlete.username}`"
                        class="textfont-bold text-xs hover:underline flex items-center gap-1">
                        Profil
                        <Icon icon="ph:arrow-square-out" class="text-sm" />
                    </NuxtLink>
                    <span v-else class="text-xs text-gray-400 italic">Profil tidak tersedia</span>
                </div>
            </div>
        </div>

        <div v-else class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm mt-8">
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

const props = defineProps({
    participants: {
        type: Array,
        default: () => []
    }
})

const activeCategory = ref('Semua')
const searchQuery = ref('')
const currentPage = ref(1)
const limit = 12

const categories = computed(() => {
    const categorySet = new Set()
    props.participants.forEach(p => {
        if (p.division_name && p.gender_division_name) {
            categorySet.add(`${p.division_name} ${p.gender_division_name}`)
        }
    })
    const sorted = Array.from(categorySet).sort()
    return ['Semua', ...sorted]
})

const filteredAthletes = computed(() => {
    let result = props.participants

    // Filter by Search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(p =>
            p.full_name?.toLowerCase().includes(query) ||
            p.club_name?.toLowerCase().includes(query)
        )
    }

    // Filter by Category
    if (activeCategory.value !== 'Semua') {
        result = result.filter(p => {
            const catName = `${p.division_name} ${p.gender_division_name}`
            return catName === activeCategory.value
        })
    }

    return result.map(p => ({
        id: p.id || p.archer_id,
        username: p.username || null,
        name: p.full_name || 'Archery Athlete',
        club: p.club_name || 'Independent',
        photo: useImageOrDefault(p.avatar_url, p.full_name),
        division: p.division_name || 'N/A',
        category: `${p.category_name || ''}${p.event_type_name ? ' - ' + p.event_type_name : ''}${p.gender_division_name ? ' - ' + p.gender_division_name : ''}`.trim() || 'N/A',
        rank: p.rank || '-',
        verified: false
    }))
})

const totalPages = computed(() => Math.ceil(filteredAthletes.value.length / limit) || 1)

const paginatedAthletes = computed(() => {
    const start = (currentPage.value - 1) * limit
    return filteredAthletes.value.slice(start, start + limit)
})

// Reset to page 1 when category or search changes
watch([activeCategory, searchQuery], () => {
    currentPage.value = 1
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
