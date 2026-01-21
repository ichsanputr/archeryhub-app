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

const toast = useToast()
const isSaving = ref(false)

// Dummy store data
const store = ref({
    name: 'Garuda Archery Store',
    slug: 'garuda-archery',
    description: 'Toko peralatan panahan berkualitas dengan harga terbaik. Kami menyediakan berbagai macam busur, anak panah, dan aksesoris panahan dari brand ternama.',
    logoUrl: '',
    bannerUrl: '',
    phone: '081234567890',
    email: 'store@garudaarchery.com',
    address: 'Jl. Panahan No. 123, Senayan',
    city: 'Jakarta',
    verified: true,
    products: 45,
    sales: 234,
    rating: 4.8
})

const saveStore = async () => {
    isSaving.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Perubahan berhasil disimpan!')
    isSaving.value = false
}
</script>
