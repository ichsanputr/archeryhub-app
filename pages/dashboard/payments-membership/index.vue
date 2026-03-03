<template>
    <div class="flex flex-col gap-6">

        <!-- ── Page Header ──────────────────────────────────────────────── -->
        <div class="relative overflow-hidden rounded-3xl bg-navy text-white">
            <div class="absolute inset-0"
                style="background-image:var(--motif-pattern);opacity:var(--motif-opacity,0.15)"></div>
            <div class="absolute -top-16 -right-16 size-56 rounded-full bg-primary/10 blur-3xl pointer-events-none">
            </div>
            <div class="absolute -bottom-10 -left-10 size-40 rounded-full bg-primary/5 blur-3xl pointer-events-none">
            </div>
            <div class="relative px-6 py-8 sm:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <div
                        class="size-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
                        <Icon icon="ph:money-bold" class="text-primary text-2xl" />
                    </div>
                    <div>
                        <div
                            class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1">
                            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                            <Icon icon="ph:caret-right-bold" class="opacity-50" />
                            <NuxtLink to="/dashboard/membership"
                                class="hover:text-primary transition-colors text-white/80">Membership</NuxtLink>
                            <Icon icon="ph:caret-right-bold" class="opacity-50" />
                            <span class="text-white">Pembayaran</span>
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-black leading-tight">Riwayat Pembayaran</h1>
                        <p class="text-white/60 text-sm mt-1">Pantau dan kelola rekaman pembayaran membership anggota
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <NuxtLink to="/dashboard/payments-membership/create"
                        class="flex items-center gap-2.5 h-11 px-7 rounded-2xl bg-primary text-primary-text font-black text-sm shadow-lg shadow-primary/30 hover:opacity-90 transition-all shrink-0">
                        <Icon icon="ph:plus-bold" />
                        Catat Pembayaran
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- ── Stats ────────────────────────────────────────────────────── -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="stat in statCards" :key="stat.label"
                class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors shrink-0">
                    <Icon :icon="stat.icon" class="text-xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold tracking-wider mb-1">{{ stat.label }}</p>
                    <p class="text-lg font-bold text-navy">{{ stat.value }}</p>
                </div>
            </div>
        </div>

        <!-- ── Content ──────────────────────────────────────────────────── -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <!-- Toolbar -->
            <div class="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
                <div class="relative flex-1 min-w-[300px]">
                    <Icon icon="ph:magnifying-glass-bold"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input v-model="search" type="text" placeholder="Cari nama anggota atau catatan..."
                        class="w-full pl-11 pr-4 h-11 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div class="flex gap-2">
                    <BaseButton variant="white" icon="ph:download-simple-bold" @click="exportPayments">Export CSV
                    </BaseButton>
                </div>
            </div>

            <!-- Table -->
            <div class="flex-1 overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50">
                            <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Anggota
                            </th>
                            <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Paket /
                                Langganan</th>
                            <th
                                class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                                Metode</th>
                            <th
                                class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                                Nominal</th>
                            <th
                                class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                                Tanggal</th>
                            <th
                                class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                                Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-if="isLoading" v-for="i in 5" :key="i" class="animate-pulse">
                            <td colspan="6" class="px-6 py-4">
                                <div class="h-4 bg-gray-100 rounded w-full"></div>
                            </td>
                        </tr>
                        <tr v-else-if="!filteredPayments.length">
                            <td colspan="6" class="px-6 py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <Icon icon="ph:money-slash-bold" class="text-4xl text-gray-200" />
                                    <p class="text-sm font-medium text-gray-400">Belum ada data pembayaran</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-else v-for="payment in filteredPayments" :key="payment.uuid"
                            class="hover:bg-gray-50/50 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="size-9 rounded-full bg-navy/5 flex items-center justify-center shrink-0 overflow-hidden">
                                        <img :src="useImageOrDefault(payment.avatar_url, payment.archer_name)"
                                            class="size-full object-cover" />
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-sm font-bold text-navy truncate">{{ payment.archer_name }}</p>
                                        <p class="text-[10px] text-gray-400 truncate">{{ payment.archer_email }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <p class="text-sm font-bold text-navy">{{ payment.package_name || 'Membership' }}</p>
                                <p class="text-[10px] text-gray-400 font-medium tracking-tight">ID: {{
                                    payment.invoice_id }}</p>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span
                                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border"
                                    :class="getMethodClass(payment.payment_method)">
                                    {{ payment.payment_method }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <p class="text-sm font-black text-navy">Rp {{ formatPrice(payment.amount) }}</p>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <p class="text-sm font-bold text-navy">{{ formatDate(payment.paid_at) }}</p>
                                <p class="text-[10px] text-gray-400 font-medium">{{ formatTime(payment.paid_at) }}</p>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button v-if="payment.proof_url" @click="viewProof(payment.proof_url)"
                                        class="size-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"
                                        title="Lihat Bukti Transfer">
                                        <Icon icon="ph:image-bold" />
                                    </button>
                                    <NuxtLink :to="`/dashboard/payments-membership/${payment.invoice_id}`"
                                        class="size-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-navy hover:bg-gray-50 transition-all">
                                        <Icon icon="ph:eye-bold" />
                                    </NuxtLink>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ──────── MODALS ──────── -->
        <Teleport to="body">
            <ClientOnly>




                <!-- Proof View Modal -->
                <BaseModal v-model="showProofModal" title="Bukti Pembayaran" max-width="max-w-xl">
                    <div class="p-2">
                        <img :src="currentProofUrl" class="w-full rounded-2xl shadow-xl" />
                    </div>
                </BaseModal>

                <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
            </ClientOnly>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { formatPrice, formatCurrency, formatDate, formatTime } from '~/utils/formatter'
import { useToast } from '~/composables/useToast'
import MediaLibrary from '~/components/common/MediaLibrary.vue'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Riwayat Pembayaran - ArcheryHub'
})

const { get, post } = useApi()
const toast = useToast()
const search = ref('')
const isLoading = ref(true)
const payments = ref([])
const statsData = ref({ total_revenue: 0, count_today: 0, count_month: 0 })

const showMediaLibrary = ref(false)
const handleMediaSelect = (media) => {
    // Used by proof viewer if editing is added later, 
    // but for now create.vue handles its own media selection
}



const fetchPayments = async () => {
    isLoading.value = true
    try {
        const [resPayments, resStats] = await Promise.all([
            get('/clubs/membership/payments'),
            get('/clubs/membership/stats')
        ])

        payments.value = resPayments.data || []

        // Use real backend stats where available, fallback to manual for today's count
        const now = new Date()
        const today = now.toISOString().split('T')[0]
        const todayCount = payments.value.filter(p => p.paid_at.startsWith(today)).length

        statsData.value = {
            total_revenue: resStats.data?.revenue_month || 0,
            count_today: todayCount,
            count_month: payments.value.length // This month's transactions in this context
        }

    } catch (err) {
        console.error('Failed to fetch payments:', err)
    } finally {
        isLoading.value = false
    }
}



const statCards = computed(() => [
    { label: 'Pemasukan Bulan Ini', value: formatCurrency(statsData.value.total_revenue), icon: 'ph:bank-bold' },
    { label: 'Transaksi Hari Ini', value: statsData.value.count_today || 0, icon: 'ph:clock-bold' },
    { label: 'Total Transaksi', value: payments.value.length || 0, icon: 'ph:receipt-bold' },
])

const filteredPayments = computed(() => {
    if (!search.value) return payments.value
    const s = search.value.toLowerCase()
    return payments.value.filter(p =>
        p.archer_name.toLowerCase().includes(s) ||
        (p.payment_note && p.payment_note.toLowerCase().includes(s))
    )
})

const getMethodClass = (m) => {
    if (m === 'cash') return 'bg-gray-100 text-gray-700 border-gray-200'
    if (m === 'transfer') return 'bg-primary/5 text-primary border-primary/20'
    return 'bg-gray-50 text-gray-400 border-gray-100'
}



// No longer needed: showAddModal, openAddModal, payForm, savePayment moved to separate create page.

// Detail modal removed in favor of separate page [id].vue

const showProofModal = ref(false)
const currentProofUrl = ref('')
const viewProof = (url) => {
    currentProofUrl.value = url
    showProofModal.value = true
}

const exportPayments = () => {
    // Basic CSV export logic
    const headers = ['Nama', 'Email', 'Paket', 'Nominal', 'Metode', 'Tanggal', 'Catatan']
    const rows = filteredPayments.value.map(p => [
        p.archer_name,
        p.archer_email,
        p.package_name || 'Membership',
        p.amount,
        p.payment_method,
        p.paid_at,
        p.payment_note || ''
    ])

    let csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `membership_payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

onMounted(() => {
    fetchPayments()
})
</script>
