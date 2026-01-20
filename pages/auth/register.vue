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
                        <span class="material-symbols-outlined text-lg">{{ type.icon }}</span>
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
                        <!-- Common Fields -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Email -->
                            <div class="sm:col-span-2">
                                <BaseInput v-model="form.email" label="Alamat Email" placeholder="email@domain.com"
                                    type="email" icon="mail" required :error="errors.email"
                                    @blur="validate('email', form.email, [rules.required(), rules.email()])" />
                            </div>

                            <!-- Password -->
                            <div>
                                <BaseInput v-model="form.password" label="Kata Sandi" placeholder="••••••••"
                                    type="password" icon="lock" required :error="errors.password"
                                    @blur="validate('password', form.password, [rules.required(), rules.minLength(8)])" />
                            </div>

                            <!-- Confirm Password -->
                            <div>
                                <BaseInput v-model="form.confirmPassword" label="Konfirmasi Sandi"
                                    placeholder="••••••••" type="password" icon="lock" required
                                    :error="errors.confirmPassword"
                                    @blur="validate('confirmPassword', form.confirmPassword, [rules.required(), rules.sameAs(form.password, 'Kata sandi tidak cocok')])" />
                            </div>
                        </div>

                        <!-- Archer Specific Fields -->
                        <div v-if="form.userType === 'archer'" class="space-y-4 pt-4 border-t border-gray-100">
                            <h4
                                class="text-xs font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-4">
                                <span class="material-symbols-outlined text-primary text-lg">sports_martial_arts</span>
                                Data Pemanah
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <BaseInput v-model="form.archer.fullName" label="Nama Lengkap" placeholder="Sesuai KTP"
                                    required :error="errors['archer.fullName']"
                                    @blur="validate('archer.fullName', form.archer.fullName, [rules.required()])" />
                                <BaseInput v-model="form.archer.nickname" label="Nama Panggilan" placeholder="Nick" />
                                <BaseInput v-model="form.archer.dateOfBirth" label="Tanggal Lahir" type="date" required
                                    :error="errors['archer.dateOfBirth']"
                                    @blur="validate('archer.dateOfBirth', form.archer.dateOfBirth, [rules.required()])" />

                                <BaseSelect v-model="form.archer.gender" label="Jenis Kelamin" :items="[
                                    { title: 'Laki-laki', value: 'male' },
                                    { title: 'Perempuan', value: 'female' }
                                ]" required />

                                <BaseInput v-model="form.archer.phone" label="No. Telepon" type="tel"
                                    placeholder="08xxxxxxxxxx" required :error="errors['archer.phone']"
                                    @blur="validate('archer.phone', form.archer.phone, [rules.required()])" />

                                <BaseSelect v-model="form.archer.bowType" label="Jenis Busur" :items="[
                                    { title: 'Recurve', value: 'recurve' },
                                    { title: 'Compound', value: 'compound' },
                                    { title: 'Barebow', value: 'barebow' },
                                    { title: 'Tradisional', value: 'traditional' }
                                ]" required />

                                <div class="sm:col-span-2">
                                    <BaseInput v-model="form.archer.city" label="Kota/Kabupaten"
                                        placeholder="Contoh: Jakarta Selatan" />
                                </div>
                            </div>
                        </div>

                        <!-- Organization Specific Fields -->
                        <div v-if="form.userType === 'organization'" class="space-y-4 pt-4 border-t border-gray-100">
                            <h4
                                class="text-xs font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-4">
                                <span class="material-symbols-outlined text-primary text-lg">corporate_fare</span>
                                Data Organisasi
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div class="sm:col-span-2">
                                    <BaseInput v-model="form.organization.name" label="Nama Organisasi"
                                        placeholder="Nama resmi organisasi" required
                                        :error="errors['organization.name']"
                                        @blur="validate('organization.name', form.organization.name, [rules.required()])" />
                                </div>
                                <BaseInput v-model="form.organization.acronym" label="Singkatan"
                                    placeholder="Contoh: PERPANI" />

                                <BaseSelect v-model="form.organization.type" label="Tipe Organisasi" :items="[
                                    { title: 'Federasi', value: 'federation' },
                                    { title: 'Asosiasi', value: 'association' },
                                    { title: 'Panitia', value: 'committee' },
                                    { title: 'Sponsor', value: 'sponsor' },
                                    { title: 'Lainnya', value: 'other' }
                                ]" required />

                                <BaseInput v-model="form.organization.contactPersonName" label="Nama PIC"
                                    placeholder="Nama penanggung jawab" required
                                    :error="errors['organization.contactPersonName']"
                                    @blur="validate('organization.contactPersonName', form.organization.contactPersonName, [rules.required()])" />
                                <BaseInput v-model="form.organization.contactPersonPhone" label="No. Telepon PIC"
                                    type="tel" placeholder="08xxxxxxxxxx" required
                                    :error="errors['organization.contactPersonPhone']"
                                    @blur="validate('organization.contactPersonPhone', form.organization.contactPersonPhone, [rules.required()])" />

                                <div class="sm:col-span-2">
                                    <BaseInput v-model="form.organization.address" label="Alamat"
                                        placeholder="Alamat lengkap kantor" />
                                </div>
                            </div>
                        </div>

                        <!-- Club Specific Fields -->
                        <div v-if="form.userType === 'club'" class="space-y-4 pt-4 border-t border-gray-100">
                            <h4
                                class="text-xs font-black text-navy uppercase tracking-widest flex items-center gap-2 mb-4">
                                <span class="material-symbols-outlined text-primary text-lg">groups</span>
                                Data Klub
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div class="sm:col-span-2">
                                    <BaseInput v-model="form.club.name" label="Nama Klub" placeholder="Nama resmi klub"
                                        required :error="errors['club.name']"
                                        @blur="validate('club.name', form.club.name, [rules.required()])" />
                                </div>
                                <BaseInput v-model="form.club.abbreviation" label="Singkatan"
                                    placeholder="Contoh: JVAC" />
                                <BaseInput v-model="form.club.establishedDate" label="Tahun Berdiri" type="date" />
                                <BaseInput v-model="form.club.headCoachName" label="Nama Kepala Pelatih"
                                    placeholder="Nama pelatih utama" required :error="errors['club.headCoachName']"
                                    @blur="validate('club.headCoachName', form.club.headCoachName, [rules.required()])" />
                                <BaseInput v-model="form.club.headCoachPhone" label="No. Telepon Pelatih" type="tel"
                                    placeholder="08xxxxxxxxxx" required :error="errors['club.headCoachPhone']"
                                    @blur="validate('club.headCoachPhone', form.club.headCoachPhone, [rules.required()])" />
                                <BaseInput v-model="form.club.city" label="Kota" placeholder="Lokasi klub" required
                                    :error="errors['club.city']"
                                    @blur="validate('club.city', form.club.city, [rules.required()])" />
                                <BaseInput v-model="form.club.province" label="Provinsi" placeholder="Provinsi" />

                                <div class="sm:col-span-2">
                                    <BaseInput v-model="form.club.address" label="Alamat Latihan"
                                        placeholder="Alamat lengkap tempat latihan" />
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2 pt-4">
                            <BaseCheckbox v-model="form.terms" required :error="errors.terms">
                                Saya setuju dengan
                                <NuxtLink class="font-bold text-navy hover:text-primary-hover" to="/terms">
                                    Syarat & Ketentuan</NuxtLink> dan
                                <NuxtLink class="font-bold text-navy hover:text-primary-hover" to="/privacy">
                                    Kebijakan Privasi</NuxtLink>
                            </BaseCheckbox>
                        </div>

                        <BaseButton type="submit" variant="gold" block size="lg" :loading="isLoading"
                            loading-text="Sedang mendaftar..." icon-right="arrow_forward">
                            Daftar Sekarang
                        </BaseButton>
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
import { ref, onMounted } from 'vue'
import { useFormValidation } from '~/composables/useFormValidation'

const route = useRoute()
const isLoading = ref(false)
const error = ref(null)

const userTypes = [
    { value: 'archer', label: 'Pemanah', icon: 'sports_martial_arts' },
    { value: 'organization', label: 'Organisasi', icon: 'corporate_fare' },
    { value: 'club', label: 'Klub', icon: 'groups' }
]

const { errors, validate, validateForm, rules } = useFormValidation()

// Get initial user type from query param
const getInitialUserType = () => {
    const typeParam = route.query.type
    if (typeParam && ['archer', 'organization', 'club'].includes(typeParam)) {
        return typeParam
    }
    return 'archer'
}

const form = ref({
    userType: getInitialUserType(),
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
    archer: {
        fullName: '',
        nickname: '',
        dateOfBirth: '',
        gender: 'male',
        phone: '',
        bowType: 'recurve',
        city: ''
    },
    organization: {
        name: '',
        acronym: '',
        type: 'association',
        contactPersonName: '',
        contactPersonPhone: '',
        address: ''
    },
    club: {
        name: '',
        abbreviation: '',
        establishedDate: '',
        headCoachName: '',
        headCoachPhone: '',
        city: '',
        province: '',
        address: ''
    }
})

const { register } = useAuth()

const handleRegister = async () => {
    // Collect all rules based on userType
    const commonRules = {
        email: [rules.required(), rules.email()],
        password: [rules.required(), rules.minLength(8)],
        confirmPassword: [rules.required(), rules.sameAs(form.value.password, 'Kata sandi tidak cocok')],
        terms: [rules.required('Anda harus menyetujui syarat dan ketentuan')]
    }

    const typeRules = {
        archer: {
            'archer.fullName': [rules.required()],
            'archer.dateOfBirth': [rules.required()],
            'archer.phone': [rules.required()]
        },
        organization: {
            'organization.name': [rules.required()],
            'organization.contactPersonName': [rules.required()],
            'organization.contactPersonPhone': [rules.required()]
        },
        club: {
            'club.name': [rules.required()],
            'club.headCoachName': [rules.required()],
            'club.headCoachPhone': [rules.required()],
            'club.city': [rules.required()]
        }
    }

    // Combine rules
    const activeRules = { ...commonRules, ...typeRules[form.value.userType] }

    // Flatten logic for validateForm support with nested paths
    const flatForm = {
        ...form.value,
        'archer.fullName': form.value.archer.fullName,
        'archer.dateOfBirth': form.value.archer.dateOfBirth,
        'archer.phone': form.value.archer.phone,
        'organization.name': form.value.organization.name,
        'organization.contactPersonName': form.value.organization.contactPersonName,
        'organization.contactPersonPhone': form.value.organization.contactPersonPhone,
        'club.name': form.value.club.name,
        'club.headCoachName': form.value.club.headCoachName,
        'club.headCoachPhone': form.value.club.headCoachPhone,
        'club.city': form.value.club.city,
    }

    if (!validateForm(flatForm, activeRules)) {
        return
    }

    isLoading.value = true
    error.value = null

    try {
        const typeData = form.value[form.value.userType]
        const payload = {
            username: form.value.email.split('@')[0] + Math.floor(Math.random() * 1000), // Generate a username if none provided
            email: form.value.email,
            password: form.value.password,
            user_type: form.value.userType,
            full_name: typeData.fullName || typeData.name || '',
            phone: typeData.phone || typeData.contactPersonPhone || typeData.headCoachPhone || ''
        }

        console.log('Registering:', payload)
        await register(payload)

        // Redirect to dashboard on success (useAuth already sets user state)
        window.location.href = '/dashboard'
    } catch (err) {
        console.error('Registration failed:', err)
        error.value = err.message || 'Pendaftaran gagal. Silakan coba lagi.'
    } finally {
        isLoading.value = false
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
