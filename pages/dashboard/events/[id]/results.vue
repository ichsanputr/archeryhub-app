<template>
    <div class="space-y-8">
        <!-- Live Dashboard Header -->
        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3">
                <span class="flex h-3 w-3 relative">
                    <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <h2 class="text-xl font-bold text-navy font-display">Live Dashboard</h2>
            </div>
            <div class="flex gap-3 w-full md:w-auto">
                <BaseSelect v-model="selectedDivision" :items="divisions" placeholder="Pilih Kategori" />
                <BaseSelect v-model="selectedRound" :items="rounds" placeholder="Pilih Babak" />
            </div>
        </div>

        <!-- Elimination Match Card -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <div class="bg-navy px-6 py-3 flex justify-between items-center text-white">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-primary"></span>
                    <span class="text-[10px] font-bold  tracking-wider text-primary">1/4 Elimination • Target
                        2</span>
                </div>
                <span class="text-[10px] text-white/50 font-bold ">{{ selectedDivision }}</span>
            </div>
            <div class="p-6 md:p-8">
                <div class="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                    <!-- Athlete 1 -->
                    <div class="flex flex-col items-center flex-1 w-full">
                        <div
                            class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 border-2 border-primary/20 mb-3 overflow-hidden">
                            <img alt="Arif Dwi" class="w-full h-full object-cover"
                                src="https://i.pravatar.cc/150?u=arif" />
                        </div>
                        <h3 class="text-lg font-bold text-navy text-center font-display">Arif Dwi Pangestu</h3>
                        <p class="text-xs text-text-sub font-bold  tracking-widest opacity-50">DKI Jakarta</p>
                        <div class="mt-2 px-2 py-0.5 rounded text-[10px] font-black bg-navy text-white ">Rank 1
                        </div>
                    </div>

                    <!-- Score -->
                    <div class="flex flex-col items-center px-4 md:px-8 relative">
                        <div class="text-[10px] font-black text-text-sub/30  tracking-[0.2em] mb-1">Set Score
                        </div>
                        <div class="flex items-center gap-6">
                            <span class="text-5xl md:text-7xl font-black text-navy tabular-nums">6</span>
                            <span class="text-2xl text-text-sub/20 font-light">-</span>
                            <span class="text-5xl md:text-7xl font-black text-text-sub/30 tabular-nums">4</span>
                        </div>
                        <span
                            class="px-3 py-1 mt-4 rounded-full bg-primary/10 text-navy text-[10px] font-black  tracking-widest border border-primary/20">Match
                            Won</span>
                    </div>

                    <!-- Athlete 2 -->
                    <div class="flex flex-col items-center flex-1 w-full">
                        <div
                            class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 border-2 border-gray-200 mb-3 overflow-hidden grayscale opacity-50">
                            <img alt="Riau Ega" class="w-full h-full object-cover"
                                src="https://i.pravatar.cc/150?u=ega" />
                        </div>
                        <h3 class="text-lg font-bold text-text-sub/50 text-center font-display">Riau Ega Agatha</h3>
                        <p class="text-xs text-text-sub/30 font-bold  tracking-widest">Jawa Timur</p>
                        <div class="mt-2 px-2 py-0.5 rounded text-[10px] font-black bg-gray-100 text-text-sub/40 ">
                            Rank 8</div>
                    </div>
                </div>

                <!-- Last Set Values -->
                <div class="border-t border-gray-50 pt-6">
                    <div class="text-center mb-4">
                        <span class="text-[10px] font-black text-text-sub/30  tracking-widest">Set 5 - Arrow
                            Values</span>
                    </div>
                    <div
                        class="flex justify-between items-center gap-4 max-w-md mx-auto bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div class="flex gap-2">
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary text-navy flex items-center justify-center font-black text-sm md:text-lg shadow-sm">
                                X</div>
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary text-navy flex items-center justify-center font-black text-sm md:text-lg shadow-sm">
                                10</div>
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white text-navy border border-gray-100 flex items-center justify-center font-bold text-sm md:text-lg">
                                9</div>
                            <div class="text-xs font-black text-navy self-center ml-2 tabular-nums">29</div>
                        </div>
                        <div class="h-8 w-px bg-gray-200"></div>
                        <div class="flex gap-2 flex-row-reverse">
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white text-navy border border-gray-100 flex items-center justify-center font-bold text-sm md:text-lg">
                                9</div>
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white text-navy border border-gray-100 flex items-center justify-center font-bold text-sm md:text-lg">
                                9</div>
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white text-navy border border-gray-100 flex items-center justify-center font-bold text-sm md:text-lg">
                                8</div>
                            <div class="text-xs font-black text-text-sub/40 self-center mr-2 tabular-nums">26</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Qualification Standings Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div class="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 class="font-bold text-navy text-lg font-display">Klasemen Kualifikasi</h3>
                <span class="text-[10px] font-black text-primary flex items-center gap-1  tracking-widest">
                    <span class="relative flex h-2 w-2">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Live Updates
                </span>
            </div>
            <div class="overflow-x-auto no-scrollbar">
                <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead
                        class="bg-white text-text-sub/50  text-[10px] font-black tracking-widest border-b border-gray-50">
                        <tr>
                            <th class="px-6 py-4 w-16">Rank</th>
                            <th class="px-6 py-4 w-20">Target</th>
                            <th class="px-6 py-4">Athlete</th>
                            <th class="px-6 py-4 text-center">Score 1</th>
                            <th class="px-6 py-4 text-center">Score 2</th>
                            <th class="px-6 py-4 text-center">10s/Xs</th>
                            <th class="px-6 py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="(stand, index) in standings" :key="stand.participant_id"
                            class="hover:bg-gray-50/50 transition-colors group"
                            :class="index === 0 ? 'bg-primary/5' : ''">
                            <td class="px-6 py-4 font-black text-navy tabular-nums">{{ stand.rank || index + 1 }}</td>
                            <td class="px-6 py-4 text-text-sub/50 font-bold tabular-nums">-</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div @click="navigateTo(`/dashboard/events/${eventId}/result-user?participant_uuid=${stand.participant_id}`)"
                                        class="font-bold text-navy group-hover:text-primary transition-colors cursor-pointer">
                                        {{ stand.archer_name }}
                                    </div>
                                    <span v-if="stand.club_name"
                                        class="px-1.5 py-0.5 rounded text-[8px] bg-navy/5 text-navy font-black border border-navy/10">{{
                                            stand.club_name }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center font-bold text-text-sub tabular-nums">
                                {{ stand.sessions?.[0]?.total_score || 0 }}
                            </td>
                            <td class="px-6 py-4 text-center font-bold text-text-sub tabular-nums">
                                {{ stand.sessions?.[1]?.total_score || 0 }}
                            </td>
                            <td class="px-6 py-4 text-center text-text-sub/50 font-medium tabular-nums">{{ stand.total_10x
                                }}/{{ stand.total_x }}</td>
                            <td class="px-6 py-4 text-right font-black text-navy text-base tabular-nums">{{ stand.total_score }}</td>
                        </tr>
                        <tr v-if="standings.length === 0 && !isLoading">
                            <td colspan="7" class="px-6 py-12 text-center text-gray-400 italic font-medium">
                                Belum ada data kualifikasi untuk kategori ini
                            </td>
                        </tr>
                        <tr v-if="isLoading">
                            <td colspan="7" class="px-6 py-12 text-center text-gray-400 animate-pulse">
                                Memuat data...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="p-4 border-t border-gray-50 text-center bg-gray-50/30">
                <button class="text-navy font-bold text-xs hover:underline  tracking-widest" @click="downloadResults">Unduh Hasil
                    Lengkap (PDF)</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import BaseSelect from '~/components/common/BaseSelect.vue'
import { Icon } from '@iconify/vue'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Hasil Pertandingan - Dashboard'
})

const { get } = useApi()
const route = useRoute()
const eventId = route.params.id

const selectedDivision = ref('')
const selectedRound = ref('Babak Kualifikasi')

const categories = ref([])
const divisions = computed(() => categories.value.map(c => ({
    label: `${c.division_name} - ${c.name}`,
    value: c.uuid
})))

const rounds = ['Babak Kualifikasi', 'Babak Eliminasi', 'Final Perunggu', 'Final Emas']
const standings = ref([])
const isLoading = ref(false)

const fetchCategories = async () => {
    try {
        const res = await get(`/events/${eventId}/categories`)
        categories.value = res?.categories || []
        if (categories.value.length > 0) {
            selectedDivision.value = categories.value[0].uuid
        }
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

const fetchResults = async () => {
    if (!selectedDivision.value) return
    isLoading.value = true
    try {
        const res = await get(`/events/${eventId}/results/qualification`, {
            params: { category_id: selectedDivision.value }
        })
        standings.value = res?.results || []
    } catch (error) {
        console.error('Failed to fetch results:', error)
        standings.value = []
    } finally {
        isLoading.value = false
    }
}

watch(selectedDivision, fetchResults)

onMounted(() => {
    fetchCategories()
})

const downloadResults = () => {
    window.open(`/api/v1/events/${eventId}/results/qualification/export?category_id=${selectedDivision.value}`, '_blank')
}
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.font-display {
    font-family: 'Manrope', sans-serif;
}
</style>
