<template>
    <div class="min-h-screen bg-white font-body text-navy antialiased h-screen flex overflow-hidden">
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
                    <div
                        class="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-navy mb-8 shadow-lg shadow-primary/20">
                        <span class="material-symbols-outlined text-4xl">target</span>
                    </div>
                    <h2 class="text-4xl xl:text-5xl font-black tracking-tight leading-tight mb-6 font-display">
                        Bergabunglah dalam Revolusi Digital Panahan Indonesia
                    </h2>
                    <div class="flex flex-col gap-4 text-white/70 text-sm font-medium">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary">check_circle</span>
                            <span>Kelola Klub Secara Profesional</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary">check_circle</span>
                            <span>Pantau Skor Secara Real-time</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary">check_circle</span>
                            <span>Ikuti Turnamen Skala Nasional</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-4 text-xs text-white/40 border-t border-white/10 pt-6">
                    <span>© 2024 Archery Hub Indonesia</span>
                    <span class="w-1 h-1 rounded-full bg-white/20"></span>
                    <NuxtLink to="/privacy" class="hover:text-white transition-colors">Privasi</NuxtLink>
                    <span class="w-1 h-1 rounded-full bg-white/20"></span>
                    <NuxtLink to="/terms" class="hover:text-white transition-colors">Ketentuan</NuxtLink>
                </div>
            </div>
        </div>

        <!-- Right Side: Registration Form -->
        <div
            class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white w-full lg:w-[550px] xl:w-[650px] overflow-y-auto no-scrollbar">
            <div class="mx-auto w-full max-w-sm lg:w-96">
                <!-- Logo (Mobile Only) -->
                <div class="lg:hidden mb-10 text-center">
                    <div class="inline-flex items-center gap-3">
                        <div class="w-10 h-10 bg-navy rounded-lg flex items-center justify-center text-primary">
                            <span class="material-symbols-outlined text-2xl">target</span>
                        </div>
                        <span class="text-navy text-2xl font-bold tracking-tight font-display">Archery Hub</span>
                    </div>
                </div>

                <div class="text-center lg:text-left">
                    <h2 class="text-3xl font-black tracking-tight text-navy font-display">Buat Akun</h2>
                    <p class="mt-2 text-sm text-text-sub">Bergabung dengan komunitas panahan terbesar di Indonesia.</p>
                </div>

                <div class="mt-10">
                    <form @submit.prevent="handleRegister" class="space-y-5">
                        <!-- Full Name -->
                        <div>
                            <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2"
                                for="name">Nama Lengkap</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span class="material-symbols-outlined text-text-sub/50 text-xl">person</span>
                                </div>
                                <input v-model="form.fullName"
                                    class="block w-full rounded-lg border-gray-200 bg-gray-50 pl-10 focus:border-primary focus:ring-primary text-sm py-3 transition-colors placeholder:text-text-sub/40"
                                    id="name" placeholder="Contoh: Budi Santoso" required type="text" />
                            </div>
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2"
                                for="email">Alamat Email</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span class="material-symbols-outlined text-text-sub/50 text-xl">mail</span>
                                </div>
                                <input v-model="form.email"
                                    class="block w-full rounded-lg border-gray-200 bg-gray-50 pl-10 focus:border-primary focus:ring-primary text-sm py-3 transition-colors placeholder:text-text-sub/40"
                                    id="email" placeholder="email@contoh.com" required type="email" />
                            </div>
                        </div>

                        <!-- Role Selection -->
                        <div>
                            <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2"
                                for="role">Saya adalah seorang...</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span class="material-symbols-outlined text-text-sub/50 text-xl">badge</span>
                                </div>
                                <select v-model="form.role"
                                    class="block w-full rounded-lg border-gray-200 bg-gray-50 pl-10 pr-10 focus:border-primary focus:ring-primary text-sm py-3 transition-colors text-navy cursor-pointer appearance-none"
                                    id="role">
                                    <option value="athlete">Atlet</option>
                                    <option value="manager">Manajer Klub</option>
                                    <option value="fan">Penggemar</option>
                                </select>
                                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span class="material-symbols-outlined text-text-sub/50 text-xl">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <!-- Password -->
                        <div>
                            <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2"
                                for="password">Kata Sandi</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span class="material-symbols-outlined text-text-sub/50 text-xl">lock</span>
                                </div>
                                <input v-model="form.password"
                                    class="block w-full rounded-lg border-gray-200 bg-gray-50 pl-10 focus:border-primary focus:ring-primary text-sm py-3 transition-colors placeholder:text-text-sub/40"
                                    id="password" placeholder="••••••••" required type="password" />
                            </div>
                            <p class="mt-1 text-[10px] text-text-sub">Minimal 8 karakter.</p>
                        </div>

                        <!-- Terms -->
                        <div class="flex items-start pt-2">
                            <div class="flex h-5 items-center">
                                <input v-model="form.terms"
                                    class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                    id="terms" type="checkbox" required />
                            </div>
                            <div class="ml-3 text-sm">
                                <label class="font-medium text-text-sub" for="terms">
                                    Saya setuju dengan <NuxtLink to="/terms"
                                        class="font-bold text-navy hover:underline">Ketentuan</NuxtLink> dan <NuxtLink
                                        to="/privacy" class="font-bold text-navy hover:underline">Kebijakan Privasi
                                    </NuxtLink>.
                                </label>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" :disabled="isLoading"
                            class="flex w-full justify-center items-center gap-2 rounded-lg border border-transparent bg-primary py-3.5 px-4 text-sm font-bold text-navy shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="isLoading"
                                class="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                            <span v-else>Daftar Sekarang</span>
                            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                    </form>

                    <!-- Footer Links -->
                    <div class="mt-8 text-center">
                        <p class="text-sm text-text-sub">
                            Sudah memiliki akun?
                            <NuxtLink to="/auth/login" class="font-bold text-navy hover:underline transition-colors">
                                Masuk di sini</NuxtLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'blank'
})

const isLoading = ref(false)
const form = ref({
    fullName: '',
    email: '',
    role: 'athlete',
    password: '',
    terms: false
})

const handleRegister = async () => {
    isLoading.value = true
    try {
        console.log('Registering...', form.value)
        // Placeholder for actual registration logic
        await new Promise(resolve => setTimeout(resolve, 1500))
        alert('Pendaftaran berhasil!')
        navigateTo('/auth/login')
    } catch (err) {
        console.error('Registration failed:', err)
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
