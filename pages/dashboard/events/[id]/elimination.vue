<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div class="space-y-1">
                <NuxtLink :to="`/dashboard/events/${route.params.id}`"
                    class="text-sm text-gray-500 hover:text-navy flex items-center gap-1 mb-2 transition-colors">
                    <Icon icon="ph:arrow-left" class="text-lg" />
                    Kembali ke Dashboard
                </NuxtLink>
                <h1 class="text-3xl font-black text-navy tracking-tight">Manajemen Bagan Eliminasi</h1>
                <p class="text-gray-500 text-sm">Kelola dan lihat bagan eliminasi untuk event ini.</p>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" icon="ph:printer" class="h-11 px-5 border-gray-200">Cetak Bagan</BaseButton>
                <BaseButton variant="primary" icon="ph:broadcast" class="h-11 px-6 shadow-lg shadow-primary/20">Siar
                    Langsung</BaseButton>
            </div>
        </div>

        <!-- Filter & Control Bar -->
        <div
            class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div class="flex items-center gap-6 flex-grow w-full md:w-auto">
                <div class="flex flex-col gap-1.5 w-full md:w-64">
                    <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Kategori
                        Pertandingan</label>
                    <BaseSelect v-model="activeCategory"
                        :items="['Recurve Men Individual', 'Compound Women Individual']" />
                </div>
            </div>
            <div class="flex items-center gap-4 w-full md:w-auto shrink-0">
                <div class="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-2xl border border-green-100/50">
                    <span class="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span
                        class="text-[9px] font-black text-green-700 uppercase tracking-widest whitespace-nowrap">Auto-sync
                        Active</span>
                </div>
            </div>
        </div>

        <!-- Bracket Component -->
        <BracketElimination :matches1_8="matches1_8" :matchesQF="matchesQF" :matchesSF="matchesSF"
            :matchFinal="matchFinal" @select-match="handleMatchSelect" />

        <!-- Selected Match Panel -->
        <Transition name="slide">
            <div v-if="selectedMatchData"
                class="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100">
                <!-- Drawer Header -->
                <div
                    class="h-20 px-6 flex items-center justify-between bg-navy text-white border-b border-gray-800 shrink-0">
                    <div class="flex items-center gap-4">
                        <div
                            class="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                            <Icon icon="ph:target-bold" class="text-primary text-xl" />
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-0.5">Match
                                Details • {{ selectedMatchData.id }}</p>
                            <p class="text-base font-bold text-white">{{ getRoundName(selectedMatchData.id) }}</p>
                        </div>
                    </div>
                    <button @click="selectedMatch = null"
                        class="h-10 w-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all group">
                        <Icon icon="ph:x-bold" class="text-xl group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <div class="p-0 flex-1 overflow-y-auto no-scrollbar bg-slate-50/50">
                    <!-- Match Metadata -->
                    <div class="grid grid-cols-2 gap-px bg-gray-100 border-b border-gray-100">
                        <div class="bg-white p-4 flex items-center gap-3">
                            <Icon icon="ph:map-pin" class="text-gray-400 text-lg" />
                            <div>
                                <p class="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Target Used
                                </p>
                                <p class="text-xs font-bold text-navy">{{ selectedMatchData.target || 'Target 12A' }}
                                </p>
                            </div>
                        </div>
                        <div class="bg-white p-4 flex items-center gap-3">
                            <Icon icon="ph:clock" class="text-gray-400 text-lg" />
                            <div>
                                <p class="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Match Date</p>
                                <p class="text-xs font-bold text-navy">24 Jan 2024</p>
                            </div>
                        </div>
                    </div>

                    <!-- Archer Comparison -->
                    <div class="p-6 space-y-6">
                        <div class="flex items-center justify-between gap-4">
                            <!-- Archer 1 -->
                            <div class="flex-1 flex flex-col items-center text-center space-y-3">
                                <div class="relative">
                                    <div class="h-20 w-20 rounded-2xl bg-white border-2 p-1 shadow-md transition-all"
                                        :class="selectedMatchData.winner === 1 ? 'border-primary' : 'border-gray-100'">
                                        <img :src="selectedMatchData.archer1.avatar"
                                            class="w-full h-full rounded-xl object-cover" />
                                    </div>
                                    <div v-if="selectedMatchData.winner === 1"
                                        class="absolute -top-2 -right-2 h-7 w-7 bg-primary rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                                        <Icon icon="ph:crown-fill" class="text-navy text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <p class="text-xs font-black text-navy leading-tight">{{
                                        selectedMatchData.archer1.name }}</p>
                                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Seed
                                        #{{ selectedMatchData.archer1.seed }}</p>
                                </div>
                            </div>

                            <div class="flex flex-col items-center justify-center space-y-1">
                                <div class="text-2xl font-black text-navy italic">VS</div>
                                <div class="px-3 py-1 bg-navy text-primary rounded-lg text-[10px] font-black">WINNER
                                </div>
                            </div>

                            <!-- Archer 2 -->
                            <div class="flex-1 flex flex-col items-center text-center space-y-3">
                                <div class="relative">
                                    <div class="h-20 w-20 rounded-2xl bg-white border-2 p-1 shadow-md transition-all"
                                        :class="selectedMatchData.winner === 2 ? 'border-primary' : 'border-gray-100'">
                                        <img :src="selectedMatchData.archer2.avatar"
                                            class="w-full h-full rounded-xl object-cover" />
                                    </div>
                                    <div v-if="selectedMatchData.winner === 2"
                                        class="absolute -top-2 -right-2 h-7 w-7 bg-primary rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                                        <Icon icon="ph:crown-fill" class="text-navy text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <p class="text-xs font-black text-navy leading-tight">{{
                                        selectedMatchData.archer2.name }}</p>
                                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Seed
                                        #{{ selectedMatchData.archer2.seed }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Scoring Breakdown -->
                        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div
                                class="px-5 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                <h4 class="text-[10px] font-black text-navy uppercase tracking-widest">Detailed Set
                                    Scores</h4>
                                <div class="flex gap-2">
                                    <span class="h-2 w-2 rounded-full bg-primary"></span>
                                    <span class="h-2 w-2 rounded-full bg-slate-200"></span>
                                </div>
                            </div>
                            <div class="p-5 space-y-4">
                                <div v-for="set in dummySets" :key="set.num" class="flex items-center gap-4">
                                    <span
                                        class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-gray-400 shadow-inner">S{{
                                            set.num }}</span>
                                    <div
                                        class="flex-1 flex items-center justify-between bg-white border border-gray-100 p-2 rounded-xl">
                                        <span class="text-sm font-black text-navy px-2"
                                            :class="{ 'text-primary': set.a > set.b }">{{ set.a }}</span>
                                        <div class="flex gap-1">
                                            <div v-for="i in 3" :key="i" class="h-1 w-4 rounded-full"
                                                :class="set.a > set.b ? 'bg-primary/30' : 'bg-gray-100'"></div>
                                        </div>
                                        <span class="text-sm font-black text-navy px-2"
                                            :class="{ 'text-primary': set.b > set.a }">{{ set.b }}</span>
                                    </div>
                                </div>
                                <div
                                    class="pt-4 mt-4 border-t border-dashed border-gray-200 flex items-center justify-between">
                                    <div class="text-center flex-1">
                                        <p class="text-[9px] font-bold text-gray-400 uppercase mb-1">Total Score</p>
                                        <p class="text-3xl font-black text-navy">{{ selectedMatchData.archer1.score }}
                                        </p>
                                    </div>
                                    <div class="px-4 text-xs font-black text-gray-300">TOTAL</div>
                                    <div class="text-center flex-1">
                                        <p class="text-[9px] font-bold text-gray-400 uppercase mb-1">Total Score</p>
                                        <p class="text-3xl font-black text-navy">{{ selectedMatchData.archer2.score }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Match Statistics -->
                        <div
                            class="bg-navy rounded-3xl p-6 text-white shadow-xl shadow-navy/20 relative overflow-hidden group">
                            <div
                                class="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                <Icon icon="ph:chart-bar-fill" class="text-[120px]" />
                            </div>
                            <h4 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Quick Stats
                            </h4>
                            <div class="grid grid-cols-2 gap-6 relative z-10">
                                <div>
                                    <p class="text-[9px] text-gray-400 font-bold uppercase mb-1">Average / Arrow</p>
                                    <p class="text-lg font-black text-white">9.4 <span
                                            class="text-[10px] font-normal text-gray-400">vs</span> 8.8</p>
                                </div>
                                <div>
                                    <p class="text-[9px] text-gray-400 font-bold uppercase mb-1">Total arrows</p>
                                    <p class="text-lg font-black text-white">15 Shots</p>
                                </div>
                                <div class="col-span-2">
                                    <p class="text-[9px] text-gray-400 font-bold uppercase mb-1">Winning Probability</p>
                                    <div class="flex items-center gap-3">
                                        <div class="flex-1 h-2 bg-white/10 rounded-full overflow-hidden flex">
                                            <div class="h-full bg-primary" style="width: 70%"></div>
                                            <div class="h-full bg-white/20" style="width: 30%"></div>
                                        </div>
                                        <p class="text-xs font-black text-primary">70%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Drawer Footer -->
                <div class="p-6 bg-white border-t border-gray-100 shrink-0">
                    <BaseButton variant="primary"
                        class="w-full h-14 font-black text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-primary/20"
                        icon="ph:file-pdf">Export Full Match Report</BaseButton>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'
import BracketElimination from '~/components/events/BracketElimination.vue'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { get } = useApi()
const { setEvent, clearEvent } = useEventContext()
const activeCategory = ref('Recurve Men Individual')
const selectedMatch = ref(null)

const getAvatar = (name, seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name + seed)}`

// Matches Data
const matches1_8 = ref([
    { id: 1, target: 'Target 4A', archer1: { name: 'M. Thompson', avatar: getAvatar('Thompson', 1), score: 6, seed: 1 }, archer2: { name: 'S. Svensson', avatar: getAvatar('Svensson', 32), score: 2, seed: 32 }, winner: 1 },
    { id: 2, target: 'Target 4B', archer1: { name: 'D. O\'Brien', avatar: getAvatar('OBrien', 16), score: 6, seed: 16 }, archer2: { name: 'K. Muller', avatar: getAvatar('Muller', 17), score: 4, seed: 17 }, winner: 1 },
    { id: 3, target: 'Target 5A', archer1: { name: 'H. Tanaka', avatar: getAvatar('Tanaka', 8), score: 7, seed: 8 }, archer2: { name: 'R. Gomez', avatar: getAvatar('Gomez', 25), score: 3, seed: 25 }, winner: 1 },
    { id: 4, target: 'Target 5B', archer1: { name: 'J. Kim', avatar: getAvatar('Kim', 9), score: 6, seed: 9 }, archer2: { name: 'A. Rossi', avatar: getAvatar('Rossi', 24), score: 4, seed: 24 }, winner: 1 },
    { id: 5, target: 'Target 6A', archer1: { name: 'L. Chen', avatar: getAvatar('Chen', 4), score: 6, seed: 4 }, archer2: { name: 'P. Garcia', avatar: getAvatar('Garcia', 29), score: 2, seed: 29 }, winner: 1 },
    { id: 6, target: 'Target 6B', archer1: { name: 'N. Patel', avatar: getAvatar('Patel', 13), score: 5, seed: 13 }, archer2: { name: 'B. Johnson', avatar: getAvatar('Johnson', 20), score: 7, seed: 20 }, winner: 2 },
    { id: 7, target: 'Target 7A', archer1: { name: 'F. Schmidt', avatar: getAvatar('Schmidt', 5), score: 6, seed: 5 }, archer2: { name: 'C. Williams', avatar: getAvatar('Williams', 28), score: 4, seed: 28 }, winner: 1 },
    { id: 8, target: 'Target 7B', archer1: { name: 'T. Brown', avatar: getAvatar('Brown', 12), score: 3, seed: 12 }, archer2: { name: 'Y. Yamamoto', avatar: getAvatar('Yamamoto', 21), score: 6, seed: 21 }, winner: 2 },
])

const matchesQF = ref([
    { id: 9, target: 'Target 8A', archer1: { name: 'M. Thompson', avatar: getAvatar('Thompson', 1), score: 6, seed: 1 }, archer2: { name: 'D. O\'Brien', avatar: getAvatar('OBrien', 16), score: 4, seed: 16 }, winner: 1 },
    { id: 10, target: 'Target 8B', archer1: { name: 'H. Tanaka', avatar: getAvatar('Tanaka', 8), score: 7, seed: 8 }, archer2: { name: 'J. Kim', avatar: getAvatar('Kim', 9), score: 5, seed: 9 }, winner: 1 },
    { id: 11, target: 'Target 9A', archer1: { name: 'L. Chen', avatar: getAvatar('Chen', 4), score: 6, seed: 4 }, archer2: { name: 'B. Johnson', avatar: getAvatar('Johnson', 20), score: 4, seed: 20 }, winner: 1 },
    { id: 12, target: 'Target 9B', archer1: { name: 'F. Schmidt', avatar: getAvatar('Schmidt', 5), score: 5, seed: 5 }, archer2: { name: 'Y. Yamamoto', avatar: getAvatar('Yamamoto', 21), score: 7, seed: 21 }, winner: 2 },
])

const matchesSF = ref([
    { id: 13, target: 'Target 10A', archer1: { name: 'M. Thompson', avatar: getAvatar('Thompson', 1), score: 7, seed: 1 }, archer2: { name: 'H. Tanaka', avatar: getAvatar('Tanaka', 8), score: 5, seed: 8 }, winner: 1 },
    { id: 14, target: 'Target 10B', archer1: { name: 'L. Chen', avatar: getAvatar('Chen', 4), score: 6, seed: 4 }, archer2: { name: 'Y. Yamamoto', avatar: getAvatar('Yamamoto', 21), score: 4, seed: 21 }, winner: 1 },
])

const matchFinal = ref({ id: 15, target: 'Target Gold 1', archer1: { name: 'M. Thompson', avatar: getAvatar('Thompson', 1), score: 7, seed: 1 }, archer2: { name: 'L. Chen', avatar: getAvatar('Chen', 4), score: 5, seed: 4 }, winner: 1 })

const selectedMatchData = computed(() => {
    if (!selectedMatch.value) return null
    return [...matches1_8.value, ...matchesQF.value, ...matchesSF.value, matchFinal.value].find(m => m.id === selectedMatch.value)
})

const handleMatchSelect = (id) => { selectedMatch.value = id }

const getRoundName = (id) => {
    if (id <= 8) return '1/8 Final'
    if (id <= 12) return 'Perempat Final'
    if (id <= 14) return 'Semi Final'
    return 'Final Emas'
}

const dummySets = [
    { num: 1, a: 28, b: 26 }, { num: 2, a: 27, b: 27 }, { num: 3, a: 29, b: 30 }, { num: 4, a: 28, b: 24 }, { num: 5, a: 30, b: 28 },
]

onMounted(async () => {
    try {
        const res = await get(`/events/${route.params.id}`)
        if (res) setEvent(res)
    } catch (e) { console.error(e) }
})

</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
