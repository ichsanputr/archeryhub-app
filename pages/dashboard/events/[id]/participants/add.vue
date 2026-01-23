<template>
    <div class="flex flex-col gap-8 pb-12">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard/events" class="hover:text-primary transition-colors">Events</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <NuxtLink :to="`/dashboard/events/${route.params.id}/overview`" class="hover:text-primary transition-colors">Control Panel</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <NuxtLink :to="`/dashboard/events/${route.params.id}/participants`" class="hover:text-primary transition-colors">Peserta</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Tambah Peserta</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Tambah Peserta Event</h1>
                <p class="text-gray-500 font-medium mt-1">Daftarkan pemanah baru atau pilih pemanah yang sudah terdaftar untuk event ini.</p>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" :to="`/dashboard/events/${route.params.id}/participants`" class="h-11">
                    Batal
                </BaseButton>
                <BaseButton variant="primary" @click="submit" :loading="isSubmitting" class="h-11 shadow-lg shadow-primary/20">
                    Simpan Peserta
                </BaseButton>
            </div>
        </div>

        <!-- Form -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                <!-- Step 1: Select Archer -->
                <div>
                    <h3 class="text-lg font-black text-navy mb-4">Pilih Pemanah</h3>
                    <div class="space-y-4">
                        <div class="flex gap-3">
                            <button @click="archerMode = 'existing'"
                                :class="archerMode === 'existing' ? 'bg-navy text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
                                class="flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-colors">
                                Pilih Pemanah Terdaftar
                            </button>
                            <button @click="archerMode = 'new'"
                                :class="archerMode === 'new' ? 'bg-navy text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
                                class="flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-colors">
                                Buat Pemanah Baru
                            </button>
                        </div>

                        <!-- Existing Archer Selection -->
                        <div v-if="archerMode === 'existing'" class="space-y-4">
                            <BaseInput v-model="searchArcherQuery" icon="ph:magnifying-glass" 
                                placeholder="Cari nama atau kode pemanah..." label="Cari Pemanah" />
                            <div v-if="searchArcherQuery" class="max-h-64 overflow-y-auto border border-gray-100 rounded-xl">
                                <button v-for="archer in filteredArchers" :key="archer.id"
                                    @click="selectArcher(archer)"
                                    :class="selectedArcher?.id === archer.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'"
                                    class="w-full p-4 text-left border-b border-gray-100 last:border-b-0 transition-colors">
                                    <div class="flex items-center gap-3">
                                        <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-xs uppercase">
                                            {{ archer.full_name?.split(' ').map(n => n[0]).join('') || 'U' }}
                                        </div>
                                        <div class="flex-1">
                                            <p class="font-bold text-navy">{{ archer.full_name }}</p>
                                            <p class="text-xs text-gray-400">{{ archer.athlete_code || '-' }} • {{ archer.club_name || 'Tidak ada klub' }}</p>
                                        </div>
                                        <Icon v-if="selectedArcher?.id === archer.id" icon="ph:check-circle" class="text-primary text-xl" />
                                    </div>
                                </button>
                                <div v-if="filteredArchers.length === 0" class="p-4 text-center text-gray-400 text-sm">
                                    Tidak ada pemanah ditemukan
                                </div>
                            </div>
                        </div>

                        <!-- New Archer Form -->
                        <div v-if="archerMode === 'new'" class="space-y-4 border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BaseInput v-model="newArcherForm.full_name" label="Nama Lengkap" placeholder="Nama sesuai identitas" required />
                                <BaseInput v-model="newArcherForm.athlete_code" label="Kode Atlet" placeholder="ARC-2025-001" />
                                <BaseInput v-model="newArcherForm.email" label="Email" type="email" placeholder="email@example.com" />
                                <BaseInput v-model="newArcherForm.phone" label="No. Telepon" type="tel" placeholder="08xxxxxxxxxx" />
                                <BaseInput v-model="newArcherForm.date_of_birth" label="Tanggal Lahir" type="date" />
                                <BaseSelect v-model="newArcherForm.gender" label="Jenis Kelamin" :items="genderOptions" />
                                <BaseSelect v-model="newArcherForm.bow_type" label="Jenis Busur" :items="bowOptions" />
                                <BaseInput v-model="newArcherForm.country" label="Negara" placeholder="Indonesia" />
                            </div>
                            <BaseInput v-model="newArcherForm.club" label="Klub" placeholder="Nama klub" />
                            <BaseTextarea v-model="newArcherForm.address" label="Alamat" placeholder="Alamat lengkap" :rows="2" />
                        </div>
                    </div>
                </div>

                <!-- Step 2: Select Category -->
                <div>
                    <h3 class="text-lg font-black text-navy mb-4">Pilih Kategori Event</h3>
                    <div class="space-y-4">
                        <BaseSelect v-model="form.category_id" label="Kategori" :items="categoryOptions" required />
                        <div v-if="selectedCategory" class="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                            <p class="text-sm font-bold text-navy mb-1">{{ selectedCategory.division_name || selectedCategory.division }} - {{ selectedCategory.category_name || selectedCategory.category }}</p>
                            <p class="text-xs text-gray-500">Kategori yang dipilih untuk peserta ini</p>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Additional Info -->
                <div>
                    <h3 class="text-lg font-black text-navy mb-4">Informasi Tambahan</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BaseInput v-model="form.back_number" label="Nomor Punggung" placeholder="Opsional" type="number" />
                        <BaseInput v-model="form.target_number" label="Nomor Target" placeholder="Akan diassign otomatis" type="number" />
                        <BaseSelect v-model="form.payment_status" label="Status Pembayaran" :items="paymentStatusOptions" />
                        <BaseInput v-model="form.payment_amount" label="Jumlah Pembayaran" placeholder="0" type="number" />
                    </div>
                    <BaseTextarea v-model="form.notes" label="Catatan" placeholder="Catatan tambahan (opsional)" :rows="3" class="mt-4" />
                </div>
            </div>

            <!-- Side Card -->
            <div class="space-y-4">
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                    <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em]">Informasi Event</h3>
                    <div v-if="event">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                <Icon icon="ph:trophy" class="text-xl" />
                            </div>
                            <div>
                                <p class="font-semibold text-navy">{{ event.name }}</p>
                                <p class="text-xs text-gray-400">{{ event.code }}</p>
                            </div>
                        </div>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center gap-2 text-gray-600">
                                <Icon icon="ph:calendar" class="text-gray-400" />
                                <span>{{ formatDate(event.start_date) }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-gray-600">
                                <Icon icon="ph:map-pin" class="text-gray-400" />
                                <span>{{ event.venue || 'TBD' }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-gray-400 text-sm">Memuat informasi event...</div>
                </div>

                <div v-if="selectedArcher" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                    <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em]">Pemanah Terpilih</h3>
                    <div class="flex items-center gap-3">
                        <div class="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-sm uppercase">
                            {{ selectedArcher.full_name?.split(' ').map(n => n[0]).join('') || 'U' }}
                        </div>
                        <div>
                            <p class="font-bold text-navy">{{ selectedArcher.full_name }}</p>
                            <p class="text-xs text-gray-400">{{ selectedArcher.athlete_code || '-' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
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
const archerMode = ref('existing')
const searchArcherQuery = ref('')
const selectedArcher = ref(null)
const isSubmitting = ref(false)

const form = reactive({
    category_id: '',
    back_number: '',
    target_number: '',
    payment_status: 'pending',
    payment_amount: 0,
    notes: ''
})

const newArcherForm = reactive({
    full_name: '',
    athlete_code: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    bow_type: '',
    country: '',
    club: '',
    address: ''
})

const genderOptions = [
    { title: 'Pilih Jenis Kelamin', value: '' },
    { title: 'Laki-laki', value: 'M' },
    { title: 'Perempuan', value: 'F' }
]

const bowOptions = [
    { title: 'Pilih Jenis Busur', value: '' },
    { title: 'Recurve', value: 'recurve' },
    { title: 'Compound', value: 'compound' },
    { title: 'Barebow', value: 'barebow' },
    { title: 'Traditional', value: 'traditional' }
]

const paymentStatusOptions = [
    { title: 'Pending', value: 'pending' },
    { title: 'Paid', value: 'paid' },
    { title: 'Waived', value: 'waived' }
]

const filteredArchers = computed(() => {
    if (!searchArcherQuery.value) return []
    const q = searchArcherQuery.value.toLowerCase()
    return archers.value.filter(a =>
        a.full_name?.toLowerCase().includes(q) ||
        a.athlete_code?.toLowerCase().includes(q) ||
        a.club_name?.toLowerCase().includes(q)
    ).slice(0, 10)
})

const categoryOptions = computed(() => {
    return [
        { title: 'Pilih Kategori', value: '' },
        ...categories.value.map(cat => ({
            title: `${cat.division_name || cat.division} - ${cat.category_name || cat.category}`,
            value: cat.id || cat.uuid
        }))
    ]
})

const selectedCategory = computed(() => {
    return categories.value.find(c => (c.id || c.uuid) === form.category_id)
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

const fetchArchers = async () => {
    try {
        const response = await get('/archers')
        archers.value = response?.archers || []
    } catch (error) {
        console.error('Failed to fetch archers:', error)
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

const submit = async () => {
    if (!form.category_id) {
        toast.error('Pilih kategori event terlebih dahulu')
        return
    }

    if (archerMode.value === 'existing' && !selectedArcher.value) {
        toast.error('Pilih pemanah terlebih dahulu')
        return
    }

    if (archerMode.value === 'new' && !newArcherForm.full_name) {
        toast.error('Nama lengkap wajib diisi')
        return
    }

    isSubmitting.value = true

    try {
        let archerId = selectedArcher.value?.id

        // Create new archer if needed
        if (archerMode.value === 'new') {
            const archerResponse = await post('/archers', {
                full_name: newArcherForm.full_name,
                athlete_code: newArcherForm.athlete_code || undefined,
                email: newArcherForm.email || undefined,
                phone: newArcherForm.phone || undefined,
                date_of_birth: newArcherForm.date_of_birth || undefined,
                gender: newArcherForm.gender || undefined,
                bow_type: newArcherForm.bow_type || undefined,
                country: newArcherForm.country || undefined,
                club: newArcherForm.club || undefined,
                address: newArcherForm.address || undefined
            })
            archerId = archerResponse.id
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
        const errorMessage = error.data?.error || error.response?._data?.error || 'Gagal menambahkan peserta'
        toast.error(errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    fetchEventDetails()
    fetchArchers()
    fetchCategories()
})

onBeforeUnmount(() => {
    clearEvent()
})
</script>
