<template>
    <div class="space-y-8">
        <!-- Empty State -->
        <div v-if="isLocationEmpty"
            class="bg-white rounded-3xl p-12 sm:p-16 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
            <div class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6 shadow-2xs">
                <Icon icon="ph:map-pin-line-bold" class="text-4xl text-gray-300" />
            </div>
            <h3 class="text-lg sm:text-xl font-black text-navy mb-2">
                {{ t('event_venue.empty_title', 'Informasi Lokasi Belum Tersedia') }}
            </h3>
            <p class="text-gray-400 font-medium text-sm max-w-sm mx-auto leading-relaxed">
                {{ t('event_venue.empty_desc', 'Penyelenggara belum menambahkan detail lokasi atau peta untuk event ini.') }}
            </p>
        </div>

        <!-- Venue Details & Map Card -->
        <section v-else class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <!-- Map Embed -->
            <div v-if="gmapsEmbedUrl" class="h-[360px] sm:h-[420px] w-full bg-gray-50 relative group">
                <iframe :src="gmapsEmbedUrl" width="100%" height="100%" style="border:0;"
                    allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>

            <!-- Venue Details Content -->
            <div class="p-6 sm:p-8 md:p-10 space-y-6">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="space-y-2">
                        <div class="flex items-center gap-3">
                            <div class="size-10 sm:size-12 rounded-2xl bg-navy/5 flex items-center justify-center shrink-0">
                                <Icon icon="ph:map-pin-fill" class="text-xl sm:text-2xl text-primary" />
                            </div>
                            <div>
                                <span class="text-[10px] font-black text-gray-400 tracking-widest block">{{ t('event_venue.venue_title', 'Lokasi & Tempat Pertandingan') }}</span>
                                <h2 class="text-xl sm:text-2xl font-black text-navy leading-tight">
                                    {{ venue || t('event_schedule.main_venue', 'Venue Utama') }}
                                </h2>
                            </div>
                        </div>

                        <p v-if="address" class="text-sm sm:text-base text-gray-600 leading-relaxed pl-0 md:pl-15">
                            {{ address }}
                        </p>
                    </div>

                    <!-- Direct Google Maps Action -->
                    <div v-if="directGmapsUrl" class="shrink-0 pl-0 md:pl-0">
                        <a :href="directGmapsUrl" target="_blank" rel="noopener noreferrer"
                            class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-navy text-white text-xs sm:text-sm font-bold hover:bg-navy/90 hover:shadow-md transition-all">
                            <Icon icon="ph:arrow-square-out-bold" class="text-base text-primary" />
                            <span>{{ t('event_venue.open_gmaps', 'Buka di Google Maps') }}</span>
                        </a>
                    </div>
                </div>

                <!-- Accessibility / Facilities Badges -->
                <div v-if="accessibility && accessibility.length > 0" class="pt-6 border-t border-gray-100">
                    <h4 class="text-xs font-black text-gray-400 tracking-widest mb-4">
                        {{ t('event_venue.accessibility_title', 'Akses & Fasilitas Lokasi') }}
                    </h4>
                    <div class="flex flex-wrap gap-2.5">
                        <div v-for="option in accessibility" :key="option"
                            class="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50/80 px-3.5 py-2 rounded-xl border border-gray-100 shadow-2xs">
                            <Icon :icon="getAccessibilityIcon(option)" class="text-base text-primary" />
                            <span>{{ option }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { extractGmapsEmbedUrl, getDirectGmapsUrl } from '~/utils/maps'

const { t } = useI18n()

const props = defineProps({
    venue: String,
    address: String,
    gmapsEmbed: String,
    gmapsLink: String,
    accessibility: {
        type: Array,
        default: () => []
    }
})

const isLocationEmpty = computed(() => {
    return !props.venue?.trim() && !props.address?.trim() && !props.gmapsEmbed && !props.gmapsLink
})

// Google Maps embed URL
const gmapsEmbedUrl = computed(() => {
    if (props.gmapsEmbed) return props.gmapsEmbed
    return extractGmapsEmbedUrl(props.gmapsLink, [props.venue, props.address].filter(Boolean).join(', '))
})

const directGmapsUrl = computed(() => {
    return getDirectGmapsUrl(props.gmapsLink, props.venue, props.address)
})

const getAccessibilityIcon = (option) => {
    const icons = {
        'Terjangkau Mobil/Motor': 'ph:car-bold',
        'Akses Transportasi Umum': 'ph:train-bold',
        'Parkir Luas': 'ph:park-bold',
        'Fasilitas Toilet': 'ph:toilet-bold',
        'Area Makan': 'ph:fork-knife-bold',
        'Tempat Duduk': 'ph:armchair-bold',
        'Akses Disabilitas': 'ph:wheelchair-bold',
        'Area Parkir Motor': 'ph:motorcycle-bold',
        'Area Parkir Mobil': 'ph:car-bold'
    }
    return icons[option] || 'ph:check-circle-bold'
}
</script>
