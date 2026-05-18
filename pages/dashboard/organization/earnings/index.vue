<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:wallet-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">Penghasilan Saya</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Lacak semua pendapatan dari event
                            Anda</p>
                    </div>
                </div>
            </div>
        </div>


        <!-- Earnings Table -->
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 class="font-black text-navy tracking-widest text-sm">Riwayat Penghasilan Event</h3>
                <div class="flex gap-2">
                    <BaseButton variant="outline" size="xs" icon="ph:download-simple-bold">Export</BaseButton>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr
                            class="bg-gray-50/50 text-gray-500 font-bold text-[10px] tracking-widest border-b border-gray-100">
                            <th class="px-6 py-4">Event</th>
                            <th class="px-6 py-4">Tanggal Selesai</th>
                            <th class="px-6 py-4">Peserta</th>
                            <th class="px-6 py-4 text-right">Penghasilan Bersih</th>
                            <th class="px-6 py-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="item in earningsHistory" :key="item.id"
                            class="hover:bg-gray-50 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="font-bold text-navy group-hover:text-primary transition-colors">{{
                                    item.eventName
                                    }}</div>
                                <div class="text-[10px] text-gray-400 font-medium">{{ item.category }}</div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600 font-medium">
                                {{ formatItemDate(item.date) }}
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 bg-navy/5 text-navy text-[10px] font-black rounded-lg">{{
                                    item.participants
                                    }} Peserta</span>
                            </td>
                            <td class="px-6 py-4 text-right font-bold text-navy">
                                Rp {{ item.amount.toLocaleString('id-ID') }}
                            </td>
                            <td class="px-6 py-4 text-center">
                                <NuxtLink :to="`/dashboard/organization/earnings/${item.id}`">
                                    <button
                                        class="p-2 hover:bg-primary/10 rounded-lg text-gray-400 hover:text-primary transition-colors">
                                        <Icon icon="ph:eye-bold" class="text-lg" />
                                    </button>
                                </NuxtLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="loading" class="p-12 text-center text-gray-400">Loading earnings data...</div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { useRouter } from 'vue-router'
import { useDateFormat } from '@vueuse/core'

const api = useApi()
const router = useRouter()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Penghasilan Saya - Archeris'
})

const earningsHistoryData = ref([])
const loading = ref(true)

const fetchEarnings = async () => {
    try {
        loading.value = true
        // Get earnings summary for this org
        const res = await api.get('/organizations/earnings')
        earningsHistoryData.value = res?.data || res || []
    } catch (error) {
        console.error('Failed to fetch earnings:', error)
    } finally {
        loading.value = false
    }
}

const totalEarningsAmount = computed(() => {
    return earningsHistoryData.value.reduce((acc, curr) => acc + curr.amount, 0)
})

const earningsHistory = computed(() => earningsHistoryData.value)

const monthlyEarnings = computed(() => {
    // Basic logic: filter by current month
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return earningsHistoryData.value
        .filter(item => {
            const d = new Date(item.date)
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear
        })
        .reduce((acc, curr) => acc + curr.amount, 0)
})

const mostActiveEvent = computed(() => {
    if (!earningsHistoryData.value.length) return null
    return [...earningsHistoryData.value].sort((a, b) => b.participants - a.participants)[0]
})

const currentMonthLabel = computed(() => {
    return new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
})

const formatItemDate = (date) => {
    if (!date) return '-'
    return useDateFormat(date, 'DD MMM YYYY', { locales: 'id-ID' }).value
}

onMounted(() => {
    fetchEarnings()
})
</script>
