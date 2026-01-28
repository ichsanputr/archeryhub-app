<template>
    <div class="space-y-8">
        <!-- Page Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 class="text-3xl font-black text-navy tracking-tight">Profil Organisasi</h1>
                <p class="text-gray-500 text-sm mt-1">Kelola informasi profil publik organisasi Anda</p>
            </div>
            <BaseButton variant="primary" icon="ph:floppy-disk-bold" :loading="isSaving" @click="saveProfile">
                Simpan Perubahan
            </BaseButton>
        </div>

        <!-- Tabs Navigation -->
        <div class="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                class="px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap"
                :class="activeTab === tab.id ? 'text-navy border-navy bg-gray-50' : 'text-gray-500 border-transparent hover:text-navy hover:bg-gray-50'">
                <Icon :icon="tab.icon" class="text-xl" />
                {{ tab.name }}
            </button>
        </div>

        <!-- Profile Form -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Info -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Tab: Dasar -->
                <template v-if="activeTab === 'dasar'">
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="font-black text-navy text-lg flex items-center gap-2">
                                <Icon icon="ph:building-office-bold" class="text-primary" />
                                Informasi Dasar
                            </h2>
                            <label class="flex items-center gap-2 text-sm">
                                <input type="checkbox" v-model="pageSettings.sections.basic"
                                    class="rounded border-gray-300" />
                                <span class="text-gray-500">Tampilkan</span>
                            </label>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BaseInput v-model="form.name" label="Nama Organisasi" placeholder="Nama organisasi..."
                                required />
                            <BaseInput v-model="form.acronym" label="Singkatan/Akronim" placeholder="Contoh: PERPANI" />
                            <BaseInput v-model="form.username" label="Username" placeholder="username-organisasi"
                                helper="Digunakan untuk URL profil publik" />
                            <BaseSelect v-model="form.type" label="Tipe Organisasi" :options="typeOptions" />
                            <div class="md:col-span-2">
                                <label class="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
                                <textarea v-model="form.description" rows="4"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="Ceritakan tentang organisasi Anda..."></textarea>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Tab: Kontak -->
                <template v-if="activeTab === 'kontak'">
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="font-black text-navy text-lg flex items-center gap-2">
                                <Icon icon="ph:phone-bold" class="text-primary" />
                                Informasi Kontak
                            </h2>
                            <label class="flex items-center gap-2 text-sm">
                                <input type="checkbox" v-model="pageSettings.sections.contact"
                                    class="rounded border-gray-300" />
                                <span class="text-gray-500">Tampilkan</span>
                            </label>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BaseInput v-model="form.email" label="Email" type="email"
                                placeholder="email@organisasi.com" disabled />
                            <BaseInput v-model="form.phone" label="Telepon" placeholder="+62..." />
                            <BaseInput v-model="form.website" label="Website" placeholder="https://website.com" />
                            <div class="md:col-span-2">
                                <BaseInput v-model="form.address" label="Alamat" placeholder="Alamat lengkap..." />
                            </div>
                            <BaseInput v-model="form.city" label="Kota" placeholder="Jakarta" />
                            <BaseInput v-model="form.province" label="Provinsi" placeholder="DKI Jakarta" />
                        </div>
                    </div>

                    <!-- Contact Person Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="font-black text-navy text-lg mb-6 flex items-center gap-2">
                            <Icon icon="ph:user-circle-bold" class="text-primary" />
                            Kontak Person
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <BaseInput v-model="form.contact_person_name" label="Nama" placeholder="Nama lengkap" />
                            <BaseInput v-model="form.contact_person_email" label="Email"
                                placeholder="email@personal.com" />
                            <BaseInput v-model="form.contact_person_phone" label="Telepon" placeholder="+62..." />
                        </div>
                    </div>
                </template>

                <!-- Tab: Sosial -->
                <template v-if="activeTab === 'sosial'">
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="font-black text-navy text-lg flex items-center gap-2">
                                <Icon icon="ph:share-network-bold" class="text-primary" />
                                Media Sosial
                            </h2>
                            <label class="flex items-center gap-2 text-sm">
                                <input type="checkbox" v-model="pageSettings.sections.social"
                                    class="rounded border-gray-300" />
                                <span class="text-gray-500">Tampilkan</span>
                            </label>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <BaseInput v-model="form.social_instagram" label="Instagram" placeholder="@username" />
                            <BaseInput v-model="form.social_facebook" label="Facebook" placeholder="facebook.com/..." />
                            <BaseInput v-model="form.social_twitter" label="Twitter/X" placeholder="@username" />
                        </div>
                    </div>
                </template>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Avatar/Logo Upload -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="font-black text-navy mb-4">Logo Organisasi</h3>
                    <div class="flex flex-col items-center">
                        <div
                            class="w-32 h-32 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden mb-4">
                            <img v-if="form.avatar_url" :src="form.avatar_url" class="w-full h-full object-cover" />
                            <Icon v-else icon="ph:image-bold" class="text-4xl text-gray-400" />
                        </div>
                        <BaseInput v-model="form.avatar_url" placeholder="URL Logo" class="w-full" />
                    </div>
                </div>

                <!-- Banner Upload -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="font-black text-navy mb-4">Banner</h3>
                    <div class="flex flex-col items-center">
                        <div
                            class="w-full h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden mb-4">
                            <img v-if="form.banner_url" :src="form.banner_url" class="w-full h-full object-cover" />
                            <Icon v-else icon="ph:image-bold" class="text-3xl text-gray-400" />
                        </div>
                        <BaseInput v-model="form.banner_url" placeholder="URL Banner" class="w-full" />
                    </div>
                </div>

                <!-- Pengaturan Tampilan -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em]">Pengaturan Tampilan</h3>
                    <p class="text-sm text-gray-500">Centang section yang ingin ditampilkan di halaman publik.</p>
                    <div class="space-y-3">
                        <label class="flex items-center gap-3 text-sm text-navy cursor-pointer">
                            <input type="checkbox" v-model="pageSettings.sections.basic"
                                class="rounded border-gray-300 text-primary" />
                            Informasi Dasar
                        </label>
                        <label class="flex items-center gap-3 text-sm text-navy cursor-pointer">
                            <input type="checkbox" v-model="pageSettings.sections.contact"
                                class="rounded border-gray-300 text-primary" />
                            Kontak
                        </label>
                        <label class="flex items-center gap-3 text-sm text-navy cursor-pointer">
                            <input type="checkbox" v-model="pageSettings.sections.social"
                                class="rounded border-gray-300 text-primary" />
                            Media Sosial
                        </label>
                    </div>
                </div>

                <!-- Verification Status -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="font-black text-navy mb-4">Status Verifikasi</h3>
                    <div class="flex items-center gap-3">
                        <div :class="verificationBadgeClass"
                            class="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                            <Icon :icon="verificationIcon" />
                            {{ verificationLabel }}
                        </div>
                    </div>
                    <p class="text-xs text-gray-400 mt-3">
                        Organisasi terverifikasi akan mendapat badge khusus di profil publik.
                    </p>
                </div>

                <!-- Public Profile Link -->
                <div class="bg-gradient-to-br from-navy to-blue-900 rounded-2xl p-6 text-white">
                    <h3 class="font-black mb-2">Profil Publik</h3>
                    <p class="text-sm text-blue-200 mb-4">Lihat bagaimana profil Anda terlihat oleh publik</p>
                    <NuxtLink v-if="form.username" :to="`/organization/${form.username}`" target="_blank"
                        class="block w-full py-3 bg-primary text-navy font-bold rounded-xl text-center hover:bg-primary-hover transition-colors">
                        Lihat Profil Publik
                    </NuxtLink>
                    <p v-else class="text-xs text-blue-300 italic">Set username terlebih dahulu untuk melihat profil
                        publik</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, reactive, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Profil Organisasi - Dashboard'
})

const { get, put } = useApi()
const toast = useToast()

const isSaving = ref(false)
const isLoading = ref(true)
const activeTab = ref('dasar')

const tabs = [
    { id: 'dasar', name: 'Informasi Dasar', icon: 'ph:building-office-bold' },
    { id: 'kontak', name: 'Kontak', icon: 'ph:phone-bold' },
    { id: 'sosial', name: 'Media Sosial', icon: 'ph:share-network-bold' }
]

const pageSettings = reactive({
    sections: {
        basic: true,
        contact: true,
        social: true
    }
})

const form = ref({
    name: '',
    acronym: '',
    username: '',
    type: 'association',
    description: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    province: '',
    avatar_url: '',
    banner_url: '',
    contact_person_name: '',
    contact_person_email: '',
    contact_person_phone: '',
    social_instagram: '',
    social_facebook: '',
    social_twitter: '',
    verification_status: 'pending'
})

const typeOptions = [
    { value: 'federation', label: 'Federasi' },
    { value: 'association', label: 'Asosiasi' },
    { value: 'committee', label: 'Panitia/Komite' },
    { value: 'sponsor', label: 'Sponsor' },
    { value: 'other', label: 'Lainnya' }
]

const verificationBadgeClass = computed(() => {
    const status = form.value.verification_status
    if (status === 'verified') return 'bg-green-50 text-green-600 border border-green-200'
    if (status === 'rejected') return 'bg-red-50 text-red-600 border border-red-200'
    return 'bg-amber-50 text-amber-600 border border-amber-200'
})

const verificationIcon = computed(() => {
    const status = form.value.verification_status
    if (status === 'verified') return 'ph:seal-check-fill'
    if (status === 'rejected') return 'ph:x-circle-fill'
    return 'ph:clock-bold'
})

const verificationLabel = computed(() => {
    const status = form.value.verification_status
    if (status === 'verified') return 'Terverifikasi'
    if (status === 'rejected') return 'Ditolak'
    return 'Menunggu Verifikasi'
})

const fetchProfile = async () => {
    isLoading.value = true
    try {
        const response = await get('/organizations/me')
        const org = response?.organization || response?.data?.organization || {}
        form.value = {
            name: org.name || '',
            acronym: org.acronym || '',
            username: org.username || '',
            type: org.type || 'association',
            description: org.description || '',
            email: org.email || '',
            phone: org.phone || '',
            website: org.website || '',
            address: org.address || '',
            city: org.city || '',
            province: org.province || '',
            avatar_url: org.avatar_url || '',
            banner_url: org.banner_url || '',
            contact_person_name: org.contact_person_name || '',
            contact_person_email: org.contact_person_email || '',
            contact_person_phone: org.contact_person_phone || '',
            social_instagram: org.social_instagram || '',
            social_facebook: org.social_facebook || '',
            social_twitter: org.social_twitter || '',
            verification_status: org.verification_status || 'pending'
        }

        // Load page settings
        if (org.page_settings) {
            try {
                const settings = typeof org.page_settings === 'string' ? JSON.parse(org.page_settings) : org.page_settings
                Object.assign(pageSettings.sections, settings.sections || {})
            } catch (e) {
                console.error('Failed to parse page_settings', e)
            }
        }
    } catch (error) {
        console.error('Failed to fetch profile:', error)
        toast.error('Gagal memuat profil organisasi')
    } finally {
        isLoading.value = false
    }
}

const saveProfile = async () => {
    isSaving.value = true
    try {
        await put('/organizations/me', {
            name: form.value.name,
            acronym: form.value.acronym,
            username: form.value.username,
            type: form.value.type,
            description: form.value.description,
            phone: form.value.phone,
            website: form.value.website,
            address: form.value.address,
            city: form.value.city,
            province: form.value.province,
            avatar_url: form.value.avatar_url,
            banner_url: form.value.banner_url,
            contact_person_name: form.value.contact_person_name,
            contact_person_email: form.value.contact_person_email,
            contact_person_phone: form.value.contact_person_phone,
            social_instagram: form.value.social_instagram,
            social_facebook: form.value.social_facebook,
            social_twitter: form.value.social_twitter,
            page_settings: JSON.stringify(pageSettings)
        })
        toast.success('Profil organisasi berhasil disimpan!')
    } catch (error) {
        console.error('Failed to save profile:', error)
        toast.error('Gagal menyimpan profil: ' + (error.message || ''))
    } finally {
        isSaving.value = false
    }
}

onMounted(() => {
    fetchProfile()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
