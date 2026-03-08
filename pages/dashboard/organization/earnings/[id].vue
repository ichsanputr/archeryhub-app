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
                    <button @click="router.back()"
                        class="size-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <Icon icon="ph:arrow-left-bold" />
                    </button>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-black tracking-tight">{{ eventName || 'Detail Penghasilan'
                            }}</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Daftar transaksi pendaftaran
                            peserta</p>
                    </div>
                </div>
                <div class="flex gap-4 items-center">
                    <div class="text-right hidden sm:block">
                        <p class="text-[10px] font-black text-primary uppercase tracking-widest">Total Terkumpul</p>
                        <p class="text-xl font-black">Rp {{ totalEarnings.toLocaleString('id-ID') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transactions Table -->
        <div class="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 class="font-black text-navy uppercase tracking-widest text-sm">Log Transaksi Berhasil</h3>
                <div
                    class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {{ payments.length }} Transaksi
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr
                            class="bg-gray-50/50 text-gray-500 font-bold text-[10px] uppercase tracking-widest border-b border-gray-100">
                            <th class="px-6 py-4">Referensi</th>
                            <th class="px-6 py-4">Archer / Pemanah</th>
                            <th class="px-6 py-4">Metode</th>
                            <th class="px-6 py-4">Waktu Bayar</th>
                            <th class="px-6 py-4 text-right">Nominal</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="payment in payments" :key="payment.reference"
                            class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4">
                                <span class="font-mono text-[10px] font-bold text-gray-400">#{{ payment.reference
                                    }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="font-bold text-navy">{{ payment.athlete_name || 'Anonymous' }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="px-2 py-0.5 bg-gray-100 text-[10px] font-black text-gray-500 rounded uppercase">{{
                                    payment.payment_method || 'N/A' }}</span>
                            </td>
                            <td class="px-6 py-4 text-xs text-gray-500 font-medium">
                                {{ formatDate(payment.paid_at || payment.created_at) }}
                            </td>
                            <td class="px-6 py-4 text-right font-black text-navy">
                                Rp {{ payment.amount.toLocaleString('id-ID') }}
                            </td>
                        </tr>
                        <tr v-if="!payments.length && !loading">
                            <td colspan="5" class="px-6 py-12 text-center">
                                <Icon icon="ph:money-slash" class="text-4xl text-gray-200 mx-auto mb-2" />
                                <p class="text-gray-400 text-sm font-bold">Belum ada transaksi berhasil untuk event ini
                                </p>
                            </td>
                        </tr>
                        <tr v-if="loading">
                            <td colspan="5" class="px-6 py-12 text-center text-gray-400">Loading...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()
const api = useApi()

definePageMeta({
    layout: 'dashboard'
})

const eventId = computed(() => route.params.id)
const payments = ref([])
const eventName = ref('')
const loading = ref(true)

const totalEarnings = computed(() => {
    return payments.value.reduce((acc, curr) => acc + curr.amount, 0)
})

const fetchPayments = async () => {
    try {
        loading.value = true
        const res = await api.get(`/events/${eventId.value}/payments`)
        payments.value = res?.data || res || []

        // Fetch event name if possible
        const eventRes = await api.get(`/events/${eventId.value}`)
        eventName.value = eventRes?.data?.name || eventRes?.name || ''
    } catch (error) {
        console.error('Failed to fetch payments:', error)
    } finally {
        loading.value = false
    }
}

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(() => {
    fetchPayments()
})

useHead({
    title: computed(() => `${eventName.value || 'Detail Penghasilan'} - ArcheryHub`)
})
</script>
