<template>
    <div class="space-y-8">
        <!-- Archer Profile Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90">
            <div class="flex items-center gap-3.5">
                <img
                    :src="getImage(archerProfile?.avatar_url || user?.avatar, profileForm.full_name || 'Archer')"
                    class="size-11 rounded-full object-cover border border-slate-200 shrink-0" />
                <div class="min-w-0">
                    <div class="text-sm sm:text-base font-black text-navy truncate">
                        {{ profileForm.full_name || archerProfile?.full_name || user?.full_name || 'Archer' }}
                    </div>
                    <div class="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
                        {{ profileForm.club_name || archerProfile?.club_name || (isEn ? 'Independent' : 'Independen') }} • {{ (profileForm.gender || 'male') === 'female' ? (isEn ? 'Female Archer' : 'Atlet Putri') : (isEn ? 'Male Archer' : 'Atlet Putra') }}
                    </div>
                </div>
            </div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-navy text-primary text-xs sm:text-sm font-black self-start sm:self-auto shrink-0 shadow-xs">
                <Icon icon="ph:user-bold" class="text-sm" />
                {{ isEn ? 'Registered Archer' : 'Pemanah Terdaftar' }}
            </span>
        </div>

        <!-- Gender mismatch alert if tournament has categories but 0 match selected gender -->
        <div v-if="categories.length > 0 && individualCategories.length === 0 && teamCategories.length === 0"
            class="p-6 text-center border-2 border-dashed border-amber-200 bg-amber-50/50 rounded-2xl space-y-3">
            <div class="size-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 flex items-center justify-center mx-auto shadow-2xs">
                <Icon icon="ph:gender-intersex-bold" class="text-2xl" />
            </div>
            <div class="max-w-md mx-auto">
                <div class="text-base font-bold text-navy">
                    {{ isEn ? 'No matching categories for selected gender' : 'Tidak ada kategori untuk gender terpilih' }}
                </div>
                <div class="text-xs sm:text-sm text-slate-500 mt-1">
                    {{ isEn 
                        ? `The categories in this tournament are set for a different gender division. Current profile gender: ${(profileForm.gender || 'male') === 'female' ? 'Female' : 'Male'}.`
                        : `Kategori turnamen ini diperuntukkan bagi divisi gender yang berbeda. Gender profil saat ini: ${(profileForm.gender || 'male') === 'female' ? 'Female' : 'Male'}.` }}
                </div>
            </div>
            <button type="button" @click="$emit('switchGender')"
                class="inline-flex items-center gap-2 px-4 py-2 bg-navy text-primary rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:bg-navy/90 transition-all cursor-pointer">
                <Icon icon="ph:arrows-clockwise-bold" />
                <span>{{ (isEn ? 'Switch Gender to ' : 'Ubah Gender ke ') + ((profileForm.gender || 'male') === 'female' ? (isEn ? 'Male' : 'Putra') : (isEn ? 'Female' : 'Putri')) }}</span>
            </button>
        </div>

        <!-- Empty categories state if tournament has 0 categories configured -->
        <div v-else-if="categories.length === 0" class="p-8 text-center border border-slate-200 rounded-2xl text-sm text-slate-500 bg-slate-50/50">
            {{ isEn ? 'No categories configured for this tournament yet.' : 'Belum ada kategori yang dikonfigurasi untuk turnamen ini.' }}
        </div>

        <!-- Section 1: Individual Category (Multi-Selectable) -->
        <div v-if="individualCategories.length > 0" class="space-y-3.5">
            <div>
                <h3 class="text-base sm:text-lg font-black text-navy">
                    {{ isEn ? 'Individual Category' : 'Kategori Individu' }}
                </h3>
                <div class="text-sm text-slate-500 mt-0.5">
                    {{ isEn ? 'Select your individual competition division (you can select more than 1).' : 'Pilih kategori individu yang akan Anda ikuti (bisa memilih lebih dari 1).' }}
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div
                    v-for="cat in individualCategories"
                    :key="cat.id"
                    @click="!lockedIndividualCategoryIds.includes(cat.id) && $emit('toggleIndividualCategory', cat)"
                    class="p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 group relative"
                    :class="[
                        selectedIndividualCategoryIds.includes(cat.id) ? 'border-navy bg-navy/[0.03] shadow-xs ring-1 ring-navy/10' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50',
                        lockedIndividualCategoryIds.includes(cat.id) ? 'cursor-not-allowed' : 'cursor-pointer'
                    ]">
                    <!-- Subtle Lock Indicator Icon (Position Absolute) -->
                    <div v-if="lockedIndividualCategoryIds.includes(cat.id)" 
                        class="absolute top-2.5 right-2.5 size-5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center text-[11px]" 
                        :title="isEn ? 'Required for team' : 'Wajib untuk beregu'">
                        <Icon icon="ph:lock-simple-fill" />
                    </div>

                    <div class="flex items-center gap-3.5 min-w-0">
                        <!-- Category Icon Image -->
                        <div class="size-11 rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-primary/30 bg-primary/15 group-hover:scale-105 transition-transform shadow-2xs">
                            <img :src="'/' + (getCategoryIcon(cat.name || cat.division_name) || 'category-icon/men-single-recurve.svg')" :alt="cat.name" class="w-full h-full object-contain" @error="(e) => { e.target.onerror = null; e.target.src = '/category-icon/men-single-recurve.svg' }" />
                        </div>
                        <div class="min-w-0">
                            <div class="text-sm sm:text-base font-black text-navy truncate">{{ cat.name }}</div>
                            <div class="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
                                {{ cat.division_name || 'Individual' }} • {{ cat.gender_division_name || 'Open' }}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                        <span class="text-sm sm:text-base font-black" :class="!getFeeForCategory(cat.id) ? 'text-emerald-600' : 'text-navy'">
                            {{ formatPriceValue(getFeeForCategory(cat.id)) }}
                        </span>
                        <div class="size-6 rounded-lg border-2 flex items-center justify-center transition-all"
                            :class="selectedIndividualCategoryIds.includes(cat.id) ? 'border-navy bg-navy text-primary font-black' : 'border-slate-300 bg-white'">
                            <Icon v-if="lockedIndividualCategoryIds.includes(cat.id)" icon="ph:lock-simple-bold" class="text-xs font-black" />
                            <Icon v-else-if="selectedIndividualCategoryIds.includes(cat.id)" icon="ph:check-bold" class="text-xs font-black" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section 2: Team & Mixed Team Events (Expandable Card Format) -->
        <div v-if="teamCategories.length > 0" class="space-y-3.5 pt-2">
            <div>
                <h3 class="text-base sm:text-lg font-black text-navy">
                    {{ isEn ? 'Team & Mixed Team Events' : 'Kategori Tim / Beregu' }}
                </h3>
                <div class="text-sm text-slate-500 mt-0.5">
                    {{ isEn ? 'Select team events to enter and invite or register teammates.' : 'Pilih kategori beregu untuk mendaftar dan susun rekan tim.' }}
                </div>
            </div>

            <div class="space-y-4">
                <!-- Expandable Team Category Card -->
                <div
                    v-for="cat in teamCategories"
                    :key="cat.id"
                    class="rounded-2xl border-2 transition-all overflow-hidden bg-white"
                    :class="selectedTeamCategories.some(t => t.id === cat.id) ? 'border-navy shadow-sm ring-1 ring-navy/10' : 'border-slate-200 hover:border-slate-300'">
                    
                    <!-- Category Toggle Bar -->
                    <div
                        @click="$emit('toggleTeamCategory', cat)"
                        class="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none transition-colors"
                        :class="selectedTeamCategories.some(t => t.id === cat.id) ? 'bg-navy/[0.03]' : 'hover:bg-slate-50/70'">
                        
                        <div class="flex items-center gap-3.5 min-w-0">
                            <!-- Category Icon Image -->
                            <div class="size-11 rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-primary/30 bg-primary/15 shadow-2xs">
                                <img :src="'/' + getCategoryIcon(cat.name || cat.division_name)" :alt="cat.name" class="w-full h-full object-contain" />
                            </div>
                            <div class="min-w-0">
                                <div class="text-sm sm:text-base font-black text-navy truncate">
                                    {{ cat.name || `${cat.division_name || ''} Team`.trim() }}
                                </div>
                                <div class="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
                                    {{ getCategoryType(cat) === 'mixed_team' ? (isEn ? 'Mixed Team (1 Male + 1 Female)' : 'Beregu Campuran (1 Putra + 1 Putri)') : (isEn ? 'Team (3 Archers of same division)' : 'Beregu (3 Pemanah divisi sama)') }}
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-4 shrink-0">
                            <span class="text-sm sm:text-base font-black" :class="!getFeeForCategory(cat.id) ? 'text-emerald-600' : 'text-navy'">
                                {{ formatPriceValue(getFeeForCategory(cat.id)) }}
                            </span>
                            <div class="size-6 rounded-lg border-2 flex items-center justify-center transition-all"
                                :class="selectedTeamCategories.some(t => t.id === cat.id) ? 'border-navy bg-navy text-primary' : 'border-slate-300 bg-white'">
                                <Icon v-if="selectedTeamCategories.some(t => t.id === cat.id)" icon="ph:check-bold" class="text-xs font-black" />
                            </div>
                        </div>
                    </div>

                    <!-- Expanded Roster Builder Section (Directly inside category card) -->
                    <div
                        v-if="selectedTeamCategories.some(t => t.id === cat.id)"
                        class="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/40">
                        <TeamSlotBuilder
                            :category-id="cat.id"
                            :category-name="cat.name || `${cat.division_name || ''} Team`"
                            :captain-name="profileForm.full_name || archerProfile?.full_name"
                            :captain-avatar="archerProfile?.avatar_url"
                            :captain-club="profileForm.club_name"
                            :captain-gender="profileForm.gender || 'male'"
                            :is-mixed-team="getCategoryType(cat) === 'mixed_team'"
                            :partners="teamRosters[cat.id]?.partners || []"
                            :default-single-fee="singleEntryFee"
                            :currency="eventCurrency"
                            @open-search="params => $emit('openPartnerModal', cat, params)"
                            @edit-partner="params => $emit('handleEditPartner', cat, params)"
                            @remove-partner="partnerIdx => $emit('removePartner', cat.id, partnerIdx)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import BaseButton from '~/components/common/BaseButton.vue'
import TeamSlotBuilder from '~/components/tournament/register/TeamSlotBuilder.vue'
const props = defineProps({
    categories: {
        type: Array,
        default: () => []
    },
    individualCategories: {
        type: Array,
        default: () => []
    },
    teamCategories: {
        type: Array,
        default: () => []
    },
    selectedIndividualCategoryIds: {
        type: Array,
        default: () => []
    },
    selectedTeamCategories: {
        type: Array,
        default: () => []
    },
    lockedIndividualCategoryIds: {
        type: Array,
        default: () => []
    },
    profileForm: {
        type: Object,
        required: true
    },
    archerProfile: {
        type: Object,
        default: null
    },
    user: {
        type: Object,
        default: null
    },
    teamRosters: {
        type: Object,
        default: () => ({})
    },
    singleEntryFee: {
        type: Number,
        default: 0
    },
    eventCurrency: {
        type: String,
        default: 'IDR'
    },
    isEn: {
        type: Boolean,
        default: false
    },
    getCategoryIcon: {
        type: Function,
        default: () => 'category-icon/men-single-recurve.svg'
    },
    getCategoryType: {
        type: Function,
        default: (c) => c?.event_type_name?.toLowerCase()?.includes('team') ? 'team' : 'individual'
    },
    getFeeForCategory: {
        type: Function,
        default: () => 0
    },
    formatPrice: {
        type: Function,
        default: null
    },
    useImageOrDefault: {
        type: Function,
        default: null
    }
})

defineEmits([
    'toggleIndividualCategory',
    'toggleTeamCategory',
    'openPartnerModal',
    'handleEditPartner',
    'removePartner',
    'switchGender'
])

const getImage = (url, name) => {
    if (props.useImageOrDefault) {
        return props.useImageOrDefault(url, name)
    }
    return url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Archer')}&background=0A192F&color=E2F163`
}

const formatPriceValue = (val) => {
    if (props.formatPrice) return props.formatPrice(val)
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}
</script>
