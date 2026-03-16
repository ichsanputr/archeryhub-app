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
                    Atur Ulang <br />
                    Akses Kamu
                </h1>
                <p class="text-slate-300 text-lg leading-relaxed max-w-md font-body">
                    Jangan khawatir, tinggal ikutin langkah simpelnya buat dapet balik akses akun Archeryhub kamu.
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

        <!-- Right panel: form -->
        <div
            class="relative z-10 w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 overflow-y-auto h-full">
            <div class="w-full max-w-md">

                <!-- Mobile logo -->
                <div class="lg:hidden mb-8 flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" class="w-9 h-9 object-contain" />
                    <span class="text-navy text-xl font-black tracking-tight">Archeryhub<span
                            class="text-yellow-500">.id</span></span>
                </div>

                <!-- Progress bar -->
                <div class="flex items-center gap-2 mb-8">
                    <div v-for="(_, i) in steps" :key="i" class="h-1.5 flex-1 rounded-full transition-all duration-500"
                        :class="currentStep >= i ? 'bg-navy' : 'bg-gray-100'"></div>
                </div>

                <!-- ── STEP 0: Email input ── -->
                <Transition name="slide-fade" mode="out-in">
                    <div v-if="currentStep === 0" key="step0">
                        <div class="mb-8">
                            <div
                                class="w-14 h-14 rounded-2xl bg-navy/5 border border-navy/10 flex items-center justify-center mb-5">
                                <Icon icon="ph:envelope-simple-open-bold" class="text-2xl text-navy" />
                            </div>
                            <h1 class="text-2xl font-black text-navy tracking-tight">Lupa Password?</h1>
                            <p class="mt-2 text-slate-500 text-sm leading-relaxed">
                                Masukkan email akun kamu. Kami akan kirimkan kode OTP untuk reset password.
                            </p>
                        </div>

                        <form @submit.prevent="requestOTP" class="space-y-5">
                            <BaseInput v-model="form.email" label="Alamat Email" placeholder="nama@email.com"
                                type="email" icon="mail" required :error="errors.email"
                                @update:model-value="validate('email', form.email, [rules.required(), rules.email()])" />

                            <BaseButton type="submit" variant="gold" block :loading="isLoading"
                                icon-right="ph:arrow-right">
                                Kirim Kode OTP
                            </BaseButton>
                        </form>

                        <p class="mt-6 text-center text-sm text-slate-500">
                            Ingat password?
                            <NuxtLink to="/auth/login"
                                class="font-black text-navy hover:text-primary transition-colors">Masuk di sini
                            </NuxtLink>
                        </p>
                    </div>
                </Transition>

                <!-- ── STEP 1: OTP verification ── -->
                <Transition name="slide-fade" mode="out-in">
                    <div v-if="currentStep === 1" key="step1">
                        <div class="mb-8">
                            <div
                                class="w-14 h-14 rounded-2xl bg-yellow-50 border border-yellow-100 flex items-center justify-center mb-5">
                                <Icon icon="ph:lock-key-open-bold" class="text-2xl text-yellow-500" />
                            </div>
                            <h1 class="text-2xl font-black text-navy tracking-tight">Masukkan Kode OTP</h1>
                            <p class="mt-2 text-slate-500 text-sm leading-relaxed">
                                Kode 6 digit telah dikirim ke <strong>{{ form.email }}</strong>.<br />
                                Berlaku selama <strong>5 menit</strong>.
                            </p>
                        </div>

                        <!-- OTP boxes (Grid ensures they never break width) -->
                        <div class="grid grid-cols-6 gap-2 sm:gap-3 mb-8 w-full">
                            <input v-for="(_, i) in otpDigits" :key="i" :id="`otp-${i}`" v-model="otpDigits[i]"
                                type="text" maxlength="1" inputmode="numeric" pattern="[0-9]"
                                class="w-full aspect-square text-center text-lg sm:text-2xl font-black text-navy border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all duration-300 bg-slate-50/50 focus:bg-white shadow-sm flex items-center justify-center min-w-0"
                                :class="{ 'border-red-300 bg-red-50 text-red-600 focus:ring-red-500/10': errors.otp }"
                                @input="onOtpInput(i, $event)" @keydown="onOtpKeydown(i, $event)"
                                @paste="onOtpPaste($event)" />
                        </div>

                        <div v-if="errors.otp"
                            class="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-shake">
                            <Icon icon="ph:warning-circle-fill" class="text-xl text-red-500 flex-shrink-0" />
                            <p class="text-xs sm:text-sm text-red-700 font-bold leading-tight">{{ errors.otp }}</p>
                        </div>

                        <BaseButton variant="gold" block :loading="isLoading" icon-right="ph:arrow-right"
                            @click="verifyOTP">
                            Verifikasi Kode
                        </BaseButton>

                        <div class="mt-8 flex flex-col items-center gap-4">
                            <button @click="requestOTP" :disabled="resendCooldown > 0"
                                class="text-sm font-bold text-slate-500 hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2">
                                <Icon v-if="resendCooldown <= 0" icon="ph:arrow-counter-clockwise" />
                                {{ resendCooldown > 0 ? `Kirim ulang dalam ${resendCooldown}s` : 'Kirim ulang kode OTP'
                                }}
                            </button>

                            <button @click="currentStep = 0"
                                class="text-sm font-bold text-slate-400 hover:text-slate-600 transition-all flex items-center gap-1">
                                <Icon icon="ph:arrow-left" /> Ganti email tujuan
                            </button>
                        </div>
                    </div>
                </Transition>

                <!-- ── STEP 2: New password ── -->
                <Transition name="slide-fade" mode="out-in">
                    <div v-if="currentStep === 2" key="step2">
                        <div class="mb-8">
                            <div
                                class="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-5">
                                <Icon icon="ph:shield-check-bold" class="text-2xl text-green-500" />
                            </div>
                            <h1 class="text-2xl font-black text-navy tracking-tight">Buat Password Baru</h1>
                            <p class="mt-2 text-slate-500 text-sm leading-relaxed">
                                OTP terverifikasi! Sekarang buat password baru untuk akun kamu.
                            </p>
                        </div>

                        <form @submit.prevent="resetPassword" class="space-y-5">
                            <BaseInput v-model="form.newPassword" label="Password Baru" placeholder="••••••••"
                                type="password" icon="lock" required :error="errors.newPassword"
                                @update:model-value="validate('newPassword', form.newPassword, [rules.required(), rules.minLength(6)])" />

                            <BaseInput v-model="form.confirmPassword" label="Konfirmasi Password Baru"
                                placeholder="••••••••" type="password" icon="lock" required
                                :error="errors.confirmPassword"
                                @update:model-value="validate('confirmPassword', form.confirmPassword, [rules.required(), rules.sameAs(form.newPassword, 'Password tidak sama')])" />

                            <!-- Password strength indicator -->
                            <div v-if="form.newPassword" class="space-y-1.5">
                                <div class="flex gap-1">
                                    <div v-for="i in 4" :key="i"
                                        class="h-1 flex-1 rounded-full transition-all duration-300"
                                        :class="passwordStrength >= i ? strengthColor : 'bg-gray-100'"></div>
                                </div>
                                <p class="text-xs font-medium" :class="strengthTextColor">{{ strengthLabel }}</p>
                            </div>

                            <BaseButton type="submit" variant="gold" block :loading="isLoading"
                                icon-right="ph:check-bold">
                                Simpan Password Baru
                            </BaseButton>
                        </form>
                    </div>
                </Transition>

                <!-- ── STEP 3: Success ── -->
                <Transition name="slide-fade" mode="out-in">
                    <div v-if="currentStep === 3" key="step3" class="text-center py-4">
                        <div
                            class="w-20 h-20 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-6">
                            <Icon icon="ph:check-circle-bold" class="text-4xl text-green-500" />
                        </div>
                        <h1 class="text-2xl font-black text-navy mb-3">Password Berhasil Direset!</h1>
                        <p class="text-slate-500 text-sm leading-relaxed mb-8">
                            Selamat! Password akun kamu sudah diperbarui.<br />Silakan masuk dengan password baru.
                        </p>
                        <BaseButton variant="gold" block icon-right="ph:arrow-right" @click="goToLogin">
                            Masuk Sekarang
                        </BaseButton>
                    </div>
                </Transition>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useFormValidation } from '~/composables/useFormValidation'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: false })

useHead({ title: 'Lupa Password - Archeryhub.id' })

const config = useRuntimeConfig()
const toast = useToast()
const router = useRouter()

const getMediaUrl = (filename) => {
    if (!filename) return ''
    if (filename.startsWith('http')) return filename
    return `${config.public.apiBaseUrl}/media/${filename}`
}

const slides = ['/slide-1.jpeg', '/slide-2.jpeg', '/slide-3.jpeg']
const currentSlideIndex = ref(0)
let slideInterval = null

const startSlideshow = () => {
    slideInterval = setInterval(() => {
        currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length
    }, 2000)
}

onMounted(() => {
    startSlideshow()
})

onUnmounted(() => {
    if (slideInterval) clearInterval(slideInterval)
})

const { errors, validate, validateForm, rules } = useFormValidation()

const currentStep = ref(0)
const isLoading = ref(false)
const resendCooldown = ref(0)

const form = ref({
    email: '',
    newPassword: '',
    confirmPassword: ''
})

const otpDigits = ref(['', '', '', '', '', ''])

const steps = [
    { title: 'Masukkan Email', desc: 'Kami kirim kode verifikasi' },
    { title: 'Verifikasi OTP', desc: 'Cek inbox atau spam kamu' },
    { title: 'Password Baru', desc: 'Buat password yang kuat' },
]

// OTP helpers
const otpValue = computed(() => otpDigits.value.join(''))

const onOtpInput = (index, event) => {
    const val = event.target.value.replace(/\D/g, '')
    otpDigits.value[index] = val.slice(-1)
    if (val && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus()
    }
}

const onOtpKeydown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
        otpDigits.value[index - 1] = ''
        document.getElementById(`otp-${index - 1}`)?.focus()
    }
}

const onOtpPaste = (event) => {
    event.preventDefault()
    const pasted = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6)
    pasted.split('').forEach((char, i) => {
        if (i < 6) otpDigits.value[i] = char
    })
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus()
}

// Password strength
const passwordStrength = computed(() => {
    const p = form.value.newPassword
    if (!p) return 0
    let score = 0
    if (p.length >= 6) score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p) || /[0-9]/.test(p)) score++
    if (/[^a-zA-Z0-9]/.test(p)) score++
    return score
})

const strengthColor = computed(() => {
    const colors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500']
    return colors[passwordStrength.value] || 'bg-gray-100'
})
const strengthTextColor = computed(() => {
    const colors = ['', 'text-red-500', 'text-yellow-600', 'text-blue-500', 'text-green-600']
    return colors[passwordStrength.value]
})
const strengthLabel = computed(() => {
    const labels = ['', 'Lemah', 'Cukup', 'Bagus', 'Kuat']
    return labels[passwordStrength.value] || ''
})

// Countdown timer for resend
let countdownInterval = null
const startCooldown = () => {
    resendCooldown.value = 60
    countdownInterval && clearInterval(countdownInterval)
    countdownInterval = setInterval(() => {
        resendCooldown.value--
        if (resendCooldown.value <= 0) clearInterval(countdownInterval)
    }, 1000)
}

// Step 1: request OTP
const requestOTP = async () => {
    const isValid = validateForm(form.value, {
        email: [rules.required(), rules.email()]
    })
    if (!isValid) return

    isLoading.value = true
    try {
        await $fetch(`${config.public.apiBaseUrl}/auth/forgot-password`, {
            method: 'POST',
            body: { email: form.value.email }
        })
        otpDigits.value = ['', '', '', '', '', '']
        currentStep.value = 1
        startCooldown()
        toast.success('Kode OTP telah dikirimkan ke email kamu')
    } catch (err) {
        toast.error(err?.data?.error || 'Gagal mengirim kode. Coba lagi.')
    } finally {
        isLoading.value = false
    }
}

// Step 2: verify OTP
const verifyOTP = async () => {
    if (otpValue.value.length !== 6) {
        errors.otp = 'Masukkan semua 6 digit kode OTP'
        return
    }
    errors.otp = ''
    isLoading.value = true
    try {
        await $fetch(`${config.public.apiBaseUrl}/auth/verify-reset-otp`, {
            method: 'POST',
            body: { email: form.value.email, otp: otpValue.value }
        })
        currentStep.value = 2
    } catch (err) {
        errors.otp = err?.data?.error || 'Kode OTP tidak valid atau sudah kedaluwarsa'
    } finally {
        isLoading.value = false
    }
}

// Step 3: reset password
const resetPassword = async () => {
    const isValid = validateForm(
        { newPassword: form.value.newPassword, confirmPassword: form.value.confirmPassword },
        {
            newPassword: [rules.required(), rules.minLength(6)],
            confirmPassword: [rules.required(), rules.sameAs(form.value.newPassword, 'Password tidak sama')]
        }
    )
    if (!isValid) return

    isLoading.value = true
    try {
        await $fetch(`${config.public.apiBaseUrl}/auth/change-password-otp`, {
            method: 'POST',
            body: {
                email: form.value.email,
                otp: otpValue.value,
                new_password: form.value.newPassword
            }
        })
        currentStep.value = 3
    } catch (err) {
        toast.error(err?.data?.error || 'Gagal mereset password. Coba mulai ulang.')
    } finally {
        isLoading.value = false
    }
}

const goToLogin = () => {
    router.push('/auth/login')
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');

.font-display {
    font-family: 'Lexend', sans-serif;
}

.animate-shake {
    animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}
</style>
