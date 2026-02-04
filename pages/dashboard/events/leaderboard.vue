<template>
    <div class="min-h-screen bg-navy text-white font-display antialiased overflow-hidden flex flex-col">
        <!-- Dashboard Header -->
        <div
            class="bg-black/20 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center shrink-0">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                    <Icon icon="ph:target-bold" class="text-navy text-2xl" />
                </div>
                <div>
                    <h1 class="text-xl font-black tracking-tight">LIVE LEADERBOARD</h1>
                    <p class="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Indonesian Open 2024</p>
                </div>
            </div>
            <div class="flex items-center gap-8">
                <div class="text-right hidden sm:block">
                    <span class="block text-[10px] font-black text-white/30 uppercase tracking-widest">Target
                        Area</span>
                    <span class="text-lg font-black text-white">TARGET 12 - 24</span>
                </div>
                <div class="text-right">
                    <span class="block text-[10px] font-black text-white/30 uppercase tracking-widest">Session
                        Time</span>
                    <span class="text-lg font-black text-white tabular-nums">{{ currentTime }}</span>
                </div>
            </div>
        </div>

        <!-- Main Display -->
        <div class="flex-grow p-4 md:p-8 flex flex-col gap-6">
            <!-- Category Header -->
            <div class="flex justify-between items-end px-2">
                <div class="flex items-center gap-4">
                    <span
                        class="px-4 py-1.5 bg-primary text-navy font-black text-sm rounded-full tracking-widest uppercase shadow-md shadow-primary/20">
                        RECURVE MEN 70m
                    </span>
                    <span class="text-xs font-bold text-white/40 uppercase tracking-widest">Qualification Session
                        1</span>
                </div>
                <div class="flex gap-2">
                    <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span class="text-[10px] font-bold text-primary uppercase tracking-widest">Live Updates</span>
                </div>
            </div>

            <!-- Standings List -->
            <div class="flex-grow grid grid-cols-1 gap-3 overflow-hidden">
                <div v-for="(athlete, index) in leaderboard" :key="athlete.name"
                    class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 flex items-center gap-6 transition-all hover:bg-white/10 hover:border-primary/30"
                    :class="index === 0 ? 'ring-2 ring-primary ring-offset-4 ring-offset-navy shadow-[0_0_40px_rgba(183,251,35,0.1)]' : ''">

                    <!-- Rank -->
                    <div class="w-12 md:w-16 shrink-0 text-center">
                        <span class="text-2xl md:text-4xl font-black tabular-nums"
                            :class="index < 3 ? 'text-primary' : 'text-white/30'">
                            {{ index + 1 }}
                        </span>
                    </div>

                    <!-- Target -->
                    <div class="w-12 md:w-16 shrink-0 text-center border-x border-white/5 py-1">
                        <span
                            class="block text-[10px] font-black text-white/20 uppercase tracking-tighter mb-1">Target</span>
                        <span class="text-lg font-black text-white tabular-nums">{{ athlete.target }}</span>
                    </div>

                    <!-- Identity -->
                    <div class="flex-grow flex items-center gap-4 min-w-0">
                        <div
                            class="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/10 shrink-0 overflow-hidden">
                            <img :src="useImageOrDefault(athlete.image, athlete.name)" :alt="athlete.name"
                                class="w-full h-full object-cover">
                        </div>
                        <div class="min-w-0">
                            <h3 class="text-lg md:text-2xl font-black truncate leading-tight tracking-tight uppercase">
                                {{ athlete.name }}</h3>
                            <p class="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest">{{
                                athlete.club }}</p>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="hidden md:flex gap-12 shrink-0">
                        <div class="text-center">
                            <span
                                class="block text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">10s+X</span>
                            <span class="text-xl font-black text-white tabular-nums">{{ athlete.tens }}/{{ athlete.xs
                            }}</span>
                        </div>
                        <div class="text-center">
                            <span
                                class="block text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Average</span>
                            <span class="text-xl font-black text-primary tabular-nums">{{ ((athlete.score /
                                72)).toFixed(2) }}</span>
                        </div>
                    </div>

                    <!-- Total -->
                    <div class="w-24 md:w-32 shrink-0 text-right bg-white/10 rounded-xl py-3 px-4">
                        <span
                            class="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Total</span>
                        <span class="text-2xl md:text-4xl font-black text-primary tabular-nums">{{ athlete.score
                        }}</span>
                    </div>
                </div>
            </div>

            <!-- Footer Ticker -->
            <div class="bg-black/30 py-3 px-6 rounded-xl flex items-center gap-6 shrink-0 border border-white/5">
                <span
                    class="text-[10px] font-black text-primary uppercase tracking-[0.3em] shrink-0 border-r border-white/10 pr-6">Next
                    Schedule</span>
                <div class="flex-grow overflow-hidden relative">
                    <div class="flex gap-12 animate-marquee whitespace-nowrap">
                        <span v-for="sc in schedules" :key="sc" class="text-xs font-bold text-white/60">
                            {{ sc }}
                        </span>
                        <!-- Repeat for smooth loop -->
                        <span v-for="sc in schedules" :key="'dup-' + sc" class="text-xs font-bold text-white/60">
                            {{ sc }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
const currentTime = ref('00:00:00')

const updateTime = () => {
    currentTime.value = new Date().toLocaleTimeString('en-GB')
}

onMounted(() => {
    updateTime()
    setInterval(updateTime, 1000)
})

useHead({
    title: 'Live Leaderboard - ArcheryHub Dashboard'
})

const leaderboard = [
    { name: 'Arif Dwi Pangestu', score: 682, target: '12A', club: 'DKI Jakarta', tens: 44, xs: 18, image: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Riau Ega Agatha', score: 678, target: '14B', club: 'Jawa Timur', tens: 40, xs: 14, image: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Alviyanto Bagas', score: 671, target: '11A', club: 'Jawa Tengah', tens: 36, xs: 12, image: 'https://i.pravatar.cc/150?u=3' },
    { name: 'Hendra Purnama', score: 665, target: '13B', club: 'DI Yogyakarta', tens: 33, xs: 10, image: 'https://i.pravatar.cc/150?u=4' },
    { name: 'Ahmad Khoirul', score: 660, target: '10A', club: 'Jawa Barat', tens: 30, xs: 8, image: 'https://i.pravatar.cc/150?u=5' }
]

const schedules = [
    '09:00 - Compound Men Qualification',
    '11:30 - Lunch Break & Maintenance',
    '13:00 - Elimination Round 1/4 (All Divisions)',
    '15:00 - Medal Ceremonies - Session 1'
]

definePageMeta({
    layout: false
})
</script>

<style scoped>
@keyframes marquee {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}

.animate-marquee {
    display: flex;
    animation: marquee 30s linear infinite;
}

.font-display {
    font-family: 'Manrope', sans-serif;
}
</style>
