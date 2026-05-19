<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:users" class="text-white text-2xl" />
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <NuxtLink :to="`/dashboard/organization/events/${eventId}/categories`"
                                    class="text-xs font-bold text-primary hover:underline tracking-widest flex items-center gap-1">
                                    <Icon icon="ph:arrow-left-bold" />
                                    Kembali ke Kategori
                                </NuxtLink>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                {{ categoryName || 'Detail Kategori' }}
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                Daftar peserta yang terdaftar khusus dalam kategori ini.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Participants List -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
                class="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 class="text-lg font-bold text-navy">Peserta Terdaftar</h2>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-gray-400">TOTAL:</span>
                    <span class="px-3 py-1 bg-navy/5 text-navy rounded-lg font-black text-xs border border-navy/10">
                        {{ participants.length }} Peserta
                    </span>
                </div>
            </div>

            <div v-if="isLoading" class="p-12 space-y-4">
                <div v-for="i in 5" :key="i" class="h-16 bg-gray-50 animate-pulse rounded-xl"></div>
            </div>

            <div v-else-if="participants.length === 0" class="p-20 text-center">
                <Icon icon="ph:user-circle-minus" class="text-6xl text-gray-200 mx-auto mb-4" />
                <h3 class="text-xl font-bold text-navy mb-1">Belum Ada Peserta</h3>
                <p class="text-gray-400 text-sm">Belum ada peserta yang terdaftar di kategori ini.</p>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50/50 border-b border-gray-100">
                        <tr class="text-[10px] font-black text-gray-400 tracking-widest">
                            <th class="px-6 py-4 w-16">No</th>
                            <th class="px-6 py-4">Nama Pemanah</th>
                            <th class="px-6 py-4">Klub / Kota</th>
                            <th class="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="(p, index) in participants" :key="p.id"
                            class="group hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 text-sm font-bold text-gray-400">{{ index + 1 }}</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-xs border border-gray-200 overflow-hidden shrink-0">
                                        <img :src="useImageOrDefault(p.avatar_url, p.full_name)"
                                            class="w-full h-full object-cover">
                                    </div>
                                    <div class="min-w-0">
                                        <div class="text-sm font-black text-navy leading-tight">{{ p.full_name }}</div>
                                        <div class=" text-xs text-gray-400 font-medium mt-1 ">{{ p.athlete_code ||
                                            '-' }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-bold text-navy leading-tight">{{ p.club_name || 'Independen' }}
                                </div>
                                <div class=" text-xs text-gray-400 mt-0.5">{{ p.city || '-' }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    :class="p.payment_status === 'Terbayar' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                                    class="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-tighter">
                                    {{ p.payment_status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'

const route = useRoute()
const eventId = route.params.id
const categoryId = route.params.categoryId
const { get } = useApi()

definePageMeta({
    layout: 'dashboard'
})

const isLoading = ref(true)
const categoryName = ref('')
const participants = ref([])

const fetchData = async () => {
    isLoading.value = true
    try {
        // Fetch category info
        const catRes = await get(`/events/${eventId}/categories/${categoryId}`)
        const cat = catRes?.category
        if (cat) {
            categoryName.value = `${cat.division_name} - ${cat.category_name} - ${cat.event_type_name}`
        }

        // Fetch participants for this category
        const partRes = await get(`/events/${eventId}/participants`, {
            params: {
                category_id: categoryId,
                limit: 1000
            }
        })
        participants.value = partRes?.participants || []
    } catch (error) {
        console.error('Failed to fetch data:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchData)
</script>