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
                    <span class="text-navy">Detail Kualifikasi</span>
                </div>
                <h1 class="text-3xl font-black text-navy tracking-tight">Manajemen Sesi Kualifikasi</h1>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" icon="ph:printer" class="h-11 px-5 border-gray-200">Cetak Hasil
                </BaseButton>
                <BaseButton variant="primary" icon="ph:broadcast" class="h-11 px-6 shadow-lg shadow-primary/20">
                    Siar Langsung</BaseButton>
            </div>
        </div>

        <!-- Session Stats Bar -->
        <div class="bg-navy rounded-3xl p-8 text-white shadow-xl shadow-navy/20 relative overflow-hidden">
            <div
                class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                <div class="space-y-1">
                    <p class="text-[10px] font-black text-primary/60 uppercase tracking-widest">Progress Seri</p>
                    <div class="flex items-center gap-4">
                        <span class="text-3xl font-black text-primary">Seri 6 <span
                                class="text-sm font-medium text-white/50">dari 12</span></span>
                    </div>
                    <div class="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div class="bg-primary h-full shadow-[0_0_10px_rgba(217,255,0,0.5)]" style="width: 50%"></div>
                    </div>
                </div>
                <div class="space-y-1 border-l border-white/10 pl-8">
                    <p class="text-[10px] font-black text-white/40 uppercase tracking-widest">Rata-rata Skor</p>
                    <p class="text-3xl font-black text-white">9.42 <span
                            class="text-xs font-medium text-white/30 tracking-normal capitalize">pts/arrow</span></p>
                </div>
                <div class="space-y-1 border-l border-white/10 pl-8">
                    <p class="text-[10px] font-black text-white/40 uppercase tracking-widest">Anak Panah Masuk</p>
                    <p class="text-3xl font-black text-white">2,430 <span
                            class="text-xs font-medium text-white/30 tracking-normal capitalize">/ 4,608</span></p>
                </div>
                <div class="space-y-1 border-l border-white/10 pl-8">
                    <p class="text-[10px] font-black text-white/40 uppercase tracking-widest">Estimasi Selesai</p>
                    <p class="text-3xl font-black text-white">14:23 <span
                            class="text-xs font-medium text-white/30 tracking-normal capitalize">WIB</span></p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Target Status Panel -->
            <div
                class="lg:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 class="text-[11px] font-black text-navy uppercase tracking-widest">Status Bantalan</h3>
                    <div
                        class="flex items-center gap-1.5 px-2 py-0.5 bg-navy text-primary text-[9px] font-black rounded uppercase">
                        Seri 6</div>
                </div>
                <div class="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
                    <div v-for="target in targets" :key="target.id" :class="getTargetStatusClass(target.status)"
                        class="flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer hover:shadow-sm">
                        <div class="flex items-center gap-3">
                            <span
                                :class="target.status === 'finished' ? 'bg-navy text-primary' : target.status === 'live' ? 'bg-primary text-navy' : 'bg-gray-100 text-gray-400'"
                                class="h-9 w-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
                                {{ target.id }}
                            </span>
                            <div>
                                <p class="text-xs font-black text-navy uppercase tracking-tight">Butt {{ target.lane }}
                                </p>
                                <p :class="target.status === 'finished' ? 'text-green-600' : target.status === 'live' ? 'text-primary-hover font-bold italic' : 'text-gray-400'"
                                    class="text-[10px] uppercase font-bold tracking-widest">
                                    {{ target.statusLabel }}
                                </p>
                            </div>
                        </div>
                        <Icon v-if="target.status === 'finished'" icon="ph:check-circle-fill"
                            class="text-green-500 text-xl" />
                        <span v-else-if="target.status === 'live'"
                            class="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    </div>
                </div>
                <div class="p-5 bg-gray-50 border-t border-gray-100">
                    <div
                        class="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        <span>Penyelesaian</span>
                        <span>14 / 32 Target</span>
                    </div>
                    <div class="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div class="bg-navy h-full w-[43%] transition-all duration-1000"></div>
                    </div>
                </div>
            </div>

            <!-- Live Standings Table -->
            <div
                class="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 class="text-[11px] font-black text-navy uppercase tracking-widest">Peringkat Langsung</h3>
                    <div class="flex gap-2">
                        <BaseInput v-model="searchQuery" placeholder="Cari atlet..." icon="ph:magnifying-glass"
                            class="max-w-[150px] !h-9 text-xs" />
                        <button class="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-all">
                            <Icon icon="ph:funnel" />
                        </button>
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
                                <th class="px-6 py-4 text-right">Trend</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="(archer, i) in filteredArchers" :key="i"
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
                                                archer.category }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{{
                                        archer.club }}</span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="text-sm font-black text-navy">{{ archer.score }}</span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="text-xs font-bold text-gray-400">{{ archer.xCount }}</span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <Icon
                                        :icon="archer.trend === 'up' ? 'ph:trend-up' : archer.trend === 'down' ? 'ph:trend-down' : 'ph:minus'"
                                        :class="archer.trend === 'up' ? 'text-green-500' : archer.trend === 'down' ? 'text-red-500' : 'text-gray-300'"
                                        class="text-lg inline-block" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Control Actions Panel -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Live Timer Card -->
                <div
                    class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-6 group hover:border-primary/30 transition-all">
                    <div class="flex justify-between items-center">
                        <h3 class="text-[11px] font-black text-navy uppercase tracking-widest">Timer Sesi</h3>
                        <span
                            class="bg-red-50 text-red-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em] animate-pulse">LIVE</span>
                    </div>
                    <div
                        class="text-5xl font-mono font-black text-navy text-center tracking-tighter tabular-nums drop-shadow-sm">
                        02:45
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <button
                            class="flex items-center justify-center gap-2 py-3 bg-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-navy-light transition-all shadow-md active:scale-95">
                            <Icon icon="ph:pause" /> PAUSE
                        </button>
                        <button
                            class="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-navy rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95">
                            <Icon icon="ph:arrow-counter-clockwise" /> RESET
                        </button>
                    </div>
                    <button
                        class="w-full py-4 bg-primary text-navy rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.15em] hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-95">
                        <Icon icon="ph:fast-forward" class="text-lg" />
                        LANJUT KE SERI 7
                    </button>
                </div>

                <!-- Session Info -->
                <div class="bg-navy rounded-3xl p-6 text-white space-y-4">
                    <h4
                        class="text-[10px] font-black text-white/40 uppercase tracking-widest border-b border-white/10 pb-3">
                        Informasi Putaran</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-white/50">Total Seri</span>
                            <span class="font-bold">12 (72 Panah)</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-white/50">Jarak Target</span>
                            <span class="font-bold">70 Meter</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-white/50">Ukuran Face</span>
                            <span class="font-bold">122cm Full</span>
                        </div>
                        <div class="pt-3 border-t border-white/10 mt-2">
                            <div class="flex items-start gap-2 text-primary/80">
                                <Icon icon="ph:info" class="mt-0.5 shrink-0" />
                                <span class="text-[10px] font-bold leading-normal uppercase">Skor Sedang diverifikasi
                                    secara real-time oleh judge lapangan.</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Print Action -->
                <button
                    class="w-full py-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest text-navy hover:shadow-md transition-all">
                    <Icon icon="ph:printer" class="text-lg" />
                    CETAK RANKING SEKARANG
                </button>
            </div>
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

const searchQuery = ref('')

const targets = ref([
    { id: 1, lane: 'A/B', status: 'finished', statusLabel: 'Score Verified' },
    { id: 2, lane: 'A/B', status: 'finished', statusLabel: 'Score Verified' },
    { id: 3, lane: 'A/B', status: 'live', statusLabel: 'Scoring...' },
    { id: 4, lane: 'A/B', status: 'pending', statusLabel: 'Waiting' },
    { id: 5, lane: 'A/B', status: 'pending', statusLabel: 'Waiting' },
    { id: 6, lane: 'A/B', status: 'pending', statusLabel: 'Waiting' },
    { id: 7, lane: 'A/B', status: 'pending', statusLabel: 'Waiting' },
    { id: 8, lane: 'A/B', status: 'pending', statusLabel: 'Waiting' },
    { id: 9, lane: 'A/B', status: 'pending', statusLabel: 'Waiting' },
    { id: 10, lane: 'A/B', status: 'pending', statusLabel: 'Waiting' },
])

const archers = ref([
    { name: 'Marcus Thompson', category: 'Recurve Men Open', club: 'ITA National', score: 588, xCount: 28, trend: 'up' },
    { name: 'Kim Jae-seong', category: 'Recurve Men Open', club: 'KOR High Perf', score: 584, xCount: 24, trend: 'stable' },
    { name: 'Luca Rossi', category: 'Recurve Men Open', club: 'FRA Elite', score: 579, xCount: 22, trend: 'down' },
    { name: 'Ahmad Rifai', category: 'Recurve Men Open', club: 'Garuda AC', score: 575, xCount: 19, trend: 'up' },
    { name: 'Steve Miller', category: 'Recurve Men Open', club: 'USA Pro', score: 572, xCount: 18, trend: 'stable' },
    { name: 'Hiroshi Tanaka', category: 'Recurve Men Open', club: 'Tokyo Sports', score: 569, xCount: 17, trend: 'down' },
])

const filteredArchers = computed(() => {
    if (!searchQuery.value) return archers.value
    return archers.value.filter(a => a.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const getTargetStatusClass = (status) => {
    const classes = {
        'finished': 'bg-green-50 border-green-100',
        'live': 'bg-primary/5 border-primary/20',
        'pending': 'bg-gray-50 border-gray-100 opacity-60'
    }
    return classes[status] || classes.pending
}
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
