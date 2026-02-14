<template>
    <div class="min-h-screen bg-background-light font-body text-navy pb-4">
        <!-- Loading State -->
        <div v-if="pending" class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <span class="material-symbols-outlined text-4xl text-primary animate-spin mb-4">sync</span>
                <p class="text-gray-500">Memuat data...</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="fetchError" class="min-h-screen flex items-center justify-center px-4">
            <div class="text-center max-w-md">
                <div class="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span class="material-symbols-outlined text-3xl text-red-500">error</span>
                </div>
                <h2 class="text-xl font-black text-navy mb-3">Gagal Memuat Data</h2>
                <p class="text-gray-500 mb-6">{{ fetchError.message || 'Terjadi kesalahan saat memuat data event' }}</p>
                <BaseButton @click="refresh()" variant="navy" size="md">
                    Coba Lagi
                </BaseButton>
            </div>
        </div>

        <!-- No Data State -->
        <div v-else-if="!data || !data.event" class="min-h-screen flex items-center justify-center px-4">
            <div class="text-center max-w-md">
                <div class="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span class="material-symbols-outlined text-3xl text-amber-500">info</span>
                </div>
                <h2 class="text-xl font-black text-navy mb-3">Event Tidak Ditemukan</h2>
                <p class="text-gray-500 mb-6">Event yang Anda cari tidak tersedia</p>
                <BaseButton to="/events" variant="navy" size="md">
                    Lihat Event Lain
                </BaseButton>
            </div>
        </div>

        <!-- Registration Success State (Maintain separate for clarity) -->
        <div v-else-if="registrationSuccess" class="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div class="bg-white rounded-3xl p-8 md:p-12 border-2 border-gray-200 max-w-md w-full">
                <div class="flex flex-col items-center text-center mb-8">
                    <div class="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                        <Icon icon="ph:check-circle-fill" class="text-5xl text-white" />
                    </div>
                    <h2 class="text-2xl md:text-3xl font-black text-navy mb-3">Pendaftaran Berhasil!</h2>
                    <p class="text-sm text-gray-600 leading-relaxed">
                        Pendaftaran Anda telah diterima dan sedang menunggu konfirmasi dari penyelenggara.
                    </p>
                </div>

                <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-8">
                    <div class="flex items-start gap-4">
                        <div class="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
                            <Icon icon="ph:clock-fill" class="text-xl text-white" />
                        </div>
                        <div class="text-left">
                            <p class="text-sm font-black text-navy mb-1">Menunggu Konfirmasi</p>
                            <p class="text-xs text-gray-600 leading-relaxed">
                                Anda akan menerima notifikasi setelah pendaftaran dikonfirmasi oleh penyelenggara.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-3">
                    <BaseButton to="/dashboard/events" variant="navy" size="lg" block>
                        Lihat Status Pendaftaran
                    </BaseButton>
                    <BaseButton :to="`/events/${slug}`" variant="outline" size="lg" block>
                        Kembali ke Event
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
                                class="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-4 md:mb-6 font-display text-white">
                                Registrasi {{ event.name }}
                            </h1>
                            <div class="flex flex-wrap items-center gap-2 text-white/80 text-base md:text-lg">
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:calendar-blank" class="text-primary" />
                                    <span class="text-sm sm:text-base">{{ displayValue(event.date) }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:map-pin" class="text-primary" />
                                    <span class="text-sm sm:text-base">{{ displayValue(event.location) }}</span>
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
                                <div v-else class="space-y-6">
                                    <div class="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                                        <div
                                            class="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-primary font-black text-xl shrink-0 overflow-hidden border-2 border-white group relative">
                                            <img :src="useImageOrDefault(archerProfile?.avatar_url, archerProfile?.full_name || userDisplay.name)"
                                                :alt="archerProfile?.full_name || userDisplay.name"
                                                class="w-full h-full object-cover" />
                                            <div
                                                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                <span
                                                    class="material-symbols-outlined text-white text-xl">camera_alt</span>
                                            </div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <h3 class="text-xl font-black text-navy mb-1">{{ profileForm.full_name ||
                                                'Atlet Baru' }}</h3>
                                            <p class="text-sm text-gray-500 mb-2">{{ archerProfile?.email ||
                                                userDisplay.email
                                            }}</p>
                                            <div class="flex flex-wrap gap-2">
                                                <span v-if="archerProfile?.id"
                                                    class="text-[10px] text-navy font-bold bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200  tracking-wider">
                                                    ID: {{ archerProfile.id }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Form Fields for Admin Needs -->
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <BaseInput v-model="profileForm.full_name" label="Nama Lengkap"
                                            placeholder="Masukkan nama lengkap" required icon="person" />

                                        <BaseSelect v-model="profileForm.gender" :items="genderOptions"
                                            label="Jenis Kelamin" placeholder="Pilih jenis kelamin" required
                                            icon="ph:gender-intersex" />

                                        <BaseInput v-model="profileForm.date_of_birth" label="Tanggal Lahir" type="date"
                                            required icon="mingcute:calendar-line" />

                                        <BaseSelect v-model="profileForm.bow_type" :items="bowTypeOptions"
                                            label="Jenis Busur" placeholder="Pilih tipe busur" required
                                            icon="hugeicons:archer" />

                                        <BaseSelect v-model="profileForm.city" :items="cityOptions"
                                            label="Kota / Kabupaten" placeholder="Pilih kota"
                                            icon="mingcute:building-2-line" />

                                        <div class="sm:col-span-2">
                                            <BaseInput v-model="profileForm.club_name" label="Klub / Instansi"
                                                placeholder="Nama klub atau instansi asal Anda"
                                                icon="mingcute:group-line"
                                                hint="Informasi klub Anda (tidak dapat diubah di sini)" disabled
                                                readonly />
                                        </div>
                                    </div>

                                    <div class="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex gap-3">
                                        <span class="material-symbols-outlined text-navy shrink-0">info</span>
                                        <p class="text-xs text-navy/80 font-medium leading-relaxed">
                                            Data di atas sangat penting untuk administrasi dan sertifikat event.
                                            Pastikan data sudah benar sebelum melanjutkan pendaftaran.
                                        </p>
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
                        <section class="bg-white rounded-2xl border border-gray-200">
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
                                    <BaseSelect v-model="form.category_id" :items="categories" label="Kategori Event"
                                        item-title="name" item-value="id" required
                                        placeholder="Pilih Kategori yang Sesuai" icon="ph:list-bullets-bold" />
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
                                    <button v-if="isLoggedIn" @click="triggerProofUpload"
                                        class="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-navy hover:bg-navy/5 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer">
                                        <div
                                            class="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform text-navy">
                                            <span class="material-symbols-outlined text-2xl">add_a_photo</span>
                                        </div>
                                        <span class="text-[10px] font-black text-gray-400  tracking-widest">Tambah
                                            Foto</span>
                                    </button>
                                    <div v-else
                                        class="aspect-square rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center gap-2 text-center p-2 opacity-60">
                                        <span class="material-symbols-outlined text-2xl text-gray-400">lock</span>
                                        <span class="text-[9px] font-bold text-gray-400  tracking-tight">Login
                                            Pemanah <br /> untuk Unggah</span>
                                    </div>
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
                                        <p class="text-xs font-black text-gray-700 mb-3  tracking-wider">Metode
                                            Pembayaran</p>
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div v-for="method in paymentMethods" :key="method.uuid"
                                                class="flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                                                <div
                                                    class="h-8 w-8 rounded-lg bg-navy/10 flex items-center justify-center shrink-0 text-navy overflow-hidden p-1">
                                                    <img v-if="getPaymentMethodImage(method.payment_method)"
                                                        :src="getPaymentMethodImage(method.payment_method)"
                                                        class="w-full h-full object-contain"
                                                        :alt="method.payment_method" />
                                                    <span v-else
                                                        class="material-symbols-outlined text-base">payments</span>
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
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'
import { Icon } from '@iconify/vue'
import { useDateFormat } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

// Use Auth composable for authentication
const { user, isLoggedIn, archerProfile: globalArcherProfile } = useAuth()
const { upload, put, post } = useApi()

// 1. DATA FETCHING (Define 'data' early)
const { data, pending, error: fetchError, refresh } = await useAsyncData(`event-register-${slug}`, async () => {
    const token = useCookie('auth_token').value
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    const fetchOptions = { headers, credentials: 'include' }

    try {
        console.log('[SSR] Fetching event data for slug:', slug)

        // Fetch event first
        const eventResponse = await $fetch(`${apiBaseUrl}/events/${slug}`)

        if (!eventResponse) {
            console.error('[SSR] No event response')
            return null
        }

        const eventId = eventResponse.uuid || eventResponse.id
        console.log('[SSR] Event fetched:', eventId, eventResponse.name)

        // Fetch all other data concurrently
        const [categoriesResponse, bowTypesRes, citiesRes, profileResponse, paymentMethodsResponseData] = await Promise.all([
            $fetch(`${apiBaseUrl}/events/${slug}/categories`).catch(() => ({ events: [] })),
            $fetch(`${apiBaseUrl}/bow-types`).catch(() => ({ bow_types: [] })),
            $fetch(`${apiBaseUrl}/cities`).catch(() => ({ data: [] })),
            token ? $fetch(`${apiBaseUrl}/archer/me`, fetchOptions).catch(() => null) : Promise.resolve(null),
            (async () => {
                if (!token || !eventId) return []
                return $fetch(`${apiBaseUrl}/events/${eventId}/payment-methods`, fetchOptions).catch(() => [])
            })()
        ])

        const formatDate = (dateString) => {
            if (!dateString) return ''
            return useDateFormat(dateString, 'DD MMM YYYY', { locales: 'id-ID' }).value
        }

        const eventData = {
            id: eventId,
            name: eventResponse.name || eventResponse.title || 'Event',
            date: (() => {
                if (!eventResponse.start_date) return eventResponse.date || ''
                const start = formatDate(eventResponse.start_date)
                const end = eventResponse.end_date ? formatDate(eventResponse.end_date) : null
                if (!end || start === end) return start
                return `${start} - ${end}`
            })(),
            location: eventResponse.location || eventResponse.venue || '',
            image: eventResponse.image || eventResponse.banner_url || '',
            description: eventResponse.description || '',
            registration_fee: eventResponse.entry_fee || eventResponse.registration_fee || 0
        }

        // Fetch profile and payment methods if logged in
        let archerProfileData = profileResponse?.data || profileResponse

        console.log('=== ARCHER PROFILE DEBUG ===')
        console.log('Token exists:', !!token)
        console.log('Profile Response:', profileResponse)
        console.log('Profile Data:', archerProfileData)
        console.log('============================')

        // Get payment methods for this event  
        let paymentMethodsData = []
        if (token) {
            const paymentMethodsResponse = await $fetch(`${apiBaseUrl}/events/${eventId}/payment-methods`, fetchOptions).catch(() => [])
            paymentMethodsData = (Array.isArray(paymentMethodsResponse) ? paymentMethodsResponse : paymentMethodsResponse?.data || []).filter(m => m.is_active !== false)
        }

        if (archerProfileData?.club_id && !archerProfileData.club_name) {
            try {
                const clubRes = await $fetch(`${apiBaseUrl}/clubs/${archerProfileData.club_id}`)
                archerProfileData.club_name = clubRes?.name || clubRes?.data?.name
            } catch (e) { }
        }

        const categoriesData = (categoriesResponse.events || categoriesResponse.categories || []).map(cat => ({
            id: cat.id || cat.uuid,
            name: `${cat.division_name || cat.division || ''} - ${cat.category_name || cat.category || ''} ${cat.event_type_name ? '- ' + cat.event_type_name : ''} ${cat.gender_division_name ? '- ' + cat.gender_division_name : ''}`.trim()
        }))

        // Process bow types and cities
        const bowTypesOptions = (bowTypesRes.bow_types || []).map(b => ({ title: b.name, value: b.code }))
        const citiesOptions = (citiesRes.data || []).map(c => ({ title: c.name, value: c.name }))

        const result = {
            isLoggedIn: !!token || !!archerProfileData,
            event: eventData,
            categories: categoriesData,
            archerProfile: archerProfileData,
            paymentMethods: paymentMethodsData,
            bowTypes: bowTypesOptions,
            cities: citiesOptions
        }

        console.log('[SSR] Returning data:', {
            eventName: result.event.name,
            categoriesCount: result.categories.length,
            hasProfile: !!result.archerProfile
        })

        return result
    } catch (err) {
        console.error('[SSR] Failed to fetch registration data:', err)
        throw createError({
            statusCode: 500,
            message: 'Gagal memuat data pendaftaran'
        })
    }
})

// 2. REFS (Basic State)
const loading = ref(false)
const error = ref('')
const registrationSuccess = ref(false)
const bowTypeOptions = computed(() => data.value?.bowTypes || [])
const cityOptions = computed(() => data.value?.cities || [])
const proofInput = ref(null)
const paymentPreviews = ref([])

const form = ref({
    category_id: '',
    payment_amount: 0,
    payment_proofs: []
})

const profileForm = ref({
    full_name: '',
    gender: '',
    date_of_birth: '',
    city: '',
    club_name: '',
    club_id: null,
    bow_type: '',
    experience_years: 0
})

const genderOptions = [
    { title: 'Pria', value: 'male' },
    { title: 'Wanita', value: 'female' }
]

// 3. COMPUTED (Derived State)
const event = computed(() => {
    if (!data.value?.event) {
        return {
            name: '',
            date: '',
            location: '',
            image: '',
            description: '',
            registration_fee: 0
        }
    }
    return data.value.event
})

const categories = computed(() => {
    if (!data.value?.categories) return []
    return data.value.categories
})

const archerProfile = computed(() => globalArcherProfile.value || data.value?.archerProfile)
const paymentMethods = computed(() => {
    if (!data.value?.paymentMethods) return []
    return data.value.paymentMethods
})

// Simplified auth checks using useAuth composable
const isArcher = computed(() => {
    const userType = user.value?.type || user.value?.role || user.value?.user_type
    return userType === 'archer'
})

const userDisplay = computed(() => ({
    name: archerProfile.value?.full_name || user.value?.full_name || user.value?.name || '',
    email: archerProfile.value?.email || user.value?.email || '',
    avatar: archerProfile.value?.avatar_url || user.value?.avatar_url || ''
}))

const isFormValid = computed(() => {
    const categorySelected = !!form.value.category_id
    const archerProfileExists = !!archerProfile.value

    // Validasi form data atlet
    const profileComplete = !!profileForm.value.full_name &&
        !!profileForm.value.gender &&
        !!profileForm.value.date_of_birth &&
        !!profileForm.value.bow_type

    const paymentProofProvided = event.value.registration_fee > 0 ? form.value.payment_proofs.length > 0 : true

    return categorySelected && archerProfileExists && profileComplete && paymentProofProvided
})

const loginUrl = computed(() => `/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)

// 4. UTILITIES
const displayValue = (value) => value || 'TBA'

const getInitials = (name) => {
    if (!name) return '?'
    const words = name.trim().split(/\s+/)
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

const getSelectedCategoryName = () => {
    const cat = categories.value.find(c => c.id === form.value.category_id)
    return cat ? cat.name : '-'
}

const indonesianPaymentMethods = [
    { title: 'BCA (Bank Central Asia)', value: 'BCA', image: '/payment-method/bca.png', type: 'bank' },
    { title: 'Mandiri', value: 'Mandiri', image: '/payment-method/mandiri.png', type: 'bank' },
    { title: 'BNI (Bank Negara Indonesia)', value: 'BNI', image: '/payment-method/bni.png', type: 'bank' },
    { title: 'BRI (Bank Rakyat Indonesia)', value: 'BRI', image: '/payment-method/bri.png', type: 'bank' },
    { title: 'BSI (Bank Syariah Indonesia)', value: 'BSI', image: '/payment-method/bsi.png', type: 'bank' },
    { title: 'Bank Danamon', value: 'Danamon', image: '/payment-method/danamon.png', type: 'bank' },
    { title: 'GoPay', value: 'GoPay', image: '/payment-method/gopay.png', type: 'ewallet' },
    { title: 'OVO', value: 'OVO', image: '/payment-method/ovo.png', type: 'ewallet' },
    { title: 'DANA', value: 'DANA', image: '/payment-method/dana.png', type: 'ewallet' },
]

const getPaymentMethodImage = (bankName) => {
    if (!bankName) return null
    const method = indonesianPaymentMethods.find(m => m.value.toLowerCase() === bankName.toLowerCase() || bankName.toLowerCase().includes(m.value.toLowerCase()))
    return method ? method.image : null
}

// 5. HOOKS & WATCHERS
// Debug watcher for data changes
watch(() => data.value, (newData) => {
    console.log('[CLIENT] Data changed:', {
        hasData: !!newData,
        hasEvent: !!newData?.event,
        eventName: newData?.event?.name,
        eventId: newData?.event?.id
    })
}, { immediate: true })

// Populate profileForm when archerProfile changes
watch(() => archerProfile.value, (profile) => {
    console.log('=== PROFILE WATCH TRIGGERED ===')
    console.log('Profile:', profile)
    console.log('globalArcherProfile:', globalArcherProfile.value)
    console.log('data.archerProfile:', data.value?.archerProfile)
    console.log('================================')

    if (profile) {
        console.log('Populating profileForm with:', profile)
        profileForm.value = {
            full_name: profile.full_name || profile.name || '',
            gender: profile.gender || '',
            date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : '',
            city: profile.city || '',
            club_name: profile.club_name || '',
            club_id: profile.club_id || null,
            bow_type: profile.bow_type || '',
            experience_years: profile.experience_years || 0
        }
        console.log('profileForm updated:', profileForm.value)
    }
}, { immediate: true })

watch(() => event.value.registration_fee, (fee) => {
    if (fee && form.value.payment_amount === 0) {
        form.value.payment_amount = fee
    }
}, { immediate: true })

watch(fetchError, (err) => {
    if (err) {
        error.value = err.message || 'Gagal memuat data event'
    }
})

// 6. METHODS
const triggerProofUpload = () => {
    if (!isLoggedIn.value) return
    proofInput.value?.click()
}

const handleProofUpload = async (ev) => {
    const files = Array.from(ev.target.files)
    if (!files.length) return

    for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
            alert(`File ${file.name} terlalu besar (Maks 5MB)`)
            continue
        }

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

        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', 'payment-proof')

        try {
            console.log('[Upload] Starting upload for:', file.name)
            const response = await upload('/media/upload', formData)
            console.log('[Upload] Success:', response)

            const idx = paymentPreviews.value.findIndex(p => p.id === previewId)
            if (idx !== -1) {
                paymentPreviews.value[idx].uploading = false
                paymentPreviews.value[idx].finalUrl = response.url
            }
            form.value.payment_proofs.push(response.url)
        } catch (err) {
            console.error('[Upload] Failed:', err)
            paymentPreviews.value = paymentPreviews.value.filter(p => p.id !== previewId)
            const errorMsg = err?.data?.error || err?.message || 'Gagal mengunggah file'
            alert(`Upload gagal: ${errorMsg}`)
        }
    }
    ev.target.value = ''
}

const removeProof = (index) => {
    const removedUrl = paymentPreviews.value[index].finalUrl
    paymentPreviews.value.splice(index, 1)
    form.value.payment_proofs = form.value.payment_proofs.filter(url => url !== removedUrl)
}

const handleSubmit = async () => {
    if (!isFormValid.value) return

    loading.value = true
    error.value = ''

    try {
        // Update archer profile if exists
        if (archerProfile.value?.uuid) {
            await put(`/archers/${archerProfile.value.uuid}`, {
                full_name: profileForm.value.full_name,
                gender: profileForm.value.gender,
                date_of_birth: profileForm.value.date_of_birth,
                city: profileForm.value.city,
                bow_type: profileForm.value.bow_type,
                club_id: profileForm.value.club_id
            })
        }

        const athleteId = archerProfile.value?.uuid || archerProfile.value?.archer_id || archerProfile.value?.id
        if (!athleteId) {
            error.value = 'Profil pemanah tidak lengkap. Silakan lengkapi profil atau login ulang.'
            return
        }

        // Create participant registration
        const payload = {
            athlete_id: athleteId,
            event_category_id: form.value.category_id,
            payment_amount: form.value.payment_amount || 0,
            payment_proof_urls: form.value.payment_proofs
        }

        await post(`/events/${event.value.id}/participants`, payload)

        registrationSuccess.value = true
    } catch (err) {
        console.error('Registration failed:', err)
        error.value = err.response?.data?.error || err.data?.error || err.message || 'Gagal melakukan pendaftaran.'
    } finally {
        loading.value = false
    }
}

useSeoMeta({
    title: () => `Daftar ${event.value?.name || 'Event'} - Archeryhub.id`,
    description: () => `Konfirmasi pendaftaran untuk ${event.value?.name || 'event'}`
})
</script>
