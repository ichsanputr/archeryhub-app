<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0 opacity-20"
                style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:brackets-curly" class="text-primary text-2xl" />
                        </div>
                        <div class="flex-1">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                Babak Eliminasi
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                Kelola bracket eliminasi dan pertandingan head-to-head untuk event ini.
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton variant="primary" icon="ph:plus-bold"
                            class="h-11 px-5 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                            @click="showCreateBracketDialog = true">
                            Buat Bracket
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Category Filter -->
        <div class="flex flex-wrap gap-4 items-center">
            <label class="text-sm font-bold text-gray-600">Filter Kategori:</label>
            <select v-model="selectedCategory"
                class="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-medium">
                <option value="">Semua Kategori</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ getCategoryName(cat) }}
                </option>
            </select>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>

        <!-- Brackets List -->
        <div v-else-if="brackets.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="bracket in filteredBrackets" :key="bracket.id"
                class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden">
                <!-- Bracket Header -->
                <div class="p-5 border-b border-gray-100 bg-gray-50/50">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="h-10 w-10 rounded-lg flex items-center justify-center"
                                :class="getStatusColor(bracket.status)">
                                <Icon :icon="getStatusIcon(bracket.status)" class="text-lg" />
                            </div>
                            <div>
                                <h3 class="font-bold text-navy text-sm">{{ bracket.category_name }}</h3>
                                <p class="text-xs text-gray-500">{{ getBracketTypeLabel(bracket.bracket_type) }} • {{
                                    getFormatLabel(bracket.format) }}</p>
                            </div>
                        </div>
                        <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide"
                            :class="getStatusBadgeClass(bracket.status)">
                            {{ getStatusLabel(bracket.status) }}
                        </span>
                    </div>
                </div>

                <!-- Bracket Stats -->
                <div class="p-5">
                    <div class="grid grid-cols-2 gap-4 mb-5">
                        <div class="text-center">
                            <p class="text-2xl font-black text-navy">{{ bracket.bracket_size }}</p>
                            <p class="text-[10px] font-bold text-gray-400 uppercase">Ukuran</p>
                        </div>
                        <div class="text-center border-l border-gray-100">
                            <p class="text-2xl font-black text-navy">{{ bracket.match_count }}</p>
                            <p class="text-[10px] font-bold text-gray-400 uppercase">Pertandingan</p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-2">
                        <BaseButton v-if="bracket.status === 'draft'" variant="primary" size="sm" icon="ph:play"
                            class="flex-1" @click="generateBracket(bracket.id)">
                            Generate
                        </BaseButton>
                        <BaseButton v-if="bracket.status === 'generated'" variant="primary" size="sm"
                            icon="ph:play-circle" class="flex-1" @click="startBracket(bracket.id)">
                            Mulai
                        </BaseButton>
                        <BaseButton v-if="bracket.status === 'running'" variant="outline" size="sm" icon="ph:eye"
                            class="flex-1" @click="viewBracket(bracket.id)">
                            Lihat Bracket
                        </BaseButton>
                        <BaseButton v-if="bracket.status === 'running'" variant="white" size="sm" icon="ph:check-circle"
                            @click="closeBracket(bracket.id)">
                            Selesai
                        </BaseButton>
                        <BaseButton v-if="bracket.status !== 'running'" variant="white" size="sm" icon="ph:trash"
                            @click="confirmDeleteBracket(bracket)">
                        </BaseButton>
                        <BaseButton v-if="bracket.status !== 'draft'" variant="white" size="sm" icon="ph:eye"
                            @click="viewBracket(bracket.id)">
                            Lihat
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div class="flex flex-col items-center gap-4 max-w-sm mx-auto">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon icon="ph:brackets-curly" class="text-4xl text-gray-400" />
                </div>
                <div>
                    <h3 class="font-bold text-navy text-lg mb-2">Belum Ada Bracket</h3>
                    <p class="text-sm text-gray-500">
                        Buat bracket eliminasi untuk memulai pertandingan head-to-head.
                    </p>
                </div>
                <BaseButton variant="primary" icon="ph:plus-bold" @click="showCreateBracketDialog = true">
                    Buat Bracket Pertama
                </BaseButton>
            </div>
        </div>

        <!-- Categories Without Brackets -->
        <div v-if="categoriesWithoutBracket.length > 0 && !isLoading" class="mt-8">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Kategori Belum Ada Bracket</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="cat in categoriesWithoutBracket" :key="cat.id"
                    class="bg-white rounded-xl border-2 border-dashed border-gray-200 p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                    @click="openCreateDialogForCategory(cat)">
                    <div class="flex items-center justify-center gap-3">
                        <div
                            class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon :icon="getCategoryIcon(cat)" class="text-xl text-gray-400 group-hover:text-navy" />
                        </div>
                        <div class="text-left">
                            <p class="text-sm font-bold text-navy">{{ getCategoryName(cat) }}</p>
                            <p class="text-[10px] text-gray-400">Klik untuk buat bracket</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Bracket Dialog -->
        <Teleport to="body">
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="showCreateBracketDialog"
                    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    @click.self="showCreateBracketDialog = false">
                    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div class="sticky top-0 bg-white px-6 py-4 rounded-t-2xl border-b border-gray-200 z-10">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="size-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                        <Icon icon="ph:brackets-curly" class="text-xl text-navy" />
                                    </div>
                                    <h3 class="text-xl font-black text-navy">Buat Bracket Baru</h3>
                                </div>
                                <button @click="showCreateBracketDialog = false"
                                    class="text-gray-400 hover:text-navy transition-colors">
                                    <Icon icon="ph:x" class="text-2xl" />
                                </button>
                            </div>
                        </div>

                        <form @submit.prevent="createBracket" class="p-6 space-y-5">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Kategori *</label>
                                <select v-model="bracketForm.category_id" required
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                                    <option value="">Pilih Kategori</option>
                                    <option v-for="cat in categoriesWithoutBracket" :key="cat.id" :value="cat.id">
                                        {{ getCategoryName(cat) }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Tipe Bracket *</label>
                                <div class="grid gap-2"
                                    :class="availableBracketTypes.length === 1 ? 'grid-cols-1' : 'grid-cols-3'">
                                    <button type="button" v-for="type in availableBracketTypes" :key="type.value"
                                        @click="bracketForm.bracket_type = type.value"
                                        class="p-3 rounded-xl border-2 transition-all text-center"
                                        :class="bracketForm.bracket_type === type.value ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'">
                                        <Icon :icon="type.icon" class="text-2xl mb-1"
                                            :class="bracketForm.bracket_type === type.value ? 'text-navy' : 'text-gray-400'" />
                                        <p class="text-xs font-bold"
                                            :class="bracketForm.bracket_type === type.value ? 'text-navy' : 'text-gray-600'">
                                            {{ type.label }}</p>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Format Skor *</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <button type="button" @click="bracketForm.format = 'recurve_set'"
                                        class="p-4 rounded-xl border-2 transition-all text-left"
                                        :class="bracketForm.format === 'recurve_set' ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'">
                                        <p class="font-bold text-navy text-sm">Set System</p>
                                        <p class="text-xs text-gray-500">Recurve (6 poin untuk menang)</p>
                                    </button>
                                    <button type="button" @click="bracketForm.format = 'compound_total'"
                                        class="p-4 rounded-xl border-2 transition-all text-left"
                                        :class="bracketForm.format === 'compound_total' ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'">
                                        <p class="font-bold text-navy text-sm">Total Score</p>
                                        <p class="text-xs text-gray-500">Compound (skor tertinggi)</p>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Ukuran Bracket *</label>
                                <div class="flex flex-wrap gap-2">
                                    <button type="button" v-for="size in [8, 16, 32, 64]" :key="size"
                                        @click="bracketForm.bracket_size = size"
                                        class="px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all"
                                        :class="bracketForm.bracket_size === size ? 'border-primary bg-primary text-navy' : 'border-gray-200 text-gray-600 hover:border-primary/50'">
                                        {{ size }}
                                    </button>
                                </div>
                                <p class="text-xs text-gray-500 mt-2">Jumlah slot dalam bracket (harus power of 2)</p>
                            </div>

                            <div class="flex gap-3 pt-4 border-t border-gray-100">
                                <button type="button" @click="showCreateBracketDialog = false"
                                    class="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                                    Batal
                                </button>
                                <button type="submit" :disabled="isSubmitting"
                                    class="flex-1 px-4 py-3 bg-primary text-navy rounded-xl font-bold hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30">
                                    {{ isSubmitting ? 'Menyimpan...' : 'Buat Bracket' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Delete Confirmation Dialog -->
        <Teleport to="body">
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="showDeleteDialog"
                    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    @click.self="showDeleteDialog = false">
                    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div class="p-6">
                            <div class="flex items-start gap-4 mb-4">
                                <div
                                    class="size-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Icon icon="ph:warning" class="text-2xl text-red-600" />
                                </div>
                                <div>
                                    <h3 class="text-xl font-black text-navy mb-2">Hapus Bracket?</h3>
                                    <p class="text-gray-600">
                                        Apakah Anda yakin ingin menghapus bracket <strong class="text-navy">{{
                                            bracketToDelete?.category_name }}</strong>?
                                        Semua data pertandingan akan dihapus.
                                    </p>
                                </div>
                            </div>
                            <div class="flex gap-3">
                                <button type="button" @click="showDeleteDialog = false"
                                    class="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                                    Batal
                                </button>
                                <button @click="deleteBracket" :disabled="isSubmitting"
                                    class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50">
                                    {{ isSubmitting ? 'Menghapus...' : 'Hapus' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Eliminasi - Dashboard'
})

const route = useRoute()
const eventId = route.params.id
const { get, post, delete: deleteApi } = useApi()
const toast = useToast()

const isLoading = ref(true)
const isSubmitting = ref(false)
const brackets = ref([])
const categories = ref([])
const selectedCategory = ref('')
const showCreateBracketDialog = ref(false)
const showDeleteDialog = ref(false)
const bracketToDelete = ref(null)

const bracketForm = ref({
    category_id: '',
    bracket_type: 'individual',
    format: 'recurve_set',
    bracket_size: 16
})

const bracketTypes = [
    { value: 'individual', label: 'Individual', icon: 'ph:user' },
    { value: 'team3', label: 'Tim 3', icon: 'ph:users-three' },
    { value: 'mixed2', label: 'Mixed', icon: 'ph:gender-intersex' }
]

// Filter bracket types based on selected category's event type
const availableBracketTypes = computed(() => {
    const selectedCat = categories.value.find(c => c.id === bracketForm.value.category_id)
    if (!selectedCat) return bracketTypes

    const eventType = selectedCat.event_type_name?.toLowerCase()

    // If category is individual, only show individual bracket type
    if (eventType === 'individual') {
        return bracketTypes.filter(t => t.value === 'individual')
    }
    // If category is team (not individual), hide individual bracket type
    if (eventType && eventType !== 'individual') {
        return bracketTypes.filter(t => t.value !== 'individual')
    }

    return bracketTypes
})

const filteredBrackets = computed(() => {
    if (!selectedCategory.value) return brackets.value
    return brackets.value.filter(b => b.category_id === selectedCategory.value)
})

const categoriesWithoutBracket = computed(() => {
    const bracketCatIds = brackets.value.map(b => b.category_id)
    return categories.value.filter(c => !bracketCatIds.includes(c.id))
})

const getCategoryIcon = (category) => {
    if (!category) return 'ph:brackets-curly'
    const eventType = category.event_type_name?.toLowerCase()
    if (eventType === 'individual') return 'ph:user'
    if (eventType === 'team') return 'ph:users-three'
    if (eventType === 'mixed') return 'ph:gender-intersex'
    return 'ph:brackets-curly'
}

const getCategoryName = (category) => {
    if (!category) return ''
    const name = [
        category.division_name,
        category.category_name,
        category.gender_division_name
    ].filter(Boolean).join(' ')
    const eventType = category.event_type_name ? ` (${category.event_type_name})` : ''
    return name + eventType
}

const openCreateDialogForCategory = (category) => {
    bracketForm.value.category_id = category.id
    // Auto-set bracket type based on category event type
    const eventType = category.event_type_name?.toLowerCase()
    if (eventType === 'individual') {
        bracketForm.value.bracket_type = 'individual'
    } else if (eventType === 'team') {
        bracketForm.value.bracket_type = 'team3'
    } else if (eventType === 'mixed') {
        bracketForm.value.bracket_type = 'mixed2'
    }
    showCreateBracketDialog.value = true
}

const fetchBrackets = async () => {
    isLoading.value = true
    try {
        const response = await get(`/events/${eventId}/elimination/brackets`)
        brackets.value = response?.brackets || []
    } catch (error) {
        console.error('Failed to fetch brackets:', error)
        toast.error('Gagal memuat data bracket')
    } finally {
        isLoading.value = false
    }
}

const fetchCategories = async () => {
    try {
        const response = await get(`/events/${eventId}/categories`)
        // API returns 'events' field, not 'categories'
        categories.value = response?.events || response?.categories || response?.data?.events || []
        console.log('Categories loaded:', categories.value)
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

const createBracket = async () => {
    if (!bracketForm.value.category_id) {
        toast.error('Pilih kategori terlebih dahulu')
        return
    }

    isSubmitting.value = true
    try {
        await post(`/events/${eventId}/elimination/brackets`, bracketForm.value)
        toast.success('Bracket berhasil dibuat')
        showCreateBracketDialog.value = false
        resetForm()
        await fetchBrackets()
    } catch (error) {
        console.error('Failed to create bracket:', error)
        toast.error(error?.data?.error || 'Gagal membuat bracket')
    } finally {
        isSubmitting.value = false
    }
}

const generateBracket = async (bracketId) => {
    try {
        await post(`/events/${eventId}/elimination/brackets/${bracketId}/generate`)
        toast.success('Bracket berhasil di-generate')
        await fetchBrackets()
    } catch (error) {
        console.error('Failed to generate bracket:', error)
        toast.error(error?.data?.error || 'Gagal generate bracket')
    }
}

const startBracket = async (bracketId) => {
    try {
        await post(`/events/${eventId}/elimination/brackets/${bracketId}/start`)
        toast.success('Bracket dimulai')
        await fetchBrackets()
    } catch (error) {
        console.error('Failed to start bracket:', error)
        toast.error(error?.data?.error || 'Gagal memulai bracket')
    }
}

const closeBracket = async (bracketId) => {
    try {
        await post(`/events/${eventId}/elimination/brackets/${bracketId}/close`)
        toast.success('Bracket selesai')
        await fetchBrackets()
    } catch (error) {
        console.error('Failed to close bracket:', error)
        toast.error(error?.data?.error || 'Gagal menyelesaikan bracket')
    }
}

const viewBracket = (bracketId) => {
    navigateTo(`/dashboard/events/${eventId}/elimination/${bracketId}`)
}

const confirmDeleteBracket = (bracket) => {
    bracketToDelete.value = bracket
    showDeleteDialog.value = true
}

const deleteBracket = async () => {
    if (!bracketToDelete.value) return

    isSubmitting.value = true
    try {
        await deleteApi(`/events/${eventId}/elimination/brackets/${bracketToDelete.value.id}`)
        toast.success('Bracket berhasil dihapus')
        showDeleteDialog.value = false
        bracketToDelete.value = null
        await fetchBrackets()
    } catch (error) {
        console.error('Failed to delete bracket:', error)
        toast.error(error?.data?.error || 'Gagal menghapus bracket')
    } finally {
        isSubmitting.value = false
    }
}

const resetForm = () => {
    bracketForm.value = {
        category_id: '',
        bracket_type: 'individual',
        format: 'recurve_set',
        bracket_size: 16
    }
}

const getStatusColor = (status) => {
    const colors = {
        draft: 'bg-gray-100 text-gray-600',
        generated: 'bg-blue-100 text-blue-600',
        running: 'bg-green-100 text-green-600',
        closed: 'bg-gray-200 text-gray-700'
    }
    return colors[status] || colors.draft
}

const getStatusIcon = (status) => {
    const icons = {
        draft: 'ph:pencil-simple',
        generated: 'ph:check',
        running: 'ph:play',
        closed: 'ph:flag-checkered'
    }
    return icons[status] || icons.draft
}

const getStatusBadgeClass = (status) => {
    const classes = {
        draft: 'bg-gray-100 text-gray-600',
        generated: 'bg-blue-100 text-blue-700',
        running: 'bg-green-100 text-green-700',
        closed: 'bg-gray-200 text-gray-700'
    }
    return classes[status] || classes.draft
}

const getStatusLabel = (status) => {
    const labels = {
        draft: 'Draft',
        generated: 'Siap',
        running: 'Berlangsung',
        closed: 'Selesai'
    }
    return labels[status] || status
}

const getBracketTypeLabel = (type) => {
    const labels = {
        individual: 'Individual',
        team3: 'Tim 3 Orang',
        mixed2: 'Mixed Team'
    }
    return labels[type] || type
}

const getFormatLabel = (format) => {
    const labels = {
        recurve_set: 'Set System',
        compound_total: 'Total Score'
    }
    return labels[format] || format
}

onMounted(async () => {
    await Promise.all([fetchBrackets(), fetchCategories()])
})
</script>
