<template>
    <div class="space-y-8">
        <!-- Map Card -->
        <section class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div class="h-[400px] w-full bg-gray-50 relative group">
                <iframe v-if="gmapsEmbedUrl" :src="gmapsEmbedUrl" width="100%" height="100%" style="border:0;"
                    allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                </iframe>
                <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
                    <Icon icon="ph:map-pin" class="text-4xl text-gray-300" />
                </div>
            </div>
            <div class="p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between items-start">
                <div class="flex-grow space-y-4">
                    <h2 class="text-2xl font-bold text-navy">{{ venue }}</h2>
                    <div class="flex items-start gap-2 text-gray-600">
                        <span class="material-symbols-outlined text-primary shrink-0">location_on</span>
                        <p>{{ address }}</p>
                    </div>
                    <div class="flex flex-wrap gap-4 pt-2">
                        <div
                            class="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <span class="material-symbols-outlined text-sm">directions_car</span>
                            Terjangkau Mobil/Motor
                        </div>
                        <div
                            class="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <span class="material-symbols-outlined text-sm">train</span>
                            Dekat MRT/TransJakarta
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
const props = defineProps({
    venue: String,
    address: String,
    gmapsEmbed: String, // Optional direct embed URL
    gmapsLink: String   // Optional direct link
})

// Google Maps embed URL
const gmapsEmbedUrl = computed(() => {
    if (props.gmapsEmbed) return props.gmapsEmbed
    if (!props.gmapsLink) return null

    try {
        const link = props.gmapsLink
        if (link.includes('google.com/maps/embed')) return link

        const coordsMatch = link.match(/[?&]q=([^&]+)/)
        if (coordsMatch) {
            const query = decodeURIComponent(coordsMatch[1])
            return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
        }

        const searchQuery = props.venue || props.address || link
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    } catch (e) {
        const searchQuery = props.venue || props.address || props.gmapsLink
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    }
})

const facilities = [
    { name: 'Musholla', icon: 'mosque' },
    { name: 'Food Court', icon: 'restaurant' },
    { name: 'Toilet Bersih', icon: 'wc' },
    { name: 'Area Parkir', icon: 'local_parking' },
    { name: 'Pos Medis', icon: 'medical_services' },
    { name: 'WiFi Gratis', icon: 'wifi' },
    { name: 'Tribun Penonton', icon: 'chair' },
    { name: 'Charging Station', icon: 'battery_charging_full' }
]

import { computed } from 'vue'
import { Icon } from '@iconify/vue'
</script>
