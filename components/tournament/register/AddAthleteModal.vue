<template>
    <Teleport to="body">
        <div v-if="show"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-navy/60 backdrop-blur-sm animate-fade-in"
            @click.self="close">
            
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200/90 flex flex-col max-h-[90vh]">
                
                <!-- Modal Header -->
                <div class="px-5 py-3.5 sm:px-6 sm:py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="size-9 rounded-xl bg-primary/15 border border-primary/30 text-navy flex items-center justify-center shadow-2xs shrink-0">
                            <Icon :icon="isEdit ? 'ph:pencil-simple-bold' : 'ph:user-plus-bold'" class="text-base text-navy" />
                        </div>
                        <div>
                            <h3 class="text-sm sm:text-base font-black text-navy leading-snug">
                                {{ isEdit ? (isEn ? 'Edit Archer Data' : 'Edit Data Atlet') : (isEn ? 'Add Archer' : 'Tambah Atlet') }}
                            </h3>
                            <div class="text-xs text-slate-500">
                                {{ isEdit 
                                    ? (isEn ? 'Update details for this archer in your delegation.' : 'Perbarui data atlet di daftar kontingen ini.')
                                    : (isEn ? 'Search registered archers or create a new archer.' : 'Cari atlet terdaftar atau buat akun archer baru.') }}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        @click="close"
                        class="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-navy hover:bg-slate-200 transition-colors cursor-pointer shrink-0">
                        <Icon icon="ph:x-bold" class="text-sm" />
                    </button>
                </div>

                <!-- Modern 2-Segment Tabs Navigation (Only when adding) -->
                <div v-if="!isEdit" class="px-4 py-2.5 bg-slate-50 border-b border-slate-100 shrink-0">
                    <div class="grid grid-cols-2 gap-1.5 bg-slate-200/70 p-1 rounded-xl">
                        <button
                            type="button"
                            @click="activeTab = 'search'"
                            class="py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                            :class="activeTab === 'search' ? 'bg-white text-navy font-black shadow-xs' : 'text-slate-600 hover:text-navy'">
                            <Icon icon="ph:magnifying-glass-bold" class="text-sm shrink-0" />
                            <span>{{ isEn ? 'Search Archer' : 'Cari Atlet' }}</span>
                        </button>
                        <button
                            type="button"
                            @click="activeTab = 'quick_add'"
                            class="py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                            :class="activeTab === 'quick_add' ? 'bg-white text-navy font-black shadow-xs' : 'text-slate-600 hover:text-navy'">
                            <Icon icon="ph:user-plus-bold" class="text-sm shrink-0" />
                            <span>{{ isEn ? 'New Archer' : 'Archer Baru' }}</span>
                        </button>
                    </div>
                </div>

                <!-- TAB 1: UNIFIED SMART SEARCH & SELECTION -->
                <div v-if="!isEdit && activeTab === 'search'" class="flex-1 flex flex-col overflow-hidden">
                    <!-- Search Input Bar -->
                    <div class="px-4 py-2.5 border-b border-slate-100 bg-slate-50/40 shrink-0">
                        <div class="relative">
                            <input
                                v-model="searchQuery"
                                type="text"
                                :placeholder="isEn ? 'Search by archer name, club, or email...' : 'Cari nama atlet, klub, atau email...'"
                                class="w-full h-10 px-3.5 pl-10 pr-9 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
                                autofocus />
                            <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                            <button
                                v-if="searchQuery"
                                type="button"
                                @click="searchQuery = ''"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy p-0.5">
                                <Icon icon="ph:x-circle-fill" class="text-base" />
                            </button>
                            <Icon v-else-if="searchLoading" icon="ph:spinner-gap-bold" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy animate-spin text-base" />
                        </div>
                    </div>

                    <!-- Search Results / Available Archers List -->
                    <div class="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5 max-h-[380px] custom-scrollbar">
                        
                        <!-- State 1: Search Query Active -->
                        <template v-if="searchQuery.trim().length > 0">
                            <div v-if="searchQuery.trim().length < 2" class="py-10">
                                <BaseEmptyState
                                    icon="ph:magnifying-glass-bold"
                                    size="sm"
                                    :title="isEn ? 'Type at least 2 characters' : 'Ketik minimal 2 karakter'"
                                    :description="isEn ? 'Enter the archer name or email to search the database.' : 'Masukkan nama atlet atau email untuk mencari di database.'"
                                />
                            </div>

                            <div v-else-if="searchLoading" class="py-14 text-center text-slate-400">
                                <Icon icon="ph:spinner-gap-bold" class="text-3xl animate-spin mx-auto mb-2 text-navy" />
                                <div class="text-xs sm:text-sm font-bold text-navy">{{ isEn ? 'Searching archers database...' : 'Mencari atlet di database...' }}</div>
                            </div>

                            <div v-else-if="searchResults.length === 0" class="py-8">
                                <BaseEmptyState
                                    icon="ph:user-slash-bold"
                                    size="sm"
                                    :title="isEn ? 'No archers found' : 'Atlet tidak ditemukan'"
                                    :description="isEn ? 'No archers matched your search. You can register a new archer.' : 'Tidak ditemukan atlet yang cocok di database. Anda dapat mendaftarkan atlet baru.'"
                                >
                                    <template #actions>
                                        <BaseButton
                                            type="button"
                                            variant="navy"
                                            size="sm"
                                            icon="ph:user-plus-bold"
                                            @click="activeTab = 'quick_add'"
                                            class="font-bold text-xs">
                                            <span>{{ isEn ? 'Register New Archer' : 'Daftarkan Atlet Baru' }}</span>
                                        </BaseButton>
                                    </template>
                                </BaseEmptyState>
                            </div>

                            <div v-else class="space-y-2.5">
                                <div
                                    v-for="archer in searchResults"
                                    :key="archer.archer_id || archer.id || archer.uuid"
                                    @click="!isArcherInRoster(archer) && selectExistingArcher(archer)"
                                    class="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all select-none"
                                    :class="isArcherInRoster(archer) 
                                        ? 'border-slate-200 bg-slate-50/70 opacity-50 cursor-not-allowed' 
                                        : 'border-slate-200 hover:border-navy hover:bg-slate-50 cursor-pointer group shadow-2xs'">
                                    
                                    <div class="flex items-center gap-3.5 min-w-0">
                                        <img
                                            :src="useImageOrDefault(archer.avatar_url || archer.photo_url, archer.full_name)"
                                            class="size-11 rounded-full object-cover shrink-0 border border-slate-200" />
                                        <div class="min-w-0">
                                            <div class="text-sm sm:text-base font-black text-navy truncate">
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

                                    <div class="flex items-center gap-2.5 shrink-0">
                                        <div v-if="isArcherInRoster(archer)" class="px-2.5 py-1 rounded-lg bg-slate-200/80 text-slate-600 text-xs font-bold flex items-center gap-1">
                                            <Icon icon="ph:check-bold" class="text-xs" />
                                            <span>{{ isEn ? 'In Roster' : 'Sudah di Daftar' }}</span>
                                        </div>
                                        <div v-else class="size-8 sm:size-9 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                            <Icon icon="ph:plus-bold" class="text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- State 2: Default Recommendations -->
                        <template v-else>
                            <div v-if="initialLoading" class="py-14 text-center text-slate-400">
                                <Icon icon="ph:spinner-gap-bold" class="text-3xl animate-spin mx-auto mb-2 text-navy" />
                                <div class="text-xs sm:text-sm font-bold text-navy">{{ isEn ? 'Loading registered archers...' : 'Memuat daftar atlet...' }}</div>
                            </div>

                            <div v-else-if="defaultArchers.length === 0" class="py-8">
                                <BaseEmptyState
                                    icon="ph:magnifying-glass-bold"
                                    size="sm"
                                    :title="isEn ? 'Search Archer in Database' : 'Cari Atlet di Database'"
                                    :description="isEn ? 'Type the archer name above to search the database, or switch to New Archer to add someone new.' : 'Ketik nama atlet di kolom pencarian di atas, atau pilih tab Archer Baru jika belum memiliki akun.'"
                                />
                            </div>

                            <div v-else class="space-y-2.5">
                                <div
                                    v-for="archer in defaultArchers"
                                    :key="archer.archer_id || archer.id || archer.uuid"
                                    @click="!isArcherInRoster(archer) && selectExistingArcher(archer)"
                                    class="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all select-none"
                                    :class="isArcherInRoster(archer) 
                                        ? 'border-slate-200 bg-slate-50/70 opacity-50 cursor-not-allowed' 
                                        : 'border-slate-200 hover:border-navy hover:bg-slate-50 cursor-pointer group shadow-2xs'">
                                    
                                    <div class="flex items-center gap-3.5 min-w-0">
                                        <img
                                            :src="useImageOrDefault(archer.avatar_url || archer.photo_url, archer.full_name)"
                                            class="size-11 rounded-full object-cover shrink-0 border border-slate-200" />
                                        <div class="min-w-0">
                                            <div class="text-sm sm:text-base font-black text-navy truncate">
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

                                    <div class="flex items-center gap-2.5 shrink-0">
                                        <div v-if="isArcherInRoster(archer)" class="px-2.5 py-1 rounded-lg bg-slate-200/80 text-slate-600 text-xs font-bold flex items-center gap-1">
                                            <Icon icon="ph:check-bold" class="text-xs" />
                                            <span>{{ isEn ? 'In Roster' : 'Sudah di Daftar' }}</span>
                                        </div>
                                        <div v-else class="size-8 sm:size-9 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                            <Icon icon="ph:plus-bold" class="text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                    </div>
                </div>

                <!-- TAB 2 / EDIT FORM: CREATE OR EDIT ARCHER ACCOUNT -->
                <div v-else class="p-5 sm:p-6 overflow-y-auto max-h-[460px] space-y-4 custom-scrollbar flex-1">
                    
                    <div v-if="!isEdit" class="p-3.5 sm:p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-start gap-3">
                        <Icon icon="ph:info-bold" class="text-navy text-lg shrink-0 mt-0.5" />
                        <div class="text-xs sm:text-sm text-navy leading-relaxed font-medium">
                            {{ isEn ? 'Enter archer credentials. If the email is already registered in Archeris, it will link automatically.' : 'Masukkan data atlet. Jika email sudah terdaftar di sistem Archeris, akun akan ditautkan secara otomatis.' }}
                        </div>
                    </div>

                    <!-- Auto-detected existing account notification -->
                    <div v-if="isExistingUserInDb && matchedDbUser && !isEdit" class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 animate-fade-in">
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
                        <BaseInput
                            v-model="newForm.full_name"
                            :label="isEn ? 'Full Name' : 'Nama Lengkap'"
                            :placeholder="isEn ? 'Official archer name' : 'Nama lengkap atlet'"
                            :error="errors.full_name"
                            @blur="validateField('full_name')"
                            required
                            icon="ph:user-bold" />

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <BaseSelect
                                v-model="newForm.gender"
                                :items="genderOptions"
                                :label="isEn ? 'Gender' : 'Jenis Kelamin'"
                                required
                                icon="ph:gender-intersex" />

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
                            </div>
                        </div>

                        <!-- Password Field: only needed if new account and creating -->
                        <div v-if="!isExistingUserInDb && !isEdit" class="relative">
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

                        <!-- Custom Registration Fields -->
                        <div v-if="customFields && customFields.length > 0" class="pt-1">
                            <DynamicCustomFieldsRenderer
                                :fields="customFields"
                                v-model="newForm.custom_fields"
                            />
                        </div>

                        <div class="pt-2">
                            <BaseButton
                                type="button"
                                @click="submitNewArcher"
                                :disabled="!isNewFormValid"
                                variant="navy"
                                size="md"
                                class="w-full justify-center text-sm sm:text-base font-black shadow-xs">
                                <template #icon-left>
                                    <Icon :icon="isEdit ? 'ph:check-bold' : 'ph:user-plus-bold'" />
                                </template>
                                {{ isEdit 
                                    ? (isEn ? 'Save Changes' : 'Simpan Perubahan') 
                                    : (isEn ? 'Add Archer to Roster' : 'Tambahkan Atlet ke Daftar') }}
                            </BaseButton>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useImageOrDefault } from '~/composables/useImageHelper'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseEmptyState from '~/components/common/BaseEmptyState.vue'
import DynamicCustomFieldsRenderer from '~/components/tournaments/DynamicCustomFieldsRenderer.vue'
import ClubSelector from '~/components/common/ClubSelector.vue'

const { locale } = useI18n()
const isEn = computed(() => locale.value !== 'id')

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    tournamentId: {
        type: [String, Number],
        required: true
    },
    individualCategories: {
        type: Array,
        default: () => []
    },
    customFields: {
        type: Array,
        default: () => []
    },
    defaultClubId: {
        type: [Number, String],
        default: null
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
    },
    editAthlete: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close', 'add-athlete', 'save-athlete'])

const isEdit = computed(() => Boolean(props.editAthlete))
const activeTab = ref('search')
const searchQuery = ref('')
const searchResults = ref([])
const searchLoading = ref(false)
const defaultArchers = ref([])
const initialLoading = ref(false)

const isExistingUserInDb = ref(false)
const matchedDbUser = ref(null)
const isCheckingEmail = ref(false)
let emailLookupTimer = null

const genderOptions = computed(() => [
    { title: isEn.value ? 'Male' : 'Laki-laki / Putra', value: 'male' },
    { title: isEn.value ? 'Female' : 'Perempuan / Putri', value: 'female' }
])

const newForm = ref({
    full_name: '',
    gender: 'male',
    email: '',
    phone: '',
    date_of_birth: '',
    password: 'Archeris123!',
    club_id: '',
    club_name: '',
    custom_fields: {}
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
        const editingOriginalEmail = props.editAthlete?.email?.trim()?.toLowerCase()

        if (!val) {
            errors.value.email = isEn.value ? 'Email is required.' : 'Alamat email wajib diisi.'
        } else if (!emailRegex.test(val)) {
            errors.value.email = isEn.value ? 'Invalid email format.' : 'Format alamat email tidak valid.'
        } else if (val !== editingOriginalEmail && props.existingEmails.some(e => e?.toLowerCase()?.trim() === val)) {
            errors.value.email = isEn.value ? 'This archer is already in the roster.' : 'Atlet dengan email ini sudah ada di daftar kontingen.'
        } else {
            errors.value.email = ''
        }
    }

    if (field === 'password') {
        if (!isExistingUserInDb.value && !isEdit.value) {
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
    if (isEdit.value) return
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
    if (isEdit.value) return
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

const areRequiredCustomFieldsFilled = (answers, fields) => {
    if (!fields || fields.length === 0) return true
    for (const f of fields) {
        const isDataField = !f.element_type || f.element_type === 'field'
        if (f.is_active && f.is_required && isDataField) {
            const val = answers?.[f.field_key] ?? answers?.[f.uuid]
            if (val === undefined || val === null || val === '') return false
            if (Array.isArray(val) && val.length === 0) return false
        }
    }
    return true
}

const isNewFormValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const email = newForm.value.email?.trim()?.toLowerCase()
    const editingOriginalEmail = props.editAthlete?.email?.trim()?.toLowerCase()
    const isEmailInRoster = email && email !== editingOriginalEmail && props.existingEmails.some(e => e?.toLowerCase()?.trim() === email)
    
    const isNameOk = !!newForm.value.full_name && newForm.value.full_name.trim().length >= 3
    const isEmailOk = !!email && emailRegex.test(email) && !isEmailInRoster
    const isGenderOk = !!newForm.value.gender
    const isPasswordOk = isExistingUserInDb.value || isEdit.value || (!!newForm.value.password && newForm.value.password.length >= 6)
    const isCustomFieldsOk = areRequiredCustomFieldsFilled(newForm.value.custom_fields, props.customFields)

    return isNameOk && isEmailOk && isGenderOk && isPasswordOk && isCustomFieldsOk
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
        phone: archer.phone || '',
        club_id: archer.club_id || props.defaultClubId,
        club_name: archer.club_name || props.defaultClubName || 'Independent',
        avatar_url: archer.avatar_url || archer.photo_url || '',
        is_new_account: false,
        custom_fields: archer.custom_fields || {}
    })
    close()
}

const submitNewArcher = () => {
    ['full_name', 'email'].forEach(validateField)
    if (!isExistingUserInDb.value && !isEdit.value) {
        validateField('password')
    }
    if (!isNewFormValid.value) return

    const athletePayload = {
        archer_id: isExistingUserInDb.value ? (matchedDbUser.value?.uuid || matchedDbUser.value?.id || props.editAthlete?.archer_id || '') : (props.editAthlete?.archer_id || ''),
        full_name: newForm.value.full_name.trim(),
        gender: newForm.value.gender || 'male',
        category_id: props.editAthlete?.category_id || '',
        category_ids: props.editAthlete?.category_ids || [],
        email: newForm.value.email.trim(),
        phone: newForm.value.phone?.trim() || '',
        date_of_birth: newForm.value.date_of_birth || '',
        password: isExistingUserInDb.value ? '' : (newForm.value.password || 'Archeris123!'),
        club_id: newForm.value.club_id || props.defaultClubId,
        club_name: newForm.value.club_name || props.defaultClubName || 'Independent',
        avatar_url: matchedDbUser.value?.avatar_url || props.editAthlete?.avatar_url || '',
        is_new_account: isEdit.value ? props.editAthlete.is_new_account : !isExistingUserInDb.value,
        custom_fields: { ...(newForm.value.custom_fields || {}) }
    }

    emit('save-athlete', athletePayload)
    emit('add-athlete', athletePayload)
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

const loadDefaultArchers = async () => {
    if (defaultArchers.value.length > 0) return
    initialLoading.value = true
    try {
        const apiBaseUrl = useApiBaseUrl()
        const res = await $fetch(`${apiBaseUrl}/archers?limit=10`)
        defaultArchers.value = res?.archers || res?.data || (Array.isArray(res) ? res : [])
    } catch (e) {
        defaultArchers.value = []
    } finally {
        initialLoading.value = false
    }
}

watch([() => props.show, () => props.editAthlete], ([val, editVal]) => {
    if (val) {
        errors.value = { full_name: '', email: '', password: '' }
        if (editVal) {
            activeTab.value = 'quick_add'
            newForm.value = {
                full_name: editVal.full_name || '',
                gender: editVal.gender || 'male',
                email: editVal.email || '',
                phone: editVal.phone || '',
                date_of_birth: editVal.date_of_birth || '',
                password: editVal.password || 'Archeris123!',
                club_id: editVal.club_id || props.defaultClubId || '',
                club_name: editVal.club_name || props.defaultClubName || 'Independent',
                custom_fields: { ...(editVal.custom_fields || {}) }
            }
            isExistingUserInDb.value = !editVal.is_new_account
            matchedDbUser.value = null
        } else {
            activeTab.value = 'search'
            searchQuery.value = ''
            newForm.value = {
                full_name: '',
                gender: 'male',
                email: '',
                phone: '',
                date_of_birth: '',
                password: 'Archeris123!',
                club_id: props.defaultClubId || '',
                club_name: props.defaultClubName || '',
                custom_fields: {}
            }
            isExistingUserInDb.value = false
            matchedDbUser.value = null
            loadDefaultArchers()
        }
    }
}, { immediate: true, deep: true })
</script>
