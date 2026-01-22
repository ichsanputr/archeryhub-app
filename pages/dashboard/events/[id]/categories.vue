<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard/events" class="hover:text-primary transition-colors">Events</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <NuxtLink :to="`/dashboard/events/${route.params.id}/overview`"
                        class="hover:text-primary transition-colors">Control Panel</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Kategori Lomba</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Kategori Lomba</h1>
                <p class="text-gray-500 font-medium mt-1">Kelola kategori lomba untuk event ini. Setiap kategori dapat memiliki maksimal peserta yang berbeda.
                </p>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" icon="ph:arrows-clockwise" class="h-11" @click="fetchCategories">
                    Muat Ulang
                </BaseButton>
                <BaseButton variant="primary" icon="ph:plus-bold" class="h-11 shadow-lg shadow-primary/20"
                    @click="openCreateDialog">
                    Tambah Kategori
                </BaseButton>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
                class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:tag" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Kategori</p>
                    <p class="text-xl font-black text-navy">{{ categories.length }}</p>
                </div>
            </div>
            <div
                class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:check-circle" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Aktif</p>
                    <p class="text-xl font-black text-navy">{{ activeCount }}</p>
                </div>
            </div>
            <div
                class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:users" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Kuota</p>
                    <p class="text-xl font-black text-navy">{{ totalQuota }}</p>
                </div>
            </div>
        </div>

        <!-- Categories List -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100">
                <h2 class="text-lg font-bold text-navy">Daftar Kategori</h2>
            </div>
            <div v-if="isLoading" class="p-12 text-center">
                <div class="inline-block h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                <p class="text-gray-500 mt-4 font-medium">Memuat kategori...</p>
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
                    class="p-6 hover:bg-gray-50 transition-colors group">
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <h3 class="text-lg font-bold text-navy">{{ category.division_name }} - {{ category.category_name }}</h3>
                                <span :class="category.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                                    class="px-2.5 py-0.5 rounded-full text-xs font-bold">
                                    {{ category.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </div>
                            <div class="flex items-center gap-6 text-sm text-gray-500">
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:users" class="text-base" />
                                    <span>Maks. Peserta: <strong class="text-navy">{{ category.max_participants || 'Tidak terbatas' }}</strong></span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:calendar" class="text-base" />
                                    <span>Dibuat: {{ formatDate(category.created_at) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <BaseButton variant="white" size="sm" icon="ph:pencil" @click="openEditDialog(category)">
                                Edit
                            </BaseButton>
                            <BaseButton variant="white" size="sm" icon="ph:trash" @click="confirmDelete(category)"
                                class="text-red-500 hover:text-red-600">
                                Hapus
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create/Edit Dialog -->
        <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            @click.self="closeDialog">
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl mx-4 p-6 space-y-6 relative">
                <div class="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h2 class="text-xl font-bold text-navy">
                        {{ editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
                    </h2>
                    <button @click="closeDialog" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <Icon icon="ph:x" class="text-2xl" />
                    </button>
                </div>

                <div class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Jenis Busur *</label>
                            <select v-model="form.division_uuid"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                <option value="">Pilih Jenis Busur</option>
                                <option v-for="bow in bowTypes" :key="bow.id" :value="bow.id">{{ bow.name }}</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Kelompok Umur *</label>
                            <select v-model="form.category_uuid"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                <option value="">Pilih Kelompok Umur</option>
                                <option v-for="age in ageGroups" :key="age.id" :value="age.id">{{ age.name }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700">Maksimal Peserta</label>
                        <input v-model.number="form.max_participants" type="number" min="0"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="Kosongkan untuk tidak terbatas" />
                        <p class="text-xs text-gray-400">Biarkan kosong jika tidak ada batasan jumlah peserta</p>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700">Status</label>
                        <select v-model="form.status"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                            <option value="active">Aktif</option>
                            <option value="inactive">Nonaktif</option>
                        </select>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <BaseButton variant="white" @click="closeDialog">Batal</BaseButton>
                    <BaseButton variant="primary" @click="saveCategory" :loading="saving">
                        {{ editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori' }}
                    </BaseButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const eventId = route.params.id
const { get, post, put, del } = useApi()
const toast = useToast()

const isLoading = ref(true)
const saving = ref(false)
const categories = ref([])
const bowTypes = ref([])
const ageGroups = ref([])
const showDialog = ref(false)
const editingCategory = ref(null)

const form = ref({
    division_uuid: '',
    category_uuid: '',
    max_participants: null,
    status: 'active'
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
        const [categoriesRes, bowRes, ageRes] = await Promise.all([
            get(`/events/${eventId}/categories`),
            get('/bow-types'),
            get('/age-groups')
        ])
        categories.value = categoriesRes?.events || categoriesRes?.data?.events || []
        bowTypes.value = bowRes?.bow_types || bowRes?.data?.bow_types || []
        ageGroups.value = ageRes?.age_groups || ageRes?.data?.age_groups || []
    } catch (error) {
        console.error('Failed to fetch categories:', error)
        toast.error('Gagal memuat kategori')
    } finally {
        isLoading.value = false
    }
}

const openCreateDialog = () => {
    editingCategory.value = null
    form.value = {
        division_uuid: '',
        category_uuid: '',
        max_participants: null,
        status: 'active'
    }
    showDialog.value = true
}

const openEditDialog = (category) => {
    editingCategory.value = category
    form.value = {
        division_uuid: category.division_id,
        category_uuid: category.category_id,
        max_participants: category.max_participants,
        status: category.status || 'active'
    }
    showDialog.value = true
}

const closeDialog = () => {
    showDialog.value = false
    editingCategory.value = null
}

const saveCategory = async () => {
    if (!form.value.division_uuid || !form.value.category_uuid) {
        toast.error('Harap pilih Jenis Busur dan Kelompok Umur')
        return
    }

    saving.value = true
    try {
        const payload = {
            division_uuid: form.value.division_uuid,
            category_uuid: form.value.category_uuid,
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
        toast.error('Gagal menyimpan kategori')
    } finally {
        saving.value = false
    }
}

const confirmDelete = async (category) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${category.division_name} - ${category.category_name}"?`)) {
        return
    }

    try {
        await del(`/events/${eventId}/categories/${category.id}`)
        toast.success('Kategori berhasil dihapus')
        await fetchCategories()
    } catch (error) {
        console.error('Failed to delete category:', error)
        toast.error('Gagal menghapus kategori')
    }
}

onMounted(() => {
    fetchCategories()
})
</script>
