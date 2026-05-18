<template>
    <div class="flex flex-col gap-8 relative">
        <!-- Success Toast -->
        <Transition enter-active-class="transform transition ease-out duration-300"
            enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
            leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-if="showSuccessToast"
                class="fixed top-8 right-8 z-[70] bg-navy text-primary px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-primary/20">
                <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon icon="ph:check-circle-bold" class="text-2xl text-primary" />
                </div>
                <div>
                    <h4 class="text-[10px] font-black tracking-widest text-white">SISTEM ROOT</h4>
                    <div class="text-xs font-bold text-primary/80">Akun baru telah berhasil dibuat</div>
                </div>
                <button @click="showSuccessToast = false"
                    class="ml-4 text-white/40 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg">
                    <Icon icon="ph:x-bold" />
                </button>
            </div>
        </Transition>

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
                        <span class="text-primary">Manajemen Akun</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                            <Icon icon="ph:users-four-bold" class="text-primary text-2xl sm:text-3xl" />
                        </div>
                        <div>
                            <h1 class="text-xl sm:text-3xl font-black tracking-tight">Manajemen Akun</h1>
                            <div class="text-slate-300 text-[10px] sm:text-sm font-medium mt-1">
                                Kelola semua pengguna terdaftar di Archeris.net
                            </div>
                        </div>
                    </div>
                </div>
                <NuxtLink to="/dashboard/root/create-account"
                    class="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-navy rounded-xl text-[10px] sm:text-xs font-black tracking-widest transition-all shadow-lg shadow-primary/20 shrink-0">
                    <Icon icon="ph:plus-bold" />
                    Buat Akun Baru
                </NuxtLink>
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
                    <div class="text-xs text-gray-400 font-bold tracking-wider ">{{ stat.label }}</div>
                    <div class="text-lg font-bold text-navy">{{ stat.value }}</div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider ">Pencarian</label>
                <div class="relative">
                    <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="searchQuery" type="text" placeholder="Cari nama atau email..."
                        class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all" />
                </div>
            </div>
            <div class="w-full md:w-48">
                <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider ">Tipe Akun</label>
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
                <table class="w-full text-left border-collapse min-w-[750px]">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest ">
                                Identitas</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest text-center">
                                Tipe
                            </th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest text-center">
                                Status</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 tracking-widest ">
                                Terdaftar</th>
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
                                        class="h-10 w-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                        <img :src="useImageOrDefault(user.avatar_url, user.name)"
                                            class="w-full h-full object-cover">
                                    </div>
                                    <div>
                                        <div
                                            class="font-bold text-navy group-hover:text-primary transition-colors line-clamp-1 truncate max-w-[200px]">
                                            {{
                                                user.name || '—' }}</div>
                                        <div class="text-xs text-gray-400 line-clamp-1 truncate max-w-[200px]">{{
                                            user.email || '—' }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span
                                    class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize tracking-widest border"
                                    :class="getTypeBadgeClass(user.type)">
                                    {{ user.type }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span class="px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest border"
                                    :class="getStatusBadgeClass(user.status)">
                                    {{ user.status || 'inactive' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-xs font-semibold text-navy">{{ formatDate(user.created_at) }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button v-if="user.status !== 'suspended' && user.type !== 'archer'"
                                        @click="confirmAction(user, 'suspend')"
                                        class="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                                        title="Suspend Akun">
                                        <Icon icon="ph:prohibit-bold" class="text-xl" />
                                    </button>
                                    <button v-else-if="user.status === 'suspended'"
                                        @click="confirmAction(user, 'activate')"
                                        class="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all"
                                        title="Aktifkan Kembali">
                                        <Icon icon="ph:check-circle-bold" class="text-xl" />
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
                                        <div class="text-sm font-bold text-gray-400 tracking-tight">Tidak ada pengguna
                                            ditemukan</div>
                                        <div class="text-xs text-gray-300 mt-1">Coba ubah filter atau kata kunci
                                            pencarian
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <div v-if="showConfirmModal"
            class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            @click.self="showConfirmModal = false">
            <div
                class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 animate-in zoom-in-95 duration-200">
                <div class="flex flex-col items-center text-center gap-4">
                    <div class="size-16 rounded-3xl flex items-center justify-center"
                        :class="pendingAction === 'suspend' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-500 border border-green-100'">
                        <Icon :icon="pendingAction === 'suspend' ? 'ph:warning-circle-bold' : 'ph:check-circle-bold'"
                            class="text-4xl" />
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-navy">{{ pendingAction === 'suspend' ? 'Suspend Akun?' :
                            'Aktifkan Akun?' }}</h3>
                        <div class="text-gray-400 text-xs mt-2 leading-relaxed">
                            Apakah Anda yakin ingin {{ pendingAction === 'suspend' ? 'menonaktifkan' : 'mengaktifkan' }}
                            akses untuk <span class="font-bold text-navy">{{ selectedUser?.name }}</span>?
                        </div>
                    </div>
                </div>

                <div class="flex gap-3">
                    <button @click="showConfirmModal = false"
                        class="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-black text-gray-500 hover:bg-gray-50 transition-all tracking-widest">
                        Batal
                    </button>
                    <button @click="executeAction" :disabled="actionLoading"
                        class="flex-1 py-3 rounded-xl text-xs font-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 tracking-widest shadow-lg"
                        :class="pendingAction === 'suspend' ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-200' : 'bg-navy text-primary hover:bg-navy/90 shadow-navy/20'">
                        <Icon v-if="actionLoading" icon="ph:spinner-bold" class="animate-spin" />
                        {{ pendingAction === 'suspend' ? 'Ya, Suspend' : 'Ya, Aktifkan' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useImageOrDefault } from '~/composables/useImageHelper'

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const route = useRoute()

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })
useHead({ title: 'Manajemen Akun — Root Terminal' })

// ── Data ──────────────────────────────────────────────────────────────
const searchQuery = ref('')
const typeFilter = ref('')
const showSuccessToast = ref(false)

const { data: usersData, refresh } = await useFetch(
    `${apiBaseUrl}/root/dashboard/users`,
    { credentials: 'include' }
)

const filteredUsers = computed(() => {
    if (!usersData.value) return []
    const q = searchQuery.value.toLowerCase()
    return usersData.value.filter(u => {
        const mQ = !q || (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
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

// ── Actions (Suspend/Activate) ─────────────────────────────────────────
const showConfirmModal = ref(false)
const selectedUser = ref(null)
const pendingAction = ref('') // 'suspend' or 'activate'
const actionLoading = ref(false)

const confirmAction = (user, action) => {
    selectedUser.value = user
    pendingAction.value = action
    showConfirmModal.value = true
}

const executeAction = async () => {
    if (!selectedUser.value) return
    actionLoading.value = true
    try {
        await $fetch(`${apiBaseUrl}/root/dashboard/users/${selectedUser.value.type}/${selectedUser.value.uuid}/terminate`, {
            method: 'PATCH',
            body: { action: pendingAction.value },
            credentials: 'include'
        })
        showConfirmModal.value = false
        await refresh()
    } catch (err) {
        alert(err.data?.error || 'Gagal mengubah status akun')
    } finally {
        actionLoading.value = false
    }
}

onMounted(() => {
    if (route.query.success === 'created') {
        showSuccessToast.value = true
        // Remove the query param without refreshing
        window.history.replaceState({}, document.title, window.location.pathname)
        setTimeout(() => { showSuccessToast.value = false }, 5000)
    }
})

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
        case 'trial': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'suspended': return 'bg-red-50 text-red-500 border-red-100'
        case 'expired': return 'bg-orange-50 text-orange-600 border-orange-100'
        default: return 'bg-gray-50 text-gray-400 border-gray-200'
    }
}

const formatDate = (d) => {
    if (!d || d.startsWith('1970')) return '—'
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d))
}
</script>
