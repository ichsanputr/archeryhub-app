<template>
    <div class="relative h-screen bg-navy text-slate-900 font-display antialiased flex overflow-hidden">
        <!-- Background Hero (Full screen on mobile, absolute behind) -->
        <div class="absolute inset-0 z-0 lg:w-1/2 lg:relative lg:flex overflow-hidden flex-col justify-end">
            <div class="absolute inset-0 z-0">
                <img alt="Archery action shot"
                    class="w-full h-full object-cover mix-blend-overlay opacity-40 lg:opacity-50"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o" />
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent"></div>
            </div>

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
                        <img alt="User" class="w-8 h-8 rounded-full border-2 border-navy bg-slate-200"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcgAI-cKVqB-rFvg63jv5RqEiFblqdw595CXHY_R7cP1SzEvLj9RApZNYpesTGKW4hnP6dODFBORzsQz0VTfOAeoUYNYWc66Rf-yAuUMyNAA2_feDvo-BF1MCVdcMHo0CJNnE5nLwPtWxfvnSOcil9PLAyYxZ56fuEWoyVFIc05X2iy2UqUQ5lNWaZZ6_e7XIc0IsvLCNI8qHt3-Z3Y-kccrkuHvLLZ1FVuFXdTt8f1fPfb-RIIZpqmeTGSo32A8PCc9Zn-1ij28M" />
                        <img alt="User" class="w-8 h-8 rounded-full border-2 border-navy bg-slate-200"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt3SzLRngf9eHahpVCYP2lIN59kq_ysykNYB0--B_JGyYcXCC5AHTW_2x8vyGfM0qqiy-UGLJIIoHecm6B__qMiqICjO8NJEpXxIIlJM96qygcz03iEnUXREI7C4rLHfbBaETWW8QsW4RuMBRz3BN0MdrIrNEdUFHgPKtE6wsEHA-FxaOf1oI5NtSJ4BwGLMFF62K65NfZJQ62juWLySTcEyLw_46lXePMcVuVlpsOxm_uvoVuOukVyaGNjboiem1tc9S2_MylKiY" />
                        <img alt="User" class="w-8 h-8 rounded-full border-2 border-navy bg-slate-200"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx-xM4-BPNOrQ3_em1j0mlD_KE5EfI8v_jh4BaO6M5r5WHUqu4TAV3zkUmk1AG7upbKsPXhgVcHTEDNu1LUdNqZYfqP0q1ZfVe_1Xqt1qpULObZvsqkCF9gx045dkMOFa6g1JYMZ8vyf9wWcj4PAh7vnXobMo-3zQS99zd4Aixp4PBT6fsUSb91KG67a5YVnsq81X3IDhvc-C6tUYjTcQ4SfuaNPyEqUc6zMTbXU9moUm5vejyBMc3PLKfoIVvow9qNznmw9IVcO0" />
                        <div
                            class="w-8 h-8 rounded-full border-2 border-navy bg-slate-700 flex items-center justify-center text-[10px] text-white">
                            +2k</div>
                    </div>
                    <span>Atlet udah gabung di Archeryhub.id</span>
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

                <!-- Error Message -->
                <div v-if="error"
                    class="mt-6 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center font-body">
                    {{ error }}
                </div>

                <div class="mt-8">
                    <form @submit.prevent="handleRegister" class="space-y-6">
                        <!-- User Type Specific Field (MANDATORY FOR GOOGLE REG) -->
                        <div class="space-y-4">
                            <!-- Archer: Nama Lengkap -->
                            <div v-if="form.userType === 'archer'">
                                <h4
                                    class="text-xs font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-4">
                                    <Icon icon="ph:user-bold" class="text-primary text-lg" />
                                    Data Pemanah
                                </h4>
                                <BaseInput v-model="form.fullName" label="Nama Lengkap" placeholder="Sesuai KTP"
                                    required :error="errors.fullName"
                                    @blur="validate('fullName', form.fullName, [rules.required()])" />
                                <p class="mt-2 text-xs text-gray-400">Data lainnya bisa dilengkapi di halaman profil
                                    setelah masuk.</p>
                            </div>

                            <!-- Organization: Nama Organisasi -->
                            <div v-if="form.userType === 'organization'">
                                <h4
                                    class="text-xs font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-4">
                                    <Icon icon="ph:buildings-bold" class="text-primary text-lg" />
                                    Data Organisasi
                                </h4>
                                <BaseInput v-model="form.organizationName" label="Nama Organisasi"
                                    placeholder="Nama resmi organisasi" required :error="errors.organizationName"
                                    @blur="validate('organizationName', form.organizationName, [rules.required()])" />
                                <p class="mt-2 text-xs text-gray-400">Informasi PIC dan detail lainnya bisa dilengkapi
                                    di halaman profil.</p>
                            </div>

                            <!-- Club: Nama Klub -->
                            <div v-if="form.userType === 'club'">
                                <h4
                                    class="text-xs font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-4">
                                    <Icon icon="ph:users-three-bold" class="text-primary text-lg" />
                                    Data Klub
                                </h4>
                                <BaseInput v-model="form.clubName" label="Nama Klub" placeholder="Nama resmi klub"
                                    required :error="errors.clubName"
                                    @blur="validate('clubName', form.clubName, [rules.required()])" />
                                <p class="mt-2 text-xs text-gray-400">Data pelatih dan lokasi bisa dilengkapi di halaman
                                    profil.</p>
                            </div>

                            <!-- Seller: Nama Toko -->
                            <div v-if="form.userType === 'seller'">
                                <h4
                                    class="text-xs font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-4">
                                    <Icon icon="ph:storefront-bold" class="text-primary text-lg" />
                                    Data Toko
                                </h4>
                                <BaseInput v-model="form.storeName" label="Nama Toko" placeholder="Nama toko Anda"
                                    required :error="errors.storeName"
                                    @blur="validate('storeName', form.storeName, [rules.required()])" />
                                <p class="mt-2 text-xs text-gray-400">Alamat dan detail toko bisa dilengkapi di halaman
                                    profil.</p>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2 pt-6 border-t border-gray-100">
                            <BaseCheckbox v-model="form.terms" required :error="errors.terms">
                                Saya setuju dengan
                                <NuxtLink class="font-bold text-navy hover:text-primary-hover" to="/terms">
                                    Syarat & Ketentuan</NuxtLink> dan
                                <NuxtLink class="font-bold text-navy hover:text-primary-hover" to="/privacy">
                                    Kebijakan Privasi</NuxtLink>
                            </BaseCheckbox>
                        </div>

                        <!-- Google OAuth Button (PRIMARY ACTION) -->
                        <div class="pt-2">
                            <BaseButton variant="gold" block size="lg" icon="logos:google-icon"
                                @click="handleGoogleRegister" :loading="isGoogleLoading"
                                :disabled="!isNameValid || !form.terms">
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFormValidation } from '~/composables/useFormValidation'

const route = useRoute()
const isLoading = ref(false)
const error = ref(null)

const userTypes = [
    { value: 'archer', label: 'Pemanah', icon: 'temaki:archery' },
    { value: 'organization', label: 'Organisasi', icon: 'ph:buildings-bold' },
    { value: 'club', label: 'Klub', icon: 'ph:users-three-bold' },
    { value: 'seller', label: 'Penjual', icon: 'ph:storefront-bold' }
]

const { errors, validate, validateForm, rules } = useFormValidation()

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
    terms: false
})

const { register, login } = useAuth()

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
        error.value = 'Silakan isi nama yang valid (minimal 3 karakter)'
        return
    }

    if (!form.value.terms) {
        error.value = 'Anda harus menyetujui syarat dan ketentuan'
        return
    }

    isGoogleLoading.value = true
    error.value = null

    try {
        // Pass user type and captured name to Google OAuth
        await login(form.value.userType, getName())
    } catch (err) {
        console.error('Google registration failed:', err)
        error.value = 'Gagal menyambung ke Google. Silakan coba lagi.'
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
