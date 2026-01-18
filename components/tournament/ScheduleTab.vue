<template>
    <div class="space-y-6">
        <!-- Day Selector -->
        <div class="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
            <button v-for="day in 4" :key="day" @click="activeDay = day"
                class="px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap shadow-sm border"
                :class="activeDay === day ? 'bg-navy text-primary border-navy' : 'bg-white text-gray-400 border-gray-100 hover:border-navy hover:text-navy'">
                Hari {{ day }} ({{ 11 + day }} Nov)
            </button>
        </div>

        <!-- Timeline -->
        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div
                class="space-y-8 relative before:absolute before:inset-0 before:left-[15px] before:w-0.5 before:bg-gray-100 before:h-full before:z-0">
                <div v-for="(session, index) in sessions" :key="index" class="relative z-10 flex gap-6 group">
                    <div class="w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center shrink-0 transition-colors"
                        :class="session.isLive ? 'bg-red-500' : 'bg-navy'">
                        <span class="w-2 h-2 rounded-full bg-white" :class="{ 'animate-pulse': session.isLive }"></span>
                    </div>
                    <div class="flex-grow pb-8" :class="{ 'border-b border-gray-50': index !== sessions.length - 1 }">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{{
                                    session.time }}</span>
                                <h3 class="text-xl font-black text-navy">{{ session.title }}</h3>
                            </div>
                            <div v-if="session.isLive"
                                class="flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> LIVE
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="detail in session.details" :key="detail.label"
                                class="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{{
                                    detail.label }}</p>
                                <p class="text-sm font-bold text-navy">{{ detail.value }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const activeDay = ref(1)

const sessions = [
    {
        time: '08:00 - 09:30',
        title: 'Kualifikasi Sesi 1 - Recurve Men',
        isLive: false,
        details: [
            { label: 'Jarak', value: '70 Meter' },
            { label: 'Target', value: '01A - 20D' },
            { label: 'Arrows', value: '36 Anak Panah' }
        ]
    },
    {
        time: '10:00 - 11:30',
        title: 'Kualifikasi Sesi 1 - Recurve Women',
        isLive: true,
        details: [
            { label: 'Jarak', value: '70 Meter' },
            { label: 'Target', value: '21A - 40D' },
            { label: 'Arrows', value: '36 Anak Panah' }
        ]
    },
    {
        time: '13:30 - 15:00',
        title: 'Eliminasi 1/32 - Recurve Men',
        isLive: false,
        details: [
            { label: 'Format', value: 'Set System' },
            { label: 'Target', value: '01 - 32' },
            { label: 'Status', value: 'Upcoming' }
        ]
    }
]
</script>
