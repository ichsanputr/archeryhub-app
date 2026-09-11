<template>
    <div class="bg-white rounded-3xl shadow-sm border border-border-subtle/50 p-6 md:p-8 h-full">
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-navy text-lg sm:text-2xl font-black tracking-tight font-display">Event
                    Terbaru</h2>
                <div class="text-text-sub text-xs sm:text-sm mt-1">Event terbaru yang bisa kamu ikuti!
                </div>
            </div>
            <NuxtLink to="/events"
                class="flex items-center gap-1 text-navy text-xs sm:text-sm font-semibold hover:text-primary transition-colors group">
                <span class="hidden sm:inline"><span class="link-underline">Cek Semua</span></span>
                <span class="sm:hidden"><span class="link-underline">Semua</span></span>
                <Icon icon="ph:arrow-right-bold"
                    class="text-base sm:text-lg group-hover:translate-x-1 transition-transform" />
            </NuxtLink>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
            <Icon icon="ph:circle-notch-bold" class="text-4xl text-primary animate-spin" />
            <p class="text-sm text-gray-400 font-medium tracking-wide">Memuat daftar event...</p>
        </div>

        <div v-else-if="events.length > 0"
            class="grid grid-cols-1 gap-4 px-1 max-h-[550px] overflow-y-auto scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-200 hover:scrollbar-thumb-primary/30 transition-colors pr-2 custom-scrollbar">
            <NuxtLink v-for="(event, index) in events" :key="event.uuid || index"
                :to="`/events/${event.slug || event.uuid}`"
                class="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden block">
                <div class="flex flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
                        <!-- Date Badge -->
                        <div
                            class="flex-shrink-0 flex flex-col items-center justify-center w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-navy text-white shadow-sm group-hover:bg-primary group-hover:text-navy transition-colors duration-300">
                            <span class="text-[8px] sm:text-xs font-bold  tracking-wider opacity-80">{{
                                formatDate(event.start_date, 'MMM') }}</span>
                            <span class="text-sm sm:text-2xl font-black leading-none">{{ formatDate(event.start_date,
                                'DD') }}</span>
                        </div>

                        <div class="flex flex-col min-w-0 flex-1">
                            <h3
                                class="text-navy text-sm sm:text-lg font-bold group-hover:text-primary transition-colors font-display line-clamp-1">
                                {{ event.name }}
                            </h3>
                            <div class="flex flex-wrap items-center gap-3 mt-1.5 min-w-0">
                                <div
                                    class="flex items-center gap-1.5 text-[10px] sm:text-xs text-text-sub font-medium min-w-0">
                                    <Icon icon="ph:map-pin-bold" class="flex-shrink-0" />
                                    <span class="truncate">{{ event.location }}</span>
                                </div>

                                <div class="hidden sm:block w-1 h-1 rounded-full bg-gray-300"></div>

                                <div class="flex items-center gap-1.5 min-w-0">
                                    <img :src="event.organizer_logo" :alt="event.organizer"
                                        class="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover border border-gray-100 flex-shrink-0 bg-gray-50">
                                    <span
                                        class="text-[10px] sm:text-xs text-text-sub truncate font-medium max-w-[160px]">{{
                                            event.organizer }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Arrow: always visible on mobile, hover on desktop -->
                    <div
                        class="flex lg:hidden items-center justify-center w-10 h-10 rounded-xl bg-primary text-navy shrink-0">
                        <Icon icon="ph:arrow-right-bold" class="text-lg" />
                    </div>
                    <div
                        class="hidden lg:flex items-center gap-2 bg-primary text-navy text-xs font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <span>{{ $t('common.view', 'Lihat') }}</span>
                        <Icon icon="ph:arrow-right-bold" />
                    </div>
                </div>
            </NuxtLink>
        </div>

        <div v-else class="flex-1 flex flex-col items-center justify-center h-full pb-24 text-center">
            <div class="flex flex-col items-center gap-2">
                <div>
                    <Icon icon="ph:calendar-blank-light" class="text-7xl text-gray-200 mb-4" />
                </div>
                <div class="text-sm text-gray-400">{{ $t('nav.no_latest_events', 'Belum ada event terbaru.') }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

const formatDate = (dateStr, format) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (format === 'MMM') {
        return date.toLocaleDateString('id-ID', { month: 'short' })
    }
    if (format === 'DD') {
        return date.getDate().toString().padStart(2, '0')
    }
    return date.toLocaleDateString('id-ID')
}

const { data: eventsData, pending: loading } = await useAsyncData(
    'latest-events',
    () => $fetch(`${apiBaseUrl}/events`, {
        query: { limit: '6' }
    })
)

const transformEvent = (event) => ({
    uuid: event.uuid || event.id,
    slug: event.slug || event.uuid || event.id,
    name: event.name,
    start_date: event.start_date,
    location: event.venue || event.location || event.city,
    organizer: event.organizer_name || 'Penyelenggara',
    organizer_logo: useImageOrDefault(event.organizer_avatar_url || null)
})

const events = computed(() => {
    const rawEvents = eventsData.value?.events || []
    return rawEvents.map(transformEvent)
})
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>
