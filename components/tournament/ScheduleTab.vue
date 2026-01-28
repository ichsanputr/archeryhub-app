<template>
    <div class="space-y-6">
        <!-- Day Selector -->
        <div class="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
            <button v-for="day in availableDays" :key="day" @click="activeDay = day"
                class="px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap shadow-sm border"
                :class="activeDay === day ? 'bg-navy text-primary border-navy' : 'bg-white text-gray-400 border-gray-100 hover:border-navy hover:text-navy'">
                Hari {{ day }}
            </button>
        </div>

        <!-- Timeline -->
        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div
                class="space-y-8 relative before:absolute before:inset-0 before:left-[15px] before:w-0.5 before:bg-gray-100 before:h-full before:z-0">
                <div v-if="isLoading" class="py-10 flex items-center justify-center text-gray-400 text-sm font-medium">
                    Memuat jadwal lomba...
                </div>
                <div v-else-if="!sessions.length" class="py-10 flex items-center justify-center text-gray-400 text-sm font-medium">
                    Jadwal lomba belum tersedia.
                </div>
                <div v-else v-for="(session, index) in sessions" :key="session.id || index" class="relative z-10 flex gap-6 group">
                    <div class="w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center shrink-0 transition-colors"
                        :class="false ? 'bg-red-500' : 'bg-navy'">
                        <span class="w-2 h-2 rounded-full bg-white"></span>
                    </div>
                    <div class="flex-grow pb-8" :class="{ 'border-b border-gray-50': index !== sessions.length - 1 }">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{{
                                    formatTimeRange(session) }}</span>
                                <h3 class="text-xl font-black text-navy">{{ session.title }}</h3>
                            </div>
                        </div>
                        <p v-if="session.description" class="text-sm text-gray-600 mb-4">
                            {{ session.description }}
                        </p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
                                    LOKASI
                                </p>
                                <p class="text-sm font-bold text-navy">
                                    {{ session.location || 'Venue utama' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useApi } from '~/composables/useApi'

const props = defineProps({
    eventId: {
        type: String,
        required: true
    }
})

const activeDay = ref(1)
const isLoading = ref(true)
const schedules = ref([])

const { get } = useApi()

const groupedByDay = computed(() => {
    const groups = {}
    for (const item of schedules.value) {
        const day = item.day_order || 1
        if (!groups[day]) groups[day] = []
        groups[day].push(item)
    }
    Object.values(groups).forEach(list => {
        list.sort((a, b) => {
            const tA = new Date(a.start_time).getTime()
            const tB = new Date(b.start_time).getTime()
            return tA - tB
        })
    })
    return groups
})

const availableDays = computed(() => {
    const days = Object.keys(groupedByDay.value).map(d => Number(d))
    return days.length ? days.sort((a, b) => a - b) : [1]
})

const sessions = computed(() => groupedByDay.value[activeDay.value] || [])

const formatTimeRange = (item) => {
    const start = new Date(item.start_time)
    const end = item.end_time ? new Date(item.end_time) : null
    const opts = { hour: '2-digit', minute: '2-digit' }
    const startStr = start.toLocaleTimeString('id-ID', opts)
    const endStr = end ? end.toLocaleTimeString('id-ID', opts) : ''
    return endStr ? `${startStr} - ${endStr}` : startStr
}

onMounted(async () => {
    try {
        const res = await get(`/events/${props.eventId}/schedule`)
        schedules.value = res?.schedules || res?.data?.schedules || []
        if (schedules.value.length) {
            const minDay = schedules.value.reduce((min, s) => {
                const d = s.day_order || 1
                return d < min ? d : min
            }, schedules.value[0].day_order || 1)
            activeDay.value = minDay
        }
    } catch (err) {
        console.error('Failed to fetch event schedule', err)
    } finally {
        isLoading.value = false
    }
})
</script>
