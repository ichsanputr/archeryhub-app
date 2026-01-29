<template>
    <div class="relative h-screen bg-navy text-slate-900 font-display antialiased flex overflow-hidden">
        <!-- Background Hero (Full screen on mobile, absolute behind) -->
        <div class="absolute inset-0 z-0 lg:w-1/2 lg:relative lg:flex overflow-hidden flex-col justify-end">
            <div class="absolute inset-0 z-0 h-full w-full">
                <div v-for="(slide, index) in slides" :key="index"
                    class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    :class="currentSlideIndex === index ? 'opacity-40 lg:opacity-50' : 'opacity-0'">
                    <img :src="slide" :alt="'Slide ' + (index + 1)"
                        class="w-full h-full object-cover mix-blend-overlay" />
                </div>
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
                        <img alt="Archer" class="w-8 h-8 rounded-full border-2 border-navy bg-slate-200 object-cover"
                            :src="getMediaUrl('94.jpg')" />
                        <img alt="Archer" class="w-8 h-8 rounded-full border-2 border-navy bg-slate-200 object-cover"
                            :src="getMediaUrl('18.jpg')" />
                        <img alt="Archer" class="w-8 h-8 rounded-full border-2 border-navy bg-slate-200 object-cover"
                            :src="getMediaUrl('8.jpg')" />
                        <div
                            class="w-8 h-8 rounded-full border-2 border-navy bg-slate-700 flex items-center justify-center text-[10px] text-white">
                            +2k</div>
                    </div>
                    <span>Pemanah udah gabung di Archeryhub.id</span>
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

                <form @submit.prevent="handleEmailAuth" class="space-y-6">
                    <BaseInput v-model="form.email" label="Alamat Email" placeholder="name@company.com" type="email"
                        icon="mail" required :error="errors.email"
                        @blur="validate('email', form.email, [rules.required(), rules.email()])" />

                    <div class="space-y-2">
                        <div class="flex items-center justify-between px-1">
                            <label class="text-xs font-bold text-navy uppercase tracking-wider">Kata Sandi</label>
                        </div>
                        <BaseInput v-model="form.password" placeholder="••••••••" type="password" icon="lock" required
                            :error="errors.password" @blur="validate('password', form.password, [rules.required()])" />
                    </div>

                    <div class="flex items-center">
                        <BaseCheckbox v-model="form.rememberMe" label="Ingat saya" />
                    </div>

                    <div>
                        <BaseButton type="submit" variant="gold" block :loading="isLoading" icon-right="ph:arrow-right">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useFormValidation } from '~/composables/useFormValidation'
import { useToast } from '~/composables/useToast'

const route = useRoute()
const router = useRouter()
const { login, loginWithEmail, isLoggedIn } = useAuth()
const toast = useToast()
const config = useRuntimeConfig()

const getMediaUrl = (filename) => {
    if (!filename) return ''
    if (filename.startsWith('http')) return filename
    return `${config.public.apiBaseUrl}/api/v1/media/${filename}`
}

const isLoading = ref(false)

const { errors, validate, validateForm, rules } = useFormValidation()

const slides = ['/slide-1.jpeg', '/slide-2.jpeg', '/slide-3.jpeg']
const currentSlideIndex = ref(0)
let slideInterval = null

const startSlideshow = () => {
    slideInterval = setInterval(() => {
        currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length
    }, 2000)
}

const form = ref({
    email: '',
    password: '',
    rememberMe: true
})

// Redirect if already logged in or auto-fill in development
onMounted(async () => {
    startSlideshow()

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

    try {
        await loginWithEmail(form.value.email, form.value.password)
        // Redirect to original destination or home
        const redirect = route.query.redirect || '/'
        window.location.href = redirect
    } catch (err) {
        console.error('Auth failed:', err)
        let errorMessage = 'Email atau kata sandi salah'

        // Handle different error types
        if (err.status === 401 || err.statusCode === 401) {
            errorMessage = 'Email atau kata sandi salah. Silakan coba lagi.'
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
    } finally {
        isLoading.value = false
    }
}

const handleGoogleLogin = async () => {
    isLoading.value = true

    try {
        await login()
    } catch (err) {
        console.error('Google login failed:', err)
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
        isLoading.value = false
    }
}

onUnmounted(() => {
    if (slideInterval) clearInterval(slideInterval)
})
</script>

<style scoped>
.font-display {
    font-family: 'Lexend', sans-serif;
}

.font-body {
    font-family: 'Noto Sans', sans-serif;
}
</style>
