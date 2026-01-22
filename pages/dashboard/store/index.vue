<template>
    <div class="flex flex-col gap-8">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Toko Saya</span>
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

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3">
            <BaseButton variant="white">Batal</BaseButton>
            <BaseButton variant="primary" icon="ph:check" :loading="isSaving" @click="saveStore">
                Simpan Perubahan
            </BaseButton>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { useToast } from '~/composables/useToast'

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

// Initialize from user data
onMounted(async () => {
    if (user.value) {
        syncUserToStore()
        
        // Fetch seller specific stats if needed
        try {
            const stats = await get('/sellers/me/stats')
            if (stats) {
                store.value.products = stats.total_products || 0
                store.value.sales = stats.total_sales || 0
                store.value.rating = stats.rating || 0
            }
        } catch (error) {
            console.error('Failed to fetch seller stats:', error)
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
        await put('/user/profile', {
            store_name: store.value.name,
            store_slug: store.value.slug,
            description: store.value.description,
            phone: store.value.phone,
            email: store.value.email,
            address: store.value.address,
            city: store.value.city,
            avatar_url: store.value.logoUrl,
            banner_url: store.value.bannerUrl
        })
        toast.success('Profil toko berhasil diperbarui!')
        await fetchUser() // Refresh global user state
    } catch (error) {
        toast.error(error.message || 'Gagal menyimpan profil toko')
    } finally {
        isSaving.value = false
    }
}
</script>
