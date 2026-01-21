<template>
    <div class="flex flex-col gap-8">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight uppercase">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Pemanah</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Daftar Pemanah</h1>
                <p class="text-gray-500 font-medium mt-1">Semua pemanah yang terdaftar dalam event organisasi Anda.</p>
            </div>
            <BaseButton variant="primary" icon="ph:download-simple" class="shadow-lg shadow-primary/20">
                Export Data
            </BaseButton>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-primary/10 text-primary-dark flex items-center justify-center">
                    <Icon icon="ph:users-three" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Pemanah</p>
                    <p class="text-lg font-bold text-navy">{{ archers.length }}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon icon="ph:gender-male" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Putra</p>
                    <p class="text-lg font-bold text-navy">{{archers.filter(a => a.gender === 'male').length}}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Icon icon="ph:gender-female" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Putri</p>
                    <p class="text-lg font-bold text-navy">{{archers.filter(a => a.gender === 'female').length}}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <Icon icon="ph:trophy" class="text-xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Event Diikuti</p>
                    <p class="text-lg font-bold text-navy">{{ uniqueEvents }}</p>
                </div>
            </div>
        </div>

        <!-- Search & Filter -->
        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <BaseInput v-model="searchQuery" icon="ph:magnifying-glass" placeholder="Cari nama, klub, atau kota..."
                    label="Pencarian" />
            </div>
            <div class="w-full md:w-48">
                <BaseSelect v-model="bowTypeFilter" :items="bowTypeOptions" label="Jenis Busur" />
            </div>
            <div class="w-full md:w-48">
                <BaseSelect v-model="genderFilter" :items="genderOptions" label="Jenis Kelamin" />
            </div>
            <BaseButton variant="white" icon="ph:funnel" @click="resetFilters" class="h-11">
                Reset
            </BaseButton>
        </div>

        <!-- Archers Table -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Pemanah</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Klub</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Jenis Busur</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Event Terakhir</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Skor Terbaik</th>
                            <th
                                class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-right">
                                Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="archer in filteredArchers" :key="archer.id"
                            class="hover:bg-primary/5 transition-colors group">
                            <!-- Archer Info -->
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="h-12 w-12 rounded-xl bg-gradient-to-br from-navy to-blue-800 flex items-center justify-center overflow-hidden">
                                        <img v-if="archer.photo_url" :src="archer.photo_url"
                                            class="w-full h-full object-cover" />
                                        <span v-else class="text-white font-bold text-lg">{{ archer.full_name?.charAt(0)
                                            || 'A'
                                            }}</span>
                                    </div>
                                    <div>
                                        <p class="font-bold text-navy group-hover:text-primary transition-colors">{{
                                            archer.full_name }}</p>
                                        <div class="flex items-center gap-2 text-xs text-gray-400">
                                            <Icon
                                                :icon="archer.gender === 'M' ? 'ph:gender-male' : archer.gender === 'F' ? 'ph:gender-female' : 'ph:gender-neuter'"
                                                :class="archer.gender === 'M' ? 'text-blue-500' : archer.gender === 'F' ? 'text-pink-500' : 'text-gray-400'" />
                                            <span>{{ calculateAge(archer.date_of_birth) }} tahun</span>
                                            <span class="text-gray-300">•</span>
                                            <span>{{ archer.country || 'Indonesia' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <!-- Club -->
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <div class="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <Icon icon="ph:shield" class="text-gray-400" />
                                    </div>
                                    <span class="text-sm font-medium text-gray-700">{{ archer.club }}</span>
                                </div>
                            </td>

                            <!-- Bow Type -->
                            <td class="px-6 py-4">
                                <span :class="[
                                    'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                                    archer.bowType === 'Recurve' ? 'bg-blue-50 text-blue-600' :
                                        archer.bowType === 'Compound' ? 'bg-purple-50 text-purple-600' :
                                            archer.bowType === 'Barebow' ? 'bg-amber-50 text-amber-600' :
                                                'bg-gray-100 text-gray-600'
                                ]">
                                    {{ archer.bowType }}
                                </span>
                            </td>

                            <!-- Last Event -->
                            <td class="px-6 py-4">
                                <p class="text-sm font-medium text-gray-700">{{ archer.lastEvent }}</p>
                                <p class="text-xs text-gray-400">{{ archer.lastEventDate }}</p>
                            </td>

                            <!-- Best Score -->
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:crosshair" class="text-primary" />
                                    <span class="font-bold text-navy text-lg">{{ archer.bestScore || '-' }}</span>
                                </div>
                            </td>

                            <!-- Actions -->
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="viewArcher(archer)"
                                        class="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors">
                                        <Icon icon="ph:eye" class="text-lg" />
                                    </button>
                                    <button @click="viewStats(archer)"
                                        class="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                        <Icon icon="ph:chart-line-up" class="text-lg" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <!-- Empty State -->
                        <tr v-if="filteredArchers.length === 0">
                            <td colspan="6" class="px-6 py-24 text-center">
                                <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                    <div
                                        class="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                                        <Icon icon="ph:users-three" class="text-4xl" />
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-lg font-bold text-navy">Tidak Ada Pemanah</p>
                                        <p class="text-sm text-gray-500 font-medium leading-relaxed">
                                            Belum ada pemanah yang terdaftar dalam event Anda.
                                        </p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                <p class="text-sm text-gray-500">
                    Menampilkan <span class="font-bold text-navy">{{ filteredArchers.length }}</span> dari <span
                        class="font-bold text-navy">{{ archers.length }}</span> pemanah
                </p>
                <div class="flex items-center gap-2">
                    <button
                        class="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-navy hover:bg-white rounded-lg border border-gray-200 transition-colors">
                        Sebelumnya
                    </button>
                    <button class="px-3 py-1.5 text-sm font-medium bg-navy text-white rounded-lg">1</button>
                    <button
                        class="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-navy hover:bg-white rounded-lg border border-gray-200 transition-colors">
                        2
                    </button>
                    <button
                        class="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-navy hover:bg-white rounded-lg border border-gray-200 transition-colors">
                        Selanjutnya
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

definePageMeta({
    title: 'Pemanah',
    layout: 'dashboard'
})

const { get } = useApi()
const toast = useToast()

const archers = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const bowTypeFilter = ref('all')
const genderFilter = ref('all')

const bowTypeOptions = [
    { title: 'Semua', value: 'all' },
    { title: 'Recurve', value: 'Recurve' },
    { title: 'Compound', value: 'Compound' },
    { title: 'Barebow', value: 'Barebow' },
    { title: 'Tradisional', value: 'Traditional' }
]

const genderOptions = [
    { title: 'Semua', value: 'all' },
    { title: 'Putra', value: 'male' },
    { title: 'Putri', value: 'female' }
]

const fetchArchers = async () => {
    isLoading.value = true
    try {
        const response = await get('/api/v1/archers')
        archers.value = response.data || []
    } catch (error) {
        toast.error('Gagal mengambil data pemanah')
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchArchers()
})

const calculateAge = (dob) => {
    if (!dob) return '-'
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
}

const uniqueEvents = computed(() => {
    return [...new Set(archers.value.map(a => a.total_events || 0))].reduce((acc, curr) => acc + curr, 0)
})

const filteredArchers = computed(() => {
    return archers.value.filter(archer => {
        const matchesSearch = archer.full_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (archer.club && archer.club.toLowerCase().includes(searchQuery.value.toLowerCase()))
        const matchesBowType = bowTypeFilter.value === 'all' || archer.bow_type === bowTypeFilter.value
        const matchesGender = genderFilter.value === 'all' ||
            (genderFilter.value === 'male' && archer.gender === 'M') ||
            (genderFilter.value === 'female' && archer.gender === 'F')
        return matchesSearch && matchesBowType && matchesGender
    })
})

const resetFilters = () => {
    searchQuery.value = ''
    bowTypeFilter.value = 'all'
    genderFilter.value = 'all'
}

const viewArcher = (archer) => {
    console.log('View archer:', archer)
}

const viewStats = (archer) => {
    console.log('View stats:', archer)
}
</script>
