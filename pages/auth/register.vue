<template>
    <div class="relative h-screen bg-navy text-slate-900 font-display antialiased flex overflow-hidden">
        <!-- Background Hero (Full screen on mobile, absolute behind) -->
        <div class="absolute inset-0 z-0 lg:w-1/2 lg:relative lg:flex overflow-hidden flex-col justify-end">
            <div v-for="(slide, index) in slides" :key="index"
                class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                :class="currentSlideIndex === index ? 'opacity-40 lg:opacity-50' : 'opacity-0'">
                <img :src="slide" :alt="'Slide ' + (index + 1)" class="w-full h-full object-cover mix-blend-overlay" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent"></div>

            <!-- Content only visible on desktop -->
            <div class="hidden lg:block relative z-10 p-16 max-w-2xl">
                <div class="flex items-center gap-4 mb-12">
                    <div class="w-12 h-12 flex items-center justify-center transition-all duration-300">
                        <img src="/logo.png" alt="Logo" class="w-12 h-12 object-contain" />
                    </div>
                    <span class="text-white text-3xl font-black tracking-tight font-display">Archeris</span>
                </div>
                <h1 class="text-white text-5xl font-black leading-tight tracking-tight mb-4 font-display" v-html="t('auth.register.desktop_title')">
                </h1>
                <div class="text-slate-300 text-base leading-relaxed max-w-md font-body space-y-2.5">
                    <div>{{ t('auth.register.desktop_desc_p1') }}</div>
                    <div>{{ t('auth.register.desktop_desc_p2') }}</div>
                </div>
                <div class="mt-12 flex items-center gap-4 text-sm text-slate-400 font-medium font-body">
                    <div class="flex -space-x-2">
                        <img alt="Archer" class="w-8 h-8 rounded-full border-2 border-navy bg-slate-200 object-cover"
                            src="https://api.dicebear.com/9.x/avataaars/svg?seed=Ardi" />
                        <img alt="Archer" class="w-8 h-8 rounded-full border-2 border-navy bg-slate-200 object-cover"
                            src="https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah" />
                        <img alt="Archer" class="w-8 h-8 rounded-full border-2 border-navy bg-slate-200 object-cover"
                            src="https://api.dicebear.com/9.x/avataaars/svg?seed=Budi" />
                        <div
                            class="w-8 h-8 rounded-full border-2 border-navy bg-slate-700 flex items-center justify-center text-[10px] text-white">
                            +2k</div>
                    </div>
                    <span>{{ t('auth.login.archers_joined') }}</span>
                </div>
            </div>
        </div>

        <!-- Right Side: Registration / OTP Form -->
        <div
            class="relative z-10 w-full lg:w-1/2 bg-white/95 backdrop-blur-sm lg:bg-white flex flex-col items-center p-6 sm:p-12 lg:p-16 overflow-y-auto h-full no-scrollbar">
            <div class="mx-auto w-full max-w-md lg:max-w-lg">
                <!-- Logo (Mobile Only) -->
                <div class="lg:hidden mb-8 text-center">
                    <div class="inline-flex items-center gap-3">
                        <div class="w-10 h-10 flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" class="w-10 h-10 object-contain" />
                        </div>
                        <span class="text-navy text-2xl font-black tracking-tight font-display">Archeris</span>
                    </div>
                </div>

                <!-- ════════════════════════════════════════════════════════ -->
                <!-- STEP 1: REGISTRATION FORM -->
                <!-- ════════════════════════════════════════════════════════ -->
                <div v-if="currentStep === 'form'">
                    <div class="text-center lg:text-left">
                        <h2 class="text-3xl font-black tracking-tight text-navy font-display">{{ t('auth.register.welcome') }}</h2>
                        <div class="mt-2 text-sm text-slate-500 font-body">{{ t('auth.register.subtitle') }}</div>
                    </div>

                    <!-- User Type Tabs -->
                    <div class="mt-8 flex bg-gray-100 rounded-xl p-1.5">
                        <button v-for="type in userTypes" :key="type.value" @click="form.userType = type.value"
                            class="flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                            :class="form.userType === type.value ? 'bg-white text-navy shadow-md' : 'text-gray-500 hover:text-navy'">
                            <Icon :icon="type.icon" class="text-lg" />
                            <span>{{ t('auth.register.' + type.value + '_tab') }}</span>
                        </button>
                    </div>

                    <div class="mt-8">
                        <form @submit.prevent="handleEmailRegister" class="space-y-5">
                            <!-- Archer Fields -->
                            <div v-if="form.userType === 'archer'" class="space-y-4">
                                <BaseInput 
                                    v-model="form.fullName" 
                                    :label="t('auth.register.full_name_label')" 
                                    :placeholder="t('auth.register.full_name_placeholder')"
                                    icon="ph:user"
                                    required
                                    :error="errors.fullName"
                                    @update:model-value="validate('fullName', form.fullName, [rules.required(), rules.minLength(3)])" 
                                />

                                <BaseInput 
                                    v-model="form.email" 
                                    :label="t('auth.login.email_label')" 
                                    :placeholder="t('auth.login.email_placeholder')" 
                                    type="email"
                                    icon="ph:envelope-simple" 
                                    required 
                                    :error="errors.email"
                                    @update:model-value="validate('email', form.email, [rules.required(), rules.email()])" 
                                />

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <BaseInput 
                                        v-model="form.password" 
                                        :label="t('auth.login.password_label')" 
                                        :placeholder="t('auth.login.password_placeholder')" 
                                        type="password" 
                                        icon="ph:lock" 
                                        required
                                        :error="errors.password"
                                        @update:model-value="validate('password', form.password, [rules.required(), rules.minLength(6)])" 
                                    />

                                    <BaseInput 
                                        v-model="form.confirmPassword" 
                                        :label="t('auth.register.confirm_password_label', 'Confirm Password')" 
                                        :placeholder="t('auth.login.password_placeholder')" 
                                        type="password" 
                                        icon="ph:lock-key" 
                                        required
                                        :error="errors.confirmPassword"
                                        @update:model-value="validateConfirmPassword" 
                                    />
                                </div>

                                <!-- Gender Selector -->
                                <div class="flex flex-col gap-1.5 w-full">
                                    <label class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
                                        {{ t('auth.register.gender_label', 'Gender') }}
                                        <span class="text-red-500">*</span>
                                    </label>
                                    <div class="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            @click="form.gender = 'male'; errors.gender = ''"
                                            class="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer"
                                            :class="form.gender === 'male' ? 'border-navy bg-navy text-primary shadow-xs' : (errors.gender ? 'border-red-300 bg-red-50/40 text-slate-700' : 'border-gray-200 bg-gray-50/50 hover:bg-white text-slate-700')"
                                        >
                                            <Icon icon="ph:gender-male-bold" class="text-lg" />
                                            <span>{{ t('auth.register.gender_male', 'Male') }}</span>
                                        </button>
                                        <button
                                            type="button"
                                            @click="form.gender = 'female'; errors.gender = ''"
                                            class="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer"
                                            :class="form.gender === 'female' ? 'border-navy bg-navy text-primary shadow-xs' : (errors.gender ? 'border-red-300 bg-red-50/40 text-slate-700' : 'border-gray-200 bg-gray-50/50 hover:bg-white text-slate-700')"
                                        >
                                            <Icon icon="ph:gender-female-bold" class="text-lg" />
                                            <span>{{ t('auth.register.gender_female', 'Female') }}</span>
                                        </button>
                                    </div>
                                    <div v-if="errors.gender" class="text-xs font-semibold text-red-500 ml-1">
                                        {{ errors.gender }}
                                    </div>
                                </div>
                            </div>

                            <!-- Organizer Fields -->
                            <div v-if="form.userType === 'organizer'" class="space-y-4">
                                <BaseInput 
                                    v-model="form.organizationName" 
                                    :label="t('auth.register.org_name_label')"
                                    :placeholder="t('auth.register.org_name_placeholder')" 
                                    icon="ph:buildings"
                                    required
                                    :error="errors.organizationName || (isNameTaken ? t('auth.register.name_taken_org') : '')"
                                    @update:model-value="validate('organizationName', form.organizationName, [rules.required(), rules.minLength(3)])" 
                                />

                                <BaseInput 
                                    v-model="form.email" 
                                    :label="t('auth.login.email_label')" 
                                    :placeholder="t('auth.login.email_placeholder')" 
                                    type="email"
                                    icon="ph:envelope-simple" 
                                    required 
                                    :error="errors.email"
                                    @update:model-value="validate('email', form.email, [rules.required(), rules.email()])" 
                                />

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <BaseInput 
                                        v-model="form.password" 
                                        :label="t('auth.login.password_label')" 
                                        :placeholder="t('auth.login.password_placeholder')" 
                                        type="password" 
                                        icon="ph:lock" 
                                        required
                                        :error="errors.password"
                                        @update:model-value="validate('password', form.password, [rules.required(), rules.minLength(6)])" 
                                    />

                                    <BaseInput 
                                        v-model="form.confirmPassword" 
                                        :label="t('auth.register.confirm_password_label', 'Confirm Password')" 
                                        :placeholder="t('auth.login.password_placeholder')" 
                                        type="password" 
                                        icon="ph:lock-key" 
                                        required
                                        :error="errors.confirmPassword"
                                        @update:model-value="validateConfirmPassword" 
                                    />
                                </div>
                            </div>

                            <!-- Terms & Conditions Checkbox -->
                            <div class="pt-2">
                                <BaseCheckbox v-model="form.terms" required :error="errors.terms"
                                    @update:model-value="validate('terms', form.terms, [rules.required(t('auth.register.terms_required_error'))])">
                                    {{ t('auth.register.agree_to') }}
                                    <NuxtLink class="font-bold text-navy hover:text-primary transition-colors" to="/terms" target="_blank">
                                        {{ t('auth.register.terms_conditions') }}</NuxtLink> {{ t('auth.register.and') }}
                                    <NuxtLink class="font-bold text-navy hover:text-primary transition-colors" to="/privacy" target="_blank">
                                        {{ t('auth.register.privacy_policy') }}</NuxtLink>
                                </BaseCheckbox>
                            </div>

                            <!-- Submit Button: Register via Email -->
                            <div class="pt-2">
                                <BaseButton 
                                    type="submit" 
                                    variant="gold" 
                                    block 
                                    size="lg" 
                                    :loading="isSubmitting"
                                    :disabled="!isFormValid || isSubmitting"
                                >
                                    {{ t('auth.register.submit_btn', 'Create Account') }}
                                </BaseButton>
                            </div>

                            <!-- Divider: Or Register With -->
                            <div class="relative my-6 flex items-center gap-3 font-body">
                                <div class="flex-1 border-t border-slate-200"></div>
                                <span class="text-xs text-slate-400 font-medium shrink-0">{{ t('auth.login.or_login_with') }}</span>
                                <div class="flex-1 border-t border-slate-200"></div>
                            </div>

                            <!-- Google OAuth Button (1-Click Direct to Dashboard) -->
                            <div>
                                <BaseButton 
                                    type="button"
                                    variant="outline" 
                                    block 
                                    size="lg" 
                                    icon="logos:google-icon"
                                    @click="handleGoogleRegister" 
                                    :loading="isGoogleLoading"
                                    :disabled="isGoogleLoading"
                                >
                                    {{ t('auth.register.register_with_google') }}
                                </BaseButton>
                                <div class="mt-2 text-[11px] text-center text-slate-400">
                                    {{ t('auth.register.google_direct_note', 'Direct 1-click verification into your dashboard.') }}
                                </div>
                            </div>
                        </form>

                        <div class="mt-8 text-center font-body">
                            <div class="text-sm text-slate-600">
                                {{ t('auth.register.already_have_account') }} 
                                <NuxtLink class="font-black text-navy hover:text-primary-hover transition-colors" to="/auth/login">
                                    {{ t('auth.register.login_here') }}
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ════════════════════════════════════════════════════════ -->
                <!-- STEP 2: OTP VERIFICATION SCREEN -->
                <!-- ════════════════════════════════════════════════════════ -->
                <div v-else-if="currentStep === 'otp'" class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <button 
                        @click="currentStep = 'form'" 
                        class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy transition-colors cursor-pointer"
                    >
                        <Icon icon="ph:arrow-left-bold" />
                        <span>{{ t('auth.register.back_to_form', 'Back to Form') }}</span>
                    </button>

                    <div class="text-center space-y-2">
                        <div class="size-14 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center mx-auto text-2xl mb-4 shadow-xs">
                            <Icon icon="ph:envelope-open-bold" class="text-navy" />
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-black text-navy font-display">
                            {{ t('auth.register.verify_email_title', 'Verify Your Email') }}
                        </h2>
                        <div class="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                            {{ t('auth.register.otp_sent_desc', 'We have sent a 6-digit verification code to') }} 
                            <strong class="text-navy font-bold">{{ form.email }}</strong>
                        </div>
                    </div>

                    <!-- 6-Box OTP Input Container -->
                    <div class="flex items-center justify-center gap-2 sm:gap-3 my-6">
                        <input
                            v-for="(digit, idx) in otpDigits"
                            :key="idx"
                            :id="'otp-input-' + idx"
                            v-model="otpDigits[idx]"
                            type="text"
                            inputmode="numeric"
                            maxlength="1"
                            class="size-11 sm:size-13 text-center text-xl sm:text-2xl font-black font-mono rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition-all"
                            :class="{ 'border-red-500 bg-red-50/50': otpError }"
                            @input="handleOtpInput(idx, $event)"
                            @keydown="handleOtpKeydown(idx, $event)"
                            @paste="handleOtpPaste($event)"
                        />
                    </div>

                    <div v-if="otpError" class="text-center text-xs font-bold text-red-500 animate-in fade-in">
                        {{ otpError }}
                    </div>

                    <!-- Submit OTP Button -->
                    <div>
                        <BaseButton 
                            type="button" 
                            variant="gold" 
                            block 
                            size="lg" 
                            :loading="isVerifyingOtp"
                            :disabled="isOtpIncomplete || isVerifyingOtp"
                            @click="submitOtpVerification"
                        >
                            {{ t('auth.register.verify_and_login', 'Verify & Enter Dashboard') }}
                        </BaseButton>
                    </div>

                    <!-- Resend Countdown & Actions -->
                    <div class="text-center space-y-2 pt-2 text-xs font-body">
                        <div v-if="resendCountdown > 0" class="text-slate-400 font-medium">
                            {{ t('auth.register.resend_in', 'Resend code in') }} 
                            <span class="font-mono font-bold text-navy">00:{{ resendCountdown < 10 ? '0' + resendCountdown : resendCountdown }}</span>
                        </div>
                        <button
                            v-else
                            type="button"
                            @click="resendOtpCode"
                            :disabled="isResendingOtp"
                            class="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-navy hover:text-primary cursor-pointer transition-colors"
                        >
                            <Icon icon="ph:arrow-clockwise-bold" :class="{ 'animate-spin': isResendingOtp }" />
                            <span>{{ isResendingOtp ? t('auth.register.resending', 'Sending code...') : t('auth.register.resend_code', 'Resend Verification Code') }}</span>
                        </button>

                        <div>
                            <button 
                                type="button" 
                                @click="currentStep = 'form'" 
                                class="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                            >
                                <Icon icon="ph:arrow-left" />
                                <span>{{ t('auth.register.wrong_email', 'Wrong email address? Change email') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFormValidation } from '~/composables/useFormValidation'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const cities = ref([])
const { t, te } = useI18n()

useHead({
    title: computed(() => t('auth.register.welcome') + ' - Archeris.net')
})

const userTypes = [
    { value: 'archer', label: 'Archer', icon: 'temaki:archery' },
    { value: 'organizer', label: 'Organizer', icon: 'ph:buildings-bold' }
]

const { errors, validate, rules } = useFormValidation()

const slides = ['/slide-1.jpeg', '/slide-2.jpeg', '/slide-3.jpeg']
const currentSlideIndex = ref(0)
let slideInterval = null

const startSlideshow = () => {
    slideInterval = setInterval(() => {
        currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length
    }, 2500)
}

const getInitialUserType = () => {
    const typeParam = route.query.type
    if (typeParam && ['archer', 'organizer'].includes(typeParam)) {
        return typeParam
    }
    return 'archer'
}

// ─────────────────────────────────────────────────────────────
// STATE & FORM DATA
// ─────────────────────────────────────────────────────────────
const currentStep = ref('form') // 'form' | 'otp'

const form = ref({
    userType: getInitialUserType(),
    fullName: '',
    organizationName: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    whatsappNo: '',
    country: 'Indonesia',
    clubID: '',
    newClubName: '',
    newClubAcronym: '',
    terms: false
})

const countries = ref([
    { title: 'Indonesia', value: 'Indonesia', icon: 'circle-flags:id' },
    { title: 'Malaysia', value: 'Malaysia', icon: 'circle-flags:my' },
    { title: 'Singapore', value: 'Singapore', icon: 'circle-flags:sg' },
    { title: 'Thailand', value: 'Thailand', icon: 'circle-flags:th' },
    { title: 'Philippines', value: 'Philippines', icon: 'circle-flags:ph' },
    { title: 'Vietnam', value: 'Vietnam', icon: 'circle-flags:vn' },
    { title: 'Australia', value: 'Australia', icon: 'circle-flags:au' },
    { title: 'Japan', value: 'Japan', icon: 'circle-flags:jp' },
    { title: 'South Korea', value: 'South Korea', icon: 'circle-flags:kr' },
    { title: 'United Kingdom', value: 'United Kingdom', icon: 'circle-flags:gb' },
    { title: 'United States', value: 'United States', icon: 'circle-flags:us' }
])

const handleCountryChange = (countryName) => {
    form.value.country = countryName
}

const validateConfirmPassword = (val) => {
    if (!val) {
        errors.confirmPassword = 'Confirm password is required'
        return false
    }
    if (val !== form.value.password) {
        errors.confirmPassword = 'Passwords do not match'
        return false
    }
    errors.confirmPassword = ''
    return true
}

const isNameValid = computed(() => {
    const name = form.value.userType === 'archer' ? form.value.fullName : form.value.organizationName
    return name && name.trim().length >= 3
})

const isFormValid = computed(() => {
    if (!isNameValid.value) return false
    if (form.value.userType === 'archer' && !form.value.gender) return false
    if (!form.value.email || !form.value.email.includes('@')) return false
    if (!form.value.password || form.value.password.length < 6) return false
    if (form.value.password !== form.value.confirmPassword) return false
    if (!form.value.terms) return false
    return true
})

const { registerWithEmail, verifyRegisterOTP, resendRegisterOTP, login } = useAuth()
const { get } = useApi()
const apiBaseUrl = useApiBaseUrl()

const getMediaUrl = (filename) => {
    if (!filename) return ''
    if (filename.startsWith('http://localhost:8001')) {
        return filename.replace('http://localhost:8001', 'https://api.archeris.net')
    }
    if (filename.startsWith('http')) return filename
    const base = (apiBaseUrl && !apiBaseUrl.includes('localhost')) ? apiBaseUrl : 'https://api.archeris.net'
    return `${base}/media/${filename}`
}

// ─────────────────────────────────────────────────────────────
// REGISTRATION VIA EMAIL & OTP
// ─────────────────────────────────────────────────────────────
const isSubmitting = ref(false)

const handleEmailRegister = async () => {
    if (form.value.userType === 'archer' && !form.value.gender) {
        errors.gender = t('auth.register.gender_required', 'Please select a gender')
    }
    if (!form.value.terms) {
        errors.terms = t('auth.register.terms_required_error', 'You must agree to the terms & conditions')
    }
    if (!isFormValid.value) {
        validateConfirmPassword(form.value.confirmPassword)
        return
    }

    isSubmitting.value = true
    try {
        const payload = {
            user_type: form.value.userType,
            full_name: form.value.userType === 'archer' ? form.value.fullName : form.value.organizationName,
            organization_name: form.value.organizationName,
            gender: form.value.userType === 'archer' ? form.value.gender : '',
            email: form.value.email,
            password: form.value.password,
            whatsapp_no: form.value.whatsappNo,
            phone: form.value.whatsappNo,
            country: form.value.country,
            club_id: form.value.clubID,
            new_club_name: form.value.newClubName,
            new_club_acronym: form.value.newClubAcronym
        }

        const res = await registerWithEmail(payload)
        toast.success(res?.message || 'Verification code has been sent to your email')
        currentStep.value = 'otp'
        startResendTimer()
        nextTick(() => {
            const firstInput = document.getElementById('otp-input-0')
            if (firstInput) firstInput.focus()
        })
    } catch (err) {
        console.error('Registration failed:', err)
        const code = err?.data?.code || err?.response?._data?.code
        const serverError = err?.data?.error || err?.response?._data?.error || err?.message
        let msg = serverError || 'Registration failed. Please try again.'

        if (code && te(`auth.errors.${code}`)) {
            msg = t(`auth.errors.${code}`)
        } else if (code === 'email_already_registered' || err.status === 409 || err.statusCode === 409) {
            msg = te('auth.errors.email_already_registered')
                ? t('auth.errors.email_already_registered')
                : (serverError || 'Email is already registered. Please log in directly.')
        }
        toast.error(msg)
    } finally {
        isSubmitting.value = false
    }
}

// ─────────────────────────────────────────────────────────────
// OTP VERIFICATION STATE & CONTROLS
// ─────────────────────────────────────────────────────────────
const otpDigits = ref(['', '', '', '', '', ''])
const otpError = ref('')
const isVerifyingOtp = ref(false)
const isResendingOtp = ref(false)
const resendCountdown = ref(60)
let countdownTimer = null

const startResendTimer = () => {
    resendCountdown.value = 60
    if (countdownTimer) clearInterval(countdownTimer)
    countdownTimer = setInterval(() => {
        if (resendCountdown.value > 0) {
            resendCountdown.value--
        } else {
            clearInterval(countdownTimer)
        }
    }, 1000)
}

const isOtpIncomplete = computed(() => {
    return otpDigits.value.some(d => !d || d.trim().length === 0)
})

const handleOtpInput = (idx, event) => {
    otpError.value = ''
    const val = event.target.value
    // Ensure only digit
    const digit = val.replace(/\D/g, '').slice(-1)
    otpDigits.value[idx] = digit

    if (digit && idx < 5) {
        nextTick(() => {
            const nextInput = document.getElementById(`otp-input-${idx + 1}`)
            if (nextInput) nextInput.focus()
        })
    }

    // If completed 6 digits, auto-submit
    if (otpDigits.value.every(d => d.length === 1)) {
        submitOtpVerification()
    }
}

const handleOtpKeydown = (idx, event) => {
    if (event.key === 'Backspace' && !otpDigits.value[idx] && idx > 0) {
        const prevInput = document.getElementById(`otp-input-${idx - 1}`)
        if (prevInput) prevInput.focus()
    }
}

const handleOtpPaste = (event) => {
    event.preventDefault()
    otpError.value = ''
    const pasted = (event.clipboardData || window.clipboardData).getData('text').trim()
    const digitsOnly = pasted.replace(/\D/g, '').slice(0, 6)
    if (digitsOnly.length > 0) {
        for (let i = 0; i < 6; i++) {
            otpDigits.value[i] = digitsOnly[i] || ''
        }
        if (digitsOnly.length === 6) {
            submitOtpVerification()
        } else {
            const nextIdx = Math.min(5, digitsOnly.length)
            const el = document.getElementById(`otp-input-${nextIdx}`)
            if (el) el.focus()
        }
    }
}

const submitOtpVerification = async () => {
    const code = otpDigits.value.join('')
    if (code.length !== 6) return

    isVerifyingOtp.value = true
    otpError.value = ''

    try {
        const res = await verifyRegisterOTP(form.value.email, code)
        toast.success(res?.message || 'Verification successful! Welcome to Archeris.')
        if (import.meta.client) {
            window.location.href = res?.redirect_url || '/dashboard'
        }
    } catch (err) {
        console.error('OTP Verification failed:', err)
        const errCode = err?.data?.code || err?.response?._data?.code
        const serverError = err?.data?.error || err?.response?._data?.error || err?.message
        let msg = serverError || 'Verification code is invalid or has expired'

        if (errCode && te(`auth.errors.${errCode}`)) {
            msg = t(`auth.errors.${errCode}`)
        }
        otpError.value = msg
        toast.error(msg)
    } finally {
        isVerifyingOtp.value = false
    }
}

const resendOtpCode = async () => {
    if (resendCountdown.value > 0 || isResendingOtp.value) return

    isResendingOtp.value = true
    otpError.value = ''

    try {
        const res = await resendRegisterOTP(form.value.email)
        toast.success(res?.message || 'A new verification code has been sent to your email')
        startResendTimer()
    } catch (err) {
        console.error('Resend OTP failed:', err)
        const errCode = err?.data?.code || err?.response?._data?.code
        const serverError = err?.data?.error || err?.response?._data?.error || err?.message
        let msg = serverError || 'Failed to resend verification code'

        if (errCode && te(`auth.errors.${errCode}`)) {
            msg = t(`auth.errors.${errCode}`)
        }
        toast.error(msg)
    } finally {
        isResendingOtp.value = false
    }
}

// ─────────────────────────────────────────────────────────────
// GOOGLE OAUTH REGISTRATION (1-CLICK DIRECT TO DASHBOARD)
// ─────────────────────────────────────────────────────────────
const isGoogleLoading = ref(false)

const handleGoogleRegister = async () => {
    const isArcher = form.value.userType === 'archer'
    const missingGender = isArcher && !form.value.gender
    const missingTerms = !form.value.terms

    if (missingGender && missingTerms) {
        errors.gender = t('auth.register.gender_required', 'Please select a gender')
        errors.terms = t('auth.register.terms_required_error', 'You must agree to the terms & conditions')
        toast.error(
            t('auth.register.google_missing_gender_terms', 'Please select your Gender and agree to the Terms & Conditions before continuing with Google.')
        )
        return
    }

    if (missingGender) {
        errors.gender = t('auth.register.gender_required', 'Please select a gender')
        toast.error(
            t('auth.register.google_missing_gender', 'Please select your Gender before continuing with Google.')
        )
        return
    }

    if (missingTerms) {
        errors.terms = t('auth.register.terms_required_error', 'You must agree to the terms & conditions')
        toast.error(
            t('auth.register.google_missing_terms', 'Please agree to the Terms & Conditions before continuing with Google.')
        )
        return
    }

    isGoogleLoading.value = true
    try {
        const metadata = {
            full_name: isArcher ? form.value.fullName : form.value.organizationName,
            user_type: form.value.userType,
            gender: isArcher ? form.value.gender : '',
            oauth_mode: 'register',
            country: form.value.country || 'Indonesia',
            club_id: form.value.clubID || '',
            new_club_name: form.value.newClubName || '',
            new_club_acronym: form.value.newClubAcronym || ''
        }
        await login(form.value.userType, metadata)
    } catch (err) {
        console.error('Google register failed:', err)
        toast.error('Failed to connect with Google. Please try again.')
        isGoogleLoading.value = false
    }
}

onMounted(() => {
    startSlideshow()
})

onUnmounted(() => {
    if (slideInterval) clearInterval(slideInterval)
    if (countdownTimer) clearInterval(countdownTimer)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
