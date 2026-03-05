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
                        class="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary/80">
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
                            <p class="text-slate-300 text-[10px] sm:text-sm font-medium mt-1">
                                Kelola paket langganan club & organisasi
                            </p>
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
                    <p class="text-xs text-gray-400 font-bold tracking-wider">{{ stat.label }}</p>
                    <p class="text-lg font-bold text-navy">{{ stat.value }}</p>
                </div>
            </div>
        </div>

        <!-- Plans Section -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <button @click="showPlans = !showPlans"
                class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors border-b border-gray-50">
                <div class="flex items-center gap-3">
                    <Icon icon="ph:package-bold" class="text-navy text-lg" />
                    <div class="text-left">
                        <p class="text-[11px] font-extrabold text-gray-400 tracking-widest">PAKET LANGGANAN</p>
                    </div>
                </div>
                <Icon :icon="showPlans ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" class="text-gray-400" />
            </button>
            <div v-if="showPlans" class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="plan in plans" :key="plan.id"
                    class="p-5 border border-gray-100 rounded-xl hover:border-primary/30 hover:shadow-sm transition-all">
                    <div class="flex items-start justify-between mb-3">
                        <span class="font-bold text-navy">{{ plan.name }}</span>
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-black border" :class="plan.is_active
                            ? 'bg-green-50 text-green-600 border-green-100'
                            : 'bg-gray-50 text-gray-400 border-gray-200'">
                            {{ plan.is_active ? 'Aktif' : 'Nonaktif' }}
                        </span>
                    </div>
                    <p class="text-2xl font-black text-navy mb-1">{{ formatCurrency(plan.price) }}</p>
                    <p class="text-xs text-gray-400 capitalize">{{ plan.billing_type }} · {{ plan.user_type || 'semua'
                        }}</p>
                </div>
                <div v-if="!plans.length" class="col-span-3 py-12 text-center">
                    <Icon icon="ph:package-bold" class="text-3xl text-gray-200 mb-2 mx-auto" />
                    <p class="text-sm font-bold text-gray-300">Tidak ada data paket</p>
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
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest">Akun</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest">Tipe</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest">Paket</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest">Status</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest">Expires</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest text-right">
                                Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="sub in filteredSubs" :key="sub.uuid"
                            class="hover:bg-primary/5 transition-colors group">
                            <td class="px-6 py-4">
                                <div>
                                    <p class="font-bold text-navy group-hover:text-primary transition-colors">{{
                                        sub.name || '—' }}</p>
                                    <p class="text-xs text-gray-400 mt-0.5">{{ sub.email || '—' }}</p>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize tracking-widest border"
                                    :class="sub.user_type === 'club'
                                        ? 'bg-primary/10 text-navy border-primary/20'
                                        : 'bg-purple-50 text-purple-600 border-purple-100'">
                                    {{ sub.user_type === 'organization' ? 'Organisasi' : 'Club' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-700 font-medium">{{ sub.plan_name || '—' }}</td>
                            <td class="px-6 py-4">
                                <span
                                    class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
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
                                    <button @click="openAddon(sub)"
                                        class="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Tambah hari">
                                        <Icon icon="ph:calendar-plus-bold" class="text-lg" />
                                    </button>
                                    <button @click="openEdit(sub)"
                                        class="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Edit subscription">
                                        <Icon icon="ph:pencil-bold" class="text-lg" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!filteredSubs.length">
                            <td colspan="6" class="px-6 py-24 text-center">
                                <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                    <div
                                        class="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                                        <Icon icon="ph:credit-card-bold" class="text-3xl" />
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-gray-400">Tidak ada data subscription</p>
                                        <p class="text-xs text-gray-300 mt-1">Coba ubah filter atau kata kunci pencarian
                                        </p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Addon Modal -->
        <div v-if="showAddonModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            @click.self="showAddonModal = false">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6">
                <div class="flex items-center gap-4">
                    <div class="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon icon="ph:calendar-plus-bold" class="text-navy text-xl" />
                    </div>
                    <div>
                        <h3 class="text-base font-black text-navy">Tambah Hari</h3>
                        <p class="text-xs text-gray-400 mt-0.5">{{ selectedSub?.name }}</p>
                    </div>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Jumlah Hari</label>
                        <input v-model.number="addonDays" type="number" min="1" max="365"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Catatan
                            (opsional)</label>
                        <input v-model="addonNote" type="text" placeholder="alasan penambahan..."
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                </div>
                <div class="flex gap-3">
                    <button @click="showAddonModal = false"
                        class="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                        Batal
                    </button>
                    <button @click="submitAddon" :disabled="addonLoading || !addonDays"
                        class="flex-1 py-3 bg-navy text-primary rounded-xl text-sm font-black hover:bg-navy/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        <Icon v-if="addonLoading" icon="ph:spinner-bold" class="animate-spin" />
                        Tambahkan
                    </button>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="showEditModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            @click.self="showEditModal = false">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6">
                <div class="flex items-center gap-4">
                    <div class="size-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                        <Icon icon="ph:pencil-bold" class="text-navy text-xl" />
                    </div>
                    <div>
                        <h3 class="text-base font-black text-navy">Edit Subscription</h3>
                        <p class="text-xs text-gray-400 mt-0.5">{{ selectedSub?.name }}</p>
                    </div>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Status</label>
                        <select v-model="editStatus"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20">
                            <option value="">Tidak diubah</option>
                            <option value="active">Active</option>
                            <option value="trial">Trial</option>
                            <option value="expired">Expired</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Upgrade Paket</label>
                        <select v-model.number="editPlanId"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20">
                            <option :value="null">Tidak diubah</option>
                            <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Set Tanggal
                            Expired</label>
                        <input v-model="editExpiresAt" type="date"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Perpanjang
                            (hari)</label>
                        <input v-model.number="editExtendDays" type="number" min="0"
                            placeholder="0 = tidak diperpanjang"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                </div>
                <div class="flex gap-3">
                    <button @click="showEditModal = false"
                        class="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                        Batal
                    </button>
                    <button @click="submitEdit" :disabled="editLoading"
                        class="flex-1 py-3 bg-navy text-primary rounded-xl text-sm font-black hover:bg-navy/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
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
import { ref, computed } from 'vue'

const config = useRuntimeConfig()

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })
useHead({ title: 'Manajemen Subscription — Root Terminal' })

// ── Data ───────────────────────────────────────────────────────────────
const subSearch = ref('')
const subTypeFilter = ref('')
const subStatusFilter = ref('')
const showPlans = ref(true)

const { data: subData, refresh: refreshSubs } = await useFetch(
    `${config.public.apiBaseUrl}/root/dashboard/subscriptions`,
    { credentials: 'include' }
)
const { data: plansData } = await useFetch(
    `${config.public.apiBaseUrl}/root/dashboard/plans`,
    { credentials: 'include' }
)

const subs = computed(() => subData.value?.subscriptions || [])
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

const subStats = computed(() => {
    const all = subs.value
    return [
        { label: 'Total', value: all.length, icon: 'ph:credit-card', color: 'text-primary' },
        { label: 'Aktif', value: all.filter(s => s.subscription_status === 'active').length, icon: 'ph:seal-check', color: 'text-green-500' },
        { label: 'Trial', value: all.filter(s => s.subscription_status === 'trial').length, icon: 'ph:clock-countdown', color: 'text-yellow-500' },
        { label: 'Expired', value: all.filter(s => s.subscription_status === 'expired').length, icon: 'ph:warning', color: 'text-red-500' },
    ]
})

// ── Addon ──────────────────────────────────────────────────────────────
const showAddonModal = ref(false)
const selectedSub = ref(null)
const addonDays = ref(30)
const addonNote = ref('')
const addonLoading = ref(false)

const openAddon = (sub) => {
    selectedSub.value = sub
    addonDays.value = 30
    addonNote.value = ''
    showAddonModal.value = true
}

const submitAddon = async () => {
    addonLoading.value = true
    try {
        await $fetch(
            `${config.public.apiBaseUrl}/root/dashboard/subscriptions/${selectedSub.value.user_type}/${selectedSub.value.uuid}/addon`,
            { method: 'POST', body: { addon_days: addonDays.value, note: addonNote.value }, credentials: 'include' }
        )
        showAddonModal.value = false
        await refreshSubs()
    } catch (err) {
        alert(err.data?.error || 'Gagal menambahkan hari')
    } finally {
        addonLoading.value = false
    }
}

// ── Edit ───────────────────────────────────────────────────────────────
const showEditModal = ref(false)
const editStatus = ref('')
const editPlanId = ref(null)
const editExpiresAt = ref('')
const editExtendDays = ref(0)
const editLoading = ref(false)

const openEdit = (sub) => {
    selectedSub.value = sub
    editStatus.value = ''
    editPlanId.value = null
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
            `${config.public.apiBaseUrl}/root/dashboard/subscriptions/${selectedSub.value.user_type}/${selectedSub.value.uuid}`,
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

const isExpiredSoon = (exp) => exp && (new Date(exp) - new Date()) < 7 * 86400000

const formatDate = (d) => {
    if (!d || d.startsWith('1970')) return '—'
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d))
}

const formatCurrency = (v) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
</script>
