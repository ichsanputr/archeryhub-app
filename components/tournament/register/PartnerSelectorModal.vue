<template>
    <Teleport to="body">
        <div v-if="show"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-navy/60 backdrop-blur-sm animate-fade-in"
            @click.self="close">
            
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200/90 flex flex-col max-h-[90vh]">
                
                <!-- Modal Header -->
                <div class="px-5 py-3.5 sm:px-6 sm:py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div class="flex items-center gap-3">
                        <div class="size-9 rounded-xl bg-primary/15 border border-primary/30 text-navy flex items-center justify-center shadow-2xs shrink-0">
                            <Icon icon="ph:user-plus-bold" class="text-base text-navy" />
                        </div>
                        <div>
                            <h3 class="text-sm sm:text-base font-black text-navy leading-snug">
                                {{ isEn ? 'Add / Change Team Member' : 'Pilih / Tambah Anggota Tim' }}
                            </h3>
                            <div class="text-xs text-slate-500">
                                {{ isEn ? 'Select or add an archer for your team roster.' : 'Pilih atau daftarkan atlet untuk anggota tim Anda.' }}
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

                <!-- Modern 2-Segment Tabs Navigation -->
                <div class="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
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
                            <span>{{ isNewArcherEdit ? (isEn ? 'Edit New Archer' : 'Edit Atlet Baru') : (isEn ? 'New Archer' : 'Atlet Baru') }}</span>
                        </button>
                    </div>
                </div>

                <!-- TAB 1: UNIFIED SMART SEARCH & SELECTION -->
                <div v-if="activeTab === 'search'" class="flex-1 flex flex-col overflow-hidden">
                    <!-- Search Input Bar (Compact, tight padding) -->
                    <div class="px-4 py-2.5 border-b border-slate-100 bg-slate-50/40">
                        <div class="relative">
                            <input
                                v-model="searchQuery"
                                type="text"
                                :placeholder="isEn ? 'Search by archer name, club, or ID...' : 'Cari nama atlet, klub, atau ID...'"
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

                    <!-- Search Results or Default Recommendations (10 archers) -->
                    <div class="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5 max-h-[380px]">
                        
                        <!-- State 1: Search Query Active (Live Database Search) -->
                        <template v-if="searchQuery.trim().length > 0">
                            <div v-if="searchQuery.trim().length < 2" class="py-10">
                                <BaseEmptyState
                                    icon="ph:magnifying-glass-bold"
                                    size="sm"
                                    :title="isEn ? 'Type at least 2 characters' : 'Ketik minimal 2 karakter'"
                                    :description="isEn ? 'Enter the archer name or club to search the database.' : 'Masukkan nama atlet atau klub untuk mencari di database.'"
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
                                    :key="archer.archer_id || archer.id"
                                    @click="selectPartner(archer)"
                                    class="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-navy hover:bg-slate-50 transition-all cursor-pointer group"
                                    :class="isAlreadySelected(archer) ? 'opacity-40 pointer-events-none' : ''">
                                    
                                    <div class="flex items-center gap-3.5 min-w-0">
                                        <img
                                            :src="useImageOrDefault(archer.avatar_url, archer.full_name)"
                                            class="size-11 rounded-full object-cover shrink-0 border border-slate-200" />
                                        <div class="min-w-0">
                                            <div class="text-sm sm:text-base font-black text-navy truncate">
                                                {{ archer.full_name }}
                                            </div>
                                            <div class="text-xs sm:text-sm text-slate-600 font-bold truncate mt-0.5 flex items-center gap-1.5">
                                                <Icon icon="ph:shield-bold" class="text-xs text-primary-hover shrink-0" />
                                                <span>{{ archer.club_name || 'Independent' }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-2.5 shrink-0">
                                        <span
                                            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black border"
                                            :class="archer.is_already_registered_individual ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'">
                                            <Icon :icon="archer.is_already_registered_individual ? 'ph:check-bold' : 'ph:tag-bold'" class="text-xs" />
                                            <span>{{ archer.is_already_registered_individual ? (isEn ? 'Free (Registered)' : 'Gratis (Sudah Terdaftar)') : (isEn ? '+ Individual Fee' : '+ Biaya Individu') }}</span>
                                        </span>
                                        <div class="size-8 sm:size-9 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                            <Icon icon="ph:plus-bold" class="text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- State 2: Default View (Shows 10 Eligible & Available Archers) -->
                        <template v-else>
                            <div v-if="loading" class="py-14 text-center text-slate-400">
                                <Icon icon="ph:spinner-gap-bold" class="text-3xl animate-spin mx-auto mb-2 text-navy" />
                                <div class="text-xs sm:text-sm font-bold text-navy">{{ isEn ? 'Loading available archers...' : 'Memuat daftar atlet...' }}</div>
                            </div>

                            <div v-else-if="registeredPartners.length === 0" class="py-8">
                                <BaseEmptyState
                                    icon="ph:magnifying-glass-bold"
                                    size="sm"
                                    :title="isEn ? 'Search Archer in Database' : 'Cari Atlet di Database'"
                                    :description="isEn ? 'Type the archer name above to search the database, or switch to New Archer to add someone new.' : 'Ketik nama atlet di kolom pencarian di atas, atau pilih tab Atlet Baru jika belum memiliki akun.'"
                                />
                            </div>

                            <div v-else class="space-y-2.5">
                                <div
                                    v-for="archer in registeredPartners"
                                    :key="archer.archer_id || archer.participant_id"
                                    @click="selectPartner(archer)"
                                    class="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-navy hover:bg-slate-50 transition-all cursor-pointer group"
                                    :class="isAlreadySelected(archer) ? 'opacity-40 pointer-events-none' : ''">
                                    
                                    <div class="flex items-center gap-3.5 min-w-0">
                                        <img
                                            :src="useImageOrDefault(archer.avatar_url, archer.full_name)"
                                            class="size-11 rounded-full object-cover shrink-0 border border-slate-200" />
                                        <div class="min-w-0">
                                            <div class="text-sm sm:text-base font-black text-navy truncate">
                                                {{ archer.full_name }}
                                            </div>
                                            <div class="text-xs sm:text-sm text-slate-600 font-bold truncate mt-0.5 flex items-center gap-1.5">
                                                <Icon icon="ph:shield-bold" class="text-xs text-primary-hover shrink-0" />
                                                <span>{{ archer.club_name || 'Independent' }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-2.5 shrink-0">
                                        <span
                                            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black border"
                                            :class="archer.is_already_registered_individual ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'">
                                            <Icon :icon="archer.is_already_registered_individual ? 'ph:check-bold' : 'ph:tag-bold'" class="text-xs" />
                                            <span>{{ archer.is_already_registered_individual ? (isEn ? 'Free (Registered)' : 'Gratis (Sudah Terdaftar)') : (isEn ? '+ Individual Fee' : '+ Biaya Individu') }}</span>
                                        </span>
                                        <div class="size-8 sm:size-9 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                            <Icon icon="ph:plus-bold" class="text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                    </div>
                </div>

                <!-- TAB 2: NEW ARCHER PROFILE / EDIT ARCHER (WITH DYNAMIC CUSTOM FIELDS) -->
                <div v-else-if="activeTab === 'quick_add'" class="p-5 sm:p-6 overflow-y-auto max-h-[440px] space-y-4">
                    <div class="p-3.5 sm:p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                        <Icon icon="ph:info-bold" class="text-amber-600 text-lg shrink-0 mt-0.5" />
                        <div class="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                            {{ isNewArcherEdit 
                                ? (isEn ? 'Update your teammate details below. Changes will be updated on your roster.' : 'Perbarui data atlet rekan tim Anda di bawah ini. Perubahan akan langsung disinkronkan ke tim.') 
                                : (isEn ? 'Enter your teammate details. The individual entry fee for this archer will be added to your payment invoice.' : 'Masukkan data atlet rekan tim Anda. Biaya pendaftaran kategori individu atlet akan otomatis ditambahkan ke tagihan pembayaran Anda.') }}
                        </div>
                    </div>

                    <div class="space-y-4">
                        <BaseInput
                            v-model="quickForm.full_name"
                            :label="isEn ? 'Full Name' : 'Nama Lengkap'"
                            :placeholder="isEn ? 'Teammate full name' : 'Nama atlet rekan tim'"
                            :error="errors.full_name"
                            @blur="validateField('full_name')"
                            required
                            icon="ph:user-bold" />

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <BaseSelect
                                v-model="quickForm.gender"
                                :items="genderOptions"
                                :label="isEn ? 'Gender' : 'Jenis Kelamin'"
                                :disabled="!!requiredGender"
                                required
                                icon="ph:gender-intersex" />

                            <BaseInput
                                v-model="quickForm.email"
                                :label="isEn ? 'Email' : 'Email'"
                                type="email"
                                :placeholder="isEn ? 'archer@email.com' : 'atlet@email.com'"
                                :error="errors.email"
                                @blur="validateField('email')"
                                required
                                icon="ph:envelope-bold" />
                        </div>

                        <!-- Password Field with Default 123456 & Auto Generate Button -->
                        <div class="relative">
                            <BaseInput
                                v-model="quickForm.password"
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
                                v-model="quickForm.club_id"
                                v-model:newClubName="quickForm.club_name"
                                :label="isEn ? 'Club / Team Origin' : 'Klub / Asal Kontingen'"
                                :placeholder="isEn ? 'Select or search club...' : 'Pilih atau cari klub...'" />
                        </div>

                        <!-- Dynamic Tournament Custom Fields -->
                        <div v-if="customFields && customFields.length > 0" class="pt-1">
                            <DynamicCustomFieldsRenderer
                                :fields="customFields"
                                v-model="quickForm.custom_fields"
                            />
                        </div>

                        <div class="pt-2">
                            <BaseButton
                                type="button"
                                @click="submitQuickAdd"
                                :disabled="!isQuickFormValid"
                                variant="navy"
                                size="md"
                                class="w-full justify-center text-sm sm:text-base">
                                <template #icon-left>
                                    <Icon :icon="isNewArcherEdit ? 'ph:check-bold' : 'ph:user-plus-bold'" />
                                </template>
                                {{ isNewArcherEdit ? (isEn ? 'Save Archer Details' : 'Simpan Data Atlet') : (isEn ? 'Add Archer to Squad' : 'Tambahkan Atlet ke Tim') }}
                            </BaseButton>
                        </div>
                    </div>
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
    title: {
        type: String,
        default: ''
    },
    categoryName: {
        type: String,
        default: ''
    },
    tournamentId: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    },
    requiredGender: {
        type: String,
        default: ''
    },
    existingPartners: {
        type: Array,
        default: () => []
    },
    defaultSingleFee: {
        type: Number,
        default: 150000
    },
    customFields: {
        type: Array,
        default: () => []
    },
    editPartner: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close', 'select-partner'])

const activeTab = ref('search')
const loading = ref(false)
const registeredPartners = ref([])
const searchQuery = ref('')
const searchResults = ref([])
const searchLoading = ref(false)

const genderOptions = [
    { title: 'Male', value: 'male' },
    { title: 'Female', value: 'female' }
]

const quickForm = ref({
    full_name: '',
    gender: 'male',
    email: '',
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

const isNewArcherEdit = computed(() => {
    if (!props.editPartner) return false
    return Boolean(
        props.editPartner.is_new_account ||
        !props.editPartner.archer_id ||
        (props.editPartner.email && props.editPartner.needs_individual_registration && !props.editPartner.is_already_registered_individual)
    )
})

watch(
    [() => props.show, () => props.editPartner],
    ([show, editData]) => {
        if (show) {
            searchQuery.value = ''
            searchResults.value = []
            errors.value = { full_name: '', email: '', password: '' }

            if (editData && isNewArcherEdit.value) {
                activeTab.value = 'quick_add'
                quickForm.value = {
                    full_name: editData.full_name || '',
                    gender: editData.gender || props.requiredGender || 'male',
                    email: editData.email || '',
                    password: editData.password || 'Archeris123!',
                    club_id: editData.club_id || '',
                    club_name: editData.club_name || '',
                    custom_fields: editData.custom_fields ? JSON.parse(JSON.stringify(editData.custom_fields)) : {}
                }
            } else {
                activeTab.value = 'search'
                quickForm.value = {
                    full_name: '',
                    gender: props.requiredGender || 'male',
                    email: '',
                    password: 'Archeris123!',
                    club_id: '',
                    club_name: '',
                    custom_fields: {}
                }
                fetchEligiblePartners()
            }
        }
    },
    { immediate: true, deep: true }
)

const validateField = (field) => {
    if (field === 'full_name') {
        const val = quickForm.value.full_name?.trim()
        if (!val) {
            errors.value.full_name = isEn.value ? 'Full name is required.' : 'Nama lengkap wajib diisi.'
        } else if (val.length < 3) {
            errors.value.full_name = isEn.value ? 'Full name must be at least 3 characters.' : 'Nama lengkap minimal 3 karakter.'
        } else {
            errors.value.full_name = ''
        }
    }

    if (field === 'email') {
        const val = quickForm.value.email?.trim()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!val) {
            errors.value.email = isEn.value ? 'Email is required.' : 'Alamat email wajib diisi.'
        } else if (!emailRegex.test(val)) {
            errors.value.email = isEn.value ? 'Invalid email format.' : 'Format alamat email tidak valid.'
        } else {
            errors.value.email = ''
        }
    }

    if (field === 'password') {
        const val = quickForm.value.password
        if (!val) {
            errors.value.password = isEn.value ? 'Password is required.' : 'Kata sandi wajib diisi.'
        } else if (val.length < 6) {
            errors.value.password = isEn.value ? 'Password must be at least 6 characters.' : 'Kata sandi minimal 6 karakter.'
        } else {
            errors.value.password = ''
        }
    }
}

const areRequiredCustomFieldsFilled = (answers, fields) => {
    if (!fields || fields.length === 0) return true
    for (const f of fields) {
        if (f.is_required) {
            const val = answers?.[f.id] || answers?.[f.field_key] || answers?.[f.name]
            if (val === undefined || val === null || String(val).trim() === '') {
                return false
            }
        }
    }
    return true
}

const isQuickFormValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const basicValid = !!quickForm.value.full_name &&
        quickForm.value.full_name.trim().length >= 3 &&
        !!quickForm.value.email &&
        emailRegex.test(quickForm.value.email.trim()) &&
        !!quickForm.value.password &&
        quickForm.value.password.length >= 6

    if (!basicValid) return false
    return areRequiredCustomFieldsFilled(quickForm.value.custom_fields, props.customFields)
})

const generateEasyPassword = () => {
    const prefixes = ['archer', 'panah', 'target', 'arrow', 'focus', 'bullseye']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const num = Math.floor(100 + Math.random() * 900)
    quickForm.value.password = `${prefix}${num}`
    errors.value.password = ''
}

const close = () => {
    emit('close')
}

const isAlreadySelected = (archer) => {
    const id = archer.archer_id || archer.uuid || archer.id
    return props.existingPartners.some(p => (p.archer_id || p.uuid || p.id) === id)
}

const selectPartner = (archer) => {
    emit('select-partner', {
        archer_id: archer.archer_id || archer.uuid || archer.id,
        participant_id: archer.participant_id || null,
        full_name: archer.full_name,
        gender: archer.gender || (props.requiredGender || 'male'),
        email: archer.email || '',
        club_name: archer.club_name || '',
        avatar_url: archer.avatar_url || '',
        is_already_registered_individual: !!archer.is_already_registered_individual,
        individual_fee: archer.is_already_registered_individual ? 0 : (archer.individual_fee || props.defaultSingleFee),
        needs_individual_registration: !archer.is_already_registered_individual,
        is_new_account: false,
        custom_fields: archer.custom_fields || {}
    })
    close()
}

const submitQuickAdd = () => {
    ['full_name', 'email', 'password'].forEach(validateField)
    if (!isQuickFormValid.value) return

    emit('select-partner', {
        archer_id: isNewArcherEdit.value ? (props.editPartner?.archer_id || '') : '',
        participant_id: isNewArcherEdit.value ? (props.editPartner?.participant_id || null) : null,
        full_name: quickForm.value.full_name.trim(),
        gender: props.requiredGender || quickForm.value.gender || 'male',
        email: quickForm.value.email.trim(),
        password: quickForm.value.password || 'Archeris123!',
        club_id: quickForm.value.club_id || '',
        club_name: quickForm.value.club_name || 'Independent',
        avatar_url: isNewArcherEdit.value ? (props.editPartner?.avatar_url || '') : '',
        is_already_registered_individual: false,
        individual_fee: props.defaultSingleFee,
        needs_individual_registration: true,
        is_new_account: true,
        custom_fields: quickForm.value.custom_fields || {}
    })
    close()
}

// Fetch eligible registered partners or recommendations
const fetchEligiblePartners = async () => {
    if (!props.tournamentId || !props.categoryId) return
    loading.value = true
    try {
        const apiBaseUrl = useApiBaseUrl()
        const genderParam = props.requiredGender ? `&gender=${props.requiredGender}` : ''
        const res = await $fetch(`${apiBaseUrl}/events/${props.tournamentId}/categories/${props.categoryId}/eligible-partners?limit=25${genderParam}`)
        const list = res?.data || []
        registeredPartners.value = list
    } catch (e) {
        registeredPartners.value = []
    } finally {
        loading.value = false
    }
}

// Debounced search
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
        const genderParam = props.requiredGender ? `&gender=${props.requiredGender}` : ''
        const res = await $fetch(`${apiBaseUrl}/events/${props.tournamentId}/categories/${props.categoryId}/eligible-partners?search=${encodeURIComponent(q)}${genderParam}`)
        searchResults.value = res?.data || []
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
</script>
