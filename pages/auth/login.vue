<template>
    <div class="min-h-screen bg-gray-50 dark:bg-background-dark flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            <!-- Logo and Branding -->
            <div class="text-center mb-8">
                <div class="flex justify-center mb-4">
                    <div
                        class="size-20 rounded-2xl bg-gradient-to-br from-brand-gold to-yellow-600 flex items-center justify-center shadow-lg shadow-brand-gold/20">
                        <span class="material-symbols-outlined text-4xl text-black">target</span>
                    </div>
                </div>
                <h1 class="text-3xl font-black text-gray-900 dark:text-white">Archery Hub</h1>
                <p class="text-brand-gold mt-2">Tournament Management System</p>
            </div>

            <!-- Login Card -->
            <div class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-highlight rounded-2xl p-8 shadow-sm">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">Welcome Back</h2>

                <!-- Error Message -->
                <div v-if="error"
                    class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 text-sm text-center">
                    {{ error }}
                </div>

                <!-- Tab Switcher -->
                <div class="flex mb-6 bg-gray-100 dark:bg-surface-highlight rounded-lg p-1">
                    <button 
                        @click="authMode = 'login'"
                        class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all"
                        :class="authMode === 'login' 
                            ? 'bg-white dark:bg-background-dark text-gray-900 dark:text-white shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400'"
                    >
                        Sign In
                    </button>
                    <button 
                        @click="authMode = 'register'"
                        class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all"
                        :class="authMode === 'register' 
                            ? 'bg-white dark:bg-background-dark text-gray-900 dark:text-white shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400'"
                    >
                        Sign Up
                    </button>
                </div>

                <!-- Email/Password Form -->
                <form @submit.prevent="handleEmailAuth" class="space-y-4 mb-6">
                    <div v-if="authMode === 'register'">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input 
                            v-model="form.fullName"
                            type="text"
                            placeholder="John Doe"
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-surface-highlight bg-white dark:bg-background-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                        />
                    </div>

                    <div v-if="authMode === 'register'">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                        <input 
                            v-model="form.username"
                            type="text"
                            placeholder="johndoe"
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-surface-highlight bg-white dark:bg-background-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input 
                            v-model="form.email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-surface-highlight bg-white dark:bg-background-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input 
                            v-model="form.password"
                            type="password"
                            placeholder="••••••••"
                            required
                            minlength="6"
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-surface-highlight bg-white dark:bg-background-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                        />
                    </div>

                    <button 
                        type="submit" 
                        :disabled="isLoading"
                        class="w-full py-3 rounded-xl bg-brand-gold hover:bg-yellow-500 text-black font-bold transition-all disabled:opacity-50"
                    >
                        <span v-if="isLoading" class="flex items-center justify-center gap-2">
                            <div class="spinner size-5"></div>
                            {{ authMode === 'login' ? 'Signing in...' : 'Creating account...' }}
                        </span>
                        <span v-else>{{ authMode === 'login' ? 'Sign In' : 'Create Account' }}</span>
                    </button>
                </form>

                <!-- Divider -->
                <div class="flex items-center gap-4 my-6">
                    <div class="flex-1 h-px bg-gray-200 dark:bg-surface-highlight"></div>
                    <span class="text-gray-500 dark:text-gray-400 text-sm">or continue with</span>
                    <div class="flex-1 h-px bg-gray-200 dark:bg-surface-highlight"></div>
                </div>

                <!-- Google Login Button -->
                <button @click="handleGoogleLogin" :disabled="isLoading"
                    class="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-gray-300 dark:border-surface-highlight bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-surface-highlight text-gray-900 dark:text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="size-5" viewBox="0 0 24 24">
                        <path fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Google</span>
                </button>

                <!-- Guest Access -->
                <NuxtLink to="/"
                    class="w-full flex items-center justify-center gap-2 px-6 py-3 mt-4 rounded-xl border border-gray-200 dark:border-surface-highlight hover:bg-gray-50 dark:hover:bg-surface-highlight text-gray-600 dark:text-gray-300 font-medium transition-all">
                    <span class="material-symbols-outlined">visibility</span>
                    <span>Browse as Guest</span>
                </NuxtLink>
            </div>

            <!-- Footer Links -->
            <div class="text-center mt-6 space-y-2">
                <p class="text-gray-500 text-sm">
                    By continuing, you agree to our
                    <NuxtLink to="/terms" class="text-brand-gold hover:underline">Terms</NuxtLink> and
                    <NuxtLink to="/privacy" class="text-brand-gold hover:underline">Privacy Policy</NuxtLink>
                </p>
                <p class="text-gray-400 text-xs">
                    Need help? <NuxtLink to="/contact" class="text-brand-gold hover:underline">Contact Support
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
const { login, loginWithEmail, register, isLoggedIn } = useAuth()

const isLoading = ref(false)
const error = ref(null)
const authMode = ref('login') // 'login' or 'register'

const form = ref({
    email: '',
    password: '',
    username: '',
    fullName: ''
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
        if (authMode.value === 'login') {
            await loginWithEmail(form.value.email, form.value.password)
        } else {
            await register({
                email: form.value.email,
                password: form.value.password,
                username: form.value.username,
                full_name: form.value.fullName
            })
        }
        const redirect = route.query.redirect || '/'
        router.push(redirect)
    } catch (err) {
        console.error('Auth failed:', err)
        error.value = err.message || (authMode.value === 'login' ? 'Invalid email or password' : 'Registration failed')
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
</style>
