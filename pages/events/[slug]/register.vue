<template>
    <div class="min-h-screen bg-background-light font-body text-navy pb-20">
        <!-- Loading State -->
        <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <span class="material-symbols-outlined text-4xl text-primary animate-spin mb-4">sync</span>
                <p class="text-gray-500">Memuat data...</p>
            </div>
        </div>

        <!-- Auth Guard - Not logged in -->
        <div v-else-if="!isLoggedIn" class="min-h-screen flex items-center justify-center px-4">
            <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-md w-full text-center">
                <div class="h-16 w-16 mx-auto bg-navy/5 rounded-2xl flex items-center justify-center mb-6">
                    <span class="material-symbols-outlined text-3xl text-navy">login</span>
                </div>
                <h2 class="text-2xl font-black text-navy mb-3">Login Diperlukan</h2>
                <p class="text-gray-500 mb-6">Anda perlu login sebagai atlet untuk mendaftar event ini.</p>
                <NuxtLink :to="loginUrl"
                    class="w-full block py-4 bg-primary hover:bg-primary-hover text-navy font-bold rounded-xl transition-colors shadow-md text-center mb-3">
                    Login Sekarang
                </NuxtLink>
                <NuxtLink :to="`/events/${slug}`" class="text-sm text-gray-400 hover:text-navy transition-colors">
                    ← Kembali ke Detail Event
                </NuxtLink>
            </div>
        </div>

        <!-- Auth Guard - Not an archer -->
        <div v-else-if="!isArcher" class="min-h-screen flex items-center justify-center px-4">
            <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-md w-full text-center">
                <div class="h-16 w-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
                    <span class="material-symbols-outlined text-3xl text-amber-500">warning</span>
                </div>
                <h2 class="text-2xl font-black text-navy mb-3">Akun Atlet Diperlukan</h2>
                <p class="text-gray-500 mb-6">Anda perlu terdaftar sebagai atlet untuk mendaftar event ini.</p>
                <NuxtLink to="/auth/register?type=archer"
                    class="w-full block py-4 bg-navy hover:bg-navy-light text-white font-bold rounded-xl transition-colors shadow-md text-center mb-3">
                    Daftar sebagai Atlet
                </NuxtLink>
                <NuxtLink :to="`/events/${slug}`" class="text-sm text-gray-400 hover:text-navy transition-colors">
                    ← Kembali ke Detail Event
                </NuxtLink>
            </div>
        </div>

        <!-- Registration Success State -->
        <div v-else-if="registrationSuccess" class="min-h-screen flex items-center justify-center px-4">
            <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-lg w-full text-center">
                <div class="h-20 w-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <span class="material-symbols-outlined text-4xl text-green-500">check_circle</span>
                </div>
                <h2 class="text-2xl font-black text-navy mb-3">Pendaftaran Berhasil!</h2>
                <p class="text-gray-500 mb-6">Pendaftaran Anda telah diterima dan sedang menunggu konfirmasi dari penyelenggara.</p>
                <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                    <div class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-amber-500 shrink-0">schedule</span>
                        <div class="text-left">
                            <p class="text-sm font-bold text-navy">Menunggu Konfirmasi</p>
                            <p class="text-xs text-gray-500">Anda akan menerima notifikasi setelah pendaftaran dikonfirmasi.</p>
                        </div>
                    </div>
                </div>
                <div class="flex gap-3">
                    <NuxtLink to="/dashboard/events"
                        class="flex-1 py-3 bg-primary hover:bg-primary-hover text-navy font-bold rounded-xl transition-colors text-center">
                        Lihat Status Pendaftaran
                    </NuxtLink>
                    <NuxtLink :to="`/events/${slug}`"
                        class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-navy font-bold rounded-xl transition-colors text-center">
                        Kembali
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Main Registration Flow -->
        <template v-else>
            <!-- Header -->
            <div class="bg-navy relative overflow-hidden py-8">
                <div class="absolute inset-0 z-0">
                    <div class="absolute inset-0 bg-navy/90 z-10"></div>
                    <img v-if="event.image" :alt="event.name" class="w-full h-full object-cover opacity-30 mix-blend-overlay"
                        :src="event.image" />
                </div>
                <div class="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <NuxtLink to="/events" class="hover:text-white transition-colors">Events</NuxtLink>
                        <span class="material-symbols-outlined text-base">chevron_right</span>
                        <NuxtLink :to="`/events/${slug}`" class="hover:text-white transition-colors">{{ event.name }}</NuxtLink>
                        <span class="material-symbols-outlined text-base">chevron_right</span>
                        <span class="text-primary font-medium">Konfirmasi Pendaftaran</span>
                    </nav>
                    <h1 class="text-white text-3xl font-black tracking-tight">Konfirmasi Pendaftaran</h1>
                    <p class="text-gray-300 mt-2">Periksa data Anda sebelum mendaftar</p>
                </div>
            </div>

            <!-- Main Content -->
            <main class="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 -mt-4 relative z-30">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column - Event & Profile Info -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Event Overview Card -->
                        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="p-5 border-b border-gray-100 bg-gray-50/50">
                                <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary">emoji_events</span>
                                    Informasi Event
                                </h2>
                            </div>
                            <div class="p-6 space-y-5">
                                <div class="flex items-start gap-4">
                                    <div v-if="event.image" class="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                        <img :src="event.image" :alt="event.name" class="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 class="text-xl font-black text-navy mb-2">{{ event.name }}</h3>
                                        <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <div class="flex items-center gap-1.5">
                                                <span class="material-symbols-outlined text-primary text-base">calendar_month</span>
                                                {{ event.date || 'TBA' }}
                                            </div>
                                            <div class="flex items-center gap-1.5">
                                                <span class="material-symbols-outlined text-primary text-base">location_on</span>
                                                {{ event.location || 'TBA' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="event.description" class="text-sm text-gray-600 leading-relaxed">
                                    {{ event.description }}
                                </div>
                            </div>
                        </section>

                        <!-- Archer Profile Card -->
                        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary">person</span>
                                    Data Atlet
                                </h2>
                                <NuxtLink to="/dashboard/archer/profile" class="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                                    Edit Profil
                                    <span class="material-symbols-outlined text-sm">edit</span>
                                </NuxtLink>
                            </div>
                            <div class="p-6">
                                <div class="flex items-center gap-4 mb-6">
                                    <div class="h-16 w-16 rounded-full bg-navy flex items-center justify-center text-primary font-black text-xl shrink-0 overflow-hidden">
                                        <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.name" class="w-full h-full object-cover" />
                                        <span v-else>{{ getInitials(user.name) }}</span>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-black text-navy">{{ user.name }}</h3>
                                        <p class="text-sm text-gray-500">{{ user.email }}</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-gray-50 rounded-xl p-4">
                                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Username</p>
                                        <p class="text-sm font-bold text-navy">@{{ user.username || '-' }}</p>
                                    </div>
                                    <div class="bg-gray-50 rounded-xl p-4">
                                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Klub/Pengprov</p>
                                        <p class="text-sm font-bold text-navy">{{ user.club_name || 'Belum terdaftar' }}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Category Selection -->
                        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="p-5 border-b border-gray-100 bg-gray-50/50">
                                <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary">category</span>
                                    Pilih Kategori
                                </h2>
                            </div>
                            <div class="p-6 space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <label class="text-sm font-bold text-gray-700">Divisi</label>
                                        <select v-model="form.division" required
                                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white">
                                            <option value="" disabled>Pilih Divisi</option>
                                            <option v-for="div in divisions" :key="div.id" :value="div.name">{{ div.name }}</option>
                                        </select>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-sm font-bold text-gray-700">Kategori</label>
                                        <select v-model="form.category" required
                                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white">
                                            <option value="" disabled>Pilih Kategori</option>
                                            <option v-for="cat in filteredCategories" :key="cat" :value="cat">{{ cat }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-bold text-gray-700">Jenis Busur</label>
                                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <label v-for="bow in bowTypes" :key="bow.id"
                                            class="relative flex items-center justify-center p-3 border rounded-xl cursor-pointer hover:border-primary transition-all"
                                            :class="form.bowType === bow.id ? 'border-primary bg-primary/5' : 'border-gray-200'">
                                            <input v-model="form.bowType" type="radio" :value="bow.id" class="sr-only">
                                            <span class="text-sm font-bold"
                                                :class="form.bowType === bow.id ? 'text-navy' : 'text-gray-500'">{{ bow.name }}</span>
                                            <span v-if="form.bowType === bow.id" class="absolute top-1.5 right-1.5 text-primary">
                                                <span class="material-symbols-outlined text-sm">check_circle</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <!-- Right Column - Summary & Submit -->
                    <aside class="space-y-6">
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h3 class="text-lg font-bold text-navy mb-4">Ringkasan Pendaftaran</h3>
                            <div class="space-y-3 mb-6 text-sm">
                                <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                    <span class="text-gray-500">Event</span>
                                    <span class="font-bold text-navy text-right max-w-[180px] truncate">{{ event.name }}</span>
                                </div>
                                <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                    <span class="text-gray-500">Atlet</span>
                                    <span class="font-bold text-navy">{{ user.name }}</span>
                                </div>
                                <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                    <span class="text-gray-500">Divisi</span>
                                    <span class="font-bold text-navy">{{ form.division || '-' }}</span>
                                </div>
                                <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                    <span class="text-gray-500">Kategori</span>
                                    <span class="font-bold text-navy">{{ form.category || '-' }}</span>
                                </div>
                                <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                    <span class="text-gray-500">Jenis Busur</span>
                                    <span class="font-bold text-navy">{{ getBowTypeName(form.bowType) }}</span>
                                </div>
                                <div class="flex justify-between items-center pt-2">
                                    <span class="text-base font-bold text-navy">Biaya Pendaftaran</span>
                                    <span class="text-xl font-black text-primary">{{ event.registration_fee ? `IDR ${event.registration_fee.toLocaleString()}` : 'Gratis' }}</span>
                                </div>
                            </div>

                            <button @click="handleSubmit" :disabled="loading || !isFormValid"
                                class="w-full py-4 bg-primary hover:bg-primary-hover text-navy font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="loading" class="material-symbols-outlined animate-spin">sync</span>
                                <span v-else class="material-symbols-outlined">how_to_reg</span>
                                Daftar Sekarang
                            </button>

                            <p v-if="error" class="text-center text-sm text-red-500 mt-3">{{ error }}</p>

                            <div class="mt-6 p-4 bg-gray-50 rounded-xl">
                                <div class="flex items-start gap-3">
                                    <span class="material-symbols-outlined text-blue-500 text-lg shrink-0">info</span>
                                    <p class="text-xs text-gray-500 leading-relaxed">
                                        Setelah mendaftar, Anda akan menerima konfirmasi dari penyelenggara. Pastikan data Anda sudah benar sebelum melanjutkan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </template>
    </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const router = useRouter()
const slug = route.params.slug

const { user, isLoggedIn } = useAuth()
const { get, post } = useApi()

// Auth checks
const isArcher = computed(() => user.value?.type === 'archer' || user.value?.role === 'archer')
const loginUrl = computed(() => `/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)

// State
const isLoading = ref(true)
const loading = ref(false)
const error = ref('')
const registrationSuccess = ref(false)

const event = ref({
    name: '',
    date: '',
    location: '',
    image: '',
    description: '',
    registration_fee: 0
})

const form = ref({
    division: '',
    category: '',
    bowType: 'recurve'
})

const divisions = [
    { id: 1, name: 'Recurve', categories: ["U-12", "U-15", "Umum", "Master"] },
    { id: 2, name: 'Compound', categories: ["Umum", "Master"] },
    { id: 3, name: 'Barebow', categories: ["Umum", "Master"] }
]

const bowTypes = [
    { id: 'recurve', name: 'Recurve' },
    { id: 'compound', name: 'Compound' },
    { id: 'barebow', name: 'Barebow' },
    { id: 'traditional', name: 'Traditional' }
]

const filteredCategories = computed(() => {
    const selectedDiv = divisions.find(d => d.name === form.value.division)
    return selectedDiv ? selectedDiv.categories : []
})

const isFormValid = computed(() => {
    return form.value.division && form.value.category && form.value.bowType
})

const getInitials = (name) => {
    if (!name) return '?'
    const words = name.trim().split(/\s+/)
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

const getBowTypeName = (id) => {
    const bow = bowTypes.find(b => b.id === id)
    return bow ? bow.name : '-'
}

// Fetch event data
const fetchEventData = async () => {
    try {
        isLoading.value = true
        const response = await get(`/events/${slug}`)
        if (response) {
            event.value = {
                name: response.name || response.title || 'Event',
                date: response.start_date ? `${response.start_date} - ${response.end_date || ''}` : response.date || '',
                location: response.location || response.venue || '',
                image: response.image || response.banner_url || '',
                description: response.description || '',
                registration_fee: response.registration_fee || 0
            }
        }
    } catch (err) {
        console.error('Failed to fetch event:', err)
        // Use fallback data
        event.value = {
            name: 'Event',
            date: '',
            location: '',
            image: '',
            description: '',
            registration_fee: 0
        }
    } finally {
        isLoading.value = false
    }
}

// Submit registration
const handleSubmit = async () => {
    if (!isFormValid.value) return

    loading.value = true
    error.value = ''

    try {
        await post(`/events/${slug}/register`, {
            division: form.value.division,
            category: form.value.category,
            bow_type: form.value.bowType
        })

        registrationSuccess.value = true
    } catch (err) {
        console.error('Registration failed:', err)
        error.value = err.message || 'Gagal melakukan pendaftaran. Silakan coba lagi.'
    } finally {
        loading.value = false
    }
}

// Initialize
onMounted(() => {
    if (isLoggedIn.value && isArcher.value) {
        fetchEventData()
    } else {
        isLoading.value = false
    }
})

useSeoMeta({
    title: () => `Daftar ${event.value.name} - Archeryhub.id`,
    description: () => `Konfirmasi pendaftaran untuk ${event.value.name}`
})
</script>
