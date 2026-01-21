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
            class="relative z-10 w-full lg:w-1/2 bg-white/95 backdrop-blur-sm lg:bg-white flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 overflow-y-auto h-full no-scrollbar">
            <div class="w-full max-w-sm space-y-8">
                <div class="lg:hidden mb-8 text-center">
                    <div class="inline-flex items-center gap-3">
                        <div class="w-10 h-10 flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" class="w-10 h-10 object-contain" />
                        </div>
                        <span class="text-navy text-2xl font-black tracking-tight font-display">Archeryhub<span
                                class="text-logo-id">.id</span></span>
                    </div>
                </div>

                <div class="text-center sm:text-left">
                    <h2 class="text-3xl font-black text-slate-900 tracking-tight font-display">Masuk Lagi Yuk!</h2>
                    <p class="mt-2 text-slate-500 text-sm font-body">Masukin email sama password kamu buat lanjut ya.
                    </p>
                </div>

                <!-- Error Message -->
                <div v-if="error"
                    class="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center font-body">
                    {{ error }}
                </div>

                <form @submit.prevent="handleEmailAuth" class="space-y-6">
                    <BaseInput v-model="form.email" label="Alamat Email" placeholder="name@company.com" type="email"
                        icon="mail" required :error="errors.email"
                        @blur="validate('email', form.email, [rules.required(), rules.email()])" />

                    <div class="space-y-2">
                        <div class="flex items-center justify-between px-1">
                            <label class="text-xs font-bold text-navy uppercase tracking-wider">Kata Sandi</label>
                            <a class="text-xs font-bold text-primary hover:text-primary-hover transition-colors"
                                href="#">Lupa password?</a>
                        </div>
                        <BaseInput v-model="form.password" placeholder="••••••••" type="password" icon="lock" required
                            :error="errors.password" @blur="validate('password', form.password, [rules.required()])" />
                    </div>

                    <div class="flex items-center">
                        <BaseCheckbox v-model="form.rememberMe" label="Ingat saya" />
                    </div>

                    <div>
                        <BaseButton type="submit" variant="gold" block :loading="isLoading" loading-text="Lagi masuk..."
                            icon-right="arrow_forward">
                            Masuk Sekarang
                        </BaseButton>
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

                <div class="mt-6">
                    <BaseButton variant="outline" block icon="logos:google-icon" @click="handleGoogleLogin"
                        :loading="isLoading && !form.email">
                        Masuk dengan Google
                    </BaseButton>
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
import { useFormValidation } from '~/composables/useFormValidation'

const route = useRoute()
const router = useRouter()
const { login, loginWithEmail, isLoggedIn } = useAuth()

const isLoading = ref(false)
const error = ref(null)

const { errors, validate, validateForm, rules } = useFormValidation()

const form = ref({
    email: '',
    password: '',
    rememberMe: false
})

// Redirect if already logged in or auto-fill in development
onMounted(async () => {
    if (isLoggedIn.value) {
        const redirect = route.query.redirect || '/'
        router.replace(redirect)
        return
    }

    // Auto-fill for development
    if (import.meta.dev) {
        try {
            const config = useRuntimeConfig()
            const { email, password } = await $fetch(`${config.public.apiBaseUrl}/auth/sample-user`)
            if (email) {
                form.value.email = email
                form.value.password = password
            }
        } catch (err) {
            console.warn('Failed to fetch sample user for auto-fill:', err)
        }
    }
})

const handleEmailAuth = async () => {
    const isValid = validateForm(form.value, {
        email: [rules.required(), rules.email()],
        password: [rules.required()]
    })

    if (!isValid) return

    isLoading.value = true
    error.value = null

    try {
        await loginWithEmail(form.value.email, form.value.password)
        const redirect = route.query.redirect || '/'
        router.push(redirect)
    } catch (err) {
        console.error('Auth failed:', err)
        error.value = err.message || 'Email atau kata sandi salah'
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
        error.value = 'Gagal menyambung ke Google. Silakan coba lagi.'
        isLoading.value = false
    }
}
</script>

<style scoped>
.font-display {
    font-family: 'Lexend', sans-serif;
}

.font-body {
    font-family: 'Noto Sans', sans-serif;
}
</style>
