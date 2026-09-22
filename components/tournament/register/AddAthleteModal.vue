<template>
    <Teleport to="body">
        <div v-if="show"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy/60 backdrop-blur-sm animate-fade-in"
            @click.self="close">
            
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200/90 flex flex-col max-h-[90vh]">
                
                <!-- Modal Header -->
                <div class="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
                    <div class="flex items-start gap-3.5">
                        <div class="size-11 rounded-2xl bg-navy text-primary flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                            <Icon icon="ph:user-plus-bold" class="text-xl" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-black text-navy leading-snug">
                                {{ isEn ? 'Add Archer' : 'Tambah Atlet' }}
                            </h3>
                            <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                                {{ isEn ? 'Search registered archers or create a new archer.' : 'Cari atlet terdaftar atau buat akun archer baru.' }}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        @click="close"
                        class="size-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-navy hover:bg-slate-200 transition-colors cursor-pointer shrink-0">
                        <Icon icon="ph:x-bold" class="text-base" />
                    </button>
                </div>

                <!-- Segmented Tabs Navigation -->
                <div class="p-3.5 bg-slate-50 border-b border-slate-100">
                    <div class="grid grid-cols-2 gap-1.5 bg-slate-200/70 p-1 rounded-2xl">
                        <button
                            type="button"
                            @click="activeTab = 'existing'"
                            class="py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                            :class="activeTab === 'existing' ? 'bg-white text-navy font-black shadow-xs' : 'text-slate-600 hover:text-navy'">
                            <Icon icon="ph:magnifying-glass-bold" class="text-sm shrink-0" />
                            <span class="truncate">{{ isEn ? 'Search Archer' : 'Cari Atlet' }}</span>
                        </button>
                        <button
                            type="button"
                            @click="activeTab = 'new'"
                            class="py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                            :class="activeTab === 'new' ? 'bg-white text-navy font-black shadow-xs' : 'text-slate-600 hover:text-navy'">
                            <Icon icon="ph:user-plus-bold" class="text-sm shrink-0" />
                            <span class="truncate">{{ isEn ? 'New Archer' : 'Archer Baru' }}</span>
                        </button>
                    </div>
                </div>

                <!-- TAB 1: SEARCH & SELECT EXISTING ARCHER -->
                <div v-if="activeTab === 'existing'" class="flex-1 overflow-y-auto p-5 space-y-4 max-h-[460px]">
                    <!-- Search Input -->
                    <div class="relative">
                        <input
                            v-model="searchQuery"
                            type="text"
                            :placeholder="isEn ? 'Search by archer name, club, or email...' : 'Cari berdasarkan nama atlet, klub, atau email...'"
                            class="w-full h-12 px-4 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-navy focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
                            autofocus />
                        <Icon icon="ph:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                        <Icon v-if="searchLoading" icon="ph:spinner-gap-bold" class="absolute right-4 top-1/2 -translate-y-1/2 text-navy animate-spin text-lg" />
                    </div>

                    <!-- Results List -->
                    <div class="space-y-2.5">
                        <div v-if="searchQuery.length < 2" class="py-10 text-center text-slate-400 space-y-2">
                            <div class="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                                <Icon icon="ph:magnifying-glass-bold" class="text-2xl" />
                            </div>
                            <div class="text-sm font-bold">{{ isEn ? 'Type at least 2 characters to search' : 'Ketik minimal 2 karakter untuk mencari' }}</div>
                        </div>
                        <div v-else-if="searchResults.length === 0 && !searchLoading" class="py-10 text-center space-y-3">
                            <div class="size-14 rounded-2xl bg-slate-100 border border-slate-200 shadow-2xs flex items-center justify-center mx-auto text-navy">
                                <Icon icon="ph:user-slash-bold" class="text-2xl text-navy" />
                            </div>
                            <div>
                                <div class="text-sm sm:text-base font-black text-navy">{{ isEn ? 'No archers found' : 'Atlet tidak ditemukan' }}</div>
                                <div class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ isEn ? 'Switch to New Archer tab to register.' : 'Pindah ke tab Archer Baru untuk mendaftarkan.' }}</div>
                            </div>
                        </div>
                        <div v-else class="space-y-2.5">
                            <div
                                v-for="archer in searchResults"
                                :key="archer.archer_id || archer.id || archer.uuid"
                                @click="!isArcherInRoster(archer) && selectExistingArcher(archer)"
                                class="flex items-center justify-between p-4 rounded-2xl border transition-all"
                                :class="isArcherInRoster(archer) 
                                    ? 'border-slate-200 bg-slate-50/70 opacity-60 cursor-not-allowed' 
                                    : 'border-slate-200 hover:border-navy hover:bg-slate-50 cursor-pointer group'">
                                <div class="flex items-center gap-3.5 min-w-0">
                                    <img
                                        :src="useImageOrDefault(archer.avatar_url || archer.photo_url, archer.full_name)"
                                        class="size-11 rounded-full object-cover shrink-0 border border-slate-200" />
                                    <div class="min-w-0">
                                        <div class="text-sm sm:text-base font-black text-navy truncate" :class="{ 'group-hover:underline': !isArcherInRoster(archer) }">
                                            {{ archer.full_name }}
                                        </div>
                                        <div class="text-xs sm:text-sm text-slate-600 font-bold truncate mt-0.5 flex items-center gap-1.5">
                                            <Icon icon="ph:shield-bold" class="text-xs text-primary-hover shrink-0" />
                                            <span>{{ archer.club_name || 'Independent' }}</span>
                                            <span class="text-slate-300">•</span>
                                            <span class="text-slate-400 font-normal">{{ archer.email || archer.phone || '-' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="isArcherInRoster(archer)" class="px-2.5 py-1 rounded-lg bg-slate-200/80 text-slate-600 text-xs font-bold flex items-center gap-1 shrink-0">
                                    <Icon icon="ph:check-bold" class="text-xs" />
                                    <span>{{ isEn ? 'In Roster' : 'Sudah di Daftar' }}</span>
                                </div>
                                <div v-else class="size-9 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                                    <Icon icon="ph:plus-bold" class="text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: CREATE NEW ARCHER ACCOUNT -->
                <div v-else-if="activeTab === 'new'" class="p-6 overflow-y-auto max-h-[480px] space-y-4">
                    <div class="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-start gap-3">
                        <Icon icon="ph:info-bold" class="text-navy text-xl shrink-0 mt-0.5" />
                        <div class="text-xs sm:text-sm text-navy leading-relaxed font-medium">
                            {{ isEn ? 'Enter archer credentials. If the email is already registered in Archeris, it will link automatically.' : 'Masukkan data atlet. Jika email sudah terdaftar di sistem Archeris, akun akan ditautkan secara otomatis.' }}
                        </div>
                    </div>

                    <!-- Auto-detected existing account notification -->
                    <div v-if="isExistingUserInDb && matchedDbUser" class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 animate-fade-in">
                        <Icon icon="ph:user-check-bold" class="text-emerald-700 text-xl shrink-0 mt-0.5" />
                        <div class="text-xs sm:text-sm text-emerald-900 leading-snug">
                            <div class="font-bold">
                                {{ isEn ? 'Registered Archeris Account Detected' : 'Akun Terdaftar Ditemukan' }}
                            </div>
                            <div class="text-xs text-emerald-700 mt-0.5">
                                {{ isEn 
                                    ? `Linked to ${matchedDbUser.full_name} (${matchedDbUser.club_name || 'Independent'}). Password is not required.` 
                                    : `Terhubung dengan profil ${matchedDbUser.full_name} (${matchedDbUser.club_name || 'Independen'}). Kata sandi tidak diperlukan.` }}
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="relative">
                            <BaseInput
                                v-model="newForm.email"
                                :label="isEn ? 'Archer Email' : 'Email Atlet'"
                                type="email"
                                :placeholder="isEn ? 'archer@email.com' : 'atlet@email.com'"
                                :error="errors.email"
                                @blur="validateField('email')"
                                required
                                icon="ph:envelope-bold" />
                            <Icon v-if="isCheckingEmail" icon="ph:spinner-gap-bold" class="absolute right-3 top-9 text-navy animate-spin text-base" />
                            <div v-if="isExistingUserInDb && matchedDbUser" class="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1.5 px-1 animate-in fade-in">
                                <Icon icon="ph:check-circle-fill" class="text-sm shrink-0" />
                                <span>{{ isEn ? `Found registered profile for ${matchedDbUser.full_name} (Linked)` : `Akun terdaftar atas nama ${matchedDbUser.full_name} ditemukan (Ditautkan)` }}</span>
                            </div>
                        </div>

                        <BaseInput
                            v-model="newForm.full_name"
                            :label="isEn ? 'Full Name' : 'Nama Lengkap'"
                            :placeholder="isEn ? 'Official archer name' : 'Nama lengkap atlet'"
                            :error="errors.full_name"
                            @blur="validateField('full_name')"
                            required
                            icon="ph:user-bold" />

                        <div>
                            <BaseSelect
                                v-model="newForm.gender"
                                :items="genderOptions"
                                :label="isEn ? 'Gender' : 'Jenis Kelamin'"
                                required
                                icon="ph:gender-intersex" />
                        </div>

                        <!-- Password Field: only needed if new account -->
                        <div v-if="!isExistingUserInDb" class="relative">
                            <BaseInput
                                v-model="newForm.password"
                                :label="isEn ? 'Account Password' : 'Kata Sandi Akun'"
                                type="text"
                                :placeholder="isEn ? 'Default: Archeris123!' : 'Default: Archeris123!'"
                                :error="errors.password"
                                @blur="validateField('password')"
                                required
                                icon="ph:lock-key-bold" />
                            <button
                                type="button"
                                @click="generateEasyPassword"
                                class="absolute right-2 top-8 text-xs font-bold text-navy bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer">
                                <Icon icon="ph:arrows-clockwise-bold" class="text-xs text-primary-hover" />
                                <span>{{ isEn ? 'Auto Generate' : 'Acak Sandi' }}</span>
                            </button>
                        </div>

                        <div>
                            <ClubSelector
                                v-model="newForm.club_id"
                                v-model:newClubName="newForm.club_name"
                                :label="isEn ? 'Club / Origin' : 'Klub / Asal Kontingen'"
                                :placeholder="isEn ? 'Select or search club...' : 'Pilih atau cari klub...'" />
                        </div>

                        <div class="pt-2">
                            <BaseButton
                                type="button"
                                @click="submitNewArcher"
                                :disabled="!isNewFormValid"
                                variant="navy"
                                size="md"
                                class="w-full justify-center text-sm sm:text-base">
                                <template #icon-left>
                                    <Icon icon="ph:user-plus-bold" />
                                </template>
                                {{ isEn ? 'Add Archer to Roster' : 'Tambahkan Atlet ke Daftar' }}
                            </BaseButton>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button
                        type="button"
                        @click="close"
                        class="px-5 py-2.5 rounded-xl border border-slate-200 text-navy font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer">
                        {{ isEn ? 'Close' : 'Tutup' }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useImageOrDefault } from '~/composables/useImageHelper'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import ClubSelector from '~/components/common/ClubSelector.vue'

const { locale } = useI18n()
const isEn = computed(() => locale.value !== 'id')

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    tournamentId: {
        type: String,
        required: true
    },
    individualCategories: {
        type: Array,
        default: () => []
    },
    defaultClubId: {
        type: String,
        default: ''
    },
    defaultClubName: {
        type: String,
        default: ''
    },
    existingEmails: {
        type: Array,
        default: () => []
    },
    existingArcherIds: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['close', 'add-athlete'])

const activeTab = ref('existing')
const searchQuery = ref('')
const searchResults = ref([])
const searchLoading = ref(false)

const isExistingUserInDb = ref(false)
const matchedDbUser = ref(null)
const isCheckingEmail = ref(false)
let emailLookupTimer = null

const genderOptions = computed(() => [
    { title: 'Male', value: 'male' },
    { title: 'Female', value: 'female' }
])

const newForm = ref({
    full_name: '',
    gender: 'male',
    email: '',
    password: 'Archeris123!',
    club_id: '',
    club_name: ''
})

const errors = ref({
    full_name: '',
    email: '',
    password: ''
})

const isArcherInRoster = (archer) => {
    const email = archer.email?.toLowerCase()?.trim()
    const id = archer.archer_id || archer.id || archer.uuid
    if (email && props.existingEmails.some(e => e?.toLowerCase()?.trim() === email)) {
        return true
    }
    if (id && props.existingArcherIds.some(existingId => existingId === id)) {
        return true
    }
    return false
}

const validateField = (field) => {
    if (field === 'full_name') {
        const val = newForm.value.full_name?.trim()
        if (!val) {
            errors.value.full_name = isEn.value ? 'Full name is required.' : 'Nama lengkap wajib diisi.'
        } else if (val.length < 3) {
            errors.value.full_name = isEn.value ? 'Full name must be at least 3 characters.' : 'Nama lengkap minimal 3 karakter.'
        } else {
            errors.value.full_name = ''
        }
    }

    if (field === 'email') {
        const val = newForm.value.email?.trim()?.toLowerCase()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!val) {
            errors.value.email = isEn.value ? 'Email is required.' : 'Alamat email wajib diisi.'
        } else if (!emailRegex.test(val)) {
            errors.value.email = isEn.value ? 'Invalid email format.' : 'Format alamat email tidak valid.'
        } else if (props.existingEmails.some(e => e?.toLowerCase()?.trim() === val)) {
            errors.value.email = isEn.value ? 'This archer is already added to the roster.' : 'Atlet dengan email ini sudah ada di daftar kontingen.'
        } else {
            errors.value.email = ''
        }
    }

    if (field === 'password') {
        if (!isExistingUserInDb.value) {
            const val = newForm.value.password
            if (!val) {
                errors.value.password = isEn.value ? 'Password is required.' : 'Kata sandi wajib diisi.'
            } else if (val.length < 6) {
                errors.value.password = isEn.value ? 'Password must be at least 6 characters.' : 'Kata sandi minimal 6 karakter.'
            } else {
                errors.value.password = ''
            }
        } else {
            errors.value.password = ''
        }
    }
}

const checkEmailInDb = async () => {
    const email = newForm.value.email?.trim()?.toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
        isExistingUserInDb.value = false
        matchedDbUser.value = null
        return
    }

    if (props.existingEmails.some(e => e?.toLowerCase()?.trim() === email)) {
        return
    }

    isCheckingEmail.value = true
    try {
        const apiBaseUrl = useApiBaseUrl()
        const res = await $fetch(`${apiBaseUrl}/archers?search=${encodeURIComponent(email)}&limit=10`)
        const users = res?.archers || res?.data || (Array.isArray(res) ? res : [])
        const matched = users.find(u => u.email?.trim()?.toLowerCase() === email)
        if (matched) {
            isExistingUserInDb.value = true
            matchedDbUser.value = matched
            if (!newForm.value.full_name || newForm.value.full_name.trim() === '') {
                newForm.value.full_name = matched.full_name
            }
            if (matched.gender) {
                newForm.value.gender = matched.gender.toLowerCase()
            }
            if (matched.club_name) {
                newForm.value.club_name = matched.club_name
                newForm.value.club_id = matched.club_id || ''
            }
            errors.value.password = ''
        } else {
            isExistingUserInDb.value = false
            matchedDbUser.value = null
        }
    } catch (err) {
        isExistingUserInDb.value = false
        matchedDbUser.value = null
    } finally {
        isCheckingEmail.value = false
    }
}

watch(() => newForm.value.email, () => {
    clearTimeout(emailLookupTimer)
    emailLookupTimer = setTimeout(() => {
        validateField('email')
        if (!errors.value.email) {
            checkEmailInDb()
        }
    }, 350)
})

const generateEasyPassword = () => {
    const prefixes = ['archer', 'panah', 'target', 'arrow', 'focus', 'bullseye']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const num = Math.floor(100 + Math.random() * 900)
    newForm.value.password = `${prefix}${num}!`
    errors.value.password = ''
}

const isNewFormValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const email = newForm.value.email?.trim()?.toLowerCase()
    const isEmailInRoster = email && props.existingEmails.some(e => e?.toLowerCase()?.trim() === email)
    
    const isNameOk = !!newForm.value.full_name && newForm.value.full_name.trim().length >= 3
    const isEmailOk = !!email && emailRegex.test(email) && !isEmailInRoster
    const isGenderOk = !!newForm.value.gender
    const isPasswordOk = isExistingUserInDb.value || (!!newForm.value.password && newForm.value.password.length >= 6)

    return isNameOk && isEmailOk && isGenderOk && isPasswordOk
})

const close = () => {
    emit('close')
}

const selectExistingArcher = (archer) => {
    if (isArcherInRoster(archer)) return

    emit('add-athlete', {
        archer_id: archer.archer_id || archer.id || archer.uuid,
        full_name: archer.full_name,
        gender: archer.gender || 'male',
        category_id: '',
        category_ids: [],
        email: archer.email || '',
        club_id: archer.club_id || props.defaultClubId,
        club_name: archer.club_name || props.defaultClubName || 'Independent',
        avatar_url: archer.avatar_url || archer.photo_url || '',
        is_new_account: false
    })
    close()
}

const submitNewArcher = () => {
    ['full_name', 'email', 'password'].forEach(validateField)
    if (!isNewFormValid.value) return

    emit('add-athlete', {
        archer_id: isExistingUserInDb.value ? (matchedDbUser.value?.uuid || matchedDbUser.value?.id || '') : '',
        full_name: newForm.value.full_name.trim(),
        gender: newForm.value.gender || 'male',
        category_id: '',
        category_ids: [],
        email: newForm.value.email.trim(),
        password: isExistingUserInDb.value ? '' : (newForm.value.password || 'Archeris123!'),
        club_id: newForm.value.club_id || props.defaultClubId,
        club_name: newForm.value.club_name || props.defaultClubName || 'Independent',
        avatar_url: matchedDbUser.value?.avatar_url || '',
        is_new_account: !isExistingUserInDb.value
    })
    
    newForm.value = {
        full_name: '',
        gender: 'male',
        email: '',
        password: 'Archeris123!',
        club_id: props.defaultClubId,
        club_name: props.defaultClubName
    }
    isExistingUserInDb.value = false
    matchedDbUser.value = null
    errors.value = {
        full_name: '',
        email: '',
        password: ''
    }
    close()
}

// Search archers
let searchTimer = null
const doSearch = async () => {
    const q = searchQuery.value.trim()
    if (!q || q.length < 2) {
        searchResults.value = []
        return
    }
    searchLoading.value = true
    try {
        const apiBaseUrl = useApiBaseUrl()
        const res = await $fetch(`${apiBaseUrl}/archers?search=${encodeURIComponent(q)}&limit=20`)
        searchResults.value = res?.archers || res?.data || (Array.isArray(res) ? res : [])
    } catch (e) {
        searchResults.value = []
    } finally {
        searchLoading.value = false
    }
}

watch(searchQuery, () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(doSearch, 300)
})

watch(() => props.show, (val) => {
    if (val) {
        if (!newForm.value.password) {
            newForm.value.password = 'Archeris123!'
        }
        if (props.defaultClubId) newForm.value.club_id = props.defaultClubId
        if (props.defaultClubName) newForm.value.club_name = props.defaultClubName
    }
})
</script>
