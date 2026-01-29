<template>
    <div class="flex flex-col gap-8">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="mb-2">
                    <Breadcrumbs :current="'Toko Saya'" />
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Pengaturan Toko</h1>
                <p class="text-gray-500 font-medium mt-1">Kelola profil dan informasi toko Anda.</p>
            </div>
        </div>

        <!-- Store Profile Card -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <!-- Banner -->
            <div class="relative h-48 bg-gradient-to-br from-navy to-blue-800">
                <img v-if="store.bannerUrl" :src="store.bannerUrl" class="w-full h-full object-cover" />
                <button
                    class="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-bold text-navy hover:bg-white transition-colors flex items-center gap-2">
                    <Icon icon="ph:camera" />
                    Ganti Banner
                </button>
            </div>

            <!-- Store Info -->
            <div class="relative px-8 pb-8">
                <div class="flex flex-col md:flex-row gap-6 items-start">
                    <!-- Logo -->
                    <div class="-mt-16 relative">
                        <div class="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden">
                            <img v-if="store.logoUrl" :src="store.logoUrl" class="w-full h-full object-cover" />
                            <div v-else
                                class="w-full h-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                                <span class="text-4xl font-black text-navy">{{ store.name.charAt(0) }}</span>
                            </div>
                        </div>
                        <button
                            class="absolute -bottom-2 -right-2 p-2 bg-primary rounded-full text-navy hover:bg-primary-hover transition-colors">
                            <Icon icon="ph:camera" class="text-lg" />
                        </button>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 pt-4 md:pt-6">
                        <div class="flex items-start justify-between">
                            <div>
                                <div class="flex items-center gap-3">
                                    <h2 class="text-2xl font-black text-navy">{{ store.name }}</h2>
                                    <span v-if="store.verified"
                                        class="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                        <Icon icon="ph:seal-check-fill" />
                                        Verified
                                    </span>
                                </div>
                                <p class="text-gray-500 mt-1">{{ store.slug }}</p>
                            </div>
                            <BaseButton variant="outline" icon="ph:pencil-simple">Edit</BaseButton>
                        </div>

                        <!-- Stats -->
                        <div class="flex items-center gap-6 mt-6">
                            <div class="text-center">
                                <p class="text-2xl font-bold text-navy">{{ store.products }}</p>
                                <p class="text-xs text-gray-400 font-medium">Produk</p>
                            </div>
                            <div class="h-8 w-px bg-gray-200"></div>
                            <div class="text-center">
                                <p class="text-2xl font-bold text-navy">{{ store.sales }}</p>
                                <p class="text-xs text-gray-400 font-medium">Penjualan</p>
                            </div>
                            <div class="h-8 w-px bg-gray-200"></div>
                            <div class="text-center">
                                <div class="flex items-center justify-center gap-1">
                                    <Icon icon="ph:star-fill" class="text-amber-400" />
                                    <p class="text-2xl font-bold text-navy">{{ store.rating }}</p>
                                </div>
                                <p class="text-xs text-gray-400 font-medium">Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-200">
            <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id"
                class="px-6 py-4 text-sm font-bold transition-all relative"
                :class="activeTab === t.id ? 'text-primary' : 'text-gray-400 hover:text-gray-600'">
                {{ t.label }}
                <div v-if="activeTab === t.id" class="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full">
                </div>
            </button>
        </div>

        <!-- Tab Content -->
        <div v-if="activeTab === 'basic'" class="flex flex-col gap-6">
            <!-- Store Details Form -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Basic Info -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="font-bold text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:storefront" class="text-primary" />
                        Informasi Toko
                    </h3>
                    <div class="space-y-4">
                        <BaseInput v-model="store.name" label="Nama Toko" placeholder="Nama toko Anda" />
                        <BaseInput v-model="store.slug" label="Slug URL" placeholder="nama-toko" disabled />
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-2">Deskripsi Toko</label>
                            <textarea v-model="store.description" rows="4"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
                                placeholder="Ceritakan tentang toko Anda..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- Contact Info -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="font-bold text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:phone" class="text-primary" />
                        Kontak & Lokasi
                    </h3>
                    <div class="space-y-4">
                        <BaseInput v-model="store.phone" label="Nomor Telepon" placeholder="08xx-xxxx-xxxx"
                            icon="ph:phone" />
                        <BaseInput v-model="store.email" label="Email Toko" placeholder="toko@email.com"
                            icon="ph:envelope" />
                        <BaseInput v-model="store.city" label="Kota" placeholder="Jakarta" icon="ph:map-pin" />
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-2">Alamat Lengkap</label>
                            <textarea v-model="store.address" rows="3"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
                                placeholder="Alamat lengkap toko..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'layout'" class="flex flex-col gap-6">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 class="font-bold text-navy mb-6 flex items-center gap-2">
                    <Icon icon="ph:layout" class="text-primary" />
                    Pengaturan Tata Letak Halaman
                </h3>

                <div class="space-y-6">
                    <div v-for="section in profile.sections" :key="section.id"
                        class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-primary transition-all">
                        <div class="flex items-center gap-4">
                            <div class="p-2 bg-gray-50 rounded-lg text-gray-400">
                                <Icon icon="ph:dots-six-vertical-bold" />
                            </div>
                            <div>
                                <p class="font-bold text-navy">{{ section.label }}</p>
                                <p class="text-xs text-gray-400">{{ section.description }}</p>
                            </div>
                        </div>
                        <BaseCheckbox v-model="section.active" />
                    </div>
                </div>

                <div class="mt-8 pt-6 border-t border-gray-100">
                    <BaseInput v-model="profile.banner_text" label="Teks Banner Promo"
                        placeholder="Gratis Ongkir untuk wilayah Jakarta!" />
                    <div class="mt-4">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Warna Tema Toko</label>
                        <div class="flex gap-3">
                            <button v-for="color in themeColors" :key="color" @click="profile.theme_color = color"
                                class="w-10 h-10 rounded-full border-4 transition-all"
                                :class="profile.theme_color === color ? 'border-navy shadow-lg scale-110' : 'border-transparent opacity-50'"
                                :style="{ backgroundColor: color }"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'catalog'" class="flex flex-col gap-6">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 class="font-bold text-navy mb-6 flex items-center gap-2">
                    <Icon icon="ph:tag" class="text-primary" />
                    Katalog & Kategori
                </h3>

                <p class="text-sm text-gray-500 mb-6 font-medium">Pilih kategori produk yang ingin Anda tampilkan secara
                    khusus di halaman utama toko.</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="cat in profile.catalog_config" :key="cat.id"
                        class="p-4 border border-gray-100 rounded-xl flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <Icon :icon="cat.icon" class="text-xl text-primary" />
                            <span class="font-bold text-navy text-sm">{{ cat.label }}</span>
                        </div>
                        <BaseCheckbox v-model="cat.visible" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <BaseButton variant="white">Batal</BaseButton>
            <BaseButton variant="primary" icon="ph:check" :loading="isSaving" @click="saveStore">
                Simpan Perubahan
            </BaseButton>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

const tabs = [
    { id: 'basic', label: 'Profil Dasar' },
    { id: 'layout', label: 'Tata Letak' },
    { id: 'catalog', label: 'Katalog' }
]
const activeTab = ref('basic')

const themeColors = ['#FBBF24', '#0EA5E9', '#10B981', '#F43F5E', '#8B5CF6', '#0F172A']

definePageMeta({
    title: 'Toko Saya',
    layout: 'dashboard'
})

const { user, fetchUser } = useAuth()
const { put, get } = useApi()
const toast = useToast()
const isSaving = ref(false)

// Store data reactive object
const store = ref({
    name: '',
    slug: '',
    description: '',
    logoUrl: '',
    bannerUrl: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    verified: false,
    products: 0,
    sales: 0,
    rating: 0
})

const profile = ref({
    sections: [
        { id: 'hero', label: 'Hero Banner', description: 'Banner utama di bagian atas', active: true },
        { id: 'featured', label: 'Produk Unggulan', description: 'Menampilkan 4 produk terbaik', active: true },
        { id: 'categories', label: 'Kategori Grid', description: 'Navigasi cepat per kategori', active: true },
        { id: 'new_arrivals', label: 'Produk Terbaru', description: 'Listing produk paling gres', active: true },
        { id: 'promos', label: 'Flash Sale / Promo', description: 'Blok penawaran terbatas', active: false }
    ],
    catalog_config: [
        { id: 'busur', label: 'Busur', icon: 'ph:bow', visible: true },
        { id: 'anak_panah', label: 'Anak Panah', icon: 'ph:arrow-right', visible: true },
        { id: 'aksesoris', label: 'Aksesoris', icon: 'ph:shooting-star', visible: true },
        { id: 'gear', label: 'Peralatan Pelindung', icon: 'ph:shield-check', visible: true }
    ],
    theme_color: '#FBBF24',
    banner_text: ''
})

// Initialize from user data
onMounted(async () => {
    if (user.value) {
        syncUserToStore()

        // Fetch seller specific stats and profile
        try {
            const [stats, profileData] = await Promise.all([
                get('/sellers/me/stats'),
                get('/sellers/profile')
            ])

            if (stats) {
                store.value.products = stats.total_products || 0
                store.value.sales = stats.total_sales || 0
                store.value.rating = stats.rating || 0
            }

            if (profileData && profileData.data) {
                const data = profileData.data
                // Extract from page_settings if available
                if (data.page_settings) {
                    try {
                        const parsed = typeof data.page_settings === 'string' ? JSON.parse(data.page_settings) : data.page_settings
                        if (parsed.sections) profile.value.sections = parsed.sections
                        if (parsed.catalog_config) profile.value.catalog_config = parsed.catalog_config
                        if (parsed.theme_color) profile.value.theme_color = parsed.theme_color
                        if (parsed.banner_text) profile.value.banner_text = parsed.banner_text
                    } catch (e) {
                        console.error('Failed to parse page_settings', e)
                    }
                }
                // Fallback to direct fields for backward compatibility
                if (data.sections) profile.value.sections = typeof data.sections === 'string' ? JSON.parse(data.sections) : data.sections
                if (data.catalog_config) profile.value.catalog_config = typeof data.catalog_config === 'string' ? JSON.parse(data.catalog_config) : data.catalog_config
                if (data.theme_color) profile.value.theme_color = data.theme_color
                if (data.banner_text) profile.value.banner_text = data.banner_text
            }
        } catch (error) {
            console.error('Failed to fetch seller data:', error)
        }
    }
})

const syncUserToStore = () => {
    if (!user.value) return
    store.value.name = user.value.store_name || user.value.name || ''
    store.value.slug = user.value.store_slug || user.value.slug || ''
    store.value.description = user.value.description || ''
    store.value.logoUrl = user.value.avatar_url || ''
    store.value.bannerUrl = user.value.banner_url || ''
    store.value.phone = user.value.phone || ''
    store.value.email = user.value.email || ''
    store.value.address = user.value.address || ''
    store.value.city = user.value.city || ''
    store.value.verified = user.value.is_verified || false
}

const saveStore = async () => {
    isSaving.value = true
    try {
        // Save Basic Profile and Seller Profile in parallel
        await Promise.all([
            put('/user/profile', {
                store_name: store.value.name,
                store_slug: store.value.slug,
                description: store.value.description,
                phone: store.value.phone,
                email: store.value.email,
                address: store.value.address,
                city: store.value.city,
                avatar_url: store.value.logoUrl,
                banner_url: store.value.bannerUrl
            }),
            put('/sellers/profile', {
                page_settings: JSON.stringify({
                    sections: profile.value.sections,
                    catalog_config: profile.value.catalog_config,
                    theme_color: profile.value.theme_color,
                    banner_text: profile.value.banner_text
                })
            })
        ])

        toast.success('Profil toko berhasil diperbarui!')
        await fetchUser() // Refresh global user state
    } catch (error) {
        toast.error(error.message || 'Gagal menyimpan profil toko')
    } finally {
        isSaving.value = false
    }
}
</script>
