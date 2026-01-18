<template>
    <div class="min-h-screen bg-[#0b1120] text-slate-200 font-sans antialiased overflow-hidden flex flex-col">
        <!-- High Contrast Header -->
        <header class="flex-none px-8 py-6 lg:px-12 lg:py-8 border-b border-white/10 bg-[#162032] shadow-2xl z-20">
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div class="flex-1 min-w-0 flex items-center gap-6">
                    <div
                        class="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                        <span class="material-symbols-outlined text-[#0b1120] text-4xl">target</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <div class="flex items-center gap-3">
                            <span
                                class="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest animate-pulse">LIVE</span>
                            <h2 class="text-yellow-400 text-sm font-bold tracking-[0.2em] uppercase opacity-90">Men's
                                Recurve Finals</h2>
                        </div>
                        <h1
                            class="text-white text-3xl lg:text-5xl font-black tracking-tighter truncate leading-tight uppercase italic">
                            2024 National Archery Championship
                        </h1>
                    </div>
                </div>
                <!-- Digital Clock -->
                <div class="flex-none bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 shadow-inner">
                    <div class="flex items-center gap-3">
                        <div v-for="unit in timeUnits" :key="unit.label" class="flex flex-col items-center gap-1">
                            <div
                                class="bg-[#1e2b42] w-16 h-20 rounded-xl flex items-center justify-center border border-white/10 shadow-lg overflow-hidden relative">
                                <div class="absolute inset-x-0 h-px bg-white/5 top-1/2"></div>
                                <span class="text-4xl font-mono font-black text-white tracking-tighter">{{ unit.value
                                    }}</span>
                            </div>
                            <span class="text-[8px] uppercase text-slate-500 font-black tracking-[0.2em]">{{ unit.label
                                }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- TV Leaderboard Table -->
        <main class="flex-1 relative overflow-hidden flex flex-col p-6 lg:p-10">
            <div
                class="grid grid-cols-12 gap-4 px-6 py-4 mb-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                <div class="col-span-1 text-center">Rank</div>
                <div class="col-span-1 text-center">Trend</div>
                <div class="col-span-4 text-left pl-4">Athlete / Category</div>
                <div class="col-span-1 text-center">End 1</div>
                <div class="col-span-1 text-center">End 2</div>
                <div class="col-span-1 text-center">End 3</div>
                <div class="col-span-1 text-center">End 4</div>
                <div class="col-span-2 text-right pr-4">Total Score</div>
            </div>

            <div class="flex-grow flex flex-col gap-3 overflow-hidden">
                <div v-for="(ath, idx) in athletes" :key="ath.name"
                    class="grid grid-cols-12 gap-4 items-center bg-[#162032] rounded-2xl p-4 border border-white/5 shadow-xl transition-all relative overflow-hidden group"
                    :class="idx === 0 ? 'ring-2 ring-yellow-400/50 scale-[1.02] z-10 shadow-yellow-400/10' : ''">

                    <div v-if="idx === 0" class="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-400"></div>

                    <div class="col-span-1 flex justify-center">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black shadow-lg"
                            :class="getRankClass(idx)">
                            {{ idx + 1 }}
                        </div>
                    </div>

                    <div class="col-span-1 flex justify-center">
                        <span class="material-symbols-outlined text-3xl"
                            :class="ath.trend === 'up' ? 'text-green-500' : ath.trend === 'down' ? 'text-red-500' : 'text-slate-600'">
                            {{ ath.trend === 'up' ? 'arrow_drop_up' : ath.trend === 'down' ? 'arrow_drop_down' :
                            'remove' }}
                        </span>
                    </div>

                    <div class="col-span-4 flex items-center gap-5 pl-2 min-w-0">
                        <div
                            class="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center bg-black/20 shrink-0">
                            <img :src="ath.image" class="w-full h-full object-cover rounded-xl">
                        </div>
                        <div class="min-w-0">
                            <h3
                                class="text-white text-2xl font-black truncate leading-none uppercase tracking-tight italic">
                                {{ ath.name }}</h3>
                            <span class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 block">{{
                                ath.country }}</span>
                        </div>
                    </div>

                    <td v-for="sc in ath.ends" :key="sc" class="col-span-1 text-center text-xl font-bold tabular-nums"
                        :class="sc === 10 ? 'text-yellow-400 animate-pulse' : 'text-slate-300'">
                        {{ sc }}
                    </td>

                    <div class="col-span-2 text-right pr-6">
                        <span class="text-4xl font-black tracking-tight tabular-nums"
                            :class="idx === 0 ? 'text-yellow-400' : 'text-white'">
                            {{ath.ends.reduce((a, b) => a + b, 0) + 320}}
                        </span>
                    </div>
                </div>
            </div>
        </main>

        <!-- High Visibility Ticker -->
        <footer class="flex-none bg-[#162032] border-t-4 border-yellow-400 h-20 flex items-stretch shadow-2xl z-30">
            <div
                class="bg-yellow-400 text-[#0b1120] font-black px-10 h-full flex items-center justify-center shrink-0 z-20 shadow-2xl">
                <span class="material-symbols-outlined mr-2 font-black">campaign</span>
                ANNOUNCEMENT
            </div>
            <div class="flex-1 flex items-center overflow-hidden bg-[#1e2b42] relative">
                <div class="flex gap-12 animate-marquee whitespace-nowrap px-8">
                    <span v-for="n in 3" :key="n"
                        class="text-2xl font-bold text-white/80 tracking-wide flex items-center gap-8">
                        Next session (Women's Recurve) starts at 14:00. Archers please report to the staging area.
                        <span class="text-yellow-400 font-black">///</span>
                        Weather Alert: Wind speeds increasing to 15km/h from NE.
                        <span class="text-yellow-400 font-black">///</span>
                    </span>
                </div>
            </div>
            <div
                class="w-72 bg-[#0b1120] flex flex-col items-center justify-center border-l border-white/10 p-2 shrink-0">
                <span class="text-[8px] text-slate-500 uppercase font-black tracking-[0.4em] mb-1">Powered by</span>
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-yellow-400 text-2xl font-black">sports_score</span>
                    <span class="text-2xl font-black text-white tracking-tighter">Archery<span
                            class="text-yellow-400">Hub</span></span>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
const timeUnits = reactive([
    { label: 'Hrs', value: '00' },
    { label: 'Min', value: '14' },
    { label: 'Sec', value: '38' }
])

onMounted(() => {
    setInterval(() => {
        const now = new Date()
        timeUnits[0].value = String(now.getHours()).padStart(2, '0')
        timeUnits[1].value = String(now.getMinutes()).padStart(2, '0')
        timeUnits[2].value = String(now.getSeconds()).padStart(2, '0')
    }, 1000)
})

const athletes = [
    { name: 'Leo VALLADOLID', country: 'United States', trend: 'up', ends: [10, 10, 9, 10], image: 'https://i.pravatar.cc/150?u=leo' },
    { name: 'Kim JIN-HO', country: 'South Korea', trend: 'stable', ends: [10, 9, 9, 9], image: 'https://i.pravatar.cc/150?u=kim' },
    { name: 'Rossi MARCO', country: 'Italy', trend: 'down', ends: [9, 9, 8, 9], image: 'https://i.pravatar.cc/150?u=marco' },
    { name: 'Chen YU-TING', country: 'Chinese Taipei', trend: 'up', ends: [9, 8, 9, 9], image: 'https://i.pravatar.cc/150?u=chen' },
    { name: 'Brady ELLISON', country: 'United States', trend: 'stable', ends: [9, 9, 9, 8], image: 'https://i.pravatar.cc/150?u=brady' }
]

const getRankClass = (idx) => {
    if (idx === 0) return 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-black'
    if (idx === 1) return 'bg-gradient-to-br from-slate-200 to-slate-400 text-black'
    if (idx === 2) return 'bg-gradient-to-br from-orange-400 to-orange-700 text-white'
    return 'bg-white/5 text-slate-500 border border-white/5'
}

definePageMeta({ layout: false })
</script>

<style scoped>
@keyframes marquee {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-33.33%);
    }
}

.animate-marquee {
    animation: marquee 40s linear infinite;
}

.material-symbols-outlined {
    font-variation-settings: 'FILL' 1, 'wght' 900, 'GRAD' 0, 'opsz' 40;
}
</style>
