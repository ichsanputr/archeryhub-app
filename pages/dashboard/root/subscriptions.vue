<template>
    <div class="flex flex-col gap-8">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="space-y-4">
                    <div
                        class="flex items-center gap-2 text-[10px] sm:text-xs font-black tracking-widest text-primary/80">
                        <span class="text-white">Root Terminal</span>
                        <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
                        <span class="text-primary">Subscription</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                            <Icon icon="ph:credit-card-bold" class="text-primary text-2xl sm:text-3xl" />
                        </div>
                        <div>
                            <h1 class="text-xl sm:text-3xl font-black tracking-tight">Manajemen Subscription</h1>
                            <div class="text-slate-300 text-[10px] sm:text-sm font-medium mt-1">
                                Kelola paket langganan club & organisasi
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="stat in subStats" :key="stat.label"
                class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg group-hover:bg-primary group-hover:text-navy-dark transition-colors"
                    :class="stat.color">
                    <Icon :icon="stat.icon" class="text-xl" />
                </div>
                <div>
                    <div class="text-xs text-gray-400 font-bold tracking-wider">{{ stat.label }}</div>
                    <div class="text-lg font-bold text-navy">{{ stat.value }}</div>
                </div>
            </div>
        </div>


        <!-- Filters -->
        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Pencarian</label>
                <div class="relative">
                    <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="subSearch" type="text" placeholder="Cari nama atau email..."
                        class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all" />
                </div>
            </div>
            <div class="w-full md:w-44">
                <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Tipe</label>
                <select v-model="subTypeFilter"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                    <option value="">Semua Tipe</option>
                    <option value="club">Club</option>
                    <option value="organization">Organisasi</option>
                </select>
            </div>
            <div class="w-full md:w-44">
                <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Status</label>
                <select v-model="subStatusFilter"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                    <option value="">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="trial">Trial</option>
                    <option value="expired">Expired</option>
                    <option value="canceled">Canceled</option>
                </select>
            </div>
            <button @click="subSearch = ''; subTypeFilter = ''; subStatusFilter = ''"
                class="h-11 px-6 font-semibold text-sm text-navy bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shrink-0">
                Reset
            </button>
        </div>

        <!-- Subscription Table -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest ">
                                Akun</th>
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest text-center">
                                Tipe</th>
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest ">
                                Paket</th>
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest text-center">
                                Status</th>
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest ">
                                Expires</th>
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest text-right">
                                Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="sub in paginatedSubs" :key="sub.uuid"
                            class="hover:bg-primary/5 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="h-10 w-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                        <img :src="useImageOrDefault(sub.avatar_url, sub.name)"
                                            class="w-full h-full object-cover">
                                    </div>
                                    <div>
                                        <div
                                            class="font-bold text-navy group-hover:text-primary transition-colors line-clamp-1 truncate max-w-[180px]">
                                            {{ sub.name || '—' }}
                                        </div>
                                        <div class="text-xs text-gray-400 mt-0.5 line-clamp-1 truncate max-w-[180px]">
                                            {{ sub.email || '—' }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span
                                    class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize tracking-widest border"
                                    :class="sub.user_type === 'club'
                                        ? 'bg-primary/10 text-navy border-primary/20'
                                        : 'bg-purple-50 text-purple-600 border-purple-100'">
                                    {{ sub.user_type === 'organization' ? 'Organisasi' : 'Club' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-700 font-medium">{{ sub.plan_name || '—' }}</td>
                            <td class="px-6 py-4 text-center">
                                <span class="px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest border"
                                    :class="getStatusBadgeClass(sub.subscription_status)">
                                    {{ sub.subscription_status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm"
                                :class="isExpiredSoon(sub.expires_at) ? 'text-red-500 font-bold' : 'text-gray-500'">
                                {{ sub.expires_at ? formatDate(sub.expires_at) : '—' }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="openEdit(sub)"
                                        class="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-xl transition-all"
                                        title="Edit subscription">
                                        <Icon icon="ph:pencil-simple-bold" class="text-xl" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!filteredSubs.length">
                            <td colspan="6" class="px-6 py-24 text-center">
                                <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                    <div
                                        class="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 border border-gray-100">
                                        <Icon icon="ph:credit-card-bold" class="text-3xl" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-gray-400">Tidak ada data subscription</div>
                                        <div class="text-xs text-gray-300 mt-1">Coba ubah filter atau kata kunci
                                            pencarian</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="filteredSubs.length > 0"
                class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-xs font-bold text-gray-400 tracking-widest">
                    Menampilkan <span class="text-navy">{{ subStartIndex + 1 }} - {{ Math.min(subEndIndex,
                        filteredSubs.length) }}</span>
                    dari <span class="text-navy">{{ filteredSubs.length }}</span> Langganan
                </div>
                <div class="flex items-center gap-2">
                    <button @click="currentPage--" :disabled="currentPage === 1"
                        class="size-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm">
                        <Icon icon="ph:caret-left-bold" />
                    </button>
                    <div class="flex items-center gap-1 px-3">
                        <span class="text-xs font-black text-navy">{{ currentPage }}</span>
                        <span class="text-[10px] font-bold text-gray-300">/</span>
                        <span class="text-[10px] font-bold text-gray-400">{{ totalPages }}</span>
                    </div>
                    <button @click="currentPage++" :disabled="currentPage === totalPages"
                        class="size-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm">
                        <Icon icon="ph:caret-right-bold" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="showEditModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            @click.self="showEditModal = false">
            <div
                class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 animate-in zoom-in-95 duration-200">
                <div class="flex items-center gap-4">
                    <div
                        class="size-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <Icon icon="ph:pencil-simple-line-bold" class="text-navy text-2xl" />
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-navy tracking-tight">Edit Subscription</h3>
                        <div class="text-[10px] font-bold text-gray-400 mt-0.5">{{ selectedSub?.name }}</div>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-black text-gray-500 tracking-widest ml-1">Status
                            Langganan</label>
                        <select v-model="editStatus"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-4 focus:ring-primary/10 transition-all">
                            <option value="active">Active</option>
                            <option value="trial">Trial</option>
                            <option value="expired">Expired</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[10px] font-black text-gray-500 tracking-widest ml-1">Pilih
                            Paket</label>
                        <select v-model.number="editPlanId"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-4 focus:ring-primary/10 transition-all">
                            <option v-for="p in availablePlansForEdit" :key="p.id" :value="p.id">
                                {{ p.name }} ({{ formatCurrency(p.price) }})
                            </option>
                        </select>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-gray-500 tracking-widest ml-1">Tgl
                                Kadaluarsa</label>
                            <input v-model="editExpiresAt" type="date"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-gray-500 tracking-widest ml-1">Perpanjang
                                (Hari)</label>
                            <input v-model.number="editExtendDays" type="number" min="0" placeholder="+0"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                        </div>
                    </div>
                </div>

                <div class="flex gap-3">
                    <button @click="showEditModal = false"
                        class="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-black text-gray-500 hover:bg-gray-50 transition-all tracking-widest">
                        Batal
                    </button>
                    <button @click="submitEdit" :disabled="editLoading"
                        class="flex-1 py-3 bg-navy text-primary rounded-xl text-xs font-black hover:bg-navy/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 tracking-widest shadow-lg shadow-navy/20">
                        <Icon v-if="editLoading" icon="ph:spinner-bold" class="animate-spin" />
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, watch } from 'vue'

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const route = useRoute()

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })
useHead({ title: 'Manajemen Subscription — Root Terminal' })

// ── Data ───────────────────────────────────────────────────────────────
const subSearch = ref('')
const subTypeFilter = ref('')
const subStatusFilter = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 8

// Reset to page 1 when filters change
watch([subSearch, subTypeFilter, subStatusFilter], () => {
    currentPage.value = 1
})

// Fetch Subscriptions with unique key to prevent caching issues
const { data: subData, refresh: refreshSubs, pending: subsPending } = await useFetch(
    `${apiBaseUrl}/root/dashboard/subscriptions`,
    {
        key: 'root-subscriptions',
        credentials: 'include',
        onResponseError({ response }) {
            console.error('Subscription Fetch Error:', response._data)
        }
    }
)

// Fetch Plans with unique key (Backend now handles grouping to return 4 plans)
const { data: plansData, refresh: refreshPlans } = await useFetch(
    `${apiBaseUrl}/root/dashboard/plans`,
    {
        key: 'root-subscription-plans',
        credentials: 'include'
    }
)

// Manual refresh on mount just in case SSR failed to populate or cache is stale
onMounted(() => {
    refreshSubs()
    refreshPlans()
})

const subs = computed(() => {
    const list = subData.value?.subscriptions || []
    // Client-side sort: Newer records first
    return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})
const plans = computed(() => plansData.value?.plans || [])

const filteredSubs = computed(() => {
    const q = subSearch.value.toLowerCase()
    return subs.value.filter(s => {
        const mQ = !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
        const mT = !subTypeFilter.value || s.user_type === subTypeFilter.value
        const mS = !subStatusFilter.value || s.subscription_status === subStatusFilter.value
        return mQ && mT && mS
    })
})

// Pagination Calculation
const totalPages = computed(() => Math.ceil(filteredSubs.value.length / itemsPerPage) || 1)
const subStartIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const subEndIndex = computed(() => subStartIndex.value + itemsPerPage)
const paginatedSubs = computed(() => filteredSubs.value.slice(subStartIndex.value, subEndIndex.value))

const subStats = computed(() => {
    const all = subs.value
    return [
        { label: 'Total', value: all.length, icon: 'ph:credit-card-bold', color: 'text-primary' },
        { label: 'Aktif', value: all.filter(s => s.subscription_status === 'active').length, icon: 'ph:seal-check-bold', color: 'text-green-500' },
        { label: 'Trial', value: all.filter(s => s.subscription_status === 'trial').length, icon: 'ph:clock-countdown-bold', color: 'text-yellow-500' },
        { label: 'Expired', value: all.filter(s => s.subscription_status === 'expired').length, icon: 'ph:warning-circle-bold', color: 'text-red-500' },
    ]
})

// ── Edit ───────────────────────────────────────────────────────────────
const showEditModal = ref(false)
const selectedSub = ref(null)
const editStatus = ref('')
const editPlanId = ref(null)
const editExpiresAt = ref('')
const editExtendDays = ref(0)
const editLoading = ref(false)

const availablePlansForEdit = computed(() => {
    if (!selectedSub.value) return []
    // Only show plans that match the user type (club/organization)
    return plans.value.filter(p => p.user_type === selectedSub.value.user_type)
})

const openEdit = (sub) => {
    selectedSub.value = sub
    editStatus.value = sub.subscription_status
    editPlanId.value = sub.plan_id
    editExpiresAt.value = sub.expires_at ? sub.expires_at.slice(0, 10) : ''
    editExtendDays.value = 0
    showEditModal.value = true
}

const submitEdit = async () => {
    editLoading.value = true
    try {
        const body = {}
        if (editStatus.value) body.status = editStatus.value
        if (editPlanId.value) body.plan_id = editPlanId.value
        if (editExpiresAt.value) body.expires_at = editExpiresAt.value
        if (editExtendDays.value > 0) body.extend_days = editExtendDays.value

        await $fetch(
            `${apiBaseUrl}/root/dashboard/subscriptions/${selectedSub.value.user_type}/${selectedSub.value.uuid}`,
            { method: 'PUT', body, credentials: 'include' }
        )
        showEditModal.value = false
        await refreshSubs()
    } catch (err) {
        alert(err.data?.error || 'Gagal update subscription')
    } finally {
        editLoading.value = false
    }
}

// ── Helpers ────────────────────────────────────────────────────────────
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'active': return 'bg-green-50 text-green-600 border-green-100'
        case 'trial': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'expired': return 'bg-red-50 text-red-500 border-red-100'
        case 'canceled': return 'bg-gray-50 text-gray-400 border-gray-200'
        default: return 'bg-gray-50 text-gray-400 border-gray-200'
    }
}

const isExpiredSoon = (exp) => {
    if (!exp) return false
    const d = new Date(exp)
    if (isNaN(d.getTime())) return false
    return (d - new Date()) < 7 * 86400000
}

const formatDate = (d) => {
    if (!d || d.startsWith('1970')) return '—'
    try {
        return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d))
    } catch (e) {
        return '—'
    }
}

const formatCurrency = (v) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
</script>
