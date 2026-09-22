<template>
    <div class="space-y-4 font-body text-navy antialiased">
        <h2 class="text-base sm:text-lg font-extrabold text-navy">{{ t('subscription.billing.title') }}</h2>
        
        <DashboardDataTable
            :items="invoices || []"
            :columns="tableColumns"
            :searchable="false"
            count-icon="ph:receipt-bold"
            :count-unit="t('subscription.billing.invoice_label')"
            :empty-title="t('subscription.billing.empty')"
            empty-icon="ph:receipt-bold"
        >
            <!-- Toolbar Actions: Download Report -->
            <template #toolbar-actions>
                <button
                    v-if="invoices?.length"
                    type="button"
                    @click="handleDownload"
                    class="h-10 px-4 text-xs font-bold text-navy bg-white border border-slate-200 rounded-xl hover:border-navy hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                    <Icon icon="ph:download-simple-bold" class="text-base text-primary" />
                    <span>{{ t('subscription.billing.download_report') }}</span>
                </button>
            </template>

            <!-- Date Column Slot -->
            <template #item-date="{ item }">
                <span class="text-xs font-bold text-slate-500 whitespace-nowrap">{{ item.date }}</span>
            </template>

            <!-- Description Column Slot -->
            <template #item-description="{ item }">
                <span class="text-xs sm:text-sm font-bold text-navy">{{ item.description }}</span>
            </template>

            <!-- Amount Column Slot -->
            <template #item-amount="{ item }">
                <span class="text-xs sm:text-sm font-black text-navy tabular-nums">{{ item.amount }}</span>
            </template>

            <!-- Status Column Slot -->
            <template #item-status="{ item }">
                <div class="flex justify-center">
                    <span
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider border"
                        :class="{
                            'bg-emerald-50 text-emerald-700 border-emerald-200': item.status === 'paid',
                            'bg-amber-50 text-amber-700 border-amber-200': item.status === 'pending',
                            'bg-rose-50 text-rose-700 border-rose-200': ['expired', 'failed'].includes(item.status)
                        }"
                    >
                        {{ getStatusLabel(item.status) }}
                    </span>
                </div>
            </template>

            <!-- Actions Column Slot -->
            <template #actions="{ item }">
                <div class="flex items-center justify-end gap-1.5">
                    <a
                        v-if="item.status === 'pending' && item.checkout_url"
                        :href="item.checkout_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="px-3 py-1.5 bg-primary text-navy text-xs font-black rounded-xl hover:bg-primary/90 transition-all shadow-2xs cursor-pointer"
                    >
                        {{ t('subscription.billing.pay_now') }}
                    </a>
                    <template v-else-if="item.status === 'paid'">
                        <a
                            :href="`${apiBaseUrl}/payment/invoice/${item.reference}`"
                            target="_blank"
                            title="View Invoice"
                            class="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-navy hover:bg-slate-100 transition-all cursor-pointer"
                        >
                            <Icon icon="ph:file-pdf-bold" class="text-base" />
                        </a>
                        <a
                            :href="`${apiBaseUrl}/payment/invoice/${item.reference}?download=true`"
                            download
                            title="Download Invoice"
                            class="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-navy hover:bg-slate-100 transition-all cursor-pointer"
                        >
                            <Icon icon="ph:download-simple-bold" class="text-base" />
                        </a>
                    </template>
                </div>
            </template>
        </DashboardDataTable>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { useApiBaseUrl } from '~/composables/useApiBaseUrl'
import { useToast } from '~/composables/useToast'
import useDashboardI18n from '~/composables/useDashboardI18n'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

const { t } = useDashboardI18n()

const apiBaseUrl = useApiBaseUrl()
const api = useApi()
const toast = useToast()

defineProps({
    invoices: Array
})

const tableColumns = computed(() => [
    { key: 'date', label: t('subscription.billing.date'), sortable: false, class: 'min-w-[130px]' },
    { key: 'description', label: t('subscription.billing.description'), sortable: false, class: 'min-w-[200px]' },
    { key: 'amount', label: t('subscription.billing.amount'), sortable: false, class: 'min-w-[130px]' },
    { key: 'status', label: t('subscription.billing.status'), sortable: false, align: 'center', class: 'min-w-[120px]' },
    { key: 'actions', label: t('subscription.billing.actions'), sortable: false, align: 'right', class: 'min-w-[120px]' }
])

const handleDownload = async () => {
    try {
        const response = await $fetch(`${apiBaseUrl}/user/subscription/export`, {
            headers: {
                ...api.createFetchOptions().headers
            },
            credentials: 'include',
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `billing-history-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    } catch (err) {
        console.error('Failed to download report:', err)
        toast.error(t('subscription.billing.download_failed'))
    }
}

const getStatusLabel = (status) => {
    const labels = {
        paid: t('subscription.billing.status_paid'),
        pending: t('subscription.billing.status_pending'),
        expired: t('subscription.billing.status_expired'),
        failed: t('subscription.billing.status_failed')
    }
    return labels[status] || status
}
</script>
