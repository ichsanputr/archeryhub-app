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
                        <span class="text-primary">Manajemen Akun</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                            <Icon icon="ph:users-four-bold" class="text-primary text-2xl sm:text-3xl" />
                        </div>
                        <div>
                            <h1 class="text-xl sm:text-3xl font-black tracking-tight">Manajemen Akun</h1>
                            <p class="text-slate-300 text-[10px] sm:text-sm font-medium mt-1">
                                Kelola semua pengguna terdaftar di Archeryhub.id
                            </p>
                        </div>
                    </div>
                </div>
                <button @click="openCreateModal"
                    class="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-navy rounded-xl text-[10px] sm:text-xs font-black tracking-widest uppercase transition-all shadow-lg shadow-primary/20 shrink-0">
                    <Icon icon="ph:plus-bold" />
                    Buat Akun Baru
                </button>
            </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="stat in stats" :key="stat.label"
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

        <!-- Filters -->
        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Pencarian</label>
                <div class="relative">
                    <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="searchQuery" type="text" placeholder="Cari nama atau email..."
                        class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all" />
                </div>
            </div>
            <div class="w-full md:w-48">
                <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Tipe Akun</label>
                <select v-model="typeFilter"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                    <option value="">Semua Tipe</option>
                    <option value="archer">Archer</option>
                    <option value="club">Club</option>
                    <option value="organization">Organisasi</option>
                    <option value="seller">Seller</option>
                </select>
            </div>
            <button @click="searchQuery = ''; typeFilter = ''"
                class="h-11 px-6 font-semibold text-sm text-navy bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shrink-0">
                Reset
            </button>
        </div>

        <!-- Table -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest">Identitas
                            </th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest">Tipe</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest">Status</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest">Terdaftar
                            </th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest text-right">
                                Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="user in filteredUsers" :key="user.uuid"
                            class="hover:bg-primary/5 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="h-10 w-10 rounded-xl bg-navy flex items-center justify-center font-black text-primary text-sm shrink-0">
                                        {{ (user.name || '?').charAt(0).toUpperCase() }}
                                    </div>
                                    <div>
                                        <p class="font-bold text-navy group-hover:text-primary transition-colors">{{
                                            user.name || '—' }}</p>
                                        <p class="text-xs text-gray-400">{{ user.email || '—' }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize tracking-widest border"
                                    :class="getTypeBadgeClass(user.type)">
                                    {{ user.type }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize tracking-widest border"
                                    :class="getStatusBadgeClass(user.status)">
                                    {{ user.status || 'inactive' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(user.created_at) }}</td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button v-if="user.status !== 'suspended' && user.type !== 'archer'"
                                        @click="handleTerminate(user, 'suspend')"
                                        class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Suspend Akun">
                                        <Icon icon="ph:prohibit-bold" class="text-lg" />
                                    </button>
                                    <button v-else-if="user.status === 'suspended'"
                                        @click="handleTerminate(user, 'activate')"
                                        class="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Aktifkan Kembali">
                                        <Icon icon="ph:check-circle-bold" class="text-lg" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!filteredUsers.length">
                            <td colspan="5" class="px-6 py-24 text-center">
                                <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                    <div
                                        class="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                                        <Icon icon="ph:user-focus-bold" class="text-3xl" />
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-gray-400">Tidak ada pengguna ditemukan</p>
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

        <!-- Create Account Modal -->
        <div v-if="showCreateModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            @click.self="showCreateModal = false">
            <div
                class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
                <div class="flex items-center gap-4">
                    <div class="size-12 rounded-2xl bg-navy flex items-center justify-center shrink-0">
                        <Icon icon="ph:plus-bold" class="text-primary text-xl" />
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-navy">Buat Akun Baru</h3>
                        <p class="text-xs text-gray-400 mt-0.5">Tambahkan akun club, organisasi, atau seller</p>
                    </div>
                </div>

                <!-- Type selector -->
                <div class="flex gap-2">
                    <button v-for="t in ['club', 'organization', 'seller']" :key="t" @click="createForm.user_type = t"
                        class="flex-1 py-2.5 rounded-xl border-2 text-xs font-black capitalize transition-all" :class="createForm.user_type === t
                            ? 'border-navy bg-navy text-primary'
                            : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'">
                        {{ t }}
                    </button>
                </div>

                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">
                                {{ createForm.user_type === 'seller' ? 'Nama Toko' : 'Nama' }}
                            </label>
                            <input v-model="createForm.name" type="text"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>
                        <div v-if="createForm.user_type === 'organization'">
                            <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Akronim</label>
                            <input v-model="createForm.acronym" type="text" placeholder="e.g. PPLM"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>
                        <div v-else>
                            <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">No. HP</label>
                            <input v-model="createForm.phone" type="text" placeholder="08xx"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Email</label>
                        <input v-model="createForm.email" type="email" placeholder="email@domain.com"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Password</label>
                        <input v-model="createForm.password" type="text" placeholder="password awal"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div class="grid grid-cols-2 gap-3" v-if="createForm.user_type !== 'seller'">
                        <div v-if="createForm.user_type === 'organization'">
                            <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Kota</label>
                            <input v-model="createForm.city" type="text" placeholder="Jakarta"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">Trial
                                (hari)</label>
                            <input v-model.number="createForm.trial_days" type="number" min="1" placeholder="90"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>
                    </div>
                </div>

                <div v-if="createError"
                    class="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-500 font-bold flex items-center gap-2">
                    <Icon icon="ph:warning-circle-fill" class="shrink-0" />
                    {{ createError }}
                </div>

                <div class="flex gap-3 pt-2">
                    <button @click="showCreateModal = false"
                        class="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                        Batal
                    </button>
                    <button @click="submitCreateAccount" :disabled="createLoading"
                        class="flex-1 py-3 bg-navy text-primary rounded-xl text-sm font-black hover:bg-navy/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        <Icon v-if="createLoading" icon="ph:spinner-bold" class="animate-spin" />
                        Buat Akun
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
useHead({ title: 'Manajemen Akun — Root Terminal' })

// ── Data ──────────────────────────────────────────────────────────────
const searchQuery = ref('')
const typeFilter = ref('')

const { data: usersData, refresh } = await useFetch(
    `${config.public.apiBaseUrl}/root/dashboard/users`,
    { credentials: 'include' }
)

const filteredUsers = computed(() => {
    if (!usersData.value) return []
    const q = searchQuery.value.toLowerCase()
    return usersData.value.filter(u => {
        const mQ = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
        const mT = !typeFilter.value || u.type === typeFilter.value
        return mQ && mT
    })
})

const stats = computed(() => {
    const all = usersData.value || []
    return [
        { label: 'Total Pengguna', value: all.length, icon: 'ph:users-four', color: 'text-primary' },
        { label: 'Archer', value: all.filter(u => u.type === 'archer').length, icon: 'ph:person', color: 'text-blue-500' },
        { label: 'Club', value: all.filter(u => u.type === 'club').length, icon: 'ph:buildings', color: 'text-navy' },
        { label: 'Organisasi', value: all.filter(u => u.type === 'organization').length, icon: 'ph:building-office', color: 'text-purple-500' },
    ]
})

// ── Create Account ─────────────────────────────────────────────────────
const showCreateModal = ref(false)
const createLoading = ref(false)
const createError = ref('')
const createForm = ref({
    user_type: 'club', name: '', email: '', password: '',
    phone: '', acronym: '', city: '', trial_days: 90
})

const openCreateModal = () => {
    createForm.value = { user_type: 'club', name: '', email: '', password: '', phone: '', acronym: '', city: '', trial_days: 90 }
    createError.value = ''
    showCreateModal.value = true
}

const submitCreateAccount = async () => {
    createError.value = ''
    if (!createForm.value.name || !createForm.value.email || !createForm.value.password) {
        createError.value = 'Nama, email, dan password wajib diisi'
        return
    }
    createLoading.value = true
    try {
        await $fetch(`${config.public.apiBaseUrl}/root/dashboard/users`, {
            method: 'POST', body: createForm.value, credentials: 'include'
        })
        showCreateModal.value = false
        await refresh()
    } catch (err) {
        createError.value = err.data?.error || 'Gagal membuat akun'
    } finally {
        createLoading.value = false
    }
}

// ── Terminate / Activate ───────────────────────────────────────────────
const handleTerminate = async (user, action) => {
    const label = action === 'suspend' ? 'Suspend' : 'Aktifkan kembali'
    if (!confirm(`${label} akun "${user.name}"?`)) return
    try {
        await $fetch(`${config.public.apiBaseUrl}/root/dashboard/users/${user.type}/${user.uuid}/terminate`, {
            method: 'PATCH', body: { action }, credentials: 'include'
        })
        await refresh()
    } catch (err) {
        alert(err.data?.error || 'Gagal mengubah status akun')
    }
}

// ── Helpers ────────────────────────────────────────────────────────────
const getTypeBadgeClass = (type) => {
    switch (type) {
        case 'archer': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'club': return 'bg-primary/10 text-navy border-primary/20'
        case 'organization': return 'bg-purple-50 text-purple-600 border-purple-100'
        case 'seller': return 'bg-orange-50 text-orange-600 border-orange-100'
        default: return 'bg-gray-50 text-gray-500 border-gray-200'
    }
}

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'active': return 'bg-green-50 text-green-600 border-green-100'
        case 'suspended': return 'bg-red-50 text-red-500 border-red-100'
        default: return 'bg-gray-50 text-gray-400 border-gray-200'
    }
}

const formatDate = (d) => {
    if (!d || d.startsWith('1970')) return '—'
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d))
}
</script>
