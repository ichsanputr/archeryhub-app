<template>
    <div class="min-h-screen bg-background-light font-body text-navy pb-20">
        <!-- Loading State -->
        <div v-if="pending" class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <span class="material-symbols-outlined text-4xl text-primary animate-spin mb-4">sync</span>
                <p class="text-gray-500">Memuat data...</p>
            </div>
        </div>

        <!-- Auth Guard - Not logged in -->
        <div v-else-if="!isLoggedIn" class="min-h-screen flex items-center justify-center px-4">
            <div class="bg-white rounded-2xl p-8 shadow-s border border-gray-100 max-w-md w-full text-center">
                <div class="h-16 w-16 mx-auto bg-navy/5 rounded-2xl flex items-center justify-center mb-6">
                    <span class="material-symbols-outlined text-3xl text-navy">login</span>
                </div>
                <h2 class="text-2xl font-black text-navy mb-3">Login Diperlukan</h2>
                <p class="text-gray-500 mb-6">Anda perlu login sebagai atlet untuk mendaftar event ini.</p>
                <NuxtLink :to="loginUrl"
                    class="w-full block py-4 bg-primary hover:bg-primary-hover text-navy font-bold rounded-xl transition-colors text-center mb-3">
                    Login Sekarang
                </NuxtLink>
                <NuxtLink :to="`/events/${slug}`" class="text-sm text-gray-400 hover:text-navy transition-colors">
                    ← Kembali ke Detail Event
                </NuxtLink>
            </div>
        </div>

        <!-- Auth Guard - Not an archer -->
        <div v-else-if="!isArcher" class="min-h-screen flex items-center justify-center px-4">
            <div class="bg-white rounded-2xl p-8 shadow-s border border-gray-100 max-w-md w-full text-center">
                <div class="h-16 w-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
                    <span class="material-symbols-outlined text-3xl text-amber-500">warning</span>
                </div>
                <h2 class="text-2xl font-black text-navy mb-3">Akun Atlet Diperlukan</h2>
                <p class="text-gray-500 mb-6">Anda perlu terdaftar sebagai atlet untuk mendaftar event ini.</p>
                <NuxtLink to="/auth/register?type=archer"
                    class="w-full block py-4 bg-navy hover:bg-navy-light text-white font-bold rounded-xl transition-colors text-center mb-3">
                    Daftar sebagai Atlet
                </NuxtLink>
                <NuxtLink :to="`/events/${slug}`" class="text-sm text-gray-400 hover:text-navy transition-colors">
                    ← Kembali ke Detail Event
                </NuxtLink>
            </div>
        </div>

        <!-- Registration Success State -->
        <div v-else-if="registrationSuccess" class="min-h-screen flex items-center justify-center px-4">
            <div class="bg-white rounded-2xl p-8 shadow-s border border-gray-100 max-w-lg w-full text-center">
                <div class="h-20 w-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <span class="material-symbols-outlined text-4xl text-green-500">check_circle</span>
                </div>
                <h2 class="text-2xl font-black text-navy mb-3">Pendaftaran Berhasil!</h2>
                <p class="text-gray-500 mb-6">Pendaftaran Anda telah diterima dan sedang menunggu konfirmasi dari
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
            <div class="bg-gradient-to-br from-navy via-navy to-navy-light relative overflow-hidden py-12 sm:py-16">
                <div class="absolute inset-0 z-0">
                    <div class="absolute inset-0 bg-navy/95 z-10"></div>
                    <img v-if="event.image" :alt="event.name"
                        class="w-full h-full object-cover opacity-20 mix-blend-overlay" :src="event.image" />
                    <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent z-10"></div>
                </div>
                <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav class="flex items-center gap-2 text-sm text-gray-300 mb-6">
                        <NuxtLink to="/events" class="hover:text-white transition-colors font-medium">Events</NuxtLink>
                        <span class="material-symbols-outlined text-base text-gray-400">chevron_right</span>
                        <NuxtLink :to="`/events/${slug}`"
                            class="hover:text-white transition-colors font-medium truncate max-w-[200px] sm:max-w-none">
                            {{ event.name }}</NuxtLink>
                        <span class="material-symbols-outlined text-base text-gray-400">chevron_right</span>
                        <span class="text-primary font-bold">Konfirmasi Pendaftaran</span>
                    </nav>
                    <div class="flex items-start gap-4">
                        <div class="flex-1">
                            <h1 class="text-white text-3xl sm:text-4xl font-black tracking-tight mb-3">Konfirmasi
                                Pendaftaran</h1>
                            <p class="text-gray-300 text-base sm:text-lg">Periksa data Anda sebelum mendaftar ke event
                                ini</p>
                        </div>
                        <NuxtLink :to="`/events/${slug}`"
                            class="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white font-bold text-sm transition-all border border-white/20">
                            <span class="material-symbols-outlined text-lg">arrow_back</span>
                            Kembali
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 -mt-6 relative z-30">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    <!-- Left Column - Event & Profile Info -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Event Overview Card -->
                        <section class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <h2 class="text-xl font-black text-navy flex items-center gap-3">
                                    <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <span class="material-symbols-outlined text-primary text-xl">emoji_events</span>
                                    </div>
                                    Informasi Event
                                </h2>
                            </div>
                            <div class="p-6 space-y-6">
                                <div class="flex items-start gap-6">
                                    <div v-if="event.image"
                                        class="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100 shadow-s border-2 border-gray-100">
                                        <img :src="event.image" :alt="event.name" class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h3 class="text-2xl font-black text-navy mb-3 leading-tight">{{ event.name }}
                                        </h3>
                                        <div class="flex flex-wrap gap-4 text-sm">
                                            <div class="flex items-center gap-2 text-gray-600">
                                                <span
                                                    class="material-symbols-outlined text-primary text-lg">calendar_month</span>
                                                <span class="font-semibold">{{ event.date || 'TBA' }}</span>
                                            </div>
                                            <div class="flex items-center gap-2 text-gray-600">
                                                <span
                                                    class="material-symbols-outlined text-primary text-lg">location_on</span>
                                                <span class="font-semibold">{{ event.location || 'TBA' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="event.description" class="pt-4 border-t border-gray-100">
                                    <p class="text-sm text-gray-700 leading-relaxed">{{ event.description }}</p>
                                </div>
                            </div>
                        </section>

                        <!-- Archer Profile Card -->
                        <section class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div
                                class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                                <h2 class="text-xl font-black text-navy flex items-center gap-3">
                                    <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <span class="material-symbols-outlined text-primary text-xl">person</span>
                                    </div>
                                    Data Atlet
                                </h2>
                                <NuxtLink to="/dashboard/archer/profile"
                                    class="text-sm text-primary font-bold hover:text-primary-hover transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary/5">
                                    <span class="material-symbols-outlined text-base">edit</span>
                                    Edit Profil
                                </NuxtLink>
                            </div>
                            <div class="p-6">
                                <div class="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                                    <div
                                        class="h-20 w-20 rounded-2xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-primary font-black text-2xl shrink-0 overflow-hidden border-2 border-white">
                                        <img v-if="archerProfile?.avatar_url" :src="archerProfile.avatar_url"
                                            :alt="archerProfile.full_name" class="w-full h-full object-cover" />
                                        <span v-else>{{ getInitials(archerProfile?.full_name || user.name) }}</span>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h3 class="text-xl font-black text-navy mb-1">{{ archerProfile?.full_name ||
                                            user.name }}</h3>
                                        <p class="text-sm text-gray-500 mb-1">{{ archerProfile?.email || user.email }}
                                        </p>
                                        <p v-if="archerProfile?.athlete_code"
                                            class="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md inline-block">
                                            {{ archerProfile.athlete_code }}</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div
                                        class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                            Jenis Kelamin</p>
                                        <p class="text-sm font-bold text-navy">{{ archerProfile?.gender === 'male' ?
                                            'Pria' : archerProfile?.gender === 'female' ? 'Wanita' : '-' }}</p>
                                    </div>
                                    <div
                                        class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                            Jenis Busur</p>
                                        <p class="text-sm font-bold text-navy capitalize">{{ archerProfile?.bow_type ||
                                            '-' }}</p>
                                    </div>
                                    <div
                                        class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                            Pengalaman</p>
                                        <p class="text-sm font-bold text-navy">{{ archerProfile?.experience_years || 0
                                            }} Tahun</p>
                                    </div>
                                    <div
                                        class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 col-span-2">
                                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                            Klub</p>
                                        <p class="text-sm font-bold text-navy truncate">{{ archerProfile?.club_name ||
                                            'Belum terdaftar' }}</p>
                                    </div>
                                    <div v-if="archerProfile?.city"
                                        class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 col-span-2 sm:col-span-3">
                                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                            Kota/Provinsi</p>
                                        <p class="text-sm font-bold text-navy">{{ archerProfile.city }}{{
                                            archerProfile.province ? ', ' + archerProfile.province : '' }}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Payment Proof Upload -->
                        <section v-if="event.registration_fee > 0"
                            class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div
                                class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                                <h2 class="text-xl font-black text-navy flex items-center gap-3">
                                    <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <span class="material-symbols-outlined text-primary text-xl">upload_file</span>
                                    </div>
                                    Unggah Bukti Pembayaran
                                </h2>
                            </div>
                            <div class="p-6">
                                <p class="text-sm text-gray-500 mb-6">Silakan unggah bukti transfer pembayaran sesuai
                                    dengan biaya pendaftaran yang tertera. Anda dapat mengunggah lebih dari satu foto
                                    jika diperlukan.</p>

                                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                                    <!-- Previews -->
                                    <div v-for="(img, idx) in paymentPreviews" :key="idx"
                                        class="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group shadow-sm">
                                        <img :src="img.url" class="w-full h-full object-cover" />
                                        <div
                                            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button @click="removeProof(idx)"
                                                class="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg">
                                                <span class="material-symbols-outlined text-base">delete</span>
                                            </button>
                                        </div>
                                        <div v-if="img.uploading"
                                            class="absolute inset-0 bg-white/80 flex items-center justify-center">
                                            <span
                                                class="material-symbols-outlined animate-spin text-primary">sync</span>
                                        </div>
                                    </div>

                                    <!-- Add Button -->
                                    <button @click="triggerProofUpload"
                                        class="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer">
                                        <div
                                            class="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <span
                                                class="material-symbols-outlined text-2xl text-primary">add_a_photo</span>
                                        </div>
                                        <span
                                            class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tambah
                                            Foto</span>
                                    </button>
                                </div>

                                <input ref="proofInput" type="file" multiple accept="image/*" class="hidden"
                                    @change="handleProofUpload" />

                                <div
                                    class="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                                    <span class="material-symbols-outlined text-primary">info</span>
                                    <p class="text-xs text-navy/70 font-medium leading-relaxed">
                                        Pastikan bukti transfer menampilkan <strong>Nominal</strong>,
                                        <strong>Tanggal</strong>, and <strong>Nama Pengirim</strong> dengan jelas.
                                        Format file: JPG, PNG (Maks 5MB).
                                    </p>
                                </div>
                            </div>
                        </section>

                        <!-- Category Selection -->
                        <section class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <h2 class="text-xl font-black text-navy flex items-center gap-3">
                                    <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <span class="material-symbols-outlined text-primary text-xl">category</span>
                                    </div>
                                    Pilih Kategori Event
                                </h2>
                            </div>
                            <div class="p-6 space-y-5">
                                <div class="space-y-3">
                                    <label class="text-sm font-bold text-gray-700 block">Kategori *</label>
                                    <select v-model="form.category_id" required
                                        class="w-full px-4 py-3.5 text-sm rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white font-medium">
                                        <option value="" disabled>Pilih Kategori yang Sesuai</option>
                                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}
                                        </option>
                                    </select>
                                    <p class="text-xs text-gray-500">Pilih kategori sesuai dengan divisi, usia, dan
                                        jenis busur Anda</p>
                                </div>
                                <div v-if="categories.length === 0 && !pending"
                                    class="p-4 bg-amber-50 border-2 border-amber-100 rounded-xl">
                                    <div class="flex items-start gap-3">
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
                    </div>

                    <!-- Right Column - Summary & Submit -->
                    <aside class="space-y-6">
                        <div class="bg-white rounded-2xl p-6 shadow-s border-2 border-gray-200 lg:sticky lg:top-6">
                            <h3 class="text-xl font-black text-navy mb-5 flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary text-xl">receipt_long</span>
                                Ringkasan Pendaftaran
                            </h3>
                            <div class="space-y-4 mb-6">
                                <!-- Payment Methods -->
                                <div v-if="paymentMethods.length > 0" class="pt-3 border-t border-gray-200">
                                    <p class="text-xs font-black text-gray-700 mb-3 uppercase tracking-wider">Metode
                                        Pembayaran</p>
                                    <div class="space-y-2.5">
                                        <div v-for="method in paymentMethods" :key="method.uuid"
                                            class="flex items-start gap-3 p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                                            <div
                                                class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <span
                                                    class="material-symbols-outlined text-primary text-base">payments</span>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <p class="font-bold text-navy text-sm mb-1">{{ method.payment_method }}
                                                </p>
                                                <p v-if="method.account_name" class="text-xs text-gray-600 mb-0.5">{{
                                                    method.account_name }}</p>
                                                <p v-if="method.account_number"
                                                    class="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded inline-block">
                                                    {{ method.account_number }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex justify-between items-center pt-3 border-t-2 border-primary/20">
                                    <span class="text-base font-black text-navy">Biaya Pendaftaran</span>
                                    <span class="text-2xl font-black text-primary">{{ event.registration_fee ? `Rp
                                        ${event.registration_fee.toLocaleString('id-ID')}` : 'Gratis' }}</span>
                                </div>
                            </div>

                            <button @click="handleSubmit" :disabled="loading || !isFormValid"
                                class="w-full py-4 bg-primary hover:bg-primary-hover text-navy font-black text-base rounded-xl transition-all shadow-s hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="loading" class="material-symbols-outlined animate-spin text-xl">sync</span>
                                <span v-else class="material-symbols-outlined text-xl">how_to_reg</span>
                                Daftar Sekarang
                            </button>

                            <p v-if="error" class="text-center text-sm text-red-500 mt-3 font-medium">{{ error }}</p>

                            <div class="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <div class="flex items-start gap-3">
                                    <span class="material-symbols-outlined text-blue-500 text-lg shrink-0">info</span>
                                    <p class="text-xs text-gray-600 leading-relaxed font-medium">
                                        Setelah mendaftar, Anda akan menerima konfirmasi dari penyelenggara. Pastikan
                                        data Anda sudah benar sebelum melanjutkan.
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
            const response = await post('/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
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

// Fetch event data using useAsyncData
const { data, pending, error: fetchError, refresh } = await useAsyncData(`event-register-${slug}`, async () => {
    const { user: authUser, isLoggedIn: authLoggedIn } = useAuth()
    const { get: apiGet } = useApi()

    // Check auth status
    const isUserArcher = authUser.value?.type === 'archer' || authUser.value?.role === 'archer'
    if (!authLoggedIn.value || !isUserArcher) {
        return {
            event: null,
            categories: [],
            archerProfile: null,
            paymentMethods: []
        }
    }

    try {
        const [eventResponse, categoriesResponse, profileResponse] = await Promise.all([
            apiGet(`/events/${slug}`),
            apiGet(`/events/${slug}/categories`),
            apiGet('/archers/me').catch(() => apiGet('/auth/me').catch(() => null))
        ])

        let eventData = null
        let paymentMethodsData = []

        if (eventResponse) {
            const eventId = eventResponse.uuid || eventResponse.id
            eventData = {
                id: eventId,
                name: eventResponse.name || eventResponse.title || 'Event',
                date: eventResponse.start_date ? `${new Date(eventResponse.start_date).toLocaleDateString('id-ID')} - ${eventResponse.end_date ? new Date(eventResponse.end_date).toLocaleDateString('id-ID') : ''}` : eventResponse.date || '',
                location: eventResponse.location || eventResponse.venue || '',
                image: eventResponse.image || eventResponse.banner_url || '',
                description: eventResponse.description || '',
                registration_fee: eventResponse.entry_fee || eventResponse.registration_fee || 0
            }

            // Fetch payment methods using event UUID
            try {
                const paymentMethodsResponse = await apiGet(`/events/${eventId}/payment-methods`).catch(() => apiGet(`/events/${slug}/payment-methods`).catch(() => ({ data: [] })))
                if (paymentMethodsResponse) {
                    paymentMethodsData = (paymentMethodsResponse.data || paymentMethodsResponse || []).filter(m => m.is_active !== false)
                }
            } catch (err) {
                console.log('Failed to fetch payment methods:', err)
            }
        }

        let categoriesData = []
        if (categoriesResponse) {
            categoriesData = (categoriesResponse.events || categoriesResponse.categories || []).map(cat => ({
                id: cat.id || cat.uuid,
                name: `${cat.division_name || cat.division || ''} - ${cat.category_name || cat.category || ''} ${cat.event_type_name ? '- ' + cat.event_type_name : ''} ${cat.gender_division_name ? '- ' + cat.gender_division_name : ''}`.trim()
            }))
        }

        let archerProfileData = profileResponse || null
        // Fetch club name if club_id exists
        if (archerProfileData?.club_id && !archerProfileData.club_name) {
            try {
                const clubRes = await apiGet(`/clubs/${archerProfileData.club_id}`)
                if (clubRes) {
                    archerProfileData.club_name = clubRes.name || clubRes.data?.name
                }
            } catch (err) {
                console.log('Club not found')
            }
        }

        return {
            event: eventData,
            categories: categoriesData,
            archerProfile: archerProfileData,
            paymentMethods: paymentMethodsData
        }
    } catch (err) {
        console.error('Failed to fetch event:', err)
        throw createError({
            statusCode: 500,
            message: 'Gagal memuat data event'
        })
    }
}, {
    server: false,
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

        await post(`/events/${event.value.id}/participants`, payload)

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
