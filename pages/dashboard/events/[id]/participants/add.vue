<template>
    <div class="flex flex-col gap-8 pb-12">
        <!-- Header -->
        <div class="flex flex-col gap-4">
            <Breadcrumbs :items="breadcrumbItems" current="Tambah Peserta" />

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl md:text-3xl font-extrabold text-navy tracking-tight">Tambah Peserta</h1>
                    <p class="text-gray-500 font-medium mt-1 text-sm md:text-base">Daftarkan pemanah baru atau pilih
                        yang sudah terdaftar.</p>
                </div>
                <div class="flex gap-3">
                    <BaseButton variant="white" :to="`/dashboard/events/${route.params.id}/participants`"
                        class="h-10 md:h-11 px-4 md:px-6">
                        Batal
                    </BaseButton>
                    <BaseButton variant="primary" @click="submit" :loading="isSubmitting"
                        class="h-10 md:h-11 px-4 md:px-6 shadow-lg shadow-primary/20">
                        <span class="hidden sm:inline">Simpan Peserta</span>
                        <span class="sm:hidden">Simpan</span>
                    </BaseButton>
                </div>
            </div>
        </div>

        <!-- Form -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                <!-- Step 1: Select Archer -->
                <div>
                    <h3 class="text-lg font-black text-navy mb-4 pb-4 border-b-2 border-gray-200">Pilih Pemanah</h3>
                    <div class="space-y-4">
                        <div class="flex gap-3">
                            <button @click="archerMode = 'existing'"
                                :class="archerMode === 'existing' ? 'bg-navy text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
                                class="flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-colors">
                                <span class="hidden sm:inline">Pilih Pemanah Terdaftar</span>
                                <span class="sm:hidden">Pilih Pemanah</span>
                            </button>
                            <button @click="archerMode = 'new'"
                                :class="archerMode === 'new' ? 'bg-navy text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
                                class="flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-colors">
                                <span class="hidden sm:inline">Buat Pemanah Baru</span>
                                <span class="sm:hidden">Buat Baru</span>
                            </button>
                        </div>

                        <!-- Existing Archer Selection -->
                        <div v-if="archerMode === 'existing'" class="space-y-4">
                            <!-- Selected State -->
                            <div v-if="selectedArcher"
                                class="bg-blue-50 border border-blue-100 rounded-xl p-4 relative overflow-hidden group">
                                <div class="absolute right-0 top-0 p-4 opacity-10">
                                    <Icon icon="ph:check-circle-fill" class="text-8xl text-primary" />
                                </div>
                                <div class="relative z-10 flex items-center gap-4">
                                    <div
                                        class="h-16 w-16 rounded-full bg-white flex items-center justify-center text-navy font-bold text-xl uppercase overflow-hidden border-2 border-white shadow-sm">
                                        <img :src="useImageOrDefault(selectedArcher.photo_url || selectedArcher.avatar_url, selectedArcher.full_name)"
                                            class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Pemanah
                                            Terpilih</p>
                                        <p class="font-black text-navy text-lg">{{ selectedArcher.full_name }}</p>
                                        <p class="text-sm text-gray-500 font-medium">{{ selectedArcher.club_name || '-'
                                            }}</p>
                                    </div>
                                    <button @click="selectedArcher = null"
                                        class="h-10 px-4 bg-white text-red-500 text-sm font-bold rounded-lg border border-red-100 hover:bg-red-50 transition-colors shadow-sm">
                                        Ganti
                                    </button>
                                </div>
                            </div>

                            <!-- Search State -->
                            <div v-else class="space-y-4">
                                <BaseInput v-model="searchArcherQuery" icon="ph:magnifying-glass"
                                    placeholder="Cari nama lengkap atau email pemanah..." label="Cari Pemanah" />

                                <!-- Search Results -->
                                <div v-if="searchArcherQuery && searchArcherQuery.length >= 2"
                                    class="max-h-64 overflow-y-auto border border-gray-100 rounded-xl bg-white shadow-sm">
                                    <template v-if="filteredArchers.length > 0">
                                        <button v-for="archer in filteredArchers" :key="archer.uuid || archer.id"
                                            @click="selectArcher(archer)"
                                            class="w-full p-4 text-left border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors group">
                                            <div class="flex items-center gap-3">
                                                <div
                                                    class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-xs uppercase overflow-hidden border border-gray-200 group-hover:border-primary/50 transition-colors">
                                                    <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                                                        class="w-full h-full object-cover" />
                                                </div>
                                                <div class="flex-1">
                                                    <p
                                                        class="font-bold text-navy group-hover:text-primary transition-colors">
                                                        {{ archer.full_name }}</p>
                                                    <div class="flex items-center gap-2 text-xs text-gray-400">
                                                        <span>{{ archer.club_name || 'Individual' }}</span>
                                                        <span v-if="archer.city"
                                                            class="w-1 h-1 rounded-full bg-gray-300"></span>
                                                        <span v-if="archer.city">{{ archer.city }}</span>
                                                    </div>
                                                </div>
                                                <Icon icon="ph:plus-circle-bold"
                                                    class="text-gray-300 group-hover:text-primary text-xl transition-colors" />
                                            </div>
                                        </button>
                                    </template>
                                    <!-- Empty Result State -->
                                    <div v-else class="p-8 text-center">
                                        <Icon icon="ph:user-minus" class="text-3xl text-gray-300 mx-auto mb-2" />
                                        <p class="text-sm font-bold text-gray-500">Pemanah tidak ditemukan</p>
                                        <p class="text-xs text-gray-400 mt-1">Coba kata kunci lain atau buat pemanah
                                            baru</p>
                                    </div>
                                </div>

                                <!-- Initial Search Empty State (No Query) -->
                                <div v-else-if="!searchArcherQuery && !isSearchingArchers"
                                    class="py-12 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-center">
                                    <div
                                        class="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                                        <Icon icon="ph:magnifying-glass" class="text-2xl text-gray-300" />
                                    </div>
                                    <p class="text-sm font-bold text-gray-500">Cari Pemanah Terdaftar</p>
                                    <p class="text-xs text-gray-400 max-w-[200px] mt-1">Ketik nama atau email untuk
                                        mencari data pemanah</p>
                                </div>

                                <div v-if="isSearchingArchers"
                                    class="flex items-center justify-center py-8 gap-2 text-sm text-gray-400 font-medium">
                                    <span
                                        class="inline-block h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                                    Mencari pemanah...
                                </div>
                            </div>
                        </div>

                        <!-- New Archer Form Info -->
                        <div v-if="archerMode === 'new'" class="space-y-4">
                            <div
                                class="flex items-center gap-3 text-navy font-bold p-4 border border-blue-100 bg-blue-50/50 rounded-xl text-sm">
                                <Icon icon="ph:info-bold" class="text-xl text-primary" />
                                <span>Pemanah baru akan dibuat sebagai akun Archeryhub global.</span>
                            </div>

                            <!-- Avatar Upload -->
                            <div class="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl">
                                <div
                                    class="relative w-16 h-16 rounded-full bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 group">
                                    <img v-if="newArcherForm.avatar_url" :src="newArcherForm.avatar_url"
                                        class="w-full h-full object-cover">
                                    <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                                        <Icon icon="ph:user" class="text-3xl" />
                                    </div>
                                    <button @click="showMediaLibrary = true"
                                        class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                        <Icon icon="ph:pencil-simple" />
                                    </button>
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm font-bold text-navy mb-1">Foto Profil</p>
                                    <div class="flex gap-2">
                                        <button @click="showMediaLibrary = true"
                                            class="text-xs text-primary font-bold hover:underline">
                                            {{ newArcherForm.avatar_url ? 'Ganti Foto' : 'Upload Foto' }}
                                        </button>
                                        <button v-if="newArcherForm.avatar_url" @click="newArcherForm.avatar_url = ''"
                                            class="text-xs text-red-500 font-bold hover:underline">
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BaseInput v-model="newArcherForm.full_name" label="Nama Lengkap"
                                    placeholder="Nama sesuai identitas" required @input="generateUsername" />
                                <BaseInput v-model="newArcherForm.email" label="Email" type="email"
                                    placeholder="email@example.com (opsional)" />
                                <BaseInput v-model="newArcherForm.phone" label="No. Telepon" type="tel"
                                    placeholder="08xxxxxxxxxx" />
                                <BaseInput v-model="newArcherForm.date_of_birth" label="Tanggal Lahir" type="date" />
                                <BaseSelect v-model="newArcherForm.gender" label="Jenis Kelamin"
                                    :items="genderOptions" />
                                <BaseSelect v-model="newArcherForm.bow_type" label="Jenis Busur" :items="bowOptions" />
                                <BaseInput v-model="newArcherForm.city" label="Kota" placeholder="Jakarta" />
                                <BaseInput v-model="newArcherForm.school" label="Sekolah"
                                    placeholder="Nama sekolah (opsional)" />
                            </div>
                            <BaseSelect v-model="newArcherForm.club_id" label="Klub" :items="clubOptions" />
                            <BaseTextarea v-model="newArcherForm.address" label="Alamat" placeholder="Alamat lengkap"
                                :rows="2" />
                            <p class="text-xs text-gray-400">
                                Field bertanda * wajib diisi untuk membuat pemanah baru.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 2 & 3: Sidebar Columns -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Step 2: Select Category -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="text-lg font-black text-navy mb-4 pb-4 border-b-2 border-gray-200">Kategori Lomba</h3>
                    <div class="space-y-4">
                        <BaseSelect v-model="form.category_id" label="Kategori" :items="categoryOptions" required />
                        <div v-if="selectedCategory" class="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                            <p class="text-sm font-bold text-navy mb-1">
                                {{ [
                                    selectedCategory.division_name || selectedCategory.division,
                                    selectedCategory.category_name || selectedCategory.category ||
                                    selectedCategory.age_category
                                    || selectedCategory.class_category,
                                    selectedCategory.event_type_name || selectedCategory.event_type,
                                    selectedCategory.gender_division_name || selectedCategory.gender
                                ].filter(Boolean).join(' - ') }}
                            </p>
                            <p class="text-xs text-gray-500">Kategori yang dipilih untuk peserta ini</p>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Additional Info -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="text-lg font-black text-navy mb-4 pb-4 border-b-2 border-gray-200">Informasi Tambahan
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BaseSelect v-model="form.payment_status" label="Status Pembayaran"
                            :items="paymentStatusOptions" />
                        <BaseInput v-model="form.payment_amount" label="Jumlah Pembayaran" placeholder="0"
                            kind="currency" />
                    </div>
                    <BaseTextarea v-model="form.notes" label="Catatan" placeholder="Catatan tambahan (opsional)"
                        :rows="3" class="mt-4" />
                </div>
            </div>
        </div>

    </div>

    <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleAvatarSelect" />
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import { ref, computed, onMounted, onBeforeUnmount, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

useHead({
    title: 'Tambah Peserta - ArcheryHub Dashboard'
})

const route = useRoute()
const router = useRouter()
const { get, post } = useApi()
const toast = useToast()
const { user } = useAuth()
const { setEvent, clearEvent } = useEventContext()

const event = ref(null)
const archers = ref([])
const categories = ref([])
const clubs = ref([])
const archerMode = ref('existing')

const breadcrumbItems = computed(() => [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Events', path: '/dashboard/events' },
    { label: 'Control Panel', path: `/dashboard/events/${route.params.id}/overview` },
    { label: 'Peserta', path: `/dashboard/events/${route.params.id}/participants` }
])

const searchArcherQuery = ref('')
const selectedArcher = ref(null)
const isSubmitting = ref(false)
const showMediaLibrary = ref(false)

const form = reactive({
    category_id: '',
    target_number: '',
    payment_status: 'pending',
    payment_amount: 0,
    notes: ''
})

const newArcherForm = reactive({
    full_name: '',
    username: '',
    id: '',
    email: '',
    password: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    bow_type: '',
    city: '',
    school: '',
    club_id: '',
    address: '',
    avatar_url: ''
})

const genderOptions = [
    { title: 'Pilih Jenis Kelamin', value: '' },
    { title: 'Laki-laki', value: 'M' },
    { title: 'Perempuan', value: 'F' }
]

const bowOptions = [
    { title: 'Pilih Jenis Busur', value: '' },
    { title: 'Standard', value: 'standard' },
    { title: 'Recurve', value: 'recurve' },
    { title: 'Compound', value: 'compound' },
    { title: 'Barebow', value: 'barebow' },
    { title: 'Traditional', value: 'traditional' }
]

const paymentStatusOptions = [
    { title: 'Menunggu ACC', value: 'menunggu_acc' },
    { title: 'Belum Lunas', value: 'belum_lunas' },
    { title: 'Lunas', value: 'lunas' }
]

const isSearchingArchers = ref(false)

const filteredArchers = computed(() => {
    return archers.value || []
})

const categoryOptions = computed(() => {
    return [
        { title: 'Pilih Kategori', value: '' },
        ...categories.value.map(cat => ({
            title: [
                cat.division_name || cat.division,
                cat.category_name || cat.category || cat.age_category || cat.class_category,
                cat.event_type_name || cat.event_type,
                cat.gender_division_name || cat.gender
            ].filter(Boolean).join(' - '),
            value: cat.id || cat.uuid
        }))
    ]
})

const selectedCategory = computed(() => {
    return categories.value.find(c => (c.id || c.uuid) === form.category_id)
})

const clubOptions = computed(() => {
    return [
        { title: 'Pilih Klub', value: '' },
        ...clubs.value.map(club => ({
            title: club.name,
            value: club.uuid
        }))
    ]
})

const fetchEventDetails = async () => {
    try {
        const eventRes = await get(`/events/${route.params.id}`)
        event.value = eventRes
        if (eventRes) {
            setEvent(eventRes)
        }
    } catch (error) {
        console.error('Failed to fetch event details:', error)
    }
}

const searchArchers = async (query) => {
    if (!query || query.length < 2) {
        archers.value = []
        return
    }

    isSearchingArchers.value = true
    try {
        const response = await get(`/archers?search=${encodeURIComponent(query)}&limit=10`)
        archers.value = response?.archers || []
    } catch (error) {
        console.error('Failed to search archers:', error)
    } finally {
        isSearchingArchers.value = false
    }
}

const fetchCategories = async () => {
    try {
        const response = await get(`/events/${route.params.id}/categories`)
        categories.value = response?.events || response?.categories || []
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

const fetchClubs = async () => {
    try {
        const response = await get('/clubs?limit=100')
        clubs.value = response?.data || []
    } catch (error) {
        console.error('Failed to fetch clubs:', error)
    }
}

const selectArcher = (archer) => {
    selectedArcher.value = archer
}

const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const generateUsername = () => {
    if (!newArcherForm.full_name.trim()) {
        newArcherForm.username = ''
        return
    }
    // Generate username from full name: lowercase, replace spaces with hyphens, remove special chars
    let username = newArcherForm.full_name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

    newArcherForm.username = username
}

const validateNewArcherForm = () => {
    if (!newArcherForm.full_name.trim()) {
        toast.error('Nama lengkap pemanah wajib diisi')
        return false
    }



    if (newArcherForm.email && newArcherForm.email.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(newArcherForm.email)) {
            toast.error('Format email tidak valid')
            return false
        }
    }
    if (!newArcherForm.gender) {
        toast.error('Pilih jenis kelamin pemanah')
        return false
    }
    if (!newArcherForm.bow_type) {
        toast.error('Pilih jenis busur pemanah')
        return false
    }
    return true
}

const submit = async () => {
    if (!form.category_id) {
        toast.error('Pilih kategori event terlebih dahulu')
        return
    }

    if (archerMode.value === 'existing' && !selectedArcher.value) {
        toast.error('Pilih pemanah terlebih dahulu')
        return
    }

    if (archerMode.value === 'new' && !validateNewArcherForm()) {
        return
    }

    isSubmitting.value = true

    try {
        let archerId = selectedArcher.value?.uuid || selectedArcher.value?.id

        // Create new archer if needed
        if (archerMode.value === 'new') {
            // Create global archer account
            const archerResponse = await post('/archers', {
                full_name: newArcherForm.full_name,
                username: newArcherForm.username || undefined,
                email: newArcherForm.email || undefined,
                phone: newArcherForm.phone || undefined,
                date_of_birth: newArcherForm.date_of_birth || undefined,
                gender: newArcherForm.gender || undefined,
                bow_type: newArcherForm.bow_type || undefined,
                city: newArcherForm.city || undefined,
                school: newArcherForm.school || undefined,
                club_id: newArcherForm.club_id || undefined,
                address: newArcherForm.address || undefined,
                avatar_url: newArcherForm.avatar_url || undefined,
                id: newArcherForm.id || undefined
            })
            archerId = archerResponse.uuid || archerResponse.id
        }

        // Register participant
        const payload = {
            athlete_id: archerId,
            event_category_id: form.category_id,
            payment_amount: form.payment_amount || 0
        }

        await post(`/events/${route.params.id}/participants`, payload)
        toast.success('Peserta berhasil ditambahkan')
        router.push(`/dashboard/events/${route.params.id}/participants`)
    } catch (error) {
        console.error('Failed to add participant:', error)
        const errorMessage = error?.data?.error || error?.response?.data?.error || error?.response?._data?.error || error?.message || 'Gagal menambahkan peserta'
        toast.error(errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

const handleAvatarSelect = (media) => {
    newArcherForm.avatar_url = media.url
}

let searchTimeout

watch(searchArcherQuery, (newVal) => {
    if (!newVal) {
        archers.value = []
        return
    }

    if (newVal.length < 2) {
        archers.value = []
        return
    }

    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }

    // throttle/debounce: tunggu sebentar sebelum hit API
    searchTimeout = setTimeout(() => {
        searchArchers(newVal)
    }, 400)
})

onMounted(() => {
    fetchEventDetails()
    fetchCategories()
    fetchClubs()
})

onBeforeUnmount(() => {
    clearEvent()
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }
})
</script>
