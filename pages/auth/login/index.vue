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
                    <div v-if="userAvatar" class="mb-6 flex justify-center sm:justify-start">
                        <div class="relative">
                            <img :src="userAvatar" alt="User Avatar"
                                class="w-20 h-20 rounded-full object-cover border-4 border-primary shadow-lg transition-all duration-500 scale-110" />
                            <div
                                class="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white">
                            </div>
                        </div>
                    </div>
                    <h2 class="text-3xl font-black text-slate-900 tracking-tight font-display">Masuk Lagi Yuk!</h2>
                    <p class="mt-2 text-slate-500 text-sm font-body">Masukin email sama password kamu buat lanjut ya.
                    </p>
                </div>

                <form @submit.prevent="handleEmailAuth" class="space-y-6">
                    <BaseInput v-model="form.email" label="Alamat Email" placeholder="name@company.com" type="email"
                        icon="mail" required :error="errors.email"
                        @update:model-value="validate('email', form.email, [rules.required(), rules.email()])" />

                    <div class="space-y-2">
                        <div class="flex items-center justify-between px-1">
                            <label class="text-xs font-bold text-navy  tracking-wider">Kata Sandi</label>
                            <NuxtLink to="/auth/forgot-password" class="text-xs font-bold transition-colors">
                                Lupa password?
                            </NuxtLink>
                        </div>
                        <BaseInput v-model="form.password" placeholder="••••••••" type="password" icon="lock" required
                            :error="errors.password"
                            @update:model-value="validate('password', form.password, [rules.required()])" />
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useFormValidation } from '~/composables/useFormValidation'
import { useToast } from '~/composables/useToast'

const route = useRoute()
const { login, loginWithEmail, isLoggedIn, user } = useAuth()
const toast = useToast()

useHead({
    title: 'Masuk - Archeryhub.id'
})
const config = useRuntimeConfig()

const getMediaUrl = (filename) => {
    if (!filename) return ''
    if (filename.startsWith('http')) return filename
    // apiBaseUrl already contains /api/v1
    return `${config.public.apiBaseUrl}/media/${filename}`
}

const isLoading = ref(false)

const { errors, validate, validateForm, rules } = useFormValidation()

const userAvatar = ref(null)

watch(() => form.value.email, async (newEmail) => {
    if (!newEmail || !newEmail.includes('@')) {
        userAvatar.value = null
        return
    }

    // Debounce or wait for blur if preferred, but let's try real-time
    try {
        const response = await $fetch(`${config.public.apiBaseUrl}/auth/avatar/${encodeURIComponent(newEmail)}`)
        if (response && response.avatar_url) {
            userAvatar.value = getMediaUrl(response.avatar_url)
        } else {
            userAvatar.value = null
        }
    } catch (err) {
        userAvatar.value = null
    }
})

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
        let redirect = route.query.redirect || '/dashboard'
        if ((!route.query.redirect || redirect === '/dashboard') && user.value?.role === 'archer') {
            redirect = '/dashboard/archers/events'
        }
        window.location.href = redirect
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
        // Full page reload so auth state is restored from cookie/SSR
        let redirect = route.query.redirect || '/dashboard'
        if ((!route.query.redirect || redirect === '/dashboard') && user.value?.role === 'archer') {
            redirect = '/dashboard/archers/events'
        }
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
