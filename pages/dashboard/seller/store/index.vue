<template>
    <div class="flex flex-col gap-8">
        <!-- Page Header -->
        <div
            class="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div
                        class="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:storefront-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">Kustomisasi Toko</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Atur profil, foto, dan informasi
                            toko Anda</p>
                    </div>
                </div>
                <BaseButton variant="primary" icon="ph:floppy-disk-bold" :loading="isSaving" @click="saveProfile"
                    class="h-10 sm:h-11 px-6 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                    Simpan Perubahan
                </BaseButton>
            </div>
        </div>

        <!-- Store Banner & Avatar Preview -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <!-- Banner -->
            <div class="relative h-44 sm:h-56 bg-gradient-to-br from-navy to-blue-800 overflow-hidden group">
                <img v-if="form.bannerUrl" :src="form.bannerUrl" class="w-full h-full object-cover" alt="Banner Toko" />
                <div
                    class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label
                        class="cursor-pointer px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl text-navy font-bold text-sm flex items-center gap-2 hover:bg-white transition-colors shadow-lg">
                        <Icon icon="ph:camera-bold" />
                        Ganti Banner
                        <input type="file" accept="image/*" class="hidden" @change="uploadBanner" />
                    </label>
                    <button v-if="form.bannerUrl" @click="form.bannerUrl = ''"
                        class="px-5 py-2.5 bg-red-500/90 backdrop-blur-sm rounded-xl text-white font-bold text-sm flex items-center gap-2 hover:bg-red-500 transition-colors shadow-lg">
                        <Icon icon="ph:trash-bold" />
                        Hapus
                    </button>
                </div>
            </div>

            <!-- Store Identity -->
            <div class="relative px-6 sm:px-8 pb-8">
                <div class="flex flex-col sm:flex-row gap-6 items-start">
                    <!-- Logo Upload -->
                    <div class="-mt-16 relative flex-shrink-0">
                        <div
                            class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden">
                            <img :src="useImageOrDefault(form.avatarUrl, form.storeName)"
                                class="w-full h-full object-cover" :alt="form.storeName" />
                        </div>
                        <label
                            class="absolute -bottom-2 -right-2 p-2.5 bg-primary rounded-full text-navy cursor-pointer hover:bg-primary-hover transition-colors shadow-md">
                            <Icon icon="ph:camera-bold" class="text-base" />
                            <input type="file" accept="image/*" class="hidden" @change="uploadAvatar" />
                        </label>
                    </div>

                    <!-- Store Name & Status -->
                    <div class="flex-1 pt-4 sm:pt-6 min-w-0">
                        <div class="flex flex-wrap items-center gap-3 mb-2">
                            <h2 class="text-xl sm:text-2xl font-black text-navy truncate">{{ displayStoreName }}</h2>
                            <span v-if="sellerData?.is_verified"
                                class="flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full shrink-0">
                                <Icon icon="ph:seal-check-fill" />
                                Terverifikasi
                            </span>
                        </div>
                        <p class="text-gray-400 text-sm font-medium">
                            archeryhub.id/store/<span class="text-primary font-bold">{{ displayStoreSlug }}</span>
                        </p>
                        <div class="flex flex-wrap gap-5 mt-4">
                            <div class="text-center">
                                <p class="text-xl font-black text-navy">{{ sellerData?.total_sales || 0 }}</p>
                                <p class="text-xs text-gray-400 font-medium">Terjual</p>
                            </div>
                            <div class="flex items-center gap-1">
                                <Icon icon="ph:star-fill" class="text-amber-400 text-lg" />
                                <div>
                                    <p class="text-xl font-black text-navy">{{ sellerData?.rating || '0.0' }}</p>
                                    <p class="text-xs text-gray-400 font-medium">Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-200 bg-white rounded-t-2xl px-2 overflow-x-auto no-scrollbar">
            <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id"
                class="px-5 py-4 text-sm font-bold transition-all relative whitespace-nowrap flex items-center gap-2"
                :class="activeTab === t.id ? 'text-primary' : 'text-gray-400 hover:text-gray-600'">
                <Icon :icon="t.icon" class="text-lg" />
                {{ t.label }}
                <div v-if="activeTab === t.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full">
                </div>
            </button>
        </div>

        <!-- Tab: Basic Info -->
        <div v-if="activeTab === 'basic'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Informasi Toko -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h3 class="font-bold text-navy flex items-center gap-2">
                    <Icon icon="ph:storefront" class="text-primary text-lg" />
                    Informasi Toko
                </h3>
                <BaseInput v-model="form.storeName" label="Nama Toko" placeholder="Masukkan nama toko"
                    icon="ph:storefront" />
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Deskripsi Toko</label>
                    <textarea v-model="form.description" rows="5"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
                        placeholder="Ceritakan tentang toko Anda, produk unggulan, dan keunggulan layanan..."></textarea>
                    <p class="text-xs text-gray-400 mt-1 font-medium">{{ (form.description || '').length }}/500 karakter
                    </p>
                </div>
                <BaseInput v-model="form.bannerUrl" label="URL Banner Toko" placeholder="https://..." icon="ph:image" />
                <BaseInput v-model="form.avatarUrl" label="URL Logo/Foto Toko" placeholder="https://..."
                    icon="ph:image-square" />
            </div>

            <!-- Kontak & Lokasi -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h3 class="font-bold text-navy flex items-center gap-2">
                    <Icon icon="ph:map-pin" class="text-primary text-lg" />
                    Kontak & Lokasi
                </h3>
                <BaseInput v-model="form.email" label="Email Toko" type="email" placeholder="toko@email.com"
                    icon="ph:envelope" />
                <BaseInput v-model="form.phone" label="Nomor WhatsApp / Telepon" placeholder="08xxxxxxxxxx"
                    icon="ph:phone" numberOnly
                    :rules="[v => !v || String(v).length >= 8 || 'Nomor HP minimal 8 digit']" />
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <BaseInput v-model="form.city" label="Kota" placeholder="Jakarta" icon="ph:buildings" />
                    <BaseInput v-model="form.province" label="Provinsi" placeholder="DKI Jakarta"
                        icon="ph:map-trifold" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Alamat Lengkap</label>
                    <textarea v-model="form.address" rows="3"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
                        placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan..."></textarea>
                </div>
            </div>
        </div>

        <!-- Tab: Page Layout -->
        <div v-if="activeTab === 'layout'" class="flex flex-col gap-6">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 class="font-bold text-navy mb-6 flex items-center gap-2">
                    <Icon icon="ph:layout" class="text-primary" />
                    Tata Letak Halaman Toko
                </h3>
                <p class="text-sm text-gray-500 mb-6 font-medium">Pilih bagian yang ingin ditampilkan kepada pengunjung
                    di halaman toko publik Anda.</p>
                <div class="space-y-4">
                    <div v-for="section in pageSections" :key="section.id"
                        class="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-primary/30 transition-all"
                        :class="section.active ? 'bg-primary/5 border-primary/20' : ''">
                        <div class="flex items-center gap-4">
                            <div class="p-2.5 rounded-xl transition-all"
                                :class="section.active ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400'">
                                <Icon :icon="section.icon" class="text-xl" />
                            </div>
                            <div>
                                <p class="font-bold text-navy text-sm">{{ section.label }}</p>
                                <p class="text-xs text-gray-400 font-medium mt-0.5">{{ section.description }}</p>
                            </div>
                        </div>
                        <button @click="section.active = !section.active"
                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                            :class="section.active ? 'bg-primary' : 'bg-gray-200'">
                            <span
                                class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform"
                                :class="section.active ? 'translate-x-6' : 'translate-x-1'"></span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Theme & Promo -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                <h3 class="font-bold text-navy flex items-center gap-2">
                    <Icon icon="ph:paint-brush" class="text-primary" />
                    Tema & Promosi
                </h3>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">Warna Tema Toko</label>
                    <div class="flex items-center flex-wrap gap-3">
                        <button v-for="color in themeColorOptions" :key="color.value"
                            @click="pageSettings.theme_color = color.value"
                            class="group flex flex-col items-center gap-1.5">
                            <div class="w-10 h-10 rounded-full border-4 transition-all shadow-sm"
                                :class="pageSettings.theme_color === color.value ? 'border-navy scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'"
                                :style="{ backgroundColor: color.value }"></div>
                            <span class="text-[10px] text-gray-400 font-medium">{{ color.label }}</span>
                        </button>
                    </div>
                </div>
                <BaseInput v-model="pageSettings.banner_text" label="Teks Promo Banner" icon="ph:megaphone"
                    placeholder="Contoh: Gratis Ongkir untuk wilayah Jabodetabek!" />
            </div>
        </div>

        <!-- Tab: Catalog Config -->
        <div v-if="activeTab === 'catalog'" class="flex flex-col gap-6">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 class="font-bold text-navy mb-2 flex items-center gap-2">
                    <Icon icon="ph:tag" class="text-primary" />
                    Kategori yang Ditampilkan
                </h3>
                <p class="text-sm text-gray-500 mb-6 font-medium">Pilih kategori produk yang tampil secara khusus di
                    halaman toko.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="cat in catalogConfig" :key="cat.id"
                        class="p-4 border border-gray-100 rounded-2xl flex items-center justify-between transition-all hover:border-primary/30"
                        :class="cat.visible ? 'bg-primary/5 border-primary/20' : ''">
                        <div class="flex items-center gap-3">
                            <div class="p-2 rounded-xl transition-all"
                                :class="cat.visible ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400'">
                                <Icon :icon="cat.icon" class="text-lg" />
                            </div>
                            <span class="font-bold text-navy text-sm">{{ cat.label }}</span>
                        </div>
                        <button @click="cat.visible = !cat.visible"
                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                            :class="cat.visible ? 'bg-primary' : 'bg-gray-200'">
                            <span
                                class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform"
                                :class="cat.visible ? 'translate-x-6' : 'translate-x-1'"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Save Bar -->
        <div class="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-sm text-gray-500 font-medium">
                <Icon icon="ph:info" class="inline text-primary mr-1" />
                Perubahan akan tampil di halaman publik toko Anda.
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" @click="resetForm">Batalkan</BaseButton>
                <BaseButton variant="primary" icon="ph:floppy-disk-bold" :loading="isSaving" @click="saveProfile">
                    Simpan Perubahan
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Kustomisasi Toko - Dashboard Seller' })

const { get, put } = useApi()
const toast = useToast()
const isSaving = ref(false)
const isLoading = ref(true)
const sellerData = ref(null)
const activeTab = ref('basic')

const displayStoreName = computed(() => form.value.storeName || 'Nama Toko')
const displayStoreSlug = computed(() => sellerData.value?.slug || 'nama-toko')

const tabs = [
    { id: 'basic', label: 'Profil Dasar', icon: 'ph:storefront' },
    { id: 'layout', label: 'Tata Letak', icon: 'ph:layout' },
    { id: 'catalog', label: 'Katalog', icon: 'ph:tag' },
]

const form = ref({
    storeName: '',
    description: '',
    email: '',
    phone: '',
    city: '',
    province: '',
    address: '',
    avatarUrl: '',
    bannerUrl: '',
})

const pageSections = ref([
    { id: 'hero', label: 'Hero Banner', description: 'Banner promo utama di halaman atas toko', icon: 'ph:image-bold', active: true },
    { id: 'featured', label: 'Produk Unggulan', description: 'Tampilkan 4 produk terbaik Anda', icon: 'ph:star-bold', active: true },
    { id: 'categories', label: 'Navigasi Kategori', description: 'Grid tombol cepat antar kategori', icon: 'ph:grid-four-bold', active: true },
    { id: 'new_arrivals', label: 'Produk Terbaru', description: 'Listing produk yang baru ditambahkan', icon: 'ph:sparkle-bold', active: true },
    { id: 'promos', label: 'Flash Sale / Promo', description: 'Blok penawaran terbatas waktu', icon: 'ph:lightning-bold', active: false },
    { id: 'about', label: 'Tentang Toko', description: 'Bagian deskripsi dan informasi toko', icon: 'ph:info-bold', active: true },
])

const catalogConfig = ref([
    { id: 'busur', label: 'Busur', icon: 'ph:arrow-arc-right', visible: true },
    { id: 'anak_panah', label: 'Anak Panah', icon: 'ph:arrow-up-right', visible: true },
    { id: 'aksesoris', label: 'Aksesoris', icon: 'ph:sparkle', visible: true },
    { id: 'pelindung', label: 'Peralatan Pelindung', icon: 'ph:shield-check', visible: true },
    { id: 'target', label: 'Target & Face', icon: 'ph:target', visible: false },
    { id: 'training', label: 'Training Tools', icon: 'ph:barbell', visible: false },
])

const pageSettings = ref({
    theme_color: '#FBBF24',
    banner_text: '',
})

const themeColorOptions = [
    { value: '#FBBF24', label: 'Emas' },
    { value: '#0EA5E9', label: 'Biru' },
    { value: '#10B981', label: 'Hijau' },
    { value: '#F43F5E', label: 'Merah' },
    { value: '#8B5CF6', label: 'Ungu' },
    { value: '#0F172A', label: 'Navy' },
]

onMounted(async () => {
    try {
        const res = await get('/sellers/me')
        if (res?.data) {
            sellerData.value = res.data
            form.value.storeName = res.data.store_name || ''
            form.value.description = res.data.description || ''
            form.value.email = res.data.email || ''
            form.value.phone = res.data.phone || ''
            form.value.city = res.data.city || ''
            form.value.province = res.data.province || ''
            form.value.address = res.data.address || ''
            form.value.avatarUrl = res.data.avatar_url || ''
            form.value.bannerUrl = res.data.banner_url || ''

            // Load page settings if present
            if (res.data.page_settings) {
                try {
                    const ps = typeof res.data.page_settings === 'string'
                        ? JSON.parse(res.data.page_settings)
                        : res.data.page_settings

                    if (ps.sections) pageSections.value = ps.sections
                    if (ps.catalog_config) catalogConfig.value = ps.catalog_config
                    if (ps.theme_color) pageSettings.value.theme_color = ps.theme_color
                    if (ps.banner_text) pageSettings.value.banner_text = ps.banner_text
                } catch (e) { /* ignore parse errors */ }
            }
        }
    } catch (e) {
        console.error('Failed to load seller profile', e)
    } finally {
        isLoading.value = false
    }
})

const saveProfile = async () => {
    isSaving.value = true
    try {
        // 1. Save basic profile info
        await put('/sellers/me', {
            store_name: form.value.storeName || undefined,
            description: form.value.description || undefined,
            email: form.value.email || undefined,
            phone: form.value.phone || undefined,
            city: form.value.city || undefined,
            province: form.value.province || undefined,
            address: form.value.address || undefined,
            avatar_url: form.value.avatarUrl || undefined,
            banner_url: form.value.bannerUrl || undefined,
        })

        // 2. Save page settings (layout, catalog, theme)
        await put('/sellers/me/page', {
            sections: pageSections.value,
            catalog_config: catalogConfig.value,
            theme_color: pageSettings.value.theme_color,
            banner_text: pageSettings.value.banner_text,
        })

        toast.success('Profil toko berhasil diperbarui!')
    } catch (error) {
        toast.error(error?.data?.error || 'Gagal menyimpan perubahan')
    } finally {
        isSaving.value = false
    }
}

const resetForm = async () => {
    // Re-load from server
    window.location.reload()
}

const uploadAvatar = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    toast.info('Fitur upload akan segera tersedia. Gunakan URL gambar untuk sementara.')
}

const uploadBanner = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    toast.info('Fitur upload akan segera tersedia. Gunakan URL gambar untuk sementara.')
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
