<template>
    <div class="space-y-5">
        <h2 class="text-lg font-extrabold text-navy">Riwayat Tagihan</h2>
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice</span>
                <button v-if="invoices?.length" @click="handleDownload"
                    class="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-navy bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all group">
                    <Icon icon="ph:download-simple-bold" class="text-lg group-hover:text-primary transition-colors" />
                    <span>Download Report</span>
                </button>
            </div>

            <div v-if="invoices?.length" class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead
                        class="bg-gray-50/50 text-gray-400 font-black text-[10px] uppercase tracking-widest border-b border-gray-100">
                        <tr>
                            <th class="px-8 py-4">Tanggal</th>
                            <th class="px-8 py-4">Deskripsi</th>
                            <th class="px-8 py-4">Jumlah</th>
                            <th class="px-8 py-4">Status</th>
                            <th class="px-8 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="(invoice, index) in invoices" :key="index"
                            class="hover:bg-slate-50 transition-colors group">
                            <td class="px-8 py-4 text-xs font-bold text-gray-500">{{ invoice.date }}</td>
                            <td class="px-8 py-4 text-sm font-black text-navy">{{ invoice.description }}</td>
                            <td class="px-8 py-4 text-sm font-black text-navy">{{ invoice.amount }}</td>
                            <td class="px-8 py-4">
                                <span class="px-2.5 py-1 rounded-full text-[9px] font-black capitalize tracking-wider"
                                    :class="{
                                        'bg-green-100 text-green-700': invoice.status === 'paid',
                                        'bg-orange-100 text-orange-700': invoice.status === 'pending',
                                        'bg-red-100 text-red-700': ['expired', 'failed'].includes(invoice.status)
                                    }">
                                    {{ getStatusLabel(invoice.status) }}
                                </span>
                            </td>
                            <td class="px-8 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <a v-if="invoice.status === 'pending' && invoice.checkout_url"
                                        :href="invoice.checkout_url"
                                        class="px-4 py-2 bg-primary text-btn-text text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all shadow-sm">
                                        Bayar Sekarang
                                    </a>
                                    <a v-else-if="invoice.status === 'paid'"
                                        :href="`${apiBaseUrl}/payment/invoice/${invoice.reference}`" target="_blank"
                                        class="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-navy hover:border-primary hover:shadow-md transition-all">
                                        <Icon icon="ph:file-pdf-bold" class="text-lg" />
                                    </a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="flex flex-col items-center justify-center p-16 text-center text-gray-300">
                <Icon icon="ph:receipt-bold" class="text-4xl mb-4 opacity-20" />
                <div class="text-xs font-black uppercase tracking-widest">Belum Ada Transaksi</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl
const api = useApi()

defineProps({
    invoices: Array
})

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
        alert('Gagal mengunduh laporan. Silakan coba lagi.')
    }
}

const getStatusLabel = (status) => {
    const labels = {
        paid: 'Lunas',
        pending: 'Pending',
        expired: 'Kedaluwarsa',
        failed: 'Gagal'
    }
    return labels[status] || status
}
</script>
