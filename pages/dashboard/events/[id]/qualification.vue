<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Report Header -->
        <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0 opacity-20" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);"></div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <div class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:chart-bar" class="text-primary text-2xl" />
                        </div>
                        <div class="flex-1">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                Laporan Kualifikasi
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                Ringkasan progres dan peringkat peserta berdasarkan kategori. Halaman ini bersifat laporan (read-only).
                            </p>
                        </div>
                    </div>

                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton variant="white" icon="ph:arrows-clockwise" class="h-11 px-5" @click="fetchLeaderboard">
                            Refresh
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <div class="min-w-[260px]">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Kategori</label>
                        <select v-model="selectedCategoryId"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <option value="">Pilih Kategori</option>
                            <option v-for="cat in eventCategories" :key="cat.id" :value="cat.id">
                                {{ cat.label }}
                            </option>
                        </select>
                    </div>
                    <div class="min-w-[260px]">
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Cari</label>
                        <BaseInput v-model="searchQuery" placeholder="Cari atlet..." icon="ph:magnifying-glass"
                            class="!h-11 text-sm" />
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div class="bg-gray-50 rounded-xl border border-gray-100 p-4">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Peserta</p>
                        <p class="text-2xl font-black text-navy">{{ totalParticipants }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-xl border border-gray-100 p-4">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rata-rata Skor</p>
                        <p class="text-2xl font-black text-navy">{{ averageTotalScore }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-xl border border-gray-100 p-4">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Top Skor</p>
                        <p class="text-2xl font-black text-navy">{{ topScore }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-xl border border-gray-100 p-4">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">End Terbanyak</p>
                        <p class="text-2xl font-black text-navy">{{ maxEndsCompleted }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-6">
            <!-- Leaderboard Table -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 class="text-[11px] font-black text-navy uppercase tracking-widest">Peringkat Langsung</h3>
                    <div class="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        {{ selectedCategoryLabel }}
                    </div>
                </div>
                <div class="flex-1 overflow-x-auto scrollbar-thin">
                    <table class="w-full text-left">
                        <thead
                            class="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-10 border-b border-gray-100">
                            <tr class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <th class="px-6 py-4 w-16">Rank</th>
                                <th class="px-6 py-4">Atlet</th>
                                <th class="px-6 py-4">Klub</th>
                                <th class="px-6 py-4 text-center">Score</th>
                                <th class="px-6 py-4 text-center">X+10</th>
                                <th class="px-6 py-4 text-right">End</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="(archer, i) in filteredArchers" :key="archer.archer_name + '-' + i"
                                class="group hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4">
                                    <span :class="i < 3 ? 'bg-primary text-navy font-black' : 'text-gray-400 font-bold'"
                                        class="text-[11px] px-2 py-0.5 rounded shadow-sm">
                                        {{ i + 1 }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                                            <Icon icon="ph:user" class="text-gray-300" />
                                        </div>
                                        <div>
                                            <p class="text-xs font-black text-navy tracking-tight leading-none mb-1">{{
                                                archer.name }}</p>
                                <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{{
                                                archer.category_name }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{{
                                        archer.club_name || '-' }}</span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="text-sm font-black text-navy">{{ archer.total_score }}</span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="text-xs font-bold text-gray-400">{{ archer.total_10x }}+{{ archer.total_x }}</span>
                                </td>
                                <td class="px-6 py-4 text-right text-[10px] text-gray-400">
                                    End {{ archer.ends_completed }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Right column reserved for future live controls (removed Timer & Info cards as requested) -->
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const { get } = useApi()
const { setEvent } = useEventContext()

const searchQuery = ref('')
const eventCategories = ref([])
const selectedCategoryId = ref('')
const leaderboard = ref([])
const isLoading = ref(false)

const fetchEventDetails = async () => {
    try {
        const eventRes = await get(`/events/${route.params.id}`)
        if (eventRes) {
            setEvent(eventRes)
        }
    } catch (error) {
        console.error('Failed to fetch event details:', error)
    }
}

const fetchCategories = async () => {
    try {
        const res = await get(`/events/${route.params.id}/categories`)
        const cats = res?.events || res?.categories || []
        eventCategories.value = cats.map(c => ({
            id: c.id || c.uuid,
            label: `${c.division_name || ''} ${c.category_name || ''}`.trim() || 'Kategori',
        }))
        if (eventCategories.value.length && !selectedCategoryId.value) {
            selectedCategoryId.value = eventCategories.value[0].id
        }
    } catch (e) {
        console.error('Failed to fetch categories:', e)
    }
}

const fetchLeaderboard = async () => {
    if (!selectedCategoryId.value) {
        leaderboard.value = []
        return
    }
    try {
        isLoading.value = true
        const res = await get(`/qualification/leaderboard/${selectedCategoryId.value}`)
        leaderboard.value = res?.leaderboard || []
    } catch (e) {
        console.error('Failed to fetch leaderboard:', e)
        leaderboard.value = []
    } finally {
        isLoading.value = false
    }
}

const filteredArchers = computed(() => {
    let rows = leaderboard.value
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        rows = rows.filter(a => a.archer_name.toLowerCase().includes(q))
    }
    return rows
})

onMounted(async () => {
    await fetchEventDetails()
    await fetchCategories()
    await fetchLeaderboard()
})

watch(selectedCategoryId, () => {
    fetchLeaderboard()
})

const selectedCategoryLabel = computed(() => {
    const cat = eventCategories.value.find(c => c.id === selectedCategoryId.value)
    return cat?.label || 'Semua'
})

const totalParticipants = computed(() => leaderboard.value.length)
const averageTotalScore = computed(() => {
    if (!leaderboard.value.length) return 0
    const sum = leaderboard.value.reduce((a, b) => a + (b.total_score || 0), 0)
    return Math.round(sum / leaderboard.value.length)
})
const topScore = computed(() => {
    if (!leaderboard.value.length) return 0
    return Math.max(...leaderboard.value.map(r => r.total_score || 0))
})
const maxEndsCompleted = computed(() => {
    if (!leaderboard.value.length) return 0
    return Math.max(...leaderboard.value.map(r => r.ends_completed || 0))
})
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>
