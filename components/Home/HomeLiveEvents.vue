<template>
    <section class="bg-gray-50 py-16 md:py-20 overflow-hidden">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl sm:text-2xl font-bold text-navy flex items-center gap-2 sm:gap-3 font-display">
                    <span class="w-2.5 h-2.5 sm:w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    Lagi Berlangsung Nih!
                </h2>
                <NuxtLink to="/events"
                    class="text-navy hover:text-primary font-bold text-xs sm:text-sm flex items-center gap-1 group">
                    <span class="hidden sm:inline">Cek Jadwalnya</span>
                    <span class="sm:hidden">Jadwal</span>
                    <span
                        class="material-symbols-outlined text-base sm:text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                </NuxtLink>
            </div>

            <div v-if="loading" class="flex items-center justify-center py-20">
                <Icon icon="ph:circle-notch-bold" class="text-4xl text-primary animate-spin" />
            </div>

            <div v-else-if="events.length > 0"
                class="flex lg:grid lg:grid-cols-4 gap-6 lg:gap-8 pb-8 lg:pb-0 overflow-x-auto lg:overflow-x-visible -mx-4 px-4 sm:mx-0 sm:px-0 lg:mx-0 lg:px-0 no-scrollbar snap-x lg:snap-none">
                <div v-for="live in events" :key="live.uuid"
                    class="min-w-[300px] md:min-w-[380px] lg:min-w-0 snap-center group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-sm hover:border-primary/50 transition-all duration-300 flex flex-col">
                    <div class="relative h-48 overflow-hidden">
                        <img :src="live.image || '/logo.png'" :alt="live.name"
                            class="w-full h-full object-cover transition-transform duration-500" />
                        <span v-if="live.isOngoing"
                            class="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-red-500 text-white text-[10px] font-black capitalize tracking-wider shadow-md">
                            Berlangsung
                        </span>
                        <span v-else
                            class="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-gray-600/90 text-white text-[10px] font-black capitalize tracking-wider shadow-md">
                            Selesai
                        </span>
                    </div>
                    <div class="p-5 flex-1 flex flex-col">
                        <h3
                            class="text-lg font-bold text-navy mb-2 leading-snug group-hover:text-primary transition-colors font-display">
                            {{ live.name }}
                        </h3>
                        <div class="flex items-center gap-2 text-gray-500 text-sm mb-4">
                            <Icon icon="mi:location" class="text-lg" />
                            <span class="truncate">{{ live.location }}</span>
                        </div>
                        <div class="mt-auto">
                            <NuxtLink :to="`/events/${live.slug || live.uuid}`"
                                class="w-full h-10 rounded-lg border-2 border-navy text-navy hover:bg-navy hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                                <span class="material-symbols-outlined text-lg">visibility</span>
                                Lihat Event
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-16">
                <Icon icon="ph:video-camera-slash-light" class="text-7xl text-gray-200 mb-4 mx-auto" />
                <p class="text-sm text-gray-400 font-medium">Saat ini belum ada event yang sedang berlangsung.</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

const { data: rawEventsData, pending: loading } = await useAsyncData(
    'live-events',
    () => $fetch(`${apiBaseUrl}/events`, {
        query: { limit: '12' }
    })
)

const events = computed(() => {
    const now = new Date()
    const list = (rawEventsData.value?.events || []).map(event => {
        const start = event.start_date ? new Date(event.start_date) : null
        const end = event.end_date ? new Date(event.end_date) : null
        const isOngoing = start && start <= now && (!end || end >= now)
        return {
            name: event.name || event.title,
            location: event.location || event.venue || '',
            image: useImageOrDefault(event.banner_url || event.logo_url),
            slug: event.slug,
            uuid: event.uuid,
            start_date: event.start_date,
            end_date: event.end_date,
            isOngoing
        }
    })
    return list.sort((a, b) => {
        const endA = a.end_date ? new Date(a.end_date).getTime() : 0
        const endB = b.end_date ? new Date(b.end_date).getTime() : 0
        const ongoingA = a.isOngoing ? 1 : 0
        const ongoingB = b.isOngoing ? 1 : 0
        if (ongoingB !== ongoingA) return ongoingB - ongoingA
        return endB - endA
    })
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
