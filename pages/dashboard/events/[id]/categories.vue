<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Enhanced Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-20"
                style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
            </div>

            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:tag" class="text-primary text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                Kategori Lomba
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                Kelola kategori lomba untuk event ini. Setiap kategori dapat memiliki maksimal peserta
                                yang berbeda.
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton variant="primary" icon="ph:plus-bold"
                            class="h-11 px-5 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                            @click="openCreateDialog">
                            Tambah Kategori
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Categories List -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
                class="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 class="text-lg font-bold text-navy">Daftar Kategori</h2>
                <div class="flex items-center gap-3">
                    <span class="text-sm font-medium text-gray-500 hidden sm:inline">Filter Busur:</span>
                    <BaseSelect v-model="selectedBowType" :items="bowFilterOptions" placeholder="Semua Busur"
                        class="w-full sm:w-48" />
                </div>
            </div>
            <!-- Skeleton Loader -->
            <div v-if="isLoading" class="divide-y divide-gray-100">
                <div v-for="i in 3" :key="i" class="p-4 sm:p-6">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div class="flex-1 space-y-4">
                            <div class="flex items-center gap-3">
                                <div class="h-6 w-3/4 bg-gray-100 animate-pulse rounded"></div>
                                <div class="h-5 w-16 bg-gray-50 animate-pulse rounded-full"></div>
                            </div>
                            <div class="flex gap-6">
                                <div class="h-4 w-32 bg-gray-50 animate-pulse rounded"></div>
                                <div class="h-4 w-32 bg-gray-50 animate-pulse rounded"></div>
                            </div>
                        </div>
                        <div class="h-9 w-20 bg-gray-100 animate-pulse rounded-lg"></div>
                    </div>
                </div>
            </div>
            <div v-else-if="categories.length === 0" class="p-12 text-center">
                <Icon icon="ph:tag-simple" class="text-5xl text-gray-300 mx-auto mb-4" />
                <p class="text-gray-500 font-medium mb-2">Belum ada kategori</p>
                <p class="text-sm text-gray-400 mb-6">Tambahkan kategori pertama untuk event ini</p>
                <BaseButton variant="primary" icon="ph:plus-bold" @click="openCreateDialog">
                    Tambah Kategori Pertama
                </BaseButton>
            </div>
            <div v-else class="divide-y divide-gray-100">
                <div v-for="category in categories" :key="category.id"
                    class="p-4 sm:p-6 hover:bg-gray-50 transition-colors group">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div class="flex items-start gap-4 flex-1 min-w-0">
                            <!-- Category Icon -->
                            <div
                                class="h-12 w-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shadow-sm shrink-0 transition-all group-hover:bg-navy p-2 overflow-hidden">
                                <img :src="'/' + getCategoryIcon(`${category.division_name} ${category.event_type_name} ${category.gender_division_name}`)"
                                    :alt="category.division_name"
                                    class="w-full h-full object-contain group-hover:invert transition-all" />
                            </div>

                            <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                    <h3 class="text-base sm:text-lg font-bold text-navy break-words min-w-0">
                                        {{ category.division_name }} – {{ category.category_name }} – {{
                                            category.event_type_name }}
                                        – {{ category.gender_division_name }}
                                    </h3>
                                    <span
                                        :class="category.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                                        class="px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0">
                                        {{ category.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                    </span>
                                </div>
                                <div
                                    class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-500">
                                    <div class="flex items-center gap-2 min-w-0">
                                        <Icon icon="ph:users" class="text-base shrink-0" />
                                        <span class="break-words">Maks. Peserta: <strong class="text-navy">{{
                                            category.max_participants || 'Tidak terbatas' }}</strong></span>
                                    </div>
                                    <div v-if="category.team_size > 0" class="flex items-center gap-2 min-w-0">
                                        <Icon icon="ph:users-three" class="text-base shrink-0" />
                                        <span class="break-words">Kapasitas Tim: <strong class="text-navy">{{
                                            category.team_size }} Orang</strong></span>
                                    </div>
                                    <div class="flex items-center gap-2 min-w-0">
                                        <Icon icon="ph:calendar" class="text-base shrink-0" />
                                        <span class="break-words">Dibuat: {{ formatDate(category.created_at) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="flex items-center justify-end sm:justify-start shrink-0 pt-2 sm:pt-0 border-t border-gray-100 sm:border-t-0 gap-2">
                            <BaseButton variant="white" size="sm" icon="ph:pencil" @click="openEditDialog(category)">
                                Edit
                            </BaseButton>
                            <button @click="deleteCategory(category)"
                                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group/del"
                                title="Hapus Kategori">
                                <Icon icon="ph:trash" class="text-lg group-hover/del:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="categories.length > 0" class="p-6 border-t border-gray-100">
                <BasePagination :current-page="currentPage" :total-items="totalItems" :items-per-page="limit"
                    @change-page="handlePageChange" />
            </div>
        </div>

        <!-- Create/Edit Dialog -->
        <BaseDialogForm v-model="showDialog" :header="editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'">
            <template #default>
                <div class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <BaseSelect v-model="form.division_uuid" :items="bowOptions" label="Jenis Busur"
                                placeholder="Pilih Jenis Busur" required teleport />
                        </div>
                        <div>
                            <BaseSelect v-model="form.category_uuid" :items="ageOptions" label="Kelompok Umur"
                                placeholder="Pilih Kelompok Umur" required teleport />
                        </div>
                        <div>
                            <BaseSelect v-model="form.event_type_uuid" :items="eventTypeOptions" label="Jenis Team"
                                placeholder="Pilih Jenis Team" required teleport />
                        </div>
                        <div v-if="!isMixedTeam">
                            <BaseSelect v-model="form.gender_division_uuid" :items="genderOptions" label="Divisi Gender"
                                placeholder="Pilih Divisi Gender" required teleport />
                        </div>
                        <div v-else>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700 block">Divisi Gender</label>
                                <div
                                    class="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-sm font-medium">
                                    Mixed (Otomatis)
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Maksimal Peserta (Pemanah)</label>
                            <input v-model.number="form.max_participants" type="number" min="0"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Kosongkan untuk tidak terbatas" />
                            <p class="text-[10px] text-gray-400">Total kuota pendaftar individu</p>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Anggota Per Tim</label>
                            <div class="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-navy font-bold">
                                {{ form.team_size || (isTeamEvent ? (isMixedTeam ? 2 : 3) : 1) }} Orang
                            </div>
                            <p class="text-[10px] text-gray-400">
                                {{ teamTypeDescription }}
                            </p>
                        </div>
                    </div>
                </div>
            </template>
            <template #action>
                <BaseButton variant="white" @click="closeDialog">Batal</BaseButton>
                <BaseButton variant="primary" @click="saveCategory" :loading="saving">
                    {{ editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori' }}
                </BaseButton>
            </template>
        </BaseDialogForm>

        <!-- Delete Confirmation Dialog -->
        <Teleport to="body">
            <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="showDeleteDialog"
                    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    @click.self="showDeleteDialog = false">
                    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div class="p-6">
                            <div class="flex items-start gap-4 mb-6">
                                <div class="size-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                    <Icon icon="ph:warning-bold" class="text-2xl text-red-600" />
                                </div>
                                <div>
                                    <h3 class="text-xl font-black text-navy mb-2">Hapus Kategori?</h3>
                                    <p class="text-gray-600 leading-relaxed">
                                        Apakah Anda yakin ingin menghapus kategori <strong class="text-navy">{{
                                            categoryToDelete?.division_name }} {{ categoryToDelete?.category_name
                                            }}</strong>?
                                        Tindakan ini tidak dapat dibatalkan jika berhasil.
                                    </p>
                                </div>
                            </div>
                            <div class="flex gap-3">
                                <button type="button" @click="showDeleteDialog = false"
                                    class="flex-1 px-4 py-3 border-2 border-gray-100 text-gray-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                                    Batal
                                </button>
                                <button @click="confirmDeleteCategory" :disabled="saving"
                                    class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                    <Icon v-if="saving" icon="ph:circle-notch" class="animate-spin text-lg" />
                                    <span>{{ saving ? 'Menghapus...' : 'Ya, Hapus' }}</span>
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
import BaseSelect from '~/components/common/BaseSelect.vue'
import BasePagination from '~/components/common/BasePagination.vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { getCategoryIcon, getCategoryColorClass } from '~/utils/logoArcheryCategory'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Kategori Lomba - Dashboard'
})

const route = useRoute()
const eventId = route.params.id
const { get, post, put, delete: delApi } = useApi()
const toast = useToast()

const isLoading = ref(true)
const saving = ref(false)
const categories = ref([])
const bowTypes = ref([])
const ageGroups = ref([])
const eventTypes = ref([])
const genderDivisions = ref([])
const showDialog = ref(false)
const editingCategory = ref(null)
const showDeleteDialog = ref(false)
const categoryToDelete = ref(null)

// Pagination & Filtering
const currentPage = ref(1)
const totalItems = ref(0)
const limit = ref(10)
const selectedBowType = ref('all')

const bowFilterOptions = computed(() => {
    return [
        { value: 'all', title: 'Semua Busur' },
        ...bowTypes.value.map(bow => ({ value: bow.code, title: bow.name }))
    ]
})

watch(selectedBowType, () => {
    currentPage.value = 1
    fetchCategories()
})

const bowOptions = computed(() => {
    return bowTypes.value.map(bow => ({ value: bow.id, title: bow.name }))
})

const ageOptions = computed(() => {
    return ageGroups.value.map(age => ({ value: age.id, title: age.name }))
})

const eventTypeOptions = computed(() => {
    return eventTypes.value.map(type => ({ value: type.id, title: type.name }))
})

const genderOptions = computed(() => {
    return genderDivisions.value
        .filter(gender => gender.code !== 'mixed')
        .map(gender => ({ value: gender.id, title: gender.name }))
})

const form = ref({
    division_uuid: '',
    category_uuid: '',
    event_type_uuid: '',
    gender_division_uuid: '',
    max_participants: null,
    team_size: 3,
    status: 'active'
})

const isMixedTeam = computed(() => {
    const selected = eventTypes.value.find(et => et.id === form.value.event_type_uuid)
    return selected?.name?.toLowerCase().includes('mixed') || selected?.code === 'mixed_team'
})

const isTeamEvent = computed(() => {
    const selected = eventTypes.value.find(et => et.id === form.value.event_type_uuid)
    return selected?.name?.toLowerCase() !== 'individual'
})

const teamTypeDescription = computed(() => {
    if (isMixedTeam.value) return 'Tim campuran (1 Putra + 1 Putri)'
    if (isTeamEvent.value) return 'Tim dengan gender yang sama'
    return 'Pemanah individu'
})

watch(() => form.value.event_type_uuid, (newId) => {
    if (!newId) return
    const selected = eventTypes.value.find(et => et.id === newId)
    const type = selected?.name?.toLowerCase() || ''
    if (type.includes('mixed')) {
        form.value.team_size = 2
        // Auto-select mixed gender if available
        const mixed = genderDivisions.value.find(g => g.code === 'mixed')
        if (mixed) form.value.gender_division_uuid = mixed.id
    } else if (type === 'team') {
        form.value.team_size = 3
        // If it was mixed before, clear it to force selection
        const mixed = genderDivisions.value.find(g => g.code === 'mixed')
        if (form.value.gender_division_uuid === mixed?.id) {
            form.value.gender_division_uuid = ''
        }
    } else {
        form.value.team_size = 1
        // If it was mixed before, clear it
        const mixed = genderDivisions.value.find(g => g.code === 'mixed')
        if (form.value.gender_division_uuid === mixed?.id) {
            form.value.gender_division_uuid = ''
        }
    }
})

const activeCount = computed(() => categories.value.filter(c => c.status === 'active').length)
const totalQuota = computed(() => {
    return categories.value.reduce((sum, c) => sum + (c.max_participants || 0), 0)
})

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    } catch {
        return dateStr
    }
}

const fetchCategories = async () => {
    isLoading.value = true
    try {
        const offset = (currentPage.value - 1) * limit.value
        const params = new URLSearchParams({
            limit: limit.value.toString(),
            offset: offset.toString()
        })

        if (selectedBowType.value !== 'all') {
            params.append('bow_type', selectedBowType.value)
        }

        const [categoriesRes, bowRes, ageRes, eventTypeRes, genderRes] = await Promise.all([
            get(`/events/${eventId}/categories?${params.toString()}`),
            get('/bow-types'),
            get('/age-groups'),
            get('/team-types'),
            get('/gender-divisions')
        ])
        categories.value = categoriesRes?.events || categoriesRes?.data?.events || []
        totalItems.value = categoriesRes?.total || categoriesRes?.data?.total || 0
        bowTypes.value = bowRes?.bow_types || bowRes?.data?.bow_types || []
        ageGroups.value = ageGroups.value.length > 0 ? ageGroups.value : (ageRes?.age_groups || ageRes?.data?.age_groups || [])
        eventTypes.value = eventTypes.value.length > 0 ? eventTypes.value : (eventTypeRes?.team_types || eventTypeRes?.event_types || eventTypeRes?.data?.team_types || eventTypeRes?.data?.event_types || [])
        genderDivisions.value = genderDivisions.value.length > 0 ? genderDivisions.value : (genderRes?.gender_divisions || genderRes?.data?.gender_divisions || [])
    } catch (error) {
        console.error('Failed to fetch categories:', error)
        toast.error(getApiErrorMessage(error, 'Gagal memuat kategori'))
    } finally {
        isLoading.value = false
    }
}

const handlePageChange = (page) => {
    currentPage.value = page
    fetchCategories()
}

const openCreateDialog = () => {
    editingCategory.value = null
    form.value = {
        division_uuid: '',
        category_uuid: '',
        event_type_uuid: '',
        gender_division_uuid: '',
        max_participants: null,
        team_size: 1,
        status: 'active'
    }
    showDialog.value = true
}

const openEditDialog = (category) => {
    editingCategory.value = category
    form.value = {
        division_uuid: category.division_id,
        category_uuid: category.category_id,
        event_type_uuid: category.event_type_id || '',
        gender_division_uuid: category.gender_division_id || '',
        max_participants: category.max_participants,
        team_size: category.team_size || 0,
        status: category.status || 'active'
    }
    showDialog.value = true
}

const closeDialog = () => {
    showDialog.value = false
    editingCategory.value = null
}

const deleteCategory = (category) => {
    categoryToDelete.value = category
    showDeleteDialog.value = true
}

const confirmDeleteCategory = async () => {
    if (!categoryToDelete.value) return

    saving.value = true
    try {
        await delApi(`/events/${eventId}/categories/${categoryToDelete.value.id}`)
        toast.success('Kategori berhasil dihapus')
        showDeleteDialog.value = false
        await fetchCategories()
    } catch (error) {
        console.error('Failed to delete category:', error)
        toast.error(getApiErrorMessage(error, 'Gagal menghapus kategori'))
    } finally {
        saving.value = false
    }
}

const saveCategory = async () => {
    const isMixed = isMixedTeam.value
    if (!form.value.division_uuid || !form.value.category_uuid || !form.value.event_type_uuid || (!isMixed && !form.value.gender_division_uuid)) {
        toast.error('Harap lengkapi semua field yang wajib diisi')
        return
    }

    if (isTeamEvent.value && (!form.value.team_size || form.value.team_size <= 1)) {
        toast.error('Jumlah anggota per tim harus lebih dari 1 bagi kategori beregu/mixed')
        return
    }

    saving.value = true
    try {
        const payload = {
            division_uuid: form.value.division_uuid,
            category_uuid: form.value.category_uuid,
            event_type_uuid: form.value.event_type_uuid,
            gender_division_uuid: isMixed ? (genderDivisions.value.find(g => g.code === 'mixed')?.id || form.value.gender_division_uuid) : form.value.gender_division_uuid,
            max_participants: form.value.max_participants || null,
            status: form.value.status
        }

        if (editingCategory.value) {
            await put(`/events/${eventId}/categories/${editingCategory.value.id}`, payload)
            toast.success('Kategori berhasil diperbarui')
        } else {
            await post(`/events/${eventId}/categories`, payload)
            toast.success('Kategori berhasil ditambahkan')
        }
        await fetchCategories()
        closeDialog()
    } catch (error) {
        console.error('Failed to save category:', error)
        toast.error(getApiErrorMessage(error, 'Gagal menyimpan kategori'))
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    fetchCategories()
})
</script>
