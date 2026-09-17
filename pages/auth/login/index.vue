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
                            class="text-logo-id">.net</span></span>
                </div>
                <h1 class="text-white text-5xl font-black leading-tight tracking-tight mb-4 font-display" v-html="t('auth.login.title')"></h1>
                <div class="text-slate-300 text-lg leading-relaxed max-w-md font-body">
                    {{ t('auth.login.desc') }}
                </div>
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
                                class="text-logo-id">.net</span></span>
                    </div>
                </div>

                <div class="text-center sm:text-left">
                    <h2 class="text-3xl font-black text-slate-900 tracking-tight font-display">{{ t('auth.login.welcome') }}</h2>
                    <div class="mt-2 text-slate-500 text-sm font-body">{{ t('auth.login.welcome_sub') }}</div>
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
                        <BaseSelect v-model="selectedDemoAccount" :options="demoAccountOptions" label="Select Demo Account Type" placeholder="-- Select Account --" @update:model-value="selectDemoUser" />
                    </div>

                    <BaseInput v-model="form.email" :label="t('auth.login.email_label')" :placeholder="t('auth.login.email_placeholder')" type="email"
                        icon="ph:envelope-simple" required :error="errors.email"
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

                <div class="relative my-8 flex items-center gap-4 font-body">
                    <div class="flex-1 border-t border-slate-200"></div>
                    <span class="text-xs sm:text-sm text-slate-400 font-medium font-body shrink-0">{{ t('auth.login.or_login_with') }}</span>
                    <div class="flex-1 border-t border-slate-200"></div>
                </div>

                <div class="mt-6">
                    <BaseButton variant="outline" block icon="logos:google-icon" @click="handleGoogleLogin"
                        :loading="isLoading && !form.email">
                        {{ t('auth.login.login_with_google') }}
                    </BaseButton>
                </div>

                <div class="mt-8 text-center text-sm text-slate-600 font-body">
                    {{ t('auth.login.dont_have_account') }}
                    <NuxtLink to="/auth/register"
                        class="font-black text-navy hover:text-primary transition-colors">{{ t('auth.login.register_here') }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useFormValidation } from '~/composables/useFormValidation'
import { useToast } from '~/composables/useToast'
 
const route = useRoute()
const { t, te } = useI18n()
const { login, loginWithEmail, isLoggedIn, user, initializeAuth } = useAuth()
const toast = useToast()

const form = ref({
    email: '',
    password: '',
    rememberMe: true
})

const checkAndRedirect = () => {
    if (route.query.expired === 'true') return
    if (isLoggedIn.value && user.value) {
        let redirect = (route.query.redirect as string) || '/dashboard'
        if ((!route.query.redirect || redirect === '/dashboard') && user.value?.role === 'archer') {
            redirect = '/dashboard/archer/tournaments'
        }
        window.location.href = redirect
    }
}

watch([isLoggedIn, user], () => {
    checkAndRedirect()
}, { immediate: true })

const isDev = computed(() => {
    if (process.client) {
        const h = window.location.hostname
        return (
            h === 'localhost' ||
            h === '127.0.0.1' ||
            h.includes('dev.archeris.net') ||
            h.includes('dev.') ||
            h.includes('staging') ||
            h.endsWith('.local') ||
            h.startsWith('192.168.') ||
            h.startsWith('10.') ||
            route.query.dev === 'true' ||
            import.meta.dev
        )
    }
    return import.meta.dev
})

const selectedDemoAccount = ref('')
const demoAccountOptions = [
    { title: 'Archer (stewie4king@gmail.com / 12345)', value: 'archer' },
    { title: 'Archer (ichsanfadhil67@gmail.com / 123456)', value: 'archer_ichsan' },
    { title: 'Organizer / EO (ngekode24@gmail.com / 123456)', value: 'organizer' },
]

const selectDemoUser = (role: string) => {
    if (!role) return
    const credentials: Record<string, { email: string, password: string }> = {
        archer: { email: 'stewie4king@gmail.com', password: '12345' },
        archer_ichsan: { email: 'ichsanfadhil67@gmail.com', password: '123456' },
        organizer: { email: 'ngekode24@gmail.com', password: '123456' },
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
    title: computed(() => (t('auth.login.seo_title', 'Masuk ke Akun')) + ' - Archeris.net')
})
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

const getMediaUrl = (filename: string) => {
    if (!filename) return ''
    if (filename.startsWith('http')) return filename
    // apiBaseUrl already contains /api/v1
    return `${apiBaseUrl}/media/${filename}`
}

const isLoading = ref(false)

const { errors, validate, validateForm, rules } = useFormValidation()

const userAvatar = ref<string | null>(null)

watch(() => form.value.email, async (newEmail) => {
    if (!newEmail || !newEmail.includes('@')) {
        userAvatar.value = null
        return
    }

    // Debounce or wait for blur if preferred, but let's try real-time
    try {
        const response = await $fetch<{ avatar_url?: string }>(`${apiBaseUrl}/auth/avatar/${encodeURIComponent(newEmail)}`)
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
let slideInterval: any = null

const startSlideshow = () => {
    slideInterval = setInterval(() => {
        currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length
    }, 2000)
}

// Redirect if already logged in or auto-fill in development
onMounted(async () => {
    startSlideshow()

    if (route.query.expired === 'true') {
        const cookiesToClear = ['auth_token', 'refresh_token', 'session', 'token']
        cookiesToClear.forEach(c => {
            document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
            document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; max-age=0;`
        })
        try {
            sessionStorage.removeItem('auth_user')
            localStorage.removeItem('auth_user')
            localStorage.removeItem('auth_token')
        } catch {}
        return
    }

    await initializeAuth()
    checkAndRedirect()
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
        const welcomeMsg = user.value?.full_name ? `Welcome back, ${user.value.full_name}!` : 'Login successful!'
        sessionStorage.setItem('auth_toast', welcomeMsg)

        // Full page reload so auth state is restored from cookie/SSR
        let redirect = route.query.redirect || '/dashboard'
        if ((!route.query.redirect || redirect === '/dashboard') && user.value?.role === 'archer') {
            redirect = '/dashboard/archer/tournaments'
        }
        window.location.href = redirect
    } catch (err: any) {
        console.error('Auth failed:', err)
        const code = err?.data?.code || err?.response?._data?.code
        const serverError = err?.data?.error || err?.response?._data?.error || err?.message

        let errorMessage = ''

        if (code && te(`auth.errors.${code}`)) {
            errorMessage = t(`auth.errors.${code}`)
        } else if (err.status === 404 || err.statusCode === 404 || code === 'user_not_found') {
            errorMessage = te('auth.errors.user_not_found')
                ? t('auth.errors.user_not_found')
                : (serverError || 'Account not found. Please check your email or register.')
        } else if (code === 'invalid_password') {
            errorMessage = te('auth.errors.invalid_password')
                ? t('auth.errors.invalid_password')
                : (serverError || 'Incorrect password. Please try again.')
        } else if (code === 'account_inactive' || err.status === 403 || err.statusCode === 403) {
            errorMessage = te('auth.errors.account_inactive')
                ? t('auth.errors.account_inactive')
                : (serverError || 'Your account is inactive or has been suspended.')
        } else if (code === 'use_google_signin') {
            errorMessage = te('auth.errors.use_google_signin')
                ? t('auth.errors.use_google_signin')
                : (serverError || 'This account was registered with Google. Please sign in with Google.')
        } else if (serverError) {
            errorMessage = serverError
        } else if (err.status === 500 || err.statusCode === 500) {
            errorMessage = te('auth.errors.server_error')
                ? t('auth.errors.server_error')
                : 'A server error occurred. Please try again later.'
        } else {
            errorMessage = te('auth.errors.invalid_credentials')
                ? t('auth.errors.invalid_credentials')
                : 'Invalid email or password. Please try again.'
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
