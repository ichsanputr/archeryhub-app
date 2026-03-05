<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Enhanced Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="flex items-center sm:items-start gap-4">
                        <!-- Icon Badge -->
                        <div
                            class="size-12 sm:size-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg shrink-0">
                            <Icon icon="ph:users-three" class="text-white text-xl sm:text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1">
                            <h1
                                class="text-xl sm:text-2xl lg:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2">
                                Manajemen Tim Resmi
                            </h1>
                            <p class="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                                Kelola tim untuk babak eliminasi. Gunakan sync otomatis atau buat tim manual.
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-3 shrink-0" v-if="selectedCategory">
                        <BaseButton variant="white" icon="ph:arrows-clockwise"
                            class="h-10 sm:h-11 px-5 w-full sm:w-auto text-xs sm:text-sm" @click="handleSyncTeams"
                            :loading="isSyncing">
                            Sync Otomatis
                        </BaseButton>
                        <BaseButton variant="primary" icon="ph:plus-bold"
                            class="h-10 sm:h-11 px-5 w-full sm:w-auto shadow-lg shadow-primary/30 hover:shadow-sm hover:shadow-primary/40 transition-all text-xs sm:text-sm"
                            @click="openAddTeamModal">
                            Tambah Tim Manual
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Category Selection -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 class="text-base font-bold text-navy mb-4">Pilih Kategori Lomba</h2>

            <div v-if="loadingCategories" class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <div v-for="i in 4" :key="i"
                    class="flex-shrink-0 w-72 p-5 rounded-xl border border-gray-100 animate-pulse">
                    <div class="flex items-start gap-3">
                        <div class="size-12 bg-gray-100 rounded-xl"></div>
                        <div class="flex-1">
                            <div class="h-5 bg-gray-100 rounded mb-2"></div>
                            <div class="h-4 bg-gray-50 rounded w-24"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="categories.length === 0" class="text-center py-8 text-gray-400">
                <Icon icon="ph:folder-notch-open" class="text-4xl mx-auto mb-2" />
                <p>Kategori tidak ditemukan</p>
            </div>

            <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <button v-for="category in categories" :key="category.id" @click="selectCategory(category)" :class="[
                    'flex-shrink-0 w-72 p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md relative',
                    selectedCategory?.id === category.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                ]">
                    <div class="absolute top-0 left-0 w-1.5 h-full rounded-l-xl transition-colors"
                        :class="selectedCategory?.id === category.id ? 'bg-primary' : 'bg-transparent'"></div>
                    <div class="flex items-start gap-3 pl-2">
                        <div
                            class="size-12 bg-navy rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-2 group-hover:bg-primary transition-colors">
                            <img :src="'/' + getCategoryIcon(`${category.division_name} ${category.event_type_name} ${category.gender_division_name}`)"
                                :alt="category.division_name"
                                class="w-full h-full object-contain invert group-hover:invert-0 transition-all" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-bold transition-colors leading-tight mb-1 line-clamp-2">
                                {{ getCategoryName(category) }}
                            </p>
                            <div class="flex flex-wrap items-center gap-2">
                                <span
                                    class="px-2 py-0.5 bg-primary/20 text-navy rounded-md text-[10px] font-black tracking-tighter">
                                    {{ category.event_type_name }}
                                </span>
                                <div class="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                    <Icon icon="ph:user-bold" />
                                    <span>{{ category.participant_count || 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <!-- Main Content: Official Teams List -->
        <div class="space-y-6">
            <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 class="text-lg font-bold text-navy leading-tight">Daftar Tim Resmi</h2>
                        <p class="text-sm text-gray-500 mt-1">Tim yang terdaftar dalam kategori ini</p>
                    </div>
                </div>

                <div v-if="loadingTeams" class="space-y-4">
                    <div v-for="i in 3" :key="i" class="h-32 bg-gray-50 rounded-2xl animate-pulse"></div>
                </div>

                <div v-else-if="officialTeams.length === 0"
                    class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div
                        class="size-20 bg-white shadow-sm rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                        <Icon icon="ph:users-four" class="text-4xl text-gray-200" />
                    </div>
                    <h3 class="text-xl font-bold text-navy mb-2">Belum ada tim resmi</h3>
                    <p class="text-gray-400 max-w-sm mx-auto text-sm">
                        Klik tombol <strong>Sync Otomatis</strong> untuk membuat tim dari peringkat kualifikasi, atau
                        buat tim manual.
                    </p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="team in officialTeams" :key="team.id"
                        class="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-sm hover:shadow-navy/5 transition-all group border-b-4 border-b-gray-100 hover:border-b-primary relative">
                        <!-- Rank Badge -->
                        <div
                            class="absolute -top-3 -right-3 size-10 bg-navy text-white rounded-xl flex items-center justify-center font-black text-lg shadow-sm border-4 border-white group-hover:bg-primary group-hover:text-navy transition-colors">
                            {{ team.team_rank || '-' }}
                        </div>

                        <div class="flex items-start justify-between mb-6">
                            <div class="flex items-center gap-4">
                                <div
                                    class="size-14 bg-navy/5 rounded-2xl flex items-center justify-center text-navy group-hover:bg-primary group-hover:scale-110 transition-all">
                                    <Icon icon="ph:users-four-bold" class="text-3xl" />
                                </div>
                                <div>
                                    <h3
                                        class="font-black text-navy text-lg group-hover:text-primary transition-colors line-clamp-1">
                                        {{ team.team_name }}</h3>
                                    <div class="flex items-center gap-2">
                                        <p
                                            class="text-[10px] font-black text-primary tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded">
                                            Klub Resmi
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Members list -->
                        <div class="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <p
                                class="text-[10px] font-black text-gray-400 tracking-widest mb-2 flex items-center gap-2">
                                <Icon icon="ph:identification-card-bold" />
                                Anggota Tim & Skor
                            </p>
                            <div v-if="team.members && team.members.length > 0">
                                <div v-for="(member, index) in team.members" :key="member.id || index"
                                    class="flex items-center justify-between group/member py-1">
                                    <div class="flex items-center gap-2 flex-1 min-w-0">
                                        <span class="text-xs font-black text-primary">{{ index + 1 }}</span>
                                        <span
                                            class="text-sm font-bold text-navy truncate group-hover/member:text-primary transition-colors">
                                            {{ member.full_name || '-' }}
                                        </span>
                                    </div>
                                    <span
                                        class="px-2 py-0.5 bg-white border border-gray-100 rounded-md text-[11px] font-black text-navy shadow-sm">
                                        {{ member.total_score || 0 }}
                                    </span>
                                </div>
                            </div>
                            <div v-else class="text-sm text-gray-400 italic">Tidak ada anggota</div>
                        </div>

                        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div class="flex gap-2">
                                <button @click="openEditTeamModal(team)"
                                    class="p-2 text-gray-400 hover:text-navy transition-colors">
                                    <Icon icon="ph:pencil-simple" class="text-lg" />
                                </button>
                                <button @click="handleDeleteTeam(team)"
                                    class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                    <Icon icon="ph:trash" class="text-lg" />
                                </button>
                            </div>
                            <div class="flex flex-col items-end">
                                <span class="text-[10px] font-black text-gray-400 tracking-widest">Total Skor</span>
                                <span class="text-xl font-black text-navy">{{ team.total_score }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Modal (Manual) -->
        <BaseDialogForm v-model="showTeamModal" :header="isEditing ? 'Edit Detil Tim' : 'Tambah Tim Manual'">
            <div class="space-y-8">
                <!-- Section 1: Identitas Tim -->
                <div class="space-y-4">
                    <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                        <Icon icon="ph:identification-card-bold" class="text-primary text-lg" />
                        Identitas & Kategori
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BaseInput v-model="teamForm.team_name" label="Nama Tim" placeholder="Contoh: Jogja Archery A"
                            required icon="ph:users-four" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BaseSelect v-model="teamForm.category_id" :items="mappedCategories" label="Kategori Lomba"
                            placeholder="Pilih Kategori" @update:modelValue="onModalCategoryChange" searchable />

                        <BaseSelect v-model="teamForm.club_name" :items="mappedClubs" label="Pilih Klub"
                            placeholder="Pilih Klub" :disabled="!teamForm.category_id || loadingParticipants"
                            @update:modelValue="onModalClubChange" searchable />
                    </div>
                </div>

                <!-- Section 2: Pemilihan Anggota -->
                <div class="space-y-4 pt-4 border-t border-gray-100" v-if="teamForm.club_name">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                            <Icon icon="ph:users-four-bold" class="text-primary text-lg" />
                            Pilih Anggota ({{ teamForm.member_ids.length }}/{{ maxMembers }})
                        </h3>
                        <span v-if="teamForm.member_ids.length === maxMembers"
                            class="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">
                            Slot Penuh
                        </span>
                    </div>

                    <div v-if="loadingParticipants" class="py-12 text-center">
                        <LoadingSpinner />
                        <p class="text-xs text-gray-400 mt-2">Memuat daftar pemanah...</p>
                    </div>

                    <div v-else-if="filteredParticipants.length > 0"
                        class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <template v-for="participant in filteredParticipants" :key="participant.id">
                            <label
                                class="group relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden"
                                :class="teamForm.member_ids.includes(participant.id)
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'">

                                <input type="checkbox" v-model="teamForm.member_ids" :value="participant.id"
                                    :disabled="!teamForm.member_ids.includes(participant.id) && teamForm.member_ids.length >= maxMembers"
                                    class="sr-only" />

                                <!-- Profile Image / Avatar -->
                                <div
                                    class="size-12 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-gray-100 group-hover:border-primary/30 transition-colors shadow-sm">
                                    <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                        class="w-full h-full object-cover" :alt="participant.full_name" />
                                </div>

                                <div class="flex-1 min-w-0">
                                    <p
                                        class="text-[13px] font-black text-navy truncate group-hover:text-primary transition-colors">
                                        {{ participant.full_name }}
                                    </p>
                                    <div class="flex items-center gap-2 mt-1">
                                        <!-- Score Chip -->
                                        <div
                                            class="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-100 rounded-md shadow-sm">
                                            <Icon icon="ph:crosshair-bold" class="text-primary text-[10px]" />
                                            <span class="text-[10px] font-black text-navy leading-none">
                                                {{ participant.total_score || 0 }}
                                            </span>
                                        </div>
                                        <!-- Gender Badge -->
                                        <div class="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter leading-none"
                                            :class="participant.gender_division_name?.toLowerCase().includes('putra') || participant.gender_division_name?.toLowerCase().includes('men')
                                                ? 'bg-blue-50 text-blue-500'
                                                : 'bg-pink-50 text-pink-500'">
                                            {{ participant.gender_division_name || 'N/A' }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Selection Status indicator -->
                                <div class="size-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0"
                                    :class="teamForm.member_ids.includes(participant.id)
                                        ? 'bg-primary border-primary text-navy'
                                        : 'bg-white border-gray-100 text-transparent'">
                                    <Icon icon="ph:check-bold" class="text-sm" />
                                </div>

                                <!-- Order Badge -->
                                <div v-if="teamForm.member_ids.includes(participant.id)"
                                    class="absolute -top-2 -right-1 px-2 py-0.5 bg-navy text-primary rounded-bl-xl rounded-tr-lg flex items-center justify-center text-[10px] font-black shadow-sm">
                                    #{{ teamForm.member_ids.indexOf(participant.id) + 1 }}
                                </div>
                            </label>
                        </template>
                    </div>

                    <div v-else
                        class="py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                        <div
                            class="size-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                            <Icon icon="ph:user-search" class="text-3xl text-gray-300" />
                        </div>
                        <p class="text-sm font-bold text-gray-500">Pemanah Tidak Ditemukan</p>
                        <p class="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
                            Belum ada pemanah dari klub ini yang terdaftar di kategori tersebut.
                        </p>
                    </div>
                </div>

                <div v-else-if="teamForm.category_id"
                    class="py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Icon icon="ph:buildings" class="text-4xl text-gray-200 mx-auto mb-3" />
                    <p class="text-sm font-bold text-gray-500">Silakan pilih klub terlebih dahulu</p>
                    <p class="text-xs text-gray-400 mt-1">Satu tim harus berasal dari klub yang sama.</p>
                </div>
            </div>

            <template #action>
                <div class="flex justify-end gap-3 pt-2">
                    <BaseButton variant="white" @click="showTeamModal = false" class="px-8">Batal</BaseButton>
                    <BaseButton variant="primary" :loading="isSaving" @click="handleSaveTeam"
                        class="px-8 shadow-lg shadow-primary/20"
                        :disabled="teamForm.member_ids.length < minMembers || !teamForm.team_name">
                        {{ isEditing ? 'Simpan Perubahan' : 'Buat Tim' }}
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>

        <!-- Sync Confirmation Dialog -->
        <BaseDialogForm v-model="showSyncConfirm" @close="showSyncConfirm = false">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="size-10 bg-red-50 rounded-xl flex items-center justify-center shadow-inner">
                        <Icon icon="ph:arrows-clockwise-bold" class="text-xl text-red-600" />
                    </div>
                    <h2 class="text-xl font-black text-navy">Sinkronisasi Tim?</h2>
                </div>
            </template>
            <div class="space-y-6">
                <div class="flex flex-col items-center text-center space-y-4">
                    <div
                        class="size-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 animate-pulse">
                        <Icon icon="ph:warning-circle-bold" class="text-5xl" />
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-lg font-black text-navy uppercase tracking-widest">Tindakan Destruktif</h3>
                        <p class="text-sm text-gray-500 max-w-sm">
                            Sistem akan menghapus semua data tim yang ada di kategori ini dan membuat tim baru secara
                            otomatis berdasarkan peringkat skor kualifikasi tertinggi.
                        </p>
                        <div class="mx-auto p-4 bg-red-50 border border-red-100 rounded-2xl max-w-[280px]">
                            <p class="text-[11px] font-black text-red-600 uppercase tracking-tighter text-center">
                                Proses ini tidak dapat dibatalkan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <template #action>
                <div class="flex justify-end gap-3 pt-2">
                    <BaseButton variant="white" @click="showSyncConfirm = false" class="px-8 font-bold">Batal
                    </BaseButton>
                    <BaseButton variant="primary" :loading="isSyncing" @click="executeSyncTeams"
                        class="px-8 bg-red-500 hover:bg-red-600 border-red-500 shadow-lg shadow-red-200 font-bold">
                        Ya, Sinkronkan
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import AppDialog from '~/components/common/AppDialog.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseDialogForm from '~/components/common/BaseDialogForm.vue'
import LoadingSpinner from '~/components/common/LoadingSpinner.vue'
import { useImageOrDefault } from '~/composables/useImageHelper'

const route = useRoute()
const eventId = route.params.id
const { get, post, put, delete: del } = useApi()
const toast = useToast()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Manajemen Tim - Dashboard'
})

// State Management
const eventName = ref('Loading...')
const categories = ref([])
const selectedCategory = ref(null)
const officialTeams = ref([])
const participants = ref([])
const globalClubs = ref([])

// Loading States
const loadingCategories = ref(false)
const loadingTeams = ref(false)
const loadingParticipants = ref(false)
const isSyncing = ref(false)
const isSaving = ref(false)

// Modal State
const showTeamModal = ref(false)
const showSyncConfirm = ref(false)
const isEditing = ref(false)
const currentTeamId = ref(null)
const clubFilter = ref('')

const teamForm = reactive({
    team_name: '',
    member_ids: [],
    category_id: '',
    club_name: ''
})

// Max members per team based on category type
const modalCategoryInfo = computed(() => {
    if (!teamForm.category_id) return null
    return categories.value.find(c => c.id === teamForm.category_id)
})

// Computed Properties
const maxMembers = computed(() => {
    if (!modalCategoryInfo.value) return 3
    const type = modalCategoryInfo.value.event_type_name?.toLowerCase() || ''
    if (type.includes('mixed')) return 2
    return 3
})

const minMembers = computed(() => maxMembers.value)

const mappedCategories = computed(() => {
    return categories.value.map(cat => ({
        title: getCategoryName(cat),
        value: cat.id,
        description: cat.event_type_name
    }))
})

const mappedClubs = computed(() => {
    // 1. Group existing participants by club to see who is actually available
    const clubCounts = {}
    let hasIndependen = false

    participants.value.forEach(p => {
        const name = p.club_name?.trim()
        if (!name || name?.toLowerCase() === 'independen') {
            hasIndependen = true
        } else {
            clubCounts[name] = (clubCounts[name] || 0) + 1
        }
    })

    // 2. Map global clubs and add the count if they have participants
    const clubs = globalClubs.value.map(club => {
        const count = clubCounts[club.name] || 0
        return {
            title: club.name + (count > 0 ? ` (${count})` : ''),
            value: club.name,
            icon: 'ph:buildings',
            description: count > 0 ? `${count} pemanah tersedia` : 'Tidak ada pemanah di kategori ini'
        }
    })

    // 3. Sort so clubs with participants appear first
    clubs.sort((a, b) => {
        const countA = clubCounts[a.value] || 0
        const countB = clubCounts[b.value] || 0
        if (countA !== countB) return countB - countA
        return a.title.localeCompare(b.title)
    })

    // 4. Add Independen if participants exist
    if (hasIndependen) {
        clubs.unshift({
            title: 'Independen',
            value: 'Independen',
            icon: 'ph:user',
            description: 'Pemanah tanpa klub'
        })
    }

    return clubs
})

// Removed clubList as we now use globalClubs for selection

const filteredParticipants = computed(() => {
    if (!teamForm.club_name) return []

    const selectedClub = teamForm.club_name.trim().toLowerCase()
    let list = [...participants.value]

    if (selectedClub === 'independen') {
        list = list.filter(p => !p.club_name || p.club_name.trim().toLowerCase() === 'independen')
    } else {
        list = list.filter(p => p.club_name?.trim().toLowerCase() === selectedClub)
    }

    // Sort by score descending
    return list.sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
})

const onModalCategoryChange = async () => {
    teamForm.member_ids = []
    teamForm.club_name = ''
    if (teamForm.category_id) {
        await fetchParticipants(teamForm.category_id)
    }
}

const onModalClubChange = () => {
    // Reset member selection when club changes
    teamForm.member_ids = []
}

// Methods
const fetchEventName = async () => {
    try {
        const response = await get(`/events/${eventId}`)
        eventName.value = response?.event?.name || response?.name || 'Event'
    } catch (error) {
        console.error('Failed to fetch event:', error)
    }
}

const fetchCategories = async () => {
    loadingCategories.value = true
    try {
        const response = await get(`/events/${eventId}/categories`)
        const data = response?.events || response?.categories || []
        // Filter out individual categories for Team management
        const teamCategories = data.filter(cat =>
            cat.event_type_name?.toLowerCase() !== 'individual'
        )

        // Sort by participant_count descending
        teamCategories.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))

        categories.value = teamCategories

        if (teamCategories.length > 0) {
            const catId = route.query.category || teamCategories[0].id
            const found = teamCategories.find(c => c.id === catId) || teamCategories[0]
            selectCategory(found)
        }
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    } finally {
        loadingCategories.value = false
    }
}

const selectCategory = async (category) => {
    selectedCategory.value = category
    await fetchTeams(category.id)
    await fetchParticipants(category.id)
}

const fetchTeams = async (categoryId) => {
    loadingTeams.value = true
    try {
        const response = await get(`/teams/event/${eventId}`, {
            params: { category_id: categoryId }
        })
        officialTeams.value = response?.teams || []
    } catch (error) {
        console.error('Failed to fetch teams:', error)
        officialTeams.value = []
    } finally {
        loadingTeams.value = false
    }
}

const fetchParticipants = async (categoryId) => {
    loadingParticipants.value = true
    try {
        const response = await get(`/events/${eventId}/participants`, {
            params: {
                category_id: categoryId,
                limit: 2000 // Get all
            }
        })
        participants.value = response?.participants || []
    } catch (error) {
        console.error('Failed to fetch participants:', error)
    } finally {
        loadingParticipants.value = false
    }
}

const fetchGlobalClubs = async () => {
    try {
        const response = await get('/clubs', { params: { limit: 1000 } })
        globalClubs.value = response?.data || []
    } catch (error) {
        console.error('Failed to fetch clubs:', error)
    }
}

const handleSyncTeams = () => {
    if (!selectedCategory.value) return
    showSyncConfirm.value = true
}

const executeSyncTeams = async () => {
    isSyncing.value = true
    try {
        await post(`/teams/event/${eventId}/sync`, {
            category_id: selectedCategory.value.id
        })
        toast.success('Tim berhasil disinkronisasi otomatis')
        await fetchTeams(selectedCategory.value.id)
    } catch (error) {
        console.error('Failed to sync teams:', error)
        toast.error('Gagal sinkronisasi tim')
    } finally {
        isSyncing.value = false
        showSyncConfirm.value = false
    }
}

const openAddTeamModal = () => {
    isEditing.value = false
    currentTeamId.value = null
    teamForm.team_name = ''
    teamForm.member_ids = []
    teamForm.category_id = selectedCategory.value?.id || ''
    teamForm.club_name = ''

    if (teamForm.category_id) {
        fetchParticipants(teamForm.category_id)
    }

    showTeamModal.value = true
}

const openEditTeamModal = (team) => {
    isEditing.value = true
    currentTeamId.value = team.id
    teamForm.team_name = team.team_name
    teamForm.category_id = team.event_id || selectedCategory.value?.id || ''
    // First fetch participants for this category to populate the list
    fetchParticipants(teamForm.category_id).then(() => {
        // Try to identify the club from members
        if (team.members && team.members.length > 0) {
            teamForm.club_name = team.members[0].club_name
        }
        teamForm.member_ids = team.members.map(m => m.participant_id)
    })
    showTeamModal.value = true
}

const handleSaveTeam = async () => {
    if (!teamForm.team_name) {
        toast.error('Nama tim wajib diisi')
        return
    }
    if (teamForm.member_ids.length < minMembers.value) {
        toast.error(`Pilih minimal ${minMembers.value} anggota`)
        return
    }

    isSaving.value = true
    try {
        const payload = {
            team_name: teamForm.team_name,
            category_id: teamForm.category_id,
            member_ids: teamForm.member_ids
        }

        if (isEditing.value) {
            await put(`/teams/${currentTeamId.value}`, payload)
            toast.success('Tim berhasil diperbarui')
        } else {
            await post(`/teams/event/${eventId}`, payload)
            toast.success('Tim berhasil dibuat')
        }

        showTeamModal.value = false
        await fetchTeams(selectedCategory.value.id)
    } catch (error) {
        console.error('Failed to save team:', error)
        toast.error('Gagal menyimpan tim')
    } finally {
        isSaving.value = false
    }
}

const handleDeleteTeam = async (team) => {
    if (!confirm(`Hapus tim "${team.team_name}"?`)) return

    try {
        await del(`/teams/${team.id}`)
        toast.success('Tim berhasil dihapus')
        await fetchTeams(selectedCategory.value.id)
    } catch (error) {
        console.error('Failed to delete team:', error)
        toast.error('Gagal menghapus tim')
    }
}

const getCategoryName = (category) => {
    if (!category) return ''
    return [
        category.division_name,
        category.category_name,
        category.gender_division_name
    ].filter(Boolean).join(' ')
}

// Watchers and lifecycle
onMounted(() => {
    fetchEventName()
    fetchCategories()
    fetchGlobalClubs()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>
