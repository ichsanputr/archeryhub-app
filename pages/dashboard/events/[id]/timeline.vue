<template>
    <div class="space-y-8">
        <div class="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-navy flex items-center gap-2 font-display">
                    <span class="material-symbols-outlined text-primary">calendar_clock</span> Pilih Hari
                </h2>
                <div class="text-[10px] font-bold text-text-sub/50 uppercase">TimeZone: WIB (UTC+7)</div>
            </div>
            <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                <button v-for="day in days" :key="day.id" @click="activeDay = day.id"
                    class="flex-shrink-0 flex flex-col items-center justify-center min-w-[100px] py-3 px-4 rounded-xl transition-all"
                    :class="activeDay === day.id ? 'bg-navy text-white shadow-lg ring-2 ring-primary ring-offset-2' : 'bg-gray-50 text-text-sub hover:bg-gray-100'">
                    <span class="text-[10px] font-bold uppercase mb-1">{{ day.date }}</span>
                    <span class="text-lg font-black">Day {{ day.id }}</span>
                </button>
            </div>
        </div>

        <div class="relative pl-4 space-y-8">
            <div class="absolute top-4 left-[15px] bottom-8 w-0.5 bg-gray-100 -z-10"></div>

            <div v-for="event in timelineEvents[activeDay]" :key="event.time" class="flex gap-4 md:gap-6 group">
                <div class="w-14 pt-3 shrink-0 text-right">
                    <span class="block font-black text-navy text-lg leading-none">{{ event.time }}</span>
                    <span class="block text-[10px] font-bold text-text-sub/40 mt-1 uppercase">{{ event.period }}</span>
                </div>
                <div class="relative mt-[18px]">
                    <div class="w-3 h-3 rounded-full ring-4 ring-background-light"
                        :class="event.active ? 'bg-primary shadow-[0_0_10px_rgba(183,251,35,0.5)]' : 'bg-gray-300'">
                    </div>
                </div>
                <div
                    class="flex-grow bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-primary/30 transition-all">
                    <div class="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <div>
                            <h3
                                class="font-bold text-navy text-lg group-hover:text-primary transition-colors font-display">
                                {{ event.title }}</h3>
                            <span v-if="event.subtitle" class="text-sm text-text-sub/70">{{ event.subtitle }}</span>
                        </div>
                        <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border"
                            :class="event.statusColor">
                            {{ event.status }}
                        </span>
                    </div>
                    <p v-if="event.desc" class="text-sm text-text-sub/70 mb-3">{{ event.desc }}</p>
                    <div class="flex items-center gap-4 text-[10px] font-bold text-text-sub/50 uppercase">
                        <span v-if="event.targets" class="flex items-center gap-1"><span
                                class="material-symbols-outlined text-sm">grid_view</span> {{ event.targets }}</span>
                        <span v-if="event.duration" class="flex items-center gap-1"><span
                                class="material-symbols-outlined text-sm">timer</span> {{ event.duration }}</span>
                        <span v-if="event.live" class="flex items-center gap-1 text-primary animate-pulse">
                            <span class="material-symbols-outlined text-sm">radio_button_checked</span> Live
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Timeline - Dashboard'
})

const activeDay = ref(1)

const days = [
    { id: 1, date: '12 Nov' },
    { id: 2, date: '13 Nov' },
    { id: 3, date: '14 Nov' },
    { id: 4, date: '15 Nov' }
]

const timelineEvents = {
    1: [
        { time: '07:30', period: 'AM', title: 'Pemeriksaan Alat & Latihan Resmi', status: 'Selesai', statusColor: 'bg-gray-50 text-gray-500 border-gray-100', desc: 'Pengecekan peralatan atlet dan sesi latihan resmi sebelum kualifikasi.', targets: 'Target 1-32', duration: '90 Menit' },
        { time: '09:00', period: 'AM', title: 'Recurve Men', subtitle: 'Babak Kualifikasi (70m)', status: 'Sedang Berlangsung', statusColor: 'bg-primary/10 text-navy border-primary/20', active: true, live: true, targets: '1-16', duration: '120 Menit' },
        { time: '11:30', period: 'AM', title: 'Istirahat Makan Siang', status: 'Mendatang', statusColor: 'bg-gray-50 text-gray-500 border-gray-100', desc: 'Pemeliharaan lapangan dan verifikasi skor.' }
    ],
    2: [
        { time: '08:00', period: 'AM', title: 'Compound Women', subtitle: 'Babak Kualifikasi (50m)', status: 'Mendatang', statusColor: 'bg-gray-50 text-gray-500 border-gray-100', targets: '1-24' }
    ],
    3: [],
    4: []
}
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
