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
                    <span class="text-white text-3xl font-black tracking-tight font-display">Archeris<span
                            class="text-logo-id">.id</span></span>
                </div>
                <h1 class="text-white text-5xl font-black leading-tight tracking-tight mb-4 font-display" v-html="t('auth.login.title')"></h1>
                <p class="text-slate-300 text-lg leading-relaxed max-w-md font-body">
                    {{ t('auth.login.desc') }}
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
                    <span>{{ t('auth.login.archers_joined') }}</span>
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
                        <span class="text-navy text-2xl font-black tracking-tight font-display">Archeris<span
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
                    <h2 class="text-3xl font-black text-slate-900 tracking-tight font-display">{{ t('auth.login.welcome') }}</h2>
                    <p class="mt-2 text-slate-500 text-sm font-body">{{ t('auth.login.welcome_sub') }}</p>
                </div>

                <form @submit.prevent="handleEmailAuth" class="space-y-6">
                    <div v-if="isDev" class="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-xs space-y-2 mb-2 font-body">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-amber-800 flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                development mode / dev mode
                            </span>
                            <span class="text-[10px] bg-amber-200/60 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">auto-fill</span>
                        </div>
                        <label class="block font-bold text-slate-700">select demo account type:</label>
                        <select @change="selectDemoUser($event.target.value)" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium">
                            <option value="">-- select account --</option>
                            <option value="archer">archer (archer) - stewie4king@gmail.com</option>
                            <option value="organization">organization (club) - ichsanfadhil67@gmail.com</option>
                            <option value="seller">seller (shop) - seller@panahan.com</option>
                        </select>
                    </div>

                    <BaseInput v-model="form.email" :label="t('auth.login.email_label')" :placeholder="t('auth.login.email_placeholder')" type="email"
                        icon="mail" required :error="errors.email"
                        @update:model-value="validate('email', form.email, [rules.required(), rules.email()])" />

                    <div class="space-y-2">
                        <div class="flex items-center justify-between px-1">
                            <label class="text-xs font-bold text-navy  tracking-wider">{{ t('auth.login.password_label') }}</label>
                            <NuxtLink to="/auth/forgot-password" class="text-xs font-bold transition-colors">
                                {{ t('auth.login.forgot_password') }}
                            </NuxtLink>
                        </div>
                        <BaseInput v-model="form.password" :placeholder="t('auth.login.password_placeholder')" type="password" icon="lock" required
                            :error="errors.password"
                            @update:model-value="validate('password', form.password, [rules.required()])" />
                    </div>

                    <div class="flex items-center">
                        <BaseCheckbox v-model="form.rememberMe" :label="t('auth.login.remember_me')" />
                    </div>

                    <div>
                        <BaseButton type="submit" variant="gold" block :loading="isLoading" icon-right="ph:arrow-right">
                            {{ t('auth.login.login_now') }}
                        </BaseButton>
                    </div>
                </form>

                <div class="relative mt-8 font-body">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-200"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-4 bg-white text-slate-500 font-medium font-body">{{ t('auth.login.or_login_with') }}</span>
                    </div>
                </div>

                <div class="mt-6">
                    <BaseButton variant="outline" block icon="logos:google-icon" @click="handleGoogleLogin"
                        :loading="isLoading && !form.email">
                        {{ t('auth.login.login_with_google') }}
                    </BaseButton>
                </div>

                <p class="mt-8 text-center text-sm text-slate-600 font-body">
                    {{ t('auth.login.dont_have_account') }}
                    <NuxtLink to="/auth/register"
                        class="font-black text-navy hover:text-primary-hover hover:underline transition-all">{{ t('auth.login.register_here') }}
                    </NuxtLink>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/composables/useAuth'
import { useFormValidation } from '~/composables/useFormValidation'
import { useToast } from '~/composables/useToast'
 
const route = useRoute()
const { t } = useI18n()
const { login, loginWithEmail, isLoggedIn, user } = useAuth()
const toast = useToast()

const isDev = computed(() => {
    if (process.client) {
        return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || import.meta.dev
    }
    return import.meta.dev
})

const selectDemoUser = (role) => {
    if (!role) return
    const credentials = {
        archer: { email: 'stewie4king@gmail.com', password: '12345' },
        organization: { email: 'ichsanfadhil67@gmail.com', password: '123456' },
        seller: { email: 'seller@panahan.com', password: '12345' }
    }
    const creds = credentials[role]
    if (creds) {
        form.value.email = creds.email
        form.value.password = creds.password
        validate('email', form.value.email, [rules.required(), rules.email()])
        validate('password', form.value.password, [rules.required()])
    }
}

useHead({
    title: 'Login - Archeris.net'
})
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

const getMediaUrl = (filename) => {
    if (!filename) return ''
    if (filename.startsWith('http')) return filename
    // apiBaseUrl already contains /api/v1
    return `${apiBaseUrl}/media/${filename}`
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
        const response = await $fetch(`${apiBaseUrl}/auth/avatar/${encodeURIComponent(newEmail)}`)
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
            redirect = '/dashboard/archer/events'
        }
        window.location.href = redirect
        return
    }

    // Auto-fill for development
    if (import.meta.dev) {
        try {
            const { email, password } = await $fetch(`${apiBaseUrl}/auth/sample-user`)
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
            redirect = '/dashboard/archer/events'
        }
        window.location.href = redirect
    } catch (err) {
        console.error('Auth failed:', err)
        let errorMessage = 'Invalid email or password'

        // Handle different error types
        if (err.status === 401 || err.statusCode === 401) {
            errorMessage = 'Invalid email or password. Please try again.'
        } else if (err.status === 500 || err.statusCode === 500) {
            errorMessage = 'A server error occurred. Please try again later.'
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
        let errorMessage = 'Failed to connect to Google. Please try again.'

        // Handle different error types
        if (err.status === 401 || err.statusCode === 401) {
            errorMessage = 'Authentication failed. Please try again.'
        } else if (err.status === 500 || err.statusCode === 500) {
            errorMessage = 'A server error occurred. Please try again later.'
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
    /* Falling back to global Bricolage Grotesque */
}

.font-body {
    /* Falling back to global NovaText */
}
</style>
