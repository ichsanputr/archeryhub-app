<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-slate-900 text-white shadow-sm">
            <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.1;"></div>
            <div class="relative p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div
                        class="size-14 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                        <Icon icon="ph:users-four-fill" class="text-navy text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-3xl font-black tracking-tight">User Management</h1>
                        <p class="text-slate-400 text-sm font-medium mt-1">Sistem Root - Pantau semua pengguna
                            Archeryhub.id</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters & Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div v-for="stat in stats" :key="stat.label"
                class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
                <p class="text-2xl font-black text-navy">{{ stat.value }}</p>
            </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
            <div class="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-black text-navy">Semua Pengguna</h2>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Root Terminal Access</p>
                </div>
                <div class="flex gap-4">
                    <div class="relative">
                        <Icon icon="ph:magnifying-glass-bold"
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchQuery" type="text" placeholder="Cari email atau nama..."
                            class="pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none w-64 transition-all">
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead
                        class="bg-slate-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                        <tr>
                            <th class="px-8 py-5">Identitas</th>
                            <th class="px-8 py-5">Tipe</th>
                            <th class="px-8 py-5">Status</th>
                            <th class="px-8 py-5">Terdaftar Pada</th>
                            <th class="px-8 py-5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="user in filteredUsers" :key="user.uuid"
                            class="hover:bg-slate-50 transition-colors group">
                            <td class="px-8 py-5">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="size-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                                        {{ user.name.charAt(0) }}
                                    </div>
                                    <div>
                                        <p class="text-sm font-black text-navy">{{ user.name }}</p>
                                        <p class="text-xs text-gray-400 font-medium">{{ user.email }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-8 py-5">
                                <span class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
                                    :class="getTypeClass(user.type)">
                                    {{ user.type }}
                                </span>
                            </td>
                            <td class="px-8 py-5">
                                <div class="flex items-center gap-2">
                                    <div class="size-1.5 rounded-full"
                                        :class="user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"></div>
                                    <span class="text-xs font-bold text-gray-600 capitalize">{{ user.status }}</span>
                                </div>
                            </td>
                            <td class="px-8 py-5 text-sm text-gray-400 font-medium">
                                {{ formatDate(user.created_at) }}
                            </td>
                            <td class="px-8 py-5 text-right">
                                <button class="p-2 text-gray-400 hover:text-navy transition-colors">
                                    <Icon icon="ph:dots-three-outline-vertical-fill" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="!filteredUsers.length" class="p-20 text-center">
                    <Icon icon="ph:user-focus-bold" class="text-4xl text-gray-200 mb-4 mx-auto" />
                    <p class="text-sm font-black text-gray-300 uppercase tracking-widest">Tidak ada pengguna ditemukan
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const config = useRuntimeConfig()

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

const searchQuery = ref('')
const { data: users, pending } = await useFetch(`${config.public.apiBaseUrl}/root/dashboard/users`, {
    credentials: 'include'
})

const filteredUsers = computed(() => {
    if (!users.value) return []
    const q = searchQuery.value.toLowerCase()
    return users.value.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.type.toLowerCase().includes(q)
    )
})

const stats = computed(() => {
    if (!users.value) return []
    return [
        { label: 'Total Users', value: users.value.length },
        { label: 'Archers', value: users.value.filter(u => u.type === 'archer').length },
        { label: 'Clubs', value: users.value.filter(u => u.type === 'club').length },
        { label: 'Orgs', value: users.value.filter(u => u.type === 'organization').length },
    ]
})

const getTypeClass = (type) => {
    switch (type) {
        case 'archer': return 'bg-blue-100 text-blue-700'
        case 'club': return 'bg-primary/20 text-navy'
        case 'organization': return 'bg-purple-100 text-purple-700'
        case 'seller': return 'bg-orange-100 text-orange-700'
        default: return 'bg-gray-100 text-gray-700'
    }
}

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date)
}
</script>
