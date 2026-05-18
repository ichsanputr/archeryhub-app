<template>
    <div class="space-y-16">
        <!-- Main Card Parent (Standardized Padding) -->
        <div class="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">

            <div v-if="isLoading" class="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                <Icon icon="ph:spinner-gap-bold" class="text-4xl animate-spin text-primary" />
                <p class="text-sm font-bold tracking-widest text-navy">Memuat jadwal...</p>
            </div>

            <div v-else-if="!props.schedules.length"
                class="py-20 flex flex-col items-center justify-center text-center">
                <div class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                    <Icon icon="ph:calendar-blank-bold" class="text-5xl text-gray-200" />
                </div>
                <p class="text-gray-400 font-black tracking-widest text-sm">Jadwal belum tersedia.</p>
            </div>

            <div v-else class="space-y-16">
                <!-- Days are listed sequentially, no selector -->
                <div v-for="day in sortedDays" :key="day" class="space-y-10">
                    <!-- Section Header (Date Focused) -->
                    <div class="flex items-center gap-4">
                        <h2 class="text-lg sm:text-xl font-black text-navy tracking-tight whitespace-nowrap">
                            {{ formatDate(groupedByDay[day][0]?.start_time) }} <span
                                class="text-[10px] sm:text-xs font-bold text-gray-400 ml-2 tracking-normal">/ HARI {{
                                    day }}</span>
                        </h2>
                        <div class="h-[2px] flex-1 bg-gray-100"></div>
                    </div>

                    <div class="relative space-y-12">
                        <!-- Vertical Line (Tightened layout) -->
                        <div class="absolute left-5 md:left-[100px] top-0 bottom-0 w-[3px] bg-primary z-0"></div>

                        <div v-for="(session, index) in groupedByDay[day]" :key="session.id || index"
                            class="relative z-10 flex flex-col md:flex-row md:gap-10 group">

                            <!-- Time Column (Absolute on mobile, right-aligned on desktop to avoid stacking) -->
                            <div
                                class="absolute md:relative top-7 md:top-0 left-14 md:left-0 md:w-20 flex-shrink-0 md:pt-7 text-navy z-30">
                                <span
                                    class="text-xs sm:text-sm font-black block md:text-right leading-none tracking-wider">
                                    {{ formatStartTime(session.start_time) }}
                                </span>
                                <div v-if="getSessionStatus(session) === 'ongoing'"
                                    class="text-[8px] sm:text-[9px] text-primary-hover block md:text-right font-black tracking-tighter mt-1.5 whitespace-nowrap">
                                    Berlangsung
                                </div>
                                <div v-else-if="getSessionStatus(session) === 'completed'"
                                    class="text-[8px] sm:text-[9px] text-gray-400 block md:text-right font-bold mt-1.5 whitespace-nowrap">
                                    Selesai
                                </div>
                            </div>

                            <!-- Timeline Indicator (Dot - Perfectly Centered at 100px) -->
                            <div class="absolute left-[10px] md:left-[90px] top-6 md:top-7 w-5 h-5 rounded-full z-20 flex items-center justify-center shadow-sm transition-colors duration-300"
                                :class="{
                                    'bg-navy border-4 border-primary': getSessionStatus(session) === 'ongoing',
                                    'bg-primary border-4 border-primary-hover': getSessionStatus(session) === 'completed',
                                    'bg-white border-4 border-primary': getSessionStatus(session) === 'upcoming'
                                }">
                            </div>

                            <!-- Content Card (Mobile padding adjusted for absolute time) -->
                            <div class="flex-1 pt-16 pb-6 px-6 md:p-8 rounded-3xl border bg-white shadow-sm" :class="[
                                getSessionStatus(session) === 'ongoing'
                                    ? 'border-l-[10px] border-primary ring-1 ring-black/5'
                                    : 'border-gray-100'
                            ]">

                                <div class="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                                    <h3 class="text-lg sm:text-xl font-black text-navy leading-tight tracking-tight">{{
                                        session.title }}</h3>

                                    <!-- Detailed Status Badges -->
                                    <div v-if="getSessionStatus(session) === 'ongoing'"
                                        class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black bg-primary text-btn-text capitalize tracking-widest shadow-lg shadow-primary/20">
                                        <span class="w-1.5 h-1.5 rounded-full bg-navy animate-pulse"></span>
                                        LIVE NOW
                                    </div>
                                    <div v-else-if="getSessionStatus(session) === 'completed'"
                                        class="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-gray-100 text-gray-500 capitalize tracking-widest">
                                        Selesai
                                    </div>
                                    <div v-else
                                        class="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 capitalize tracking-widest">
                                        Mendatang
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                            <Icon icon="ph:map-pin-bold"
                                                class="text-lg sm:text-xl text-primary-hover" />
                                        </div>
                                        <div>
                                            <p
                                                class="text-[8px] sm:text-[9px] font-black text-gray-400 tracking-widest leading-none mb-1">
                                                LOKASI</p>
                                            <p class="text-xs sm:text-sm font-black text-navy">{{ session.location ||
                                                'Venue Utama' }}</p>
                                        </div>
                                    </div>

                                    <div v-if="session.description" class="flex items-center gap-3">
                                        <div
                                            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                            <Icon icon="ph:info-bold" class="text-lg sm:text-xl text-primary-hover" />
                                        </div>
                                        <div>
                                            <p
                                                class="text-[8px] sm:text-[9px] font-black text-gray-400 tracking-widest leading-none mb-1">
                                                DETAIL</p>
                                            <p class="text-xs sm:text-sm font-black text-navy line-clamp-1">{{
                                                session.description }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    eventId: {
        type: String,
        required: true
    },
    schedules: {
        type: Array,
        default: () => []
    }
})

const isLoading = ref(false)

const groupedByDay = computed(() => {
    const groups = {}
    props.schedules.forEach(item => {
        const day = item.day_order || 1
        if (!groups[day]) groups[day] = []
        groups[day].push(item)
    })

    // Sort items within each day by start time
    Object.values(groups).forEach(list => {
        list.sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    })

    return groups
})

const sortedDays = computed(() => {
    return Object.keys(groupedByDay.value).map(Number).sort((a, b) => a - b)
})

const formatStartTime = (timeStr) => {
    if (!timeStr) return '--:--'
    return new Date(timeStr).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}

const formatDate = (timeStr) => {
    if (!timeStr) return ''
    return new Date(timeStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const getSessionStatus = (session) => {
    const now = new Date()
    const start = new Date(session.start_time)
    const end = session.end_time ? new Date(session.end_time) : null

    if (now < start) return 'upcoming'
    if (end && now > end) return 'completed'
    return 'ongoing'
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

@keyframes pulse-custom {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.7;
        transform: scale(0.95);
    }
}

.animate-pulse {
    animation: pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
