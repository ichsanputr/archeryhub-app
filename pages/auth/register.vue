<template>
    <div class="relative h-screen bg-navy text-slate-900 font-display antialiased flex overflow-hidden">
        <!-- Background Hero (Full screen on mobile, absolute behind) -->
        <div class="absolute inset-0 z-0 lg:w-1/2 lg:relative lg:flex overflow-hidden flex-col justify-end">
            <div v-for="(slide, index) in slides" :key="index"
                class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                :class="currentSlideIndex === index ? 'opacity-40 lg:opacity-50' : 'opacity-0'">
                <img :src="slide" :alt="'Slide ' + (index + 1)" class="w-full h-full object-cover mix-blend-overlay" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent"></div>

            <!-- Content only visible on desktop -->
            <div class="hidden lg:block relative z-10 p-16 max-w-2xl">
                <div class="flex items-center gap-4 mb-12">
                    <div class="w-12 h-12 flex items-center justify-center transition-all duration-300">
                        <img src="/logo.png" alt="Logo" class="w-12 h-12 object-contain" />
                    </div>
                    <span class="text-white text-3xl font-black tracking-tight font-display">Archeryhub<span
                            class="text-logo-id">.id</span></span>
                </div>
                <h1 class="text-white text-5xl font-black leading-tight tracking-tight mb-4 font-display">
                    Ikutan Revolusi <br />
                    Digital Panahan
                </h1>
                <p class="text-slate-300 text-lg leading-relaxed max-w-md font-body">
                    Gabung bareng komunitas panahan terbesar di Indonesia buat kelola klub, pantau skor, sama ikutan
                    lomba.
                </p>
                <div class="mt-12 flex items-center gap-4 text-sm text-slate-400 font-medium font-body">
                    <div class="flex -space-x-2">
                        <img alt="Archer" class="w-8 h-8 rounded-full border-2 border-navy bg-slate-200 object-cover"
                            :src="getMediaUrl('male_94.jpg')" />
                        <img alt="Archer" class="w-8 h-8 rounded-full border-2 border-navy bg-slate-200 object-cover"
                            :src="getMediaUrl('female_18.jpg')" />
                        <img alt="Archer" class="w-8 h-8 rounded-full border-2 border-navy bg-slate-200 object-cover"
                            :src="getMediaUrl('male_8.jpg')" />
                        <div
                            class="w-8 h-8 rounded-full border-2 border-navy bg-slate-700 flex items-center justify-center text-[10px] text-white">
                            +2k</div>
                    </div>
                    <span>Pemanah udah gabung di Archeryhub.id</span>
                </div>
            </div>
        </div>

        <!-- Right Side: Registration Form -->
        <div
            class="relative z-10 w-full lg:w-1/2 bg-white/95 backdrop-blur-sm lg:bg-white flex flex-col items-center p-6 sm:p-12 lg:p-16 overflow-y-auto h-full no-scrollbar">
            <div class="mx-auto w-full max-w-md lg:max-w-lg">
                <!-- Logo (Mobile Only) -->
                <div class="lg:hidden mb-8 text-center">
                    <div class="inline-flex items-center gap-3">
                        <div class="w-10 h-10 flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" class="w-10 h-10 object-contain" />
                        </div>
                        <span class="text-navy text-2xl font-black tracking-tight font-display">Archeryhub<span
                                class="text-logo-id">.id</span></span>
                    </div>
                </div>

                <div class="text-center lg:text-left">
                    <h2 class="text-3xl font-black tracking-tight text-navy font-display">Buat Akun Baru</h2>
                    <p class="mt-2 text-sm text-slate-500 font-body">Gabung bareng komunitas panahan terbesar di
                        Indonesia.</p>
                </div>

                <!-- User Type Tabs -->
                <div class="mt-8 flex bg-gray-100 rounded-xl p-1.5">
                    <button v-for="type in userTypes" :key="type.value" @click="form.userType = type.value"
                        class="flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                        :class="form.userType === type.value ? 'bg-white text-navy shadow-md' : 'text-gray-500 hover:text-navy'">
                        <Icon :icon="type.icon" class="text-lg" />
                        <span class="hidden sm:inline">{{ type.label }}</span>
                    </button>
                </div>

                <div class="mt-8">
                    <form @submit.prevent="handleRegister" class="space-y-6">
                        <!-- User Type Specific Field (MANDATORY FOR GOOGLE REG) -->
                        <div class="space-y-4">
                            <!-- Archer: Nama Lengkap -->
                            <div v-if="form.userType === 'archer'" class="space-y-4">
                                <h4 class="text-xs font-black text-navy  tracking-widest flex items-center gap-2 mb-4">
                                    <Icon icon="ph:user-bold" class="text-primary text-lg" />
                                    Data Pemanah
                                </h4>
                                <BaseInput v-model="form.fullName" label="Nama Lengkap" placeholder="Masukkan Nama Anda"
                                    required
                                    :error="errors.fullName || (isNameTaken ? 'Nama atlet sudah terdaftar' : '')"
                                    @update:model-value="validate('fullName', form.fullName, [rules.required(), rules.minLength(3)])" />

                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <label class="text-sm font-bold text-navy">Jenis Kelamin</label>
                                        <select v-model="form.gender"
                                            class="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                                            <option value="male">Laki-laki</option>
                                            <option value="female">Perempuan</option>
                                        </select>
                                    </div>
                                    <BaseInput v-model="form.dateOfBirth" label="Tanggal Lahir" type="date" required
                                        :error="errors.dateOfBirth"
                                        @update:model-value="validate('dateOfBirth', form.dateOfBirth, [rules.required()])" />
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <BaseSelect v-model="form.city" :items="cities" label="Kota"
                                        placeholder="Pilih Kota" required :error="errors.city" searchable
                                        @update:model-value="validate('city', form.city, [rules.required()])" />
                                    <div class="space-y-1">
                                        <label class="text-sm font-bold text-navy">Tipe Busur Utama</label>
                                        <select v-model="form.bowType"
                                            class="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                                            <option value="recurve">Recurve</option>
                                            <option value="recurve">Standard</option>
                                            <option value="compound">Compound</option>
                                            <option value="barebow">Barebow</option>
                                            <option value="traditional">Traditional</option>
                                        </select>
                                    </div>
                                </div>

                                <BaseInput v-model="form.school" label="Sekolah / Instansi"
                                    placeholder="Masukkan nama sekolah atau instansi" />

                                <p class="mt-2 text-xs text-gray-400 font-body italic">* Data ini penting untuk
                                    penentuan kategori
                                    lomba.</p>
                            </div>

                            <!-- Organization: Nama Organisasi -->
                            <div v-if="form.userType === 'organization'" class="space-y-4">
                                <h4 class="text-xs font-black text-navy  tracking-widest flex items-center gap-2 mb-4">
                                    <Icon icon="ph:buildings-bold" class="text-primary text-lg" />
                                    Data Organisasi
                                </h4>
                                <BaseInput v-model="form.organizationName" label="Nama Organisasi"
                                    placeholder="Nama resmi organisasi" required
                                    :error="errors.organizationName || (isNameTaken ? 'Nama organisasi sudah terdaftar' : '')"
                                    @update:model-value="validate('organizationName', form.organizationName, [rules.required(), rules.minLength(3)])" />

                                <div class="grid grid-cols-2 gap-4">
                                    <BaseInput v-model="form.acronym" label="Singkatan (Acronym)"
                                        placeholder="Contoh: PERPANI" :error="errors.acronym"
                                        @update:model-value="validate('acronym', form.acronym, [rules.minLength(2)])" />
                                    <BaseInput v-model="form.whatsappNo" label="Nomor WhatsApp"
                                        placeholder="081234567XXX" required number-only :error="errors.whatsappNo"
                                        @update:model-value="validate('whatsappNo', form.whatsappNo, [rules.required(), rules.minLength(10)])" />
                                </div>

                                <BaseSelect v-model="form.city" label="Kota" placeholder="Pilih Kota" required
                                    :items="cities" :error="errors.city" searchable
                                    @update:model-value="validate('city', form.city, [rules.required()])" />

                                <div class="space-y-1">
                                    <label class="text-sm font-bold text-navy">Alamat Lengkap</label>
                                    <textarea v-model="form.address"
                                        class="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[80px]"
                                        :class="{ 'border-red-500': errors.address }"
                                        placeholder="Alamat kantor atau sekretariat"
                                        @input="validate('address', form.address, [rules.required()])"></textarea>
                                    <p v-if="errors.address" class="text-red-500 text-[11px] font-bold ml-1">{{
                                        errors.address }}</p>
                                </div>
                            </div>

                            <!-- Club: Nama Klub -->
                            <div v-if="form.userType === 'club'">
                                <h4 class="text-xs font-black text-navy  tracking-widest flex items-center gap-2 mb-4">
                                    <Icon icon="ph:users-three-bold" class="text-primary text-lg" />
                                    Data Klub
                                </h4>
                                <BaseInput v-model="form.clubName" label="Nama Klub" placeholder="Nama resmi klub"
                                    required
                                    :error="errors.clubName || (isNameTaken ? 'Nama klub sudah terdaftar' : '')"
                                    @update:model-value="validate('clubName', form.clubName, [rules.required(), rules.minLength(3)])" />
                                <p class="mt-2 text-xs text-gray-400">Data pelatih dan lokasi bisa dilengkapi di halaman
                                    profil.</p>
                            </div>

                            <!-- Seller: Nama Toko -->
                            <div v-if="form.userType === 'seller'">
                                <h4 class="text-xs font-black text-navy  tracking-widest flex items-center gap-2 mb-4">
                                    <Icon icon="ph:storefront-bold" class="text-primary text-lg" />
                                    Data Toko
                                </h4>
                                <BaseInput v-model="form.storeName" label="Nama Toko" placeholder="Nama toko Anda"
                                    required
                                    :error="errors.storeName || (isNameTaken ? 'Nama toko sudah terdaftar' : '')"
                                    @update:model-value="validate('storeName', form.storeName, [rules.required(), rules.minLength(3)])" />
                                <p class="mt-2 text-xs text-gray-400">Alamat dan detail toko bisa dilengkapi di halaman
                                    profil.</p>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2 pt-6 border-t border-gray-100">
                            <BaseCheckbox v-model="form.terms" required :error="errors.terms"
                                @update:model-value="validate('terms', form.terms, [rules.required('Anda harus menyetujui syarat & ketentuan')])">
                                Saya setuju dengan
                                <NuxtLink class="font-bold underline text-navy hover:text-primary-hover" to="/terms">
                                    Syarat & Ketentuan</NuxtLink> dan
                                <NuxtLink class="font-bold underline text-navy hover:text-primary-hover" to="/privacy">
                                    Kebijakan Privasi</NuxtLink>
                            </BaseCheckbox>
                        </div>

                        <!-- Google OAuth Button (PRIMARY ACTION) -->
                        <div class="pt-2">
                            <BaseButton variant="gold" block size="lg" icon="logos:google-icon"
                                @click="handleGoogleRegister" :loading="isGoogleLoading || isValidating"
                                :disabled="!isNameValid || !form.terms || isNameTaken || isValidating">
                                Daftar dengan Google
                            </BaseButton>
                            <p class="mt-4 text-xs text-center text-gray-400">
                                Pilih tipe akun di atas, isi nama, lalu klik tombol ini.
                            </p>
                        </div>
                    </form>

                    <div class="mt-8 text-center font-body">
                        <p class="text-sm text-slate-600">
                            Sudah punya akun?
                            <NuxtLink class="font-black text-navy hover:text-primary-hover transition-colors"
                                to="/auth/login">
                                Masuk di sini
                            </NuxtLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFormValidation } from '~/composables/useFormValidation'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

const route = useRoute()
const isLoading = ref(false)
const toast = useToast()
const cities = ref([])

useHead({
    title: 'Buat Akun Baru - Archeryhub.id'
})

const userTypes = [
    { value: 'archer', label: 'Pemanah', icon: 'temaki:archery' },
    { value: 'organization', label: 'Organisasi', icon: 'ph:buildings-bold' },
    { value: 'club', label: 'Klub', icon: 'ph:users-three-bold' },
    { value: 'seller', label: 'Penjual', icon: 'ph:storefront-bold' }
]

const { errors, validate, validateForm, rules } = useFormValidation()

const slides = ['/slide-1.jpeg', '/slide-2.jpeg', '/slide-3.jpeg']
const currentSlideIndex = ref(0)
let slideInterval = null

const startSlideshow = () => {
    slideInterval = setInterval(() => {
        currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length
    }, 2000)
}

// Get initial user type from query param
const getInitialUserType = () => {
    const typeParam = route.query.type
    if (typeParam && ['archer', 'organization', 'club', 'seller'].includes(typeParam)) {
        return typeParam
    }
    return 'archer'
}

// Simplified form - only essential fields
const form = ref({
    userType: getInitialUserType(),
    fullName: '',           // For archer
    organizationName: '',   // For organization
    clubName: '',           // For club
    storeName: '',          // For seller
    terms: false,

    // New Fields
    gender: 'male',
    dateOfBirth: '',
    city: '',
    school: '',
    bowType: 'recurve',
    acronym: '',
    whatsappNo: '',
    address: ''
})

const { register, login } = useAuth()
const { get } = useApi()
const config = useRuntimeConfig()

const getMediaUrl = (filename) => {
    if (!filename) return ''
    if (filename.startsWith('http')) return filename
    // apiBaseUrl already contains /api/v1
    return `${config.public.apiBaseUrl}/media/${filename}`
}

// Name uniqueness validation
const isNameTaken = ref(false)
const isValidating = ref(false)
let debounceTimer = null

const checkNameUnique = async (name) => {
    if (!name || name.length < 3) return

    isValidating.value = true
    try {
        const response = await get(`/auth/check-name?type=${form.value.userType}&name=${encodeURIComponent(name)}`)
        isNameTaken.value = response.exists
        if (response.exists) {
            toast.error('Nama ini sudah terdaftar. Silakan gunakan nama lain.')
        }
    } catch (err) {
        console.error('Failed to check name:', err)
    } finally {
        isValidating.value = false
    }
}

watch([() => form.value.fullName, () => form.value.organizationName, () => form.value.clubName, () => form.value.storeName], () => {
    isNameTaken.value = false
    clearTimeout(debounceTimer)
    const name = getName()
    if (name.length >= 3) {
        debounceTimer = setTimeout(() => {
            checkNameUnique(name)
        }, 500)
    }
})

watch(() => form.value.userType, () => {
    isNameTaken.value = false
    const name = getName()
    if (name.length >= 3) {
        checkNameUnique(name)
    }
})

onMounted(async () => {
    startSlideshow()
    try {
        const response = await get('/cities')
        cities.value = response.data.map(c => ({ title: c.name, value: c.name }))
    } catch (err) {
        console.error('Failed to fetch cities:', err)
    }
})

onUnmounted(() => {
    if (slideInterval) clearInterval(slideInterval)
})

const getName = () => {
    switch (form.value.userType) {
        case 'archer': return form.value.fullName
        case 'organization': return form.value.organizationName
        case 'club': return form.value.clubName
        case 'seller': return form.value.storeName
        default: return ''
    }
}

const isNameValid = computed(() => {
    const name = getName()
    return name && name.trim().length >= 3
})

// Google OAuth registration
const isGoogleLoading = ref(false)

const handleRegister = () => {
    handleGoogleRegister()
}

const handleGoogleRegister = async () => {
    if (!isNameValid.value) {
        toast.error('Silakan isi nama yang valid (minimal 3 karakter)')
        return
    }

    if (!form.value.terms) {
        toast.error('Anda harus menyetujui syarat dan ketentuan')
        return
    }

    isGoogleLoading.value = true

    try {
        // Prepare metadata from form
        const metadata = {
            full_name: getName(),
        }

        // Add Archer fields if applicable
        if (form.value.userType === 'archer') {
            Object.assign(metadata, {
                gender: form.value.gender,
                date_of_birth: form.value.dateOfBirth,
                city: form.value.city,
                school: form.value.school,
                bow_type: form.value.bowType
            })
        }

        // Add Organization fields if applicable
        if (form.value.userType === 'organization') {
            Object.assign(metadata, {
                organization_name: form.value.organizationName,
                acronym: form.value.acronym,
                city: form.value.city,
                address: form.value.address,
                whatsapp_no: form.value.whatsappNo
            })
        }

        // Pass user type and metadata to Google OAuth
        await login(form.value.userType, metadata)
    } catch (err) {
        console.error('Google registration failed:', err)
        let errorMessage = 'Gagal menyambung ke Google. Silakan coba lagi.'

        // Handle different error types
        if (err.status === 401 || err.statusCode === 401) {
            errorMessage = 'Autentikasi gagal. Silakan coba lagi.'
        } else if (err.status === 500 || err.statusCode === 500) {
            errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
        } else if (err.data?.error) {
            errorMessage = err.data.error
        } else if (err.response?._data?.error) {
            errorMessage = err.response._data.error
        } else if (err.message) {
            errorMessage = err.message
        }

        toast.error(errorMessage)
        isGoogleLoading.value = false
    }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
