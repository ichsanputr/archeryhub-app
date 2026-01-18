<template>
    <div class="bg-surface font-display antialiased h-screen flex overflow-hidden">
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
                    <div class="flex items-center gap-4 text-slate-300 text-sm font-medium font-body">
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
                    <NuxtLink class="hover:text-white transition-colors" to="/privacy">Privacy</NuxtLink>
                    <span class="w-1 h-1 rounded-full bg-slate-500"></span>
                    <NuxtLink class="hover:text-white transition-colors" to="/terms">Terms</NuxtLink>
                </div>
            </div>
        </div>

        <!-- Right Side: Registration Form -->
        <div
            class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white w-full lg:w-[600px] xl:w-[700px] overflow-y-auto no-scrollbar">
            <div class="mx-auto w-full max-w-sm lg:w-96">
                <!-- Logo (Mobile Only) -->
                <div class="lg:hidden mb-10 text-center">
                    <div class="inline-flex items-center gap-3">
                        <div class="w-10 h-10 flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" class="w-10 h-10 object-contain" />
                        </div>
                        <span class="text-navy text-2xl font-bold tracking-tight font-display">Archeryhub.id</span>
                    </div>
                </div>

                <div class="text-center lg:text-left">
                    <h2 class="text-3xl font-black tracking-tight text-navy font-display">Buat Akun Baru</h2>
                    <p class="mt-2 text-sm text-slate-500 font-body">Gabung bareng komunitas panahan terbesar di
                        Indonesia.
                    </p>
                </div>

                <div class="mt-10">
                    <form @submit.prevent="handleRegister" class="space-y-5">
                        <!-- Full Name -->
                        <div>
                            <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2" for="name">
                                Nama Lengkap
                            </label>
                            <div class="relative rounded-lg shadow-sm">
                                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span class="material-symbols-outlined text-slate-400 text-[20px]">person</span>
                                </div>
                                <input v-model="form.fullName" autocomplete="name"
                                    class="block w-full rounded-lg border-gray-200 bg-background-light pl-10 focus:border-primary focus:ring-primary sm:text-sm py-3 transition-colors placeholder:text-slate-400"
                                    id="name" name="name" placeholder="John Doe" required type="text" />
                            </div>
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2" for="email">
                                Alamat Email
                            </label>
                            <div class="relative rounded-lg shadow-sm">
                                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span class="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                                </div>
                                <input v-model="form.email" autocomplete="email"
                                    class="block w-full rounded-lg border-gray-200 bg-background-light pl-10 focus:border-primary focus:ring-primary sm:text-sm py-3 transition-colors placeholder:text-slate-400"
                                    id="email" name="email" placeholder="you@example.com" required type="email" />
                            </div>
                        </div>

                        <!-- Role -->
                        <div>
                            <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2" for="role">
                                Aku adalah seorang...
                            </label>
                            <div class="relative rounded-lg shadow-sm">
                                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span class="material-symbols-outlined text-slate-400 text-[20px]">badge</span>
                                </div>
                                <select v-model="form.role"
                                    class="block w-full rounded-lg border-gray-200 bg-background-light pl-10 pr-10 focus:border-primary focus:ring-primary sm:text-sm py-3 transition-colors text-slate-700 cursor-pointer appearance-none"
                                    id="role" name="role">
                                    <option value="athlete">Atlet</option>
                                    <option value="manager">Manajer Klub</option>
                                    <option value="fan">Penggemar</option>
                                </select>
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span
                                        class="material-symbols-outlined text-slate-400 text-[20px]">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <!-- Password -->
                        <div>
                            <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2"
                                for="password">
                                Kata Sandi
                            </label>
                            <div class="relative rounded-lg shadow-sm">
                                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span class="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                                </div>
                                <input v-model="form.password" autocomplete="new-password"
                                    class="block w-full rounded-lg border-gray-200 bg-background-light pl-10 focus:border-primary focus:ring-primary sm:text-sm py-3 transition-colors placeholder:text-slate-400"
                                    id="password" name="password" placeholder="••••••••" required type="password" />
                            </div>
                            <p class="mt-1 text-[10px] text-slate-400 font-body">Minimal 8 karakter ya.</p>
                        </div>

                        <!-- Terms -->
                        <div class="flex items-start pt-2">
                            <div class="flex h-5 items-center">
                                <input v-model="form.terms"
                                    class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                    id="terms" name="terms" type="checkbox" required />
                            </div>
                            <div class="ml-3 text-sm font-body">
                                <label class="font-medium text-slate-600" for="terms">Aku setuju sama <NuxtLink
                                        class="font-black text-navy hover:text-primary-hover" to="/terms">Syarat &
                                        Ketentuan
                                    </NuxtLink> dan <NuxtLink class="font-black text-navy hover:text-primary-hover"
                                        to="/privacy">Kebijakan Privasi</NuxtLink></label>
                            </div>
                        </div>

                        <button :disabled="isLoading"
                            class="flex w-full justify-center items-center gap-2 rounded-lg border border-transparent bg-primary py-3.5 px-4 text-sm font-bold text-navy shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                            type="submit">
                            <span v-if="isLoading" class="flex items-center gap-2">
                                <div class="spinner size-5"></div>
                                Lagi buat akun...
                            </span>
                            <span v-else class="flex items-center gap-2">
                                Daftar Sekarang
                                <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </span>
                        </button>
                    </form>

                    <div class="mt-8 text-center font-body">
                        <p class="text-sm text-slate-600">
                            Udah punya akun?
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
import { ref } from 'vue'

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

.font-display {
    font-family: 'Lexend', sans-serif;
}

.font-body {
    font-family: 'Noto Sans', sans-serif;
}
</style>
