<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <div
                    class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    <NuxtLink to="/dashboard/events" class="hover:text-primary transition-colors">Events</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                    <NuxtLink :to="`/dashboard/events/${route.params.id}/overview`"
                        class="hover:text-primary transition-colors">Control Panel</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                    <span class="text-navy">Detail Eliminasi</span>
                </div>
                <h1 class="text-3xl font-black text-navy tracking-tight">Manajemen Bagan Eliminasi</h1>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" icon="ph:printer" class="h-11 px-5 border-gray-200">Cetak Bagan
                </BaseButton>
                <BaseButton variant="primary" icon="ph:broadcast" class="h-11 px-6 shadow-lg shadow-primary/20">
                    Siar Langsung</BaseButton>
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
                <div class="h-10 w-px bg-gray-100 hidden md:block"></div>
                <div class="flex gap-1 bg-gray-100 p-1.5 rounded-2xl">
                    <button v-for="round in ['1/32', '1/16', '1/8', 'Final']" :key="round" @click="activeRound = round"
                        :class="activeRound === round ? 'bg-white text-navy shadow-sm' : 'text-gray-400 hover:text-navy'"
                        class="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        {{ round }}
                    </button>
                </div>
            </div>
            <div class="flex items-center gap-4 w-full md:w-auto shrink-0">
                <div class="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-2xl border border-green-100/50">
                    <span class="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span
                        class="text-[9px] font-black text-green-700 uppercase tracking-widest whitespace-nowrap">Auto-sync
                        Active</span>
                </div>
                <button
                    class="p-3 bg-navy text-primary rounded-2xl hover:bg-navy-light transition-all shadow-md active:scale-95">
                    <Icon icon="ph:arrows-clockwise" class="text-lg" />
                </button>
            </div>
        </div>

        <!-- Bracket Visualization -->
        <div
            class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[700px] flex flex-col relative">
            <!-- Scrollable Area -->
            <div class="flex-1 overflow-auto p-10 bg-[#f8fafc] select-none scrollbar-thin">
                <div class="min-w-max flex items-start gap-16 h-full relative">
                    <!-- Round 1/16 (Hidden/Opaque) -->
                    <div class="round-column opacity-40">
                        <div class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-4">
                            1/16 Finals</div>
                        <div class="space-y-4">
                            <div class="h-16 w-12 border-y border-r border-gray-300 rounded-r-lg"></div>
                            <div class="h-16 w-12 border-y border-r border-gray-300 rounded-r-lg"></div>
                        </div>
                    </div>

                    <!-- Round 1/8 -->
                    <div class="round-column">
                        <div class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-4">
                            1/8 Finals</div>
                        <div v-for="(match, idx) in matches1_8" :key="idx" @click="selectedMatch = match.id"
                            :class="getMatchNodeClass(match.status)"
                            class="match-node">
                            <div class="flex justify-between items-center p-2 border-b border-gray-50"
                                :class="match.status === 'live' ? 'bg-red-50/30' : ''">
                                <span :class="getStatusBadgeClass(match.status)"
                                    class="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                    {{ match.status === 'completed' ? 'Completed' : match.status === 'live' ? 'Live' : 'Waiting' }}
                                </span>
                                <span class="text-[9px] font-bold text-gray-400">{{ match.target }}</span>
                            </div>
                            <div class="flex flex-col">
                                <div class="flex justify-between items-center p-2 px-3"
                                    :class="match.status === 'completed' && match.winner === 1 ? 'bg-primary/10' : ''">
                                    <span class="text-xs font-black text-navy-dark">{{ match.archer1.name }} ({{ match.archer1.seed }})</span>
                                    <span class="text-sm font-black text-navy-dark">{{ match.status === 'completed' || match.status === 'live' ? match.archer1.score : '-' }}</span>
                                </div>
                                <div class="flex justify-between items-center p-2 px-3 opacity-60"
                                    :class="match.status === 'completed' && match.winner === 2 ? '!opacity-100 bg-primary/10' : ''">
                                    <span class="text-xs font-medium text-gray-500">{{ match.archer2.name }} ({{ match.archer2.seed }})</span>
                                    <span class="text-sm font-bold text-gray-400">{{ match.status === 'completed' || match.status === 'live' ? match.archer2.score : '-' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Connector Lines -->
                    <div class="flex flex-col justify-around py-8 relative">
                        <svg v-for="i in 4" :key="i" class="absolute" :style="getConnectorStyle(i)"
                            width="64" height="200" viewBox="0 0 64 200" preserveAspectRatio="none">
                            <path :d="getConnectorPath(i)" stroke="#cbd5e1" stroke-width="2" fill="none" />
                        </svg>
                    </div>

                    <!-- Quarter Finals -->
                    <div class="round-column">
                        <div class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-4">
                            Quarter-Finals</div>
                        <div v-for="(match, idx) in matchesQF" :key="idx" @click="selectedMatch = match.id"
                            :class="getMatchNodeClass(match.status)"
                            class="match-node">
                            <div class="flex justify-between items-center p-2 border-b border-gray-50">
                                <span :class="getStatusBadgeClass(match.status)"
                                    class="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                    {{ match.status === 'scheduled' ? 'Scheduled' : match.status === 'waiting' ? 'Waiting' : 'Completed' }}
                                </span>
                                <span class="text-[9px] font-bold text-gray-400">{{ match.time || '-' }}</span>
                            </div>
                            <div class="flex flex-col">
                                <div class="flex justify-between items-center p-2 px-3"
                                    :class="match.status === 'completed' && match.winner === 1 ? 'bg-primary/10' : ''">
                                    <span class="text-xs font-black text-navy-dark">{{ match.archer1?.name || 'TBD' }}</span>
                                    <span class="text-sm font-black text-navy-dark">{{ match.archer1?.score || '-' }}</span>
                                </div>
                                <div class="flex justify-between items-center p-2 px-3 opacity-60"
                                    :class="match.status === 'completed' && match.winner === 2 ? '!opacity-100 bg-primary/10' : ''">
                                    <span class="text-xs font-black text-navy-dark">{{ match.archer2?.name || 'TBD' }}</span>
                                    <span class="text-sm font-bold text-gray-400">{{ match.archer2?.score || '-' }}</span>
                                </div>
                            </div>
                        </div>
                        <!-- Placeholder for waiting matches -->
                        <div v-if="matchesQF.length < 2" class="match-node opacity-40 border-dashed">
                            <div class="h-16 flex items-center justify-center">
                                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TBD Winner
                                    M3/M4</span>
                            </div>
                        </div>
                    </div>

                    <!-- Semi Finals -->
                    <div class="round-column">
                        <div class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-4">
                            Semi-Finals</div>
                        <div v-for="(match, idx) in matchesSF" :key="idx" @click="selectedMatch = match.id"
                            :class="getMatchNodeClass(match.status)"
                            class="match-node opacity-20 border-dashed scale-95 origin-left">
                            <div class="h-16 flex items-center justify-center">
                                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TBD</span>
                            </div>
                        </div>
                    </div>

                    <!-- Finals -->
                    <div class="round-column">
                        <div
                            class="text-[10px] font-black text-primary uppercase tracking-[0.3em] text-center mb-4 bg-navy py-1.5 rounded-full px-8 shadow-lg">
                            Finals</div>
                        <div
                            class="w-64 h-40 bg-white border-2 border-primary rounded-2xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group hover:shadow-primary/20 transition-all cursor-pointer">
                            <div class="absolute top-0 inset-x-0 h-1.5 bg-primary"></div>
                            <div
                                class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Icon icon="ph:trophy" class="text-8xl rotate-12" />
                            </div>
                            <span
                                class="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest relative z-10">Gold
                                Medal Match</span>
                            <div class="flex items-center gap-6 relative z-10">
                                <div class="flex flex-col items-center gap-1">
                                    <div
                                        class="h-12 w-12 rounded-full bg-slate-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        <Icon icon="ph:user" class="text-gray-300 text-2xl" />
                                    </div>
                                    <span class="text-[10px] font-bold text-gray-400">TBD</span>
                                </div>
                                <span class="text-sm font-black text-navy-dark italic">VS</span>
                                <div class="flex flex-col items-center gap-1">
                                    <div
                                        class="h-12 w-12 rounded-full bg-slate-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        <Icon icon="ph:user" class="text-gray-300 text-2xl" />
                                    </div>
                                    <span class="text-[10px] font-bold text-gray-400">TBD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Stats -->
            <div class="h-14 bg-white border-t border-gray-200 px-8 flex items-center justify-between shrink-0">
                <div class="flex gap-8">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active
                            Matches</span>
                        <span class="text-sm font-bold text-navy-dark">{{ activeMatchesCount }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed</span>
                        <span class="text-sm font-bold text-navy-dark">{{ completedMatchesCount }} / {{ totalMatchesCount }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <span class="text-[10px] font-bold text-gray-400 uppercase">Auto-update: <span
                            class="text-green-600">Active</span></span>
                    <button
                        class="flex items-center gap-2 text-xs font-bold text-navy-dark hover:bg-gray-50 px-3 py-1.5 rounded transition-colors border border-gray-200">
                        <Icon icon="ph:clock-counter-clockwise" class="text-lg" />
                        Audit Log
                    </button>
                </div>
            </div>

            <!-- Side Entry Panel (Conditional) -->
            <Transition name="slide-panel">
                <div v-if="selectedMatch"
                    class="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl border-l border-gray-100 z-20 flex flex-col clip-panel">
                    <div class="p-6 bg-navy text-white flex justify-between items-center">
                        <div>
                            <h4 class="text-xs font-black uppercase tracking-widest text-primary">Input Skor Cepat</h4>
                            <p class="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1">Match {{
                                selectedMatch }} • 1/8 Finals</p>
                        </div>
                        <button @click="selectedMatch = null"
                            class="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all group">
                            <Icon icon="ph:x" class="group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>
                    <div class="p-8 flex-1 flex flex-col">
                        <div class="space-y-10 flex-1">
                            <div v-for="i in 2" :key="i" class="space-y-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-navy border border-gray-100">
                                        {{ i === 1 ? 'A' : 'B' }}</div>
                                    <div>
                                        <p class="text-xs font-black text-navy">Archer {{ i === 1 ? 'A' : 'B' }}{{
                                            selectedMatch }}</p>
                                        <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Set
                                            Points: {{ i === 1 ? '4' : '2' }}</p>
                                    </div>
                                </div>
                                <div
                                    class="flex items-center justify-center gap-6 py-4 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                    <button
                                        class="h-10 w-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-xl font-black text-navy shadow-sm hover:border-primary transition-all active:scale-90">-</button>
                                    <div class="text-3xl font-black text-navy tabular-nums w-12 text-center">{{ i === 1
                                        ? '2' : '0' }}</div>
                                    <button
                                        class="h-10 w-10 bg-primary border border-primary rounded-xl flex items-center justify-center text-xl font-black text-navy shadow-md hover:bg-primary-hover transition-all active:scale-90">+</button>
                                </div>
                            </div>
                        </div>
                        <div class="pt-8 border-t border-gray-50 space-y-3">
                            <div
                                class="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
                                <Icon icon="ph:warning-circle" class="text-amber-500 shrink-0" />
                                <p class="text-[9px] font-bold text-amber-700 uppercase leading-relaxed">Update ini akan
                                    langsung mengubah data scoreboard publik.</p>
                            </div>
                            <BaseButton variant="primary"
                                class="w-full h-14 font-black text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-primary/20"
                                icon="ph:cloud-arrow-up">
                                Update Hasil Set
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const { get } = useApi()
const { setEvent, clearEvent } = useEventContext()

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

onMounted(() => {
    fetchEventDetails()
})

onBeforeUnmount(() => {
    clearEvent()
})

const activeCategory = ref('Recurve Men Individual')
const activeRound = ref('1/8')
const selectedMatch = ref(null)

// Sample match data
const matches1_8 = ref([
    {
        id: 1,
        status: 'completed',
        target: 'Target 4A',
        archer1: { name: 'M. Thompson', seed: 1, score: 6 },
        archer2: { name: 'S. Svensson', seed: 32, score: 0 },
        winner: 1
    },
    {
        id: 2,
        status: 'completed',
        target: 'Target 4B',
        archer1: { name: 'D. O\'Brien', seed: 16, score: 6 },
        archer2: { name: 'K. Muller', seed: 17, score: 4 },
        winner: 1
    },
    {
        id: 3,
        status: 'live',
        target: 'Target 5A',
        archer1: { name: 'H. Tanaka', seed: 8, score: 4 },
        archer2: { name: 'R. Gomez', seed: 25, score: 2 },
        winner: null
    },
    {
        id: 4,
        status: 'waiting',
        target: 'Target 5B',
        archer1: { name: 'J. Kim', seed: 9, score: null },
        archer2: { name: 'A. Rossi', seed: 24, score: null },
        winner: null
    }
])

const matchesQF = ref([
    {
        id: 5,
        status: 'scheduled',
        time: '14:30',
        archer1: { name: 'M. Thompson', score: null },
        archer2: { name: 'D. O\'Brien', score: null },
        winner: null
    }
])

const matchesSF = ref([
    {
        id: 6,
        status: 'waiting',
        archer1: null,
        archer2: null,
        winner: null
    }
])

const getMatchNodeClass = (status) => {
    const base = 'bg-white border border-gray-200 rounded-lg shadow-sm hover:border-primary cursor-pointer transition-all w-52 overflow-hidden flex flex-col'
    if (status === 'live') return `${base} border-l-4 border-l-red-500 shadow-md ring-1 ring-red-100`
    if (status === 'completed') return `${base} border-l-4 border-l-primary shadow-sm`
    if (status === 'waiting') return `${base} opacity-70 grayscale-[0.5]`
    return base
}

const getStatusBadgeClass = (status) => {
    if (status === 'completed') return 'text-primary-hover bg-navy-dark'
    if (status === 'live') return 'text-red-600 bg-red-50'
    if (status === 'scheduled') return 'text-gray-400 bg-gray-100'
    return 'text-gray-400 bg-gray-100'
}

const getConnectorStyle = (index) => {
    const top = (index - 1) * 200 + 50
    return {
        top: `${top}px`,
        left: '0px'
    }
}

const getConnectorPath = (index) => {
    // Creates a connector path: horizontal line, then vertical, then horizontal
    return `M 0 100 L 32 100 L 32 ${100 + (index % 2 === 0 ? 100 : -100)} L 64 ${100 + (index % 2 === 0 ? 100 : -100)}`
}

const activeMatchesCount = computed(() => {
    return matches1_8.value.filter(m => m.status === 'live').length
})

const completedMatchesCount = computed(() => {
    return matches1_8.value.filter(m => m.status === 'completed').length + 
           matchesQF.value.filter(m => m.status === 'completed').length
})

const totalMatchesCount = computed(() => {
    return matches1_8.value.length + matchesQF.value.length + matchesSF.value.length + 1 // +1 for finals
})
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.slide-panel-enter-active,
.slide-panel-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-panel-enter-from,
.slide-panel-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.clip-panel {
    border-top-left-radius: 2.5rem;
    border-bottom-left-radius: 2.5rem;
}

.round-column {
    @apply flex flex-col justify-around h-full gap-8 py-8;
}

.match-node {
    @apply bg-white border border-gray-200 rounded-lg shadow-sm hover:border-primary cursor-pointer transition-all w-52 overflow-hidden flex flex-col;
}
</style>
