<template>
    <Teleport to="body">
        <div v-if="show"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy/60 backdrop-blur-sm animate-fade-in"
            @click.self="close">
            
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200/90 flex flex-col max-h-[90vh]">
                
                <!-- Modal Header (Clean, No Chips) -->
                <div class="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
                    <div class="flex items-start gap-3.5">
                        <div class="size-11 rounded-2xl bg-navy text-primary flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                            <Icon icon="ph:user-plus-bold" class="text-xl" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-black text-navy leading-snug">
                                {{ isEn ? 'Add Team Member' : 'Tambah Anggota Tim' }}
                            </h3>
                            <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                                {{ isEn ? 'Select or add an archer for your team roster.' : 'Pilih atau tambahkan atlet untuk anggota tim Anda.' }}
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

                <!-- Modern Segmented Tabs Navigation -->
                <div class="p-3.5 bg-slate-50 border-b border-slate-100">
                    <div class="grid grid-cols-3 gap-1.5 bg-slate-200/70 p-1 rounded-2xl">
                        <button
                            type="button"
                            @click="activeTab = 'registered'"
                            class="py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            :class="activeTab === 'registered' ? 'bg-white text-navy font-black shadow-xs' : 'text-slate-600 hover:text-navy'">
                            <span class="size-2 rounded-full bg-emerald-500 shrink-0"></span>
                            <span class="truncate">{{ isEn ? 'Registered (Rp 0)' : 'Sudah Terdaftar (Rp 0)' }}</span>
                        </button>
                        <button
                            type="button"
                            @click="activeTab = 'search'"
                            class="py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            :class="activeTab === 'search' ? 'bg-white text-navy font-black shadow-xs' : 'text-slate-600 hover:text-navy'">
                            <Icon icon="ph:magnifying-glass-bold" class="text-sm shrink-0" />
                            <span class="truncate">{{ isEn ? 'Search Archer' : 'Cari Atlet' }}</span>
                        </button>
                        <button
                            type="button"
                            @click="activeTab = 'quick_add'"
                            class="py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            :class="activeTab === 'quick_add' ? 'bg-white text-navy font-black shadow-xs' : 'text-slate-600 hover:text-navy'">
                            <Icon icon="ph:user-plus-bold" class="text-sm shrink-0" />
                            <span class="truncate">{{ isEn ? 'New Archer' : 'Archer Baru' }}</span>
                        </button>
                    </div>
                </div>

                <!-- TAB 1: REGISTERED IN EVENT (RP 0) -->
                <div v-if="activeTab === 'registered'" class="flex-1 overflow-y-auto p-5 space-y-3 max-h-[420px]">
                    <div v-if="loading" class="py-14 text-center text-slate-400">
                        <Icon icon="ph:spinner-gap-bold" class="text-3xl animate-spin mx-auto mb-2 text-navy" />
                        <div class="text-sm font-bold">{{ isEn ? 'Loading eligible archers...' : 'Memuat atlet yang memenuhi syarat...' }}</div>
                    </div>
                    
                    <div v-else-if="registeredPartners.length === 0" class="py-12 text-center text-slate-400 space-y-2">
                        <div class="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                            <Icon icon="ph:users-three-bold" class="text-3xl" />
                        </div>
                        <div class="text-sm sm:text-base font-black text-navy">{{ isEn ? 'No other individual archers registered yet' : 'Belum ada atlet individu terdaftar lainnya' }}</div>
                        <div class="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                            {{ isEn ? 'Archers registered in this division will appear here with no extra fee (Rp 0). You can also search the database or add a new archer.' : 'Atlet yang mendaftar kategori individu pada divisi ini akan otomatis muncul di sini tanpa biaya tambahan (Rp 0). Anda juga dapat mencari di database atau membuat profil atlet baru.' }}
                        </div>
                    </div>

                    <div v-else class="space-y-2.5">
                        <div
                            v-for="archer in registeredPartners"
                            :key="archer.archer_id || archer.participant_id"
                            @click="selectPartner(archer)"
                            class="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-navy hover:bg-slate-50 transition-all cursor-pointer group"
                            :class="isAlreadySelected(archer) ? 'opacity-40 pointer-events-none' : ''">
                            
                            <div class="flex items-center gap-3.5 min-w-0">
                                <img
                                    :src="useImageOrDefault(archer.avatar_url, archer.full_name)"
                                    class="size-11 rounded-full object-cover shrink-0 border border-slate-200" />
                                <div class="min-w-0">
                                    <div class="text-sm sm:text-base font-black text-navy truncate group-hover:underline">
                                        {{ archer.full_name }}
                                    </div>
                                    <div class="text-xs sm:text-sm text-slate-600 font-bold truncate mt-0.5 flex items-center gap-1.5">
                                        <Icon icon="ph:shield-bold" class="text-xs text-primary-hover shrink-0" />
                                        <span>{{ archer.club_name || 'Independent' }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 shrink-0">
                                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black border border-emerald-300">
                                    <Icon icon="ph:check-bold" />
                                    {{ isEn ? 'Rp 0 (Registered)' : 'Rp 0 (Sudah Bayar)' }}
                                </span>
                                <div class="size-9 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                    <Icon icon="ph:plus-bold" class="text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: SEARCH ARCHERIS DATABASE -->
                <div v-else-if="activeTab === 'search'" class="flex-1 flex flex-col overflow-hidden">
                    <div class="p-4 border-b border-slate-100 bg-slate-50/50">
                        <div class="relative">
                            <input
                                v-model="searchQuery"
                                type="text"
                                :placeholder="isEn ? 'Search by archer name, club, or ID...' : 'Cari nama atlet, klub, atau ID...'"
                                class="w-full h-12 px-4 pl-11 bg-white border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-navy focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
                                autofocus />
                            <Icon icon="ph:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                            <Icon v-if="searchLoading" icon="ph:spinner-gap-bold" class="absolute right-4 top-1/2 -translate-y-1/2 text-navy animate-spin text-lg" />
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto p-5 space-y-2.5 max-h-[360px]">
                        <div v-if="searchQuery.length < 2" class="py-12 text-center text-slate-400 space-y-2">
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
                                <div class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ isEn ? 'Try another keyword or switch to New Archer tab.' : 'Coba kata kunci lain atau pilih tab Archer Baru.' }}</div>
                            </div>
                        </div>
                        <div v-else class="space-y-2.5">
                            <div
                                v-for="archer in searchResults"
                                :key="archer.archer_id || archer.id"
                                @click="selectPartner(archer)"
                                class="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-navy hover:bg-slate-50 transition-all cursor-pointer group"
                                :class="isAlreadySelected(archer) ? 'opacity-40 pointer-events-none' : ''">
                                
                                <div class="flex items-center gap-3.5 min-w-0">
                                    <img
                                        :src="useImageOrDefault(archer.avatar_url, archer.full_name)"
                                        class="size-11 rounded-full object-cover shrink-0 border border-slate-200" />
                                    <div class="min-w-0">
                                        <div class="text-sm sm:text-base font-black text-navy truncate group-hover:underline">
                                            {{ archer.full_name }}
                                        </div>
                                        <div class="text-xs sm:text-sm text-slate-600 font-bold truncate mt-0.5 flex items-center gap-1.5">
                                            <Icon icon="ph:shield-bold" class="text-xs text-primary-hover shrink-0" />
                                            <span>{{ archer.club_name || 'Independent' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center gap-3 shrink-0">
                                    <span
                                        class="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs sm:text-sm font-black border"
                                        :class="archer.is_already_registered_individual ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'">
                                        {{ archer.is_already_registered_individual ? 'Rp 0' : (isEn ? '+ Individual Fee' : '+ Biaya Individu') }}
                                    </span>
                                    <div class="size-9 rounded-xl bg-navy text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                        <Icon icon="ph:plus-bold" class="text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB 3: NEW ARCHER PROFILE (REQUIRED FIELDS ONLY) -->
                <div v-else-if="activeTab === 'quick_add'" class="p-6 overflow-y-auto max-h-[440px] space-y-4">
                    <div class="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                        <Icon icon="ph:info-bold" class="text-amber-600 text-xl shrink-0 mt-0.5" />
                        <div class="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                            {{ isEn ? 'Enter your teammate details. The individual entry fee for this archer will be added to your payment invoice.' : 'Masukkan data atlet rekan tim Anda. Biaya pendaftaran kategori individu atlet akan otomatis ditambahkan ke tagihan pembayaran Anda.' }}
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
                                :placeholder="isEn ? 'Default: 123456' : 'Default: 123456'"
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

                        <div class="pt-2">
                            <BaseButton
                                type="button"
                                @click="submitQuickAdd"
                                :disabled="!isQuickFormValid"
                                variant="navy"
                                size="md"
                                class="w-full justify-center text-sm sm:text-base">
                                <template #icon-left>
                                    <Icon icon="ph:user-plus-bold" />
                                </template>
                                {{ isEn ? 'Add Archer to Squad' : 'Tambahkan Atlet ke Tim' }}
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
    }
})

const emit = defineEmits(['close', 'select-partner'])

const activeTab = ref('registered')
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
    club_name: ''
})

const errors = ref({
    full_name: '',
    email: '',
    password: ''
})

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

const isQuickFormValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !!quickForm.value.full_name &&
        quickForm.value.full_name.trim().length >= 3 &&
        !!quickForm.value.email &&
        emailRegex.test(quickForm.value.email.trim()) &&
        !!quickForm.value.password &&
        quickForm.value.password.length >= 6
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
        club_name: archer.club_name || '',
        avatar_url: archer.avatar_url || '',
        is_already_registered_individual: !!archer.is_already_registered_individual,
        individual_fee: archer.is_already_registered_individual ? 0 : (archer.individual_fee || props.defaultSingleFee),
        needs_individual_registration: !archer.is_already_registered_individual
    })
    close()
}

const submitQuickAdd = () => {
    ['full_name', 'email', 'password'].forEach(validateField)
    if (!isQuickFormValid.value) return

    emit('select-partner', {
        archer_id: '',
        participant_id: null,
        full_name: quickForm.value.full_name.trim(),
        gender: props.requiredGender || quickForm.value.gender || 'male',
        email: quickForm.value.email.trim(),
        password: quickForm.value.password || '123456',
        club_id: quickForm.value.club_id || '',
        club_name: quickForm.value.club_name || 'Independent',
        avatar_url: '',
        is_already_registered_individual: false,
        individual_fee: props.defaultSingleFee,
        needs_individual_registration: true
    })
    quickForm.value = {
        full_name: '',
        gender: props.requiredGender || 'male',
        email: '',
        password: '123456',
        club_id: '',
        club_name: ''
    }
    errors.value = {
        full_name: '',
        email: '',
        password: ''
    }
    close()
}

// Fetch eligible registered partners
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

watch(() => props.show, (val) => {
    if (val) {
        activeTab.value = 'registered'
        if (props.requiredGender) {
            quickForm.value.gender = props.requiredGender
        }
        fetchEligiblePartners()
    }
})
</script>
