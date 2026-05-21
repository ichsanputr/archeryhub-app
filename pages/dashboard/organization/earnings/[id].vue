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
                        <Icon icon="ph:arrow-left-bold" class="text-white text-xl" />
                    </button>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">{{ eventName || t('earnings.detail_title') }}</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">{{ t('earnings.detail_subtitle') }}</p>
                    </div>
                </div>
                <div class="flex gap-3">
                    <div class="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 text-right">
                        <p class="text-[10px] font-black tracking-wider text-primary">{{ t('earnings.total_event') }}</p>
                        <p class="text-xl font-black tabular-nums">Rp {{ totalAmount.toLocaleString('id-ID') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter & Search -->
        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <BaseInput v-model="searchQuery" icon="ph:magnifying-glass"
                    :placeholder="t('earnings.search_placeholder')" :label="t('earnings.search_label')" />
            </div>
        </div>

        <!-- Payments Table -->
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr
                            class="bg-gray-50/50 text-gray-500 font-bold text-[10px] tracking-widest border-b border-gray-100">
                            <th class="px-6 py-4">{{ t('earnings.table_participant') }}</th>
                            <th class="px-6 py-4">{{ t('earnings.table_date') }}</th>
                            <th class="px-6 py-4">{{ t('earnings.table_method') }}</th>
                            <th class="px-6 py-4">{{ t('earnings.table_reference') }}</th>
                            <th class="px-6 py-4 text-right">{{ t('earnings.table_amount') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="payment in filteredPayments" :key="payment.id"
                            class="hover:bg-gray-50 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="font-bold text-navy leading-tight">{{ payment.archerName }}</div>
                                <div class="text-[10px] text-gray-400 font-medium mt-0.5">{{ payment.archerEmail }}
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600 font-medium">
                                {{ formatPaymentDate(payment.createdAt) }}
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded-lg ">
                                    {{ payment.method }}
                                </span>
                            </td>
                            <td class="px-6 py-4 font-mono text-xs text-gray-400">
                                {{ payment.reference }}
                            </td>
                            <td class="px-6 py-4 text-right font-black text-navy tabular-nums">
                                Rp {{ payment.amount.toLocaleString('id-ID') }}
                            </td>
                        </tr>
                        <tr v-if="!loading && filteredPayments.length === 0">
                            <td colspan="5" class="px-6 py-12 text-center">
                                <Icon icon="ph:mask-sad" class="text-4xl text-gray-200 mx-auto mb-2" />
                                <p class="text-gray-400">{{ t('earnings.no_data') }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="loading" class="p-12 text-center">
                <Icon icon="ph:circle-notch-bold" class="text-3xl text-primary animate-spin mx-auto" />
                <p class="text-gray-400 mt-2 text-sm font-medium">{{ t('earnings.loading') }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useDateFormat } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const api = useApi()
const { t } = useI18n()

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

useHead({
    title: 'Detail Penghasilan Event - ArcheryHub'
})

const eventId = route.params.id
const eventName = ref('')
const payments = ref([])
const loading = ref(true)
const searchQuery = ref('')

const fetchDetails = async () => {
    try {
        loading.value = true
        const res = await api.get(`/organizations/earnings/${eventId}`)
        eventName.value = res.eventName
        payments.value = res.payments || []
    } catch (error) {
        console.error('Failed to fetch details:', error)
    } finally {
        loading.value = false
    }
}

const totalAmount = computed(() => {
    return payments.value.reduce((acc, curr) => acc + curr.amount, 0)
})

const filteredPayments = computed(() => {
    if (!searchQuery.value) return payments.value
    const q = searchQuery.value.toLowerCase()
    return payments.value.filter(p =>
        p.archerName.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q)
    )
})

const formatPaymentDate = (date) => {
    return useDateFormat(date, 'DD MMM YYYY, HH:mm', { locales: 'id-ID' }).value
}

onMounted(() => {
    fetchDetails()
})
</script>
