<template>
    <div class="flex flex-col gap-8 relative">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="space-y-4">
                    <div class="flex items-center gap-2 text-[10px] sm:text-xs font-black tracking-widest text-primary/80">
                        <NuxtLink to="/dashboard/root" class="text-white hover:text-primary transition-colors">{{ t('root.index.root_terminal', 'Root Terminal') }}</NuxtLink>
                        <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
                        <span class="text-primary">{{ t('sidebar.docs', 'Documentation') }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                            <Icon icon="ph:book-bookmark-bold" class="text-primary text-2xl sm:text-3xl" />
                        </div>
                        <div>
                            <h1 class="text-xl sm:text-3xl font-black tracking-tight">{{ t('root.docs.title', 'Knowledge Base & Docs Management') }}</h1>
                            <div class="text-slate-300 text-[10px] sm:text-sm font-medium mt-1">
                                {{ t('root.docs.subtitle', 'Kelola artikel dokumentasi, panduan pengguna, dan konten bilingual Archeris.') }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <a href="/docs" target="_blank">
                        <BaseButton variant="outline" icon="ph:arrow-square-out-bold" class="!text-white !border-white/20 hover:!bg-white/10">
                            {{ t('root.docs.view_docs_site', 'Buka Web Docs') }}
                        </BaseButton>
                    </a>
                    <NuxtLink to="/dashboard/root/docs/create">
                        <BaseButton variant="primary" icon="ph:plus-bold" class="shadow-lg shadow-primary/20">
                            {{ t('root.docs.create_button', 'Tambah Dokumen') }}
                        </BaseButton>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Documentation List Table -->
        <DashboardDataTable
            :items="filteredDocs"
            :columns="tableColumns"
            :loading="loading"
            :searchable="true"
            search-placeholder="Cari judul panduan atau slug URL..."
            count-icon="ph:book-bookmark-bold"
            count-unit="Dokumen"
            :show-reset-button="true"
            empty-title="Belum ada artikel dokumentasi"
            empty-description="Tambahkan artikel panduan baru untuk membantu pengguna Archeris."
            empty-icon="ph:book-open-bold"
            :items-per-page="itemsPerPage"
            :initial-sort-by="sortBy"
            :initial-sort-order="sortOrder"
            @search="searchQuery = $event"
            @sort="toggleSort($event.sortBy)"
            @reset-filters="resetFilters"
        >
            <!-- Inline Filters: Category Select -->
            <template #inline-filters>
                <div class="flex items-center gap-2 flex-wrap">
                    <div class="w-48 sm:w-56">
                        <select v-model="categoryFilter"
                            class="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-navy text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer">
                            <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
                                {{ cat.label }}
                            </option>
                        </select>
                    </div>
                </div>
            </template>

            <!-- Doc Title & Icon Column Slot -->
            <template #item-title="{ item }">
                <div class="flex items-start gap-3.5 py-1">
                    <div class="size-11 sm:size-12 rounded-2xl bg-navy/5 border border-navy/10 flex items-center justify-center shrink-0 shadow-2xs">
                        <Icon :icon="item.icon || 'ph:file-text-bold'" class="text-xl text-navy" />
                    </div>
                    <div class="space-y-0.5 min-w-0">
                        <NuxtLink :to="`/dashboard/root/docs/${item.base_slug}`"
                            class="font-bold text-xs sm:text-sm text-navy hover:text-primary transition-colors line-clamp-1 block">
                            {{ item.title_id || item.title_en || item.base_slug }}
                        </NuxtLink>
                        <div class="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                            <span class="font-mono text-slate-500">/docs/{{ item.slug }}</span>
                            <span>•</span>
                            <span>{{ item.readTime || '5 min' }}</span>
                            <span>•</span>
                            <span>Urutan: #{{ item.order }}</span>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Category Column Slot -->
            <template #item-category="{ item }">
                <span class="px-2.5 py-1 rounded-lg bg-navy/5 text-navy text-xs font-bold whitespace-nowrap">
                    {{ formatCategory(item.category) }}
                </span>
            </template>

            <!-- Languages Column Slot -->
            <template #item-languages="{ item }">
                <div class="flex items-center gap-1.5">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold"
                        :class="item.has_id ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'">
                        <Icon icon="circle-flags:id" class="text-xs" />
                        <span>ID</span>
                    </span>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold"
                        :class="item.has_en ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'">
                        <Icon icon="circle-flags:us" class="text-xs" />
                        <span>EN</span>
                    </span>
                </div>
            </template>

            <!-- Updated At Column Slot -->
            <template #item-updated_at="{ item }">
                <div class="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    {{ formatDate(item.updated_at) }}
                </div>
            </template>

            <!-- Actions Column Slot -->
            <template #item-actions="{ item }">
                <div class="flex items-center justify-end gap-1.5">
                    <a :href="`/docs/${item.slug}`" target="_blank"
                        class="p-2 rounded-xl text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors"
                        title="Buka Halaman Publik">
                        <Icon icon="ph:arrow-square-out-bold" class="text-base" />
                    </a>
                    <NuxtLink :to="`/dashboard/root/docs/${item.base_slug}`"
                        class="p-2 rounded-xl text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors"
                        title="Edit Dokumen">
                        <Icon icon="ph:pencil-simple-bold" class="text-base" />
                    </NuxtLink>
                    <button type="button" @click="confirmDelete(item)"
                        class="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Dokumen">
                        <Icon icon="ph:trash-bold" class="text-base" />
                    </button>
                </div>
            </template>
        </DashboardDataTable>

        <!-- Delete Confirmation Modal -->
        <div v-if="docToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6">
                <div class="size-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl shadow-xs">
                    <Icon icon="ph:trash-bold" />
                </div>
                <div class="text-center space-y-2">
                    <h3 class="text-lg font-black text-navy">Hapus Artikel Dokumentasi?</h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                        Apakah Anda yakin ingin menghapus panduan <strong class="text-navy">"{{ docToDelete.title_id || docToDelete.title_en || docToDelete.base_slug }}"</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <BaseButton variant="outline" block @click="docToDelete = null" :disabled="isDeleting">
                        Batal
                    </BaseButton>
                    <BaseButton variant="danger" block @click="handleDelete" :loading="isDeleting">
                        Hapus Sekarang
                    </BaseButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

const { t } = useI18n()
const toast = useToast()
const { get, del } = useApi()

useHead({
    title: 'Manajemen Dokumentasi - Archeris Root'
})

const loading = ref(true)
const docs = ref([])
const searchQuery = ref('')
const categoryFilter = ref('all')
const sortBy = ref('order')
const sortOrder = ref('asc')
const itemsPerPage = ref(15)

const docToDelete = ref(null)
const isDeleting = ref(false)

const categoryOptions = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'accounts', label: 'Accounts & Profile' },
    { value: 'tournaments', label: 'Tournaments' },
    { value: 'scorekeeper', label: 'Scorekeeper' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'elimination', label: 'Elimination' },
    { value: 'reporting', label: 'Reporting' },
]

const tableColumns = [
    { key: 'title', label: 'Artikel Panduan', sortable: true },
    { key: 'category', label: 'Kategori', sortable: true },
    { key: 'languages', label: 'Bahasa', sortable: false },
    { key: 'updated_at', label: 'Terakhir Diubah', sortable: true },
    { key: 'actions', label: 'Aksi', sortable: false, align: 'right' }
]

const fetchDocs = async () => {
    loading.value = true
    try {
        const res = await get('/root/dashboard/docs')
        docs.value = res?.docs || []
    } catch (err) {
        console.error('Fetch docs failed:', err)
        toast.error('Gagal memuat daftar dokumentasi')
    } finally {
        loading.value = false
    }
}

const filteredDocs = computed(() => {
    let list = [...docs.value]

    if (categoryFilter.value && categoryFilter.value !== 'all') {
        list = list.filter(d => d.category === categoryFilter.value)
    }

    if (searchQuery.value && searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim()
        list = list.filter(d => 
            (d.title_id && d.title_id.toLowerCase().includes(q)) ||
            (d.title_en && d.title_en.toLowerCase().includes(q)) ||
            (d.base_slug && d.base_slug.toLowerCase().includes(q)) ||
            (d.category && d.category.toLowerCase().includes(q))
        )
    }

    return list
})

const formatCategory = (cat) => {
    const map = {
        accounts: 'Accounts & Profile',
        tournaments: 'Tournaments',
        scorekeeper: 'Scorekeeper',
        qualification: 'Qualification',
        elimination: 'Elimination',
        reporting: 'Reporting'
    }
    return map[cat] || cat
}

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
        const d = new Date(dateStr)
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    } catch {
        return dateStr
    }
}

const toggleSort = (key) => {
    if (sortBy.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortBy.value = key
        sortOrder.value = 'asc'
    }
}

const resetFilters = () => {
    searchQuery.value = ''
    categoryFilter.value = 'all'
    sortBy.value = 'order'
    sortOrder.value = 'asc'
}

const confirmDelete = (item) => {
    docToDelete.value = item
}

const handleDelete = async () => {
    if (!docToDelete.value) return
    isDeleting.value = true
    try {
        await del(`/root/dashboard/docs/${docToDelete.value.base_slug}`)
        toast.success('Artikel dokumentasi berhasil dihapus')
        docToDelete.value = null
        await fetchDocs()
    } catch (err) {
        console.error('Delete doc failed:', err)
        toast.error('Gagal menghapus dokumentasi')
    } finally {
        isDeleting.value = false
    }
}

onMounted(() => {
    fetchDocs()
})
</script>
