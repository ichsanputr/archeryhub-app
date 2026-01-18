<template>
    <div class="bg-background-light text-slate-900 font-display antialiased h-screen flex overflow-hidden">
        <!-- Left Side: Visual Hero (Desktop Only) -->
        <div class="hidden lg:flex lg:w-1/2 relative bg-navy overflow-hidden flex-col justify-end">
            <div class="absolute inset-0 z-0">
                <img alt="Archery action shot" class="w-full h-full object-cover mix-blend-overlay opacity-50"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o" />
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent"></div>
            </div>
            <div class="relative z-10 p-16 max-w-2xl">
                <div class="flex items-center gap-4 mb-12">
                    <div class="w-12 h-12 flex items-center justify-center transition-all duration-300">
                        <img src="/logo.png" alt="Logo" class="w-12 h-12 object-contain" />
                    </div>
                    <span class="text-white text-3xl font-bold tracking-tight font-display">Archeryhub.id</span>
                </div>
                <h1 class="text-white text-5xl font-black leading-tight tracking-tight mb-4 font-display">
                    Tingkatkan <br />
                    Panahan Indonesia
                </h1>
                <p class="text-slate-300 text-lg leading-relaxed max-w-md font-body">
                    Gabung sama platform digital panahan nomor satu buat kelola turnamen, atlet, sama skor real-time.
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

        <!-- Right Side: Login Form -->
        <div
            class="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 overflow-y-auto h-full no-scrollbar">
            <div class="w-full max-w-sm space-y-8">
                <div class="text-center sm:text-left">
                    <h2 class="text-3xl font-black text-slate-900 tracking-tight font-display">Wah, Masuk Lagi Yuk!</h2>
                    <p class="mt-2 text-slate-500 text-sm font-body">Masukin email sama password kamu buat lanjut ya.
                    </p>
                </div>

                <!-- Error Message -->
                <div v-if="error"
                    class="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center font-body">
                    {{ error }}
                </div>

                <form @submit.prevent="handleEmailAuth" class="space-y-6">
                    <div>
                        <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-2"
                            for="email">Alamat Email</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                            </div>
                            <input v-model="form.email"
                                class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-gray-50 hover:bg-white"
                                id="email" name="email" placeholder="name@company.com" required type="email" />
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block text-xs font-bold text-navy uppercase tracking-wider"
                                for="password">Kata Sandi</label>
                            <a class="text-xs font-bold text-primary hover:text-primary-hover transition-colors"
                                href="#">Lupa password?</a>
                        </div>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                            </div>
                            <input v-model="form.password"
                                class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-gray-50 hover:bg-white"
                                id="password" name="password" placeholder="••••••••" required type="password" />
                        </div>
                    </div>
                    <div class="flex items-center">
                        <input class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                            id="remember-me" name="remember-me" type="checkbox" />
                        <label class="ml-2 block text-sm text-slate-600 cursor-pointer select-none font-body"
                            for="remember-me">Ingat saya selama 30 hari</label>
                    </div>
                    <div>
                        <button :disabled="isLoading"
                            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50"
                            type="submit">
                            <span v-if="isLoading" class="flex items-center gap-2">
                                <div class="spinner size-5"></div>
                                Lagi masuk...
                            </span>
                            <span v-else class="flex items-center gap-2">
                                Masuk Sekarang
                                <span class="material-symbols-outlined text-lg">arrow_forward</span>
                            </span>
                        </button>
                    </div>
                </form>

                <div class="relative mt-8 font-body">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-200"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-4 bg-white text-slate-500 font-medium font-body">Atau masuk lewat</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-6">
                    <button @click="handleGoogleLogin"
                        class="flex items-center justify-center gap-3 w-full py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-700 hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 font-body"
                        type="button">
                        <svg class="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <NuxtLink to="/"
                        class="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-body">
                        <span class="material-symbols-outlined text-lg">visibility</span>
                        Guest
                    </NuxtLink>
                </div>

                <p class="mt-8 text-center text-sm text-slate-600 font-body">
                    Belum punya akun?
                    <NuxtLink to="/auth/register"
                        class="font-black text-navy hover:text-primary-hover hover:underline transition-all">Daftar di
                        sini!
                    </NuxtLink>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
    layout: 'blank',
    title: 'Login'
})

const route = useRoute()
const router = useRouter()
const { login, loginWithEmail, isLoggedIn } = useAuth()

const isLoading = ref(false)
const error = ref(null)

const form = ref({
    email: '',
    password: ''
})

// Redirect if already logged in
onMounted(() => {
    if (isLoggedIn.value) {
        const redirect = route.query.redirect || '/'
        router.replace(redirect)
    }
})

const handleEmailAuth = async () => {
    isLoading.value = true
    error.value = null

    try {
        await loginWithEmail(form.value.email, form.value.password)
        const redirect = route.query.redirect || '/'
        router.push(redirect)
    } catch (err) {
        console.error('Auth failed:', err)
        error.value = err.message || 'Invalid email or password'
    } finally {
        isLoading.value = false
    }
}

const handleGoogleLogin = async () => {
    isLoading.value = true
    error.value = null

    try {
        await login()
    } catch (err) {
        console.error('Google login failed:', err)
        error.value = 'Failed to connect to Google. Please try again.'
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

.font-display {
    font-family: 'Lexend', sans-serif;
}

.font-body {
    font-family: 'Noto Sans', sans-serif;
}
</style>
