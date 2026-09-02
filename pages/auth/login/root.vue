<template>
    <div class="relative h-screen bg-navy text-slate-900 font-display antialiased flex overflow-hidden">
        <!-- Background Hero (Full screen on mobile, absolute behind) -->
        <div class="absolute inset-0 z-0 lg:w-1/2 lg:relative lg:flex overflow-hidden flex-col justify-end">
            <div class="absolute inset-0 z-0 h-full w-full">
                <div v-for="(slide, index) in slides" :key="index"
                    class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    :class="currentSlideIndex === index ? 'opacity-30 lg:opacity-40' : 'opacity-0'">
                    <img :src="slide" :alt="'Slide ' + (index + 1)"
                        class="w-full h-full object-cover mix-blend-overlay" />
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-transparent"></div>
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
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full mb-6">
                    <Icon icon="ph:shield-checkered-fill" class="text-primary text-sm" />
                    <span class="text-[10px] font-black text-primary tracking-widest">Administrative
                        Access</span>
                </div>
                <h1 class="text-white text-5xl font-black leading-tight tracking-tight mb-4 font-display ">
                    Root <br />
                    Terminal
                </h1>
                <p class="text-slate-300 text-lg leading-relaxed max-w-md font-body">
                    Akses kontrol pusat untuk pengelolaan ekosistem panahan digital Archeris.net.
                </p>
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
                    <h2 class="text-3xl font-black text-slate-900 tracking-tight font-display ">System Restore
                    </h2>
                    <p class="mt-2 text-slate-500 text-sm font-body">Input secure identification to access the root
                        environment.</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    <BaseInput v-model="form.email" label="Root Identity" placeholder="root"
                        type="text" icon="ph:envelope-simple-fill" required
                        :error="error && error.includes('Email') ? error : ''" />

                    <div class="space-y-2">
                        <div class="flex items-center justify-between px-1">
                            <label class="text-xs font-bold text-navy tracking-wider">Security Key</label>
                        </div>
                        <BaseInput v-model="form.password" placeholder="••••••••" type="password"
                            icon="ph:lock-key-fill" required
                            :error="error && error.includes('password') ? error : ''" />
                    </div>

                    <div v-if="error"
                        class="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-bold flex items-center gap-3 animate-shake">
                        <Icon icon="ph:warning-circle-fill" class="text-lg" />
                        {{ error }}
                    </div>

                    <div>
                        <BaseButton type="submit" variant="navy" block :loading="loading" icon-right="ph:key-fill">
                            Authorize Session
                        </BaseButton>
                    </div>
                </form>

                <div class="pt-8 border-t border-gray-100 mt-8">
                    <p class="text-center text-[10px] text-gray-400 font-bold tracking-[0.3em]">
                        Archeris OS v2.0 • Secure Terminal
                    </p>
                </div>

                <p class="mt-8 text-center text-sm text-slate-600 font-body">
                    Unauthorized access is strictly monitored.
                    <NuxtLink to="/"
                        class="font-black text-navy hover:text-primary-hover hover:underline transition-all">
                        Exit to Public
                    </NuxtLink>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onUnmounted } from 'vue'

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const router = useRouter()

definePageMeta({
    layout: 'blank'
})

useHead({
    title: 'Root Login - Archeris'
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
    password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
    loading.value = true
    error.value = ''
    try {
        await $fetch(`${apiBaseUrl}/root/login`, {
            method: 'POST',
            body: form.value,
            credentials: 'include'
        })

        // Standard redirect for root
        window.location.href = '/dashboard/root'
    } catch (err) {
        error.value = err.data?.error || 'Authentication sequence failed'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    startSlideshow()
})

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

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translateX(-2px);
    }

    20%,
    40%,
    60%,
    80% {
        transform: translateX(2px);
    }
}

.animate-shake {
    animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}
</style>
