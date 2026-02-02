<template>
    <div class="min-h-screen bg-background-light font-body text-navy pb-20">
        <!-- Loading State -->
        <div v-if="pending" class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <span class="material-symbols-outlined text-4xl text-primary animate-spin mb-4">sync</span>
                <p class="text-gray-500">Memuat data...</p>
            </div>
        </div>

        <!-- Registration Success State (Maintain separate for clarity) -->
        <div v-else-if="registrationSuccess" class="min-h-screen flex items-center justify-center px-4">
            <div class="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 max-w-lg w-full text-left">
                <div class="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <span class="material-symbols-outlined text-3xl text-green-500">check_circle</span>
                </div>
                <h2 class="text-xl font-black text-navy mb-3">Pendaftaran Berhasil!</h2>
                <p class="text-xs text-gray-500 mb-6">Pendaftaran Anda telah diterima dan sedang menunggu konfirmasi
                    dari
                    penyelenggara.</p>
                <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                    <div class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-amber-500 shrink-0">schedule</span>
                        <div class="text-left">
                            <p class="text-sm font-bold text-navy">Menunggu Konfirmasi</p>
                            <p class="text-xs text-gray-500">Anda akan menerima notifikasi setelah pendaftaran
                                dikonfirmasi.</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <BaseButton to="/dashboard/events" variant="navy" size="md" block class="flex-1">
                        Lihat Status Pendaftaran
                    </BaseButton>
                    <BaseButton :to="`/events/${slug}`" variant="white" size="md" block class="flex-1">
                        Kembali
                    </BaseButton>
                </div>
            </div>
        </div>

        <!-- Main Registration Flow -->
        <template v-else>
            <!-- Hero Header (Verbatim sync from index.vue) -->
            <div class="bg-navy relative overflow-hidden h-[280px] md:h-[400px] flex items-center">
                <div class="absolute inset-0 z-0">
                    <img :alt="event.name" class="w-full h-full object-cover object-center"
                        src="/hero-event-detail.jpeg" />
                    <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                    </div>
                </div>
                <div class="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 md:mt-6">
                    <div class="flex flex-col lg:flex-row items-end justify-between gap-8 mb-12">
                        <div class="max-w-3xl">
                            <h1
                                class="text-xl md:text-2xl font-black leading-tight tracking-tight mb-4 md:mb-6 font-display text-white">
                                Registrasi {{ event.name }}
                            </h1>
                            <div class="flex flex-wrap items-center gap-2 text-white/80 text-sm sm:text-base">
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:calendar-blank" class="text-primary" />
                                    <span>{{ displayValue(event.date) }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:map-pin" class="text-primary" />
                                    <span>{{ displayValue(event.location) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <main class="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 -mt-6 relative z-30">
                <div class="grid grid-cols-1 gap-6 sm:gap-8">
                    <!-- Single Column Content -->
                    <div class="space-y-6">
                        <!-- Archer Profile Card (Data Atlet) -->
                        <section class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div
                                class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                                <h2 class="text-lg font-black text-navy flex items-center gap-3">
                                    <div
                                        class="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-navy shadow-sm">
                                        <span class="material-symbols-outlined text-lg">person</span>
                                    </div>
                                    Data Atlet
                                </h2>
                                <BaseButton v-if="isLoggedIn && isArcher" to="/dashboard/archer/profile" variant="white"
                                    size="sm" icon="edit">
                                    Edit Profil
                                </BaseButton>
                            </div>
                            <div class="p-6">
                                <!-- Not logged in state -->
                                <div v-if="!isLoggedIn"
                                    class="py-10 px-5 md:px-6 bg-gradient-to-b from-gray-50 to-white rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                                    <div class="relative mb-5">
                                        <div class="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                                        <div
                                            class="relative h-12 w-12 md:h-16 md:w-16 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 transform rotate-6 hover:rotate-0 transition-all duration-500">
                                            <span
                                                class="material-symbols-outlined text-2xl md:text-3xl text-navy">account_circle</span>
                                        </div>
                                    </div>
                                    <h3 class="text-base md:text-lg font-black text-navy mb-2">Login Diperlukan
                                    </h3>
                                    <p
                                        class="text-gray-500 mb-6 max-w-sm leading-relaxed text-[10px] md:text-sm mx-auto">
                                        Hanya satu langkah lagi! Silakan login sebagai atlet untuk mendaftar event seru
                                        ini.</p>
                                    <BaseButton :to="loginUrl" variant="navy" size="md" icon="login">
                                        Login Sekarang
                                    </BaseButton>
                                </div>

                                <!-- Not an archer state -->
                                <div v-else-if="!isArcher"
                                    class="py-10 px-5 md:px-6 bg-gradient-to-b from-gray-50 to-white rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                                    <div class="relative mb-5">
                                        <div class="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                                        <div
                                            class="relative h-12 w-12 md:h-16 md:w-16 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 transform -rotate-6 hover:rotate-0 transition-all duration-500">
                                            <span
                                                class="material-symbols-outlined text-2xl md:text-3xl text-navy">person_add</span>
                                        </div>
                                    </div>
                                    <h3 class="text-base md:text-lg font-black text-navy mb-2">Akun Atlet
                                        Diperlukan</h3>
                                    <p
                                        class="text-gray-500 mb-6 max-w-sm leading-relaxed text-[10px] md:text-sm mx-auto">
                                        Pendaftaran ini khusus untuk profil atlet. Silakan daftar sebagai atlet untuk
                                        melanjutkan.</p>
                                    <BaseButton to="/auth/register?type=archer" variant="navy" size="md"
                                        icon="how_to_reg">
                                        Daftar Sekarang
                                    </BaseButton>
                                </div>

                                <!-- Logged in and Archer state -->
                                <div v-else>
                                    <div class="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                                        <div
                                            class="h-16 w-16 md:h-16 md:w-16 rounded-2xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-primary font-black text-xl shrink-0 overflow-hidden border-2 border-white">
                                            <img :src="useImageOrDefault(archerProfile?.avatar_url, archerProfile?.full_name || user.name)"
                                                :alt="archerProfile?.full_name || user.name"
                                                class="w-full h-full object-cover" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <h3 class="text-lg font-black text-navy mb-1">{{ archerProfile?.full_name ||
                                                user.name }}</h3>
                                            <p class="text-sm text-gray-500 mb-1">{{ archerProfile?.email || user.email
                                            }}
                                            </p>
                                            <p v-if="archerProfile?.id"
                                                class="text-xs text-navy font-bold bg-gray-100 px-2 py-0.5 rounded-md inline-block">
                                                {{ archerProfile.id }}</p>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <div
                                            class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                                            <p
                                                class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                                Jenis Kelamin</p>
                                            <p class="text-sm font-bold text-navy">{{ archerProfile?.gender === 'male' ?
                                                'Pria' : archerProfile?.gender === 'female' ? 'Wanita' : '-' }}</p>
                                        </div>
                                        <div
                                            class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                                            <p
                                                class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                                Jenis Busur</p>
                                            <p class="text-sm font-bold text-navy capitalize">{{ archerProfile?.bow_type
                                                ||
                                                '-' }}</p>
                                        </div>
                                        <div
                                            class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                                            <p
                                                class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                                Pengalaman</p>
                                            <p class="text-sm font-bold text-navy">{{ archerProfile?.experience_years ||
                                                0
                                            }} Tahun</p>
                                        </div>
                                        <div
                                            class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 col-span-2">
                                            <p
                                                class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                                Klub</p>
                                            <p class="text-sm font-bold text-navy truncate">{{ archerProfile?.club_name
                                                ||
                                                'Belum terdaftar' }}</p>
                                        </div>
                                        <div v-if="archerProfile?.city"
                                            class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 col-span-2 sm:col-span-3">
                                            <p
                                                class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                                Kota/Provinsi</p>
                                            <p class="text-sm font-bold text-navy">{{ archerProfile.city }}{{
                                                archerProfile.province ? ', ' + archerProfile.province : '' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Event Overview Card (Informasi Event) -->
                        <section class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <h2 class="text-lg font-black text-navy flex items-center gap-3">
                                    <div
                                        class="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-navy shadow-sm">
                                        <span class="material-symbols-outlined text-lg">emoji_events</span>
                                    </div>
                                    Informasi Event
                                </h2>
                            </div>
                            <div class="p-6 space-y-6">
                                <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    <div v-if="event.image"
                                        class="w-full sm:w-32 h-48 sm:h-32 rounded-2xl overflow-hidden shrink-0 bg-gray-100 border-2 border-gray-100">
                                        <img :src="event.image" :alt="event.name" class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0 text-left">
                                        <h3 class="text-xl font-black text-navy mb-3 leading-tight">{{ event.name }}
                                        </h3>
                                        <div class="flex flex-wrap justify-start gap-4 text-sm">
                                            <div class="flex items-center gap-2 text-gray-600">
                                                <span
                                                    class="material-symbols-outlined text-navy text-lg">calendar_month</span>
                                                <span class="font-bold">{{ event.date || 'TBA' }}</span>
                                            </div>
                                            <div class="flex items-center gap-2 text-gray-600">
                                                <span
                                                    class="material-symbols-outlined text-navy text-lg">location_on</span>
                                                <span class="font-bold">{{ event.location || 'TBA' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="event.description" class="pt-6 border-t border-gray-100">
                                    <div class="prose max-w-none text-gray-700 leading-relaxed text-sm md:text-base"
                                        v-html="event.description"></div>
                                </div>
                            </div>
                        </section>

                        <!-- Category Selection -->
                        <section class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <h2 class="text-lg font-black text-navy flex items-center gap-3">
                                    <div
                                        class="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-navy shadow-sm">
                                        <span class="material-symbols-outlined text-lg">category</span>
                                    </div>
                                    Pilih Kategori Event
                                </h2>
                            </div>
                            <div class="p-6 space-y-5">
                                <div class="space-y-3">
                                    <label class="text-sm font-bold text-gray-700 block">Kategori *</label>
                                    <select v-model="form.category_id" required
                                        class="w-full px-4 py-3.5 text-sm rounded-xl border-2 border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/5 outline-none transition-all bg-white font-medium">
                                        <option value="" disabled>Pilih Kategori yang Sesuai</option>
                                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}
                                        </option>
                                    </select>
                                    <p class="text-xs text-gray-500">Pilih kategori sesuai dengan divisi, usia, dan
                                        jenis busur Anda</p>
                                </div>
                                <div v-if="categories.length === 0 && !pending"
                                    class="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="material-symbols-outlined text-amber-500 text-xl shrink-0">info</span>
                                        <p class="text-sm text-amber-700 font-medium">
                                            Kategori untuk event ini belum tersedia. Silakan hubungi penyelenggara untuk
                                            informasi lebih lanjut.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Payment & Summary Section -->
                        <section v-if="event.registration_fee > 0"
                            class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div
                                class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                                <h2 class="text-lg font-black text-navy flex items-center gap-3">
                                    <div
                                        class="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-navy shadow-sm">
                                        <span class="material-symbols-outlined text-lg">receipt_long</span>
                                    </div>
                                    Pembayaran & Ringkasan
                                </h2>
                            </div>
                            <div class="p-6">
                                <p class="text-sm text-gray-500 mb-6">Silakan unggah bukti transfer pembayaran sesuai
                                    dengan biaya pendaftaran yang tertera. Anda dapat mengunggah lebih dari satu foto
                                    jika diperlukan.</p>

                                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                                    <!-- Previews -->
                                    <div v-for="(img, idx) in paymentPreviews" :key="idx"
                                        class="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group">
                                        <img :src="img.url" class="w-full h-full object-cover" />
                                        <div
                                            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <BaseButton @click="removeProof(idx)" variant="danger" size="sm"
                                                icon="delete" />
                                        </div>
                                        <div v-if="img.uploading"
                                            class="absolute inset-0 bg-white/80 flex items-center justify-center">
                                            <span class="material-symbols-outlined animate-spin text-navy">sync</span>
                                        </div>
                                    </div>

                                    <!-- Add Button -->
                                    <button @click="triggerProofUpload"
                                        class="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-navy hover:bg-navy/5 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer">
                                        <div
                                            class="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform text-navy">
                                            <span class="material-symbols-outlined text-2xl">add_a_photo</span>
                                        </div>
                                        <span
                                            class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tambah
                                            Foto</span>
                                    </button>
                                </div>

                                <input ref="proofInput" type="file" multiple accept="image/*" class="hidden"
                                    @change="handleProofUpload" />

                                <div
                                    class="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl mb-6">
                                    <span class="material-symbols-outlined text-navy">info</span>
                                    <p class="text-xs text-navy/70 font-medium leading-relaxed">
                                        Pastikan bukti transfer menampilkan <strong>Nominal</strong>,
                                        <strong>Tanggal</strong>, dan <strong>Nama Pengirim</strong> dengan jelas.
                                        Format file: JPG, PNG (Maks 5MB).
                                    </p>
                                </div>

                                <!-- Payment Methods & Summary -->
                                <div class="space-y-4">
                                    <!-- Payment Methods -->
                                    <div v-if="paymentMethods.length > 0" class="pt-3 border-t border-gray-200">
                                        <p class="text-xs font-black text-gray-700 mb-3 uppercase tracking-wider">Metode
                                            Pembayaran</p>
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div v-for="method in paymentMethods" :key="method.uuid"
                                                class="flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                                                <div
                                                    class="h-8 w-8 rounded-lg bg-navy/10 flex items-center justify-center shrink-0 text-navy">
                                                    <span class="material-symbols-outlined text-base">payments</span>
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <p class="font-bold text-navy text-sm mb-1 line-clamp-1">{{
                                                        method.payment_method }}
                                                    </p>
                                                    <p v-if="method.account_name"
                                                        class="text-xs text-gray-500 mb-1 font-medium truncate">{{
                                                            method.account_name }}</p>
                                                    <p v-if="method.account_number"
                                                        class="text-xs font-mono font-bold text-navy bg-white border border-gray-200 px-2 py-1 rounded-md inline-block">
                                                        {{ method.account_number }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex items-center justify-between pt-6 border-t border-gray-100">
                                        <span class="text-sm font-black text-navy">Biaya Pendaftaran</span>
                                        <span class="text-2xl font-black text-navy">{{ event.registration_fee ? `Rp
                                            ${event.registration_fee.toLocaleString('id-ID')}` : 'Gratis' }}</span>
                                    </div>
                                </div>

                                <BaseButton @click="handleSubmit" :loading="loading" :disabled="!isFormValid"
                                    variant="navy" size="lg" block icon="how_to_reg" class="mt-8">
                                    Daftar Sekarang
                                </BaseButton>

                                <p v-if="error" class="text-sm text-red-500 mt-4 font-bold text-left">{{ error }}</p>

                                <div class="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                    <div class="flex items-start gap-3">
                                        <span class="material-symbols-outlined text-navy text-lg shrink-0">info</span>
                                        <p class="text-xs text-gray-500 leading-relaxed font-medium">
                                            Pendaftaran akan diverifikasi oleh penyelenggara dalam 1-3 hari kerja. Anda
                                            akan menerima notifikasi status pendaftaran Anda.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </template>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'blank'
})
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'
import BaseButton from '~/components/common/BaseButton.vue'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug

const { user, isLoggedIn } = useAuth()

// Helper function to display values with fallbacks
const displayValue = (value) => {
    return value || 'TBA'
}

// Auth checks
const isArcher = computed(() => user.value?.type === 'archer' || user.value?.role === 'archer')
const loginUrl = computed(() => `/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)

// State
const loading = ref(false)
const error = ref('')
const registrationSuccess = ref(false)

const form = ref({
    category_id: '',
    payment_amount: 0,
    payment_proofs: []
})

const proofInput = ref(null)
const paymentPreviews = ref([])

const triggerProofUpload = () => {
    proofInput.value?.click()
}

const handleProofUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (!files.length) return

    for (const file of files) {
        // Validation
        if (file.size > 5 * 1024 * 1024) {
            alert(`File ${file.name} terlalu besar (Maks 5MB)`)
            continue
        }

        // Create preview
        const reader = new FileReader()
        const previewId = Date.now() + Math.random()

        reader.onload = (e) => {
            paymentPreviews.value.push({
                id: previewId,
                url: e.target.result,
                uploading: true
            })
        }
        reader.readAsDataURL(file)

        // Upload to server
        const formData = new FormData()
        formData.append('file', file)

        try {
            // Use $fetch for media upload
            const response = await $fetch(`${apiBaseUrl}/media/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${useCookie('auth_token').value}`
                }
            })

            // Find and update preview
            const idx = paymentPreviews.value.findIndex(p => p.id === previewId)
            if (idx !== -1) {
                paymentPreviews.value[idx].uploading = false
                paymentPreviews.value[idx].finalUrl = response.url
            }

            form.value.payment_proofs.push(response.url)
        } catch (err) {
            console.error('Upload failed:', err)
            // Remove preview on failure
            paymentPreviews.value = paymentPreviews.value.filter(p => p.id !== previewId)
            alert(`Gagal mengunggah ${file.name}`)
        }
    }

    // Reset input
    event.target.value = ''
}

const removeProof = (index) => {
    const removedUrl = paymentPreviews.value[index].finalUrl
    paymentPreviews.value.splice(index, 1)
    form.value.payment_proofs = form.value.payment_proofs.filter(url => url !== removedUrl)
}

const isFormValid = computed(() => {
    const categorySelected = !!form.value.category_id
    const archerProfileExists = !!data.value?.archerProfile
    const paymentProofProvided = event.value.registration_fee > 0 ? form.value.payment_proofs.length > 0 : true

    return categorySelected && archerProfileExists && paymentProofProvided
})

const getInitials = (name) => {
    if (!name) return '?'
    const words = name.trim().split(/\s+/)
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

const getSelectedCategoryName = () => {
    const cat = data.value?.categories?.find(c => c.id === form.value.category_id)
    return cat ? cat.name : '-'
}

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

// Fetch event data using useAsyncData
const { data, pending, error: fetchError, refresh } = await useAsyncData(`event-register-${slug}`, async () => {
    const token = useCookie('auth_token').value
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    try {
        // Fetch event and categories concurrently
        const [eventResponse, categoriesResponse] = await Promise.all([
            $fetch(`${apiBaseUrl}/events/${slug}`),
            $fetch(`${apiBaseUrl}/events/${slug}/categories`).catch(() => ({ events: [] }))
        ])

        if (!eventResponse) return null

        const eventId = eventResponse.uuid || eventResponse.id
        const formatDate = (dateString) => {
            if (!dateString) return ''
            const d = new Date(dateString)
            return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
        }

        const eventData = {
            id: eventId,
            name: eventResponse.name || eventResponse.title || 'Event',
            date: eventResponse.start_date ? `${formatDate(eventResponse.start_date)}${eventResponse.end_date ? ' - ' + formatDate(eventResponse.end_date) : ''}` : eventResponse.date || '',
            location: eventResponse.location || eventResponse.venue || '',
            image: eventResponse.image || eventResponse.banner_url || '',
            description: eventResponse.description || '',
            registration_fee: eventResponse.entry_fee || eventResponse.registration_fee || 0
        }

        // Fetch profile and payment methods if logged in
        let archerProfileData = null
        let paymentMethodsData = []

        if (token) {
            const [profileResponse, paymentMethodsResponse] = await Promise.all([
                $fetch(`${apiBaseUrl}/archers/me`, { headers }).catch(() => $fetch(`${apiBaseUrl}/auth/me`, { headers }).catch(() => null)),
                $fetch(`${apiBaseUrl}/events/${eventId}/payment-methods`, { headers }).catch(() => [])
            ])

            archerProfileData = profileResponse
            paymentMethodsData = (Array.isArray(paymentMethodsResponse) ? paymentMethodsResponse : paymentMethodsResponse?.data || []).filter(m => m.is_active !== false)

            if (archerProfileData?.club_id && !archerProfileData.club_name) {
                try {
                    const clubRes = await $fetch(`${apiBaseUrl}/clubs/${archerProfileData.club_id}`)
                    archerProfileData.club_name = clubRes?.name || clubRes?.data?.name
                } catch (e) { }
            }
        }

        const categoriesData = (categoriesResponse.events || categoriesResponse.categories || []).map(cat => ({
            id: cat.id || cat.uuid,
            name: `${cat.division_name || cat.division || ''} - ${cat.category_name || cat.category || ''} ${cat.event_type_name ? '- ' + cat.event_type_name : ''} ${cat.gender_division_name ? '- ' + cat.gender_division_name : ''}`.trim()
        }))

        return {
            event: eventData,
            categories: categoriesData,
            archerProfile: archerProfileData,
            paymentMethods: paymentMethodsData
        }
    } catch (err) {
        console.error('Failed to fetch registration data:', err)
        throw createError({
            statusCode: 500,
            message: 'Gagal memuat data pendaftaran'
        })
    }
}, {
    server: true,
    lazy: true
})

// Computed properties for easier access
const event = computed(() => data.value?.event || {
    name: '',
    date: '',
    location: '',
    image: '',
    description: '',
    registration_fee: 0
})

const categories = computed(() => data.value?.categories || [])
const archerProfile = computed(() => data.value?.archerProfile)
const paymentMethods = computed(() => data.value?.paymentMethods || [])

// Initialize payment amount when event data is loaded
watch(() => event.value.registration_fee, (fee) => {
    if (fee && form.value.payment_amount === 0) {
        form.value.payment_amount = fee
    }
}, { immediate: true })

// Set error from fetchError
watch(fetchError, (err) => {
    if (err) {
        error.value = err.message || 'Gagal memuat data event'
    }
})

// Submit registration
const handleSubmit = async () => {
    if (!isFormValid.value) return

    loading.value = true
    error.value = ''

    try {
        const payload = {
            athlete_id: archerProfile.value?.uuid || archerProfile.value?.id || user.value?.id,
            event_category_id: form.value.category_id,
            payment_amount: form.value.payment_amount || 0,
            payment_proof_urls: form.value.payment_proofs
        }

        await $fetch(`${apiBaseUrl}/events/${event.value.id}/participants`, {
            method: 'POST',
            body: payload,
            headers: {
                'Authorization': `Bearer ${useCookie('auth_token').value}`
            }
        })

        registrationSuccess.value = true
    } catch (err) {
        console.error('Registration failed:', err)
        const errorMsg = err.response?.data?.error || err.data?.error || err.message || 'Gagal melakukan pendaftaran. Silakan coba lagi.'
        error.value = errorMsg
    } finally {
        loading.value = false
    }
}

useSeoMeta({
    title: () => `Daftar ${event.value?.name || 'Event'} - Archeryhub.id`,
    description: () => `Konfirmasi pendaftaran untuk ${event.value?.name || 'event'}`
})
</script>
