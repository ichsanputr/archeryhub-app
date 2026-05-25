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
                <p class="text-slate-300 text-lg leading-relaxed max-w-md font-body">
                    {{ t('auth.register.desktop_desc') }}
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

        <!-- Right Side: Registration Form -->
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

                <div class="text-center lg:text-left">
                    <h2 class="text-3xl font-black tracking-tight text-navy font-display">{{ t('auth.register.welcome') }}</h2>
                    <p class="mt-2 text-sm text-slate-500 font-body">{{ t('auth.register.subtitle') }}</p>
                </div>

                <!-- User Type Tabs -->
                <div class="mt-8 flex bg-gray-100 rounded-xl p-1.5">
                    <button v-for="type in userTypes" :key="type.value" @click="form.userType = type.value"
                        class="flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                        :class="form.userType === type.value ? 'bg-white text-navy shadow-md' : 'text-gray-500 hover:text-navy'">
                        <Icon :icon="type.icon" class="text-lg" />
                        <span class="hidden sm:inline">{{ t('auth.register.' + type.value + '_tab') }}</span>
                    </button>
                </div>

                <div class="mt-8">
                    <form @submit.prevent="handleRegister" class="space-y-6">
                        <!-- User Type Specific Field (MANDATORY FOR GOOGLE REG) -->
                        <div class="space-y-4">
                            <!-- Archer: Nama Lengkap -->
                            <div v-if="form.userType === 'archer'" class="space-y-4">
                                <h4 class="text-xs font-black text-navy  tracking-widest flex items-center gap-2 mb-4">
                                    <Icon icon="ph:user-bold" class="text-primary text-lg" />
                                    {{ t('auth.register.archer_info') }}
                                </h4>
                                <BaseInput v-model="form.fullName" :label="t('auth.register.full_name_label')" :placeholder="t('auth.register.full_name_placeholder')"
                                    required
                                    :error="errors.fullName || (isNameTaken ? t('auth.register.name_taken_archer') : '')"
                                    @update:model-value="validate('fullName', form.fullName, [rules.required(), rules.minLength(3)])" />

                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <label class="text-sm font-bold text-navy">{{ t('auth.register.gender_label') }} <span class="text-red-500">*</span></label>
                                        <select v-model="form.gender" required
                                            class="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                                            <option value="">{{ t('auth.register.gender_select') || 'Select Gender' }}</option>
                                            <option value="male">{{ t('auth.register.gender_male') }}</option>
                                            <option value="female">{{ t('auth.register.gender_female') }}</option>
                                        </select>
                                    </div>
                                    <BaseInput v-model="form.dateOfBirth" :label="t('auth.register.birth_date_label')" type="date" required
                                        :error="errors.dateOfBirth"
                                        @update:model-value="validate('dateOfBirth', form.dateOfBirth, [rules.required()])" />
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <BaseSelect v-model="form.city" :items="cities" :label="t('auth.register.city_label')"
                                        :placeholder="t('auth.register.city_placeholder')" required :error="errors.city" searchable
                                        @update:model-value="validate('city', form.city, [rules.required()])" />
                                    
                                    <ClubSelector
                                        v-model="form.clubID"
                                        v-model:newClubName="form.newClubName"
                                        v-model:newClubAcronym="form.newClubAcronym"
                                        required
                                        label="Club" />
                                </div>

                                <p class="mt-2 text-xs text-gray-400 font-body italic">{{ t('auth.register.archer_note') }}</p>
                            </div>

                            <!-- Organization: Nama Organisasi -->
                            <div v-if="form.userType === 'organization'" class="space-y-4">
                                <h4 class="text-xs font-black text-navy  tracking-widest flex items-center gap-2 mb-4">
                                    <Icon icon="ph:buildings-bold" class="text-primary text-lg" />
                                    {{ t('auth.register.org_info') }}
                                </h4>
                                <BaseInput v-model="form.organizationName" :label="t('auth.register.org_name_label')"
                                    :placeholder="t('auth.register.org_name_placeholder')" required
                                    :error="errors.organizationName || (isNameTaken ? t('auth.register.name_taken_org') : '')"
                                    @update:model-value="validate('organizationName', form.organizationName, [rules.required(), rules.minLength(3)])" />

                                <!-- Acronym and WhatsApp fields removed -->

                                <div class="grid grid-cols-2 gap-4">
                                    <BaseSelect v-model="form.country" :label="t('auth.register.country_label')" :placeholder="t('auth.register.country_placeholder')" required
                                        :items="countries" :error="errors.country" searchable
                                        @update:model-value="handleCountryChange" />
                                    
                                    <BaseSelect v-model="form.currency" :label="t('auth.register.currency_label')" :placeholder="t('auth.register.currency_placeholder')" required
                                        :items="currencies" :error="errors.currency"
                                        item-title="title" item-value="value"
                                        @update:model-value="validate('currency', form.currency, [rules.required()])" />
                                </div>

                                <div class="space-y-1">
                                    <label class="text-sm font-bold text-navy">{{ t('auth.register.address_label_full') }}</label>
                                    <textarea v-model="form.address"
                                        class="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[80px]"
                                        :class="{ 'border-red-500': errors.address }"
                                        :placeholder="t('auth.register.address_label')"
                                        @input="validate('address', form.address, [rules.required()])"></textarea>
                                    <p v-if="errors.address" class="text-red-500  text-xs font-bold ml-1">{{
                                        errors.address }}</p>
                                </div>
                            </div>

                            <!-- Seller: Nama Toko -->
                            <div v-if="form.userType === 'seller'">
                                <h4 class="text-xs font-black text-navy  tracking-widest flex items-center gap-2 mb-4">
                                    <Icon icon="ph:storefront-bold" class="text-primary text-lg" />
                                    {{ t('auth.register.shop_info') }}
                                </h4>
                                <BaseInput v-model="form.storeName" :label="t('auth.register.shop_name_label')" :placeholder="t('auth.register.shop_name_placeholder')"
                                    required
                                    :error="errors.storeName || (isNameTaken ? t('auth.register.name_taken_shop') : '')"
                                    @update:model-value="validate('storeName', form.storeName, [rules.required(), rules.minLength(3)])" />
                                <p class="mt-2 text-xs text-gray-400">{{ t('auth.register.shop_note') }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2 pt-6 border-t border-gray-100">
                            <BaseCheckbox v-model="form.terms" required :error="errors.terms"
                                @update:model-value="validate('terms', form.terms, [rules.required(t('auth.register.terms_required_error'))])">
                                {{ t('auth.register.agree_to') }}
                                <NuxtLink class="font-bold underline text-navy hover:text-primary-hover" to="/terms">
                                    {{ t('auth.register.terms_conditions') }}</NuxtLink> {{ t('auth.register.and') }}
                                <NuxtLink class="font-bold underline text-navy hover:text-primary-hover" to="/privacy">
                                    {{ t('auth.register.privacy_policy') }}</NuxtLink>
                            </BaseCheckbox>
                        </div>

                        <!-- Google OAuth Button (PRIMARY ACTION) -->
                        <div class="pt-2">
                            <BaseButton variant="gold" block size="lg" icon="logos:google-icon"
                                @click="handleGoogleRegister" :loading="isGoogleLoading || isValidating"
                                :disabled="!isNameValid || !form.terms || isNameTaken || isValidating">
                                {{ t('auth.register.register_with_google') }}
                            </BaseButton>
                            <p class="mt-4 text-xs text-center text-gray-400">
                                {{ t('auth.register.google_instruction') }}
                            </p>
                        </div>
                    </form>

                    <div class="mt-8 text-center font-body">
                        <p class="text-sm text-slate-600">
                            {{ t('auth.register.already_have_account') }}
                            <NuxtLink class="font-black text-navy hover:text-primary-hover transition-colors"
                                to="/auth/login">
                                {{ t('auth.register.login_here') }}
                            </NuxtLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFormValidation } from '~/composables/useFormValidation'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

const route = useRoute()
const isLoading = ref(false)
const toast = useToast()
const cities = ref([])
const { t } = useI18n()

useHead({
    title: t('auth.register.welcome') + ' - Archeris.net'
})

const userTypes = [
    { value: 'archer', label: 'Archer', icon: 'temaki:archery' },
    { value: 'organization', label: 'Organization', icon: 'ph:buildings-bold' },
    { value: 'seller', label: 'Seller', icon: 'ph:storefront-bold' }
]

const { errors, validate, validateForm, rules } = useFormValidation()

const slides = ['/slide-1.jpeg', '/slide-2.jpeg', '/slide-3.jpeg']
const currentSlideIndex = ref(0)
let slideInterval = null

const startSlideshow = () => {
    slideInterval = setInterval(() => {
        currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length
    }, 2000)
}

// Get initial user type from query param
const getInitialUserType = () => {
    const typeParam = route.query.type
    if (typeParam && ['archer', 'organization', 'seller'].includes(typeParam)) {
        return typeParam
    }
    return 'archer'
}

// Simplified form - only essential fields
const form = ref({
    userType: getInitialUserType(),
    fullName: '',           // For archer
    organizationName: '',   // For organization
    storeName: '',          // For seller
    terms: false,

    // New Fields
    gender: '',
    dateOfBirth: '',
    city: '',
    country: '',
    currency: '',
    clubID: '',
    newClubName: '',
    newClubAcronym: '',
    address: ''
})

// Club variables removed

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

const currencies = ref([
  { title: 'IDR - Rupiah Indonesia', value: 'IDR', icon: 'circle-flags:id' },
  { title: 'MYR - Ringgit Malaysia', value: 'MYR', icon: 'circle-flags:my' },
  { title: 'SGD - Dolar Singapura', value: 'SGD', icon: 'circle-flags:sg' },
  { title: 'THB - Baht Thailand', value: 'THB', icon: 'circle-flags:th' },
  { title: 'PHP - Peso Filipina', value: 'PHP', icon: 'circle-flags:ph' },
  { title: 'VND - Dong Vietnam', value: 'VND', icon: 'circle-flags:vn' },
  { title: 'AUD - Dolar Australia', value: 'AUD', icon: 'circle-flags:au' },
  { title: 'JPY - Yen Jepang', value: 'JPY', icon: 'circle-flags:jp' },
  { title: 'KRW - Won Korea Selatan', value: 'KRW', icon: 'circle-flags:kr' },
  { title: 'GBP - Pound Sterling', value: 'GBP', icon: 'circle-flags:gb' },
  { title: 'USD - Dolar Amerika Serikat', value: 'USD', icon: 'circle-flags:us' }
])

const countryToCurrency = {
  'Indonesia': 'IDR',
  'Malaysia': 'MYR',
  'Singapore': 'SGD',
  'Thailand': 'THB',
  'Philippines': 'PHP',
  'Vietnam': 'VND',
  'Australia': 'AUD',
  'Japan': 'JPY',
  'South Korea': 'KRW',
  'United Kingdom': 'GBP',
  'United States': 'USD'
}

const handleCountryChange = (countryName) => {
    validate('country', countryName, [rules.required()])
    const currency = countryToCurrency[countryName]
    if (currency) {
        form.value.currency = currency
    }
}

const { register, login } = useAuth()
const { get } = useApi()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

const getMediaUrl = (filename) => {
    if (!filename) return ''
    if (filename.startsWith('http')) return filename
    // apiBaseUrl already contains /api/v1
    return `${apiBaseUrl}/media/${filename}`
}

// Name uniqueness validation
const isNameTaken = ref(false)
const isValidating = ref(false)
let debounceTimer = null

const checkNameUnique = async (name) => {
    if (!name || name.length < 3) return

    isValidating.value = true
    try {
        const response = await get(`/auth/check-name?type=${form.value.userType}&name=${encodeURIComponent(name)}`)
        isNameTaken.value = response.exists
        if (response.exists) {
            toast.error(t('auth.register.name_taken_toast'))
        }
    } catch (err) {
        console.error('Failed to check name:', err)
    } finally {
        isValidating.value = false
    }
}

watch([() => form.value.fullName, () => form.value.organizationName, () => form.value.storeName], () => {
    isNameTaken.value = false
    clearTimeout(debounceTimer)
    const name = getName()
    if (name.length >= 3) {
        debounceTimer = setTimeout(() => {
            checkNameUnique(name)
        }, 500)
    }
})

watch(() => form.value.userType, () => {
    isNameTaken.value = false
    const name = getName()
    if (name.length >= 3) {
        checkNameUnique(name)
    }
})

onMounted(async () => {
    startSlideshow()
    try {
        const response = await get('/cities')
        cities.value = response.data.map(c => ({ title: c.name, value: c.name }))
    } catch (err) {
        console.error('Failed to fetch cities:', err)
    }
})

onUnmounted(() => {
    if (slideInterval) clearInterval(slideInterval)
})

const getName = () => {
    switch (form.value.userType) {
        case 'archer': return form.value.fullName
        case 'organization': return form.value.organizationName
        case 'seller': return form.value.storeName
        default: return ''
    }
}

const isNameValid = computed(() => {
    const name = getName()
    return name && name.trim().length >= 3
})

// Google OAuth registration
const isGoogleLoading = ref(false)

const handleRegister = () => {
    handleGoogleRegister()
}

const handleGoogleRegister = async () => {
    if (!isNameValid.value) {
        toast.error(t('auth.register.name_invalid_toast'))
        return
    }

    if (!form.value.terms) {
        toast.error(t('auth.register.terms_toast'))
        return
    }

    isGoogleLoading.value = true

    try {
        // Prepare metadata from form
        const metadata = {
            full_name: getName(),
            oauth_mode: 'register',
        }

        if (form.value.userType === 'archer') {
            if (!form.value.gender) {
                toast.error('Gender is required')
                isGoogleLoading.value = false
                return
            }
            if (!form.value.dateOfBirth) {
                toast.error('Birth date is required')
                isGoogleLoading.value = false
                return
            }
            if (!form.value.city) {
                toast.error('City is required')
                isGoogleLoading.value = false
                return
            }
            if (!form.value.clubID && !form.value.newClubName) {
                toast.error('Club is required')
                isGoogleLoading.value = false
                return
            }

            Object.assign(metadata, {
                gender: form.value.gender,
                date_of_birth: form.value.dateOfBirth,
                city: form.value.city,
                club_id: form.value.clubID || '',
                new_club_name: form.value.newClubName || '',
                new_club_acronym: form.value.newClubAcronym || ''
            })
        } else if (form.value.userType === 'organization') {
            if (!form.value.country) {
                toast.error('Country is required')
                isGoogleLoading.value = false
                return
            }
            if (!form.value.currency) {
                toast.error('Currency is required')
                isGoogleLoading.value = false
                return
            }
            if (!form.value.address) {
                toast.error('Address is required')
                isGoogleLoading.value = false
                return
            }

            Object.assign(metadata, {
                country: form.value.country,
                currency: form.value.currency,
                address: form.value.address
            })
        }

        await login(form.value.userType, metadata)
    } catch (err) {
        console.error('Google register failed:', err)
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
        isGoogleLoading.value = false
    }
}
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
