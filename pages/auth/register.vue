<template>
    <div class="bg-surface font-display antialiased min-h-screen flex overflow-hidden">
        <!-- Left Side: Visual Hero (Desktop Only) -->
        <div class="relative hidden w-0 flex-1 lg:block bg-navy">
            <div class="absolute inset-0 h-full w-full">
                <div class="absolute inset-0 bg-navy/40 mix-blend-multiply z-10"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent z-10 opacity-90">
                </div>
                <img alt="Archer silhouette during sunset" class="h-full w-full object-cover object-center opacity-80"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o" />
            </div>
            <div class="relative z-20 flex h-full flex-col justify-end p-12 xl:p-16 text-white">
                <div class="mb-10 max-w-lg">
                    <div class="w-14 h-14 flex items-center justify-center mb-8">
                        <img src="/logo.png" alt="Logo" class="w-14 h-14 object-contain" />
                    </div>
                    <h2 class="text-4xl xl:text-5xl font-black tracking-tight leading-tight mb-6 font-display">
                        Ikutan Revolusi Digital Panahan Indonesia
                    </h2>
                    <div class="flex flex-wrap items-center gap-4 text-slate-300 text-sm font-medium font-body">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary">check_circle</span>
                            <span>Kelola Klub</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary">check_circle</span>
                            <span>Pantau Skor</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary">check_circle</span>
                            <span>Ikutan Lomba</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-4 text-xs text-slate-400 border-t border-white/10 pt-6 font-body">
                    <span>© 2024 Archeryhub.id Indonesia</span>
                    <span class="w-1 h-1 rounded-full bg-slate-500"></span>
                    <a class="hover:text-white transition-colors" href="/privacy">Privacy</a>
                    <span class="w-1 h-1 rounded-full bg-slate-500"></span>
                    <a class="hover:text-white transition-colors" href="/terms">Terms</a>
                </div>
            </div>
        </div>

        <!-- Right Side: Registration Form -->
        <div
            class="flex flex-1 flex-col justify-start px-4 py-8 sm:px-6 lg:flex-none lg:px-16 xl:px-20 bg-white w-full lg:w-[650px] xl:w-[750px] overflow-y-auto no-scrollbar">
            <div class="mx-auto w-full max-w-md lg:max-w-lg">
                <!-- Logo (Mobile Only) -->
                <div class="lg:hidden mb-8 text-center">
                    <div class="inline-flex items-center gap-3">
                        <div class="w-10 h-10 flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" class="w-10 h-10 object-contain" />
                        </div>
                        <span class="text-navy text-2xl font-bold tracking-tight font-display">Archeryhub<span
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
                    <form @submit.prevent="handleRegister" class="space-y-5">
                        <!-- Common Fields -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Email -->
                            <div class="sm:col-span-2">
                                <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                                    Alamat Email
                                </label>
                                <div class="relative rounded-lg shadow-sm">
                                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span class="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                                    </div>
                                    <input v-model="form.email" autocomplete="email"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 pl-10 focus:border-primary focus:ring-primary sm:text-sm py-3 transition-colors placeholder:text-slate-400"
                                        placeholder="email@domain.com" required type="email" />
                                </div>
                            </div>

                            <!-- Password -->
                            <div>
                                <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                                    Kata Sandi
                                </label>
                                <div class="relative rounded-lg shadow-sm">
                                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span class="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                                    </div>
                                    <input v-model="form.password" autocomplete="new-password"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 pl-10 focus:border-primary focus:ring-primary sm:text-sm py-3 transition-colors placeholder:text-slate-400"
                                        placeholder="••••••••" required type="password" />
                                </div>
                            </div>

                            <!-- Confirm Password -->
                            <div>
                                <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                                    Konfirmasi Sandi
                                </label>
                                <div class="relative rounded-lg shadow-sm">
                                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span class="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                                    </div>
                                    <input v-model="form.confirmPassword" autocomplete="new-password"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 pl-10 focus:border-primary focus:ring-primary sm:text-sm py-3 transition-colors placeholder:text-slate-400"
                                        placeholder="••••••••" required type="password" />
                                </div>
                            </div>
                        </div>

                        <!-- Archer Specific Fields -->
                        <div v-if="form.userType === 'archer'" class="space-y-4 pt-4 border-t border-gray-100">
                            <h4 class="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">sports_martial_arts</span>
                                Data Pemanah
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Nama
                                        Lengkap</label>
                                    <input v-model="form.archer.fullName" type="text" required
                                        placeholder="Nama lengkap sesuai KTP"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Nama
                                        Panggilan</label>
                                    <input v-model="form.archer.nickname" type="text" placeholder="Nama panggilan"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label
                                        class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Tanggal
                                        Lahir</label>
                                    <input v-model="form.archer.dateOfBirth" type="date" required
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Jenis
                                        Kelamin</label>
                                    <select v-model="form.archer.gender"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3">
                                        <option value="male">Laki-laki</option>
                                        <option value="female">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">No.
                                        Telepon</label>
                                    <input v-model="form.archer.phone" type="tel" required placeholder="08xxxxxxxxxx"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Jenis
                                        Busur</label>
                                    <select v-model="form.archer.bowType"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3">
                                        <option value="recurve">Recurve</option>
                                        <option value="compound">Compound</option>
                                        <option value="barebow">Barebow</option>
                                        <option value="traditional">Tradisional</option>
                                    </select>
                                </div>
                                <div class="sm:col-span-2">
                                    <label
                                        class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Kota/Kabupaten</label>
                                    <input v-model="form.archer.city" type="text" placeholder="Contoh: Jakarta Selatan"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                            </div>
                        </div>

                        <!-- Organization Specific Fields -->
                        <div v-if="form.userType === 'organization'" class="space-y-4 pt-4 border-t border-gray-100">
                            <h4 class="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">corporate_fare</span>
                                Data Organisasi
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="sm:col-span-2">
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Nama
                                        Organisasi</label>
                                    <input v-model="form.organization.name" type="text" required
                                        placeholder="Nama resmi organisasi"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label
                                        class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Singkatan</label>
                                    <input v-model="form.organization.acronym" type="text" placeholder="Contoh: PERPANI"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Tipe
                                        Organisasi</label>
                                    <select v-model="form.organization.type"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3">
                                        <option value="federation">Federasi</option>
                                        <option value="association">Asosiasi</option>
                                        <option value="committee">Panitia</option>
                                        <option value="sponsor">Sponsor</option>
                                        <option value="other">Lainnya</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Nama
                                        PIC</label>
                                    <input v-model="form.organization.contactPersonName" type="text" required
                                        placeholder="Nama penanggung jawab"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">No.
                                        Telepon PIC</label>
                                    <input v-model="form.organization.contactPersonPhone" type="tel" required
                                        placeholder="08xxxxxxxxxx"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div class="sm:col-span-2">
                                    <label
                                        class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Alamat</label>
                                    <input v-model="form.organization.address" type="text"
                                        placeholder="Alamat lengkap kantor"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                            </div>
                        </div>

                        <!-- Club Specific Fields -->
                        <div v-if="form.userType === 'club'" class="space-y-4 pt-4 border-t border-gray-100">
                            <h4 class="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">groups</span>
                                Data Klub
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="sm:col-span-2">
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Nama
                                        Klub</label>
                                    <input v-model="form.club.name" type="text" required placeholder="Nama resmi klub"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label
                                        class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Singkatan</label>
                                    <input v-model="form.club.abbreviation" type="text" placeholder="Contoh: JVAC"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Tahun
                                        Berdiri</label>
                                    <input v-model="form.club.establishedDate" type="date"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Nama
                                        Kepala Pelatih</label>
                                    <input v-model="form.club.headCoachName" type="text" required
                                        placeholder="Nama pelatih utama"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">No.
                                        Telepon Pelatih</label>
                                    <input v-model="form.club.headCoachPhone" type="tel" required
                                        placeholder="08xxxxxxxxxx"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label
                                        class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Kota</label>
                                    <input v-model="form.club.city" type="text" required placeholder="Lokasi klub"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div>
                                    <label
                                        class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Provinsi</label>
                                    <input v-model="form.club.province" type="text" placeholder="Provinsi"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                                <div class="sm:col-span-2">
                                    <label
                                        class="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Alamat
                                        Latihan</label>
                                    <input v-model="form.club.address" type="text"
                                        placeholder="Alamat lengkap tempat latihan"
                                        class="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 focus:border-primary focus:ring-primary sm:text-sm py-3" />
                                </div>
                            </div>
                        </div>

                        <!-- Terms -->
                        <div class="flex items-start pt-4">
                            <div class="flex h-5 items-center">
                                <input v-model="form.terms"
                                    class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                    type="checkbox" required />
                            </div>
                            <div class="ml-3 text-sm font-body">
                                <label class="font-medium text-slate-600">Saya setuju dengan
                                    <a class="font-black text-navy hover:text-primary-hover" href="/terms">Syarat &
                                        Ketentuan</a> dan
                                    <a class="font-black text-navy hover:text-primary-hover" href="/privacy">Kebijakan
                                        Privasi</a>
                                </label>
                            </div>
                        </div>

                        <button :disabled="isLoading"
                            class="flex w-full justify-center items-center gap-2 rounded-xl border border-transparent bg-primary py-4 px-4 text-sm font-bold text-navy shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                            type="submit">
                            <span v-if="isLoading" class="flex items-center gap-2">
                                <div class="spinner size-5"></div>
                                Sedang mendaftar...
                            </span>
                            <span v-else class="flex items-center gap-2">
                                Daftar Sekarang
                                <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </span>
                        </button>
                    </form>

                    <div class="mt-8 text-center font-body">
                        <p class="text-sm text-slate-600">
                            Sudah punya akun?
                            <a class="font-black text-navy hover:text-primary-hover transition-colors"
                                href="/auth/login">
                                Masuk di sini
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
    layout: 'blank'
})

const route = useRoute()
const isLoading = ref(false)
const error = ref(null)

const userTypes = [
    { value: 'archer', label: 'Pemanah', icon: 'sports_martial_arts' },
    { value: 'organization', label: 'Organisasi', icon: 'corporate_fare' },
    { value: 'club', label: 'Klub', icon: 'groups' }
]

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

const handleRegister = async () => {
    if (form.value.password !== form.value.confirmPassword) {
        error.value = 'Kata sandi tidak cocok'
        return
    }

    isLoading.value = true
    error.value = null

    try {
        const payload = {
            email: form.value.email,
            password: form.value.password,
            userType: form.value.userType,
            ...form.value[form.value.userType]
        }

        console.log('Registering:', payload)
        // TODO: Call API to register user
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Redirect to login
        window.location.href = '/auth/login'
    } catch (err) {
        console.error('Registration failed:', err)
        error.value = err.message || 'Pendaftaran gagal. Silakan coba lagi.'
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.spinner {
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-left-color: currentColor;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
