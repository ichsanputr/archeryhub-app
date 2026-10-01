<template>
    <div class="p-4 sm:p-8 space-y-6 sm:space-y-8">
        <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/15 border border-primary/30 text-navy text-xs font-black mb-2 shadow-2xs">
                <Icon icon="ph:identification-card-bold" class="text-xs" />
                <span>{{ isEn ? 'Step 1 of 3' : 'Langkah 1 dari 3' }}</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-navy tracking-tight">
                {{ isEn ? 'Select Registration Type' : 'Pilih Tipe Pendaftaran' }}
            </h2>
            <div class="text-xs sm:text-sm text-slate-500 mt-1">
                {{ isEn ? 'Choose whether you are registering for yourself / team, or registering on behalf of other archers.' : 'Pilih apakah Anda mendaftar untuk diri sendiri & tim, atau mendaftarkan atlet lain sebagai perwakilan.' }}
            </div>
        </div>

        <!-- 2-Way Mode Selector Cards: Horizontal on Mobile, Card Grid on Desktop -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <!-- Option 1: Individual / Captain -->
            <div
                @click="$emit('update:registrationMode', 'captain_team')"
                class="p-4 sm:p-6 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-row sm:flex-col items-center sm:items-stretch justify-between gap-3.5 sm:gap-0 group select-none"
                :class="registrationMode === 'captain_team' ? 'border-navy bg-navy/[0.03] shadow-xs ring-1 ring-navy/10' : 'border-slate-200 hover:border-slate-300 bg-white'">
                <div class="flex items-center sm:block gap-3.5 sm:gap-0 min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2 sm:mb-4 shrink-0 sm:shrink">
                        <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/15 border border-primary/30 group-hover:bg-primary group-hover:border-primary flex items-center justify-center text-navy group-hover:text-navy transition-all duration-300 shrink-0"
                            :class="registrationMode === 'captain_team' ? 'bg-primary border-primary' : ''">
                            <Icon icon="ph:user-bold" class="text-xl" />
                        </div>
                        <span class="hidden sm:inline-block px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold"
                            :class="registrationMode === 'captain_team' ? 'bg-navy text-primary' : 'bg-slate-100 text-slate-600'">
                            {{ isEn ? 'Competing Athlete' : 'Peserta Bertanding' }}
                        </span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-0.5 sm:mb-0">
                            <div class="font-black text-navy text-sm sm:text-lg leading-tight">
                                {{ isEn ? 'Self & Teammates' : 'Pendaftaran Mandiri & Rekan' }}
                            </div>
                            <span class="sm:hidden px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0"
                                :class="registrationMode === 'captain_team' ? 'bg-navy text-primary' : 'bg-slate-100 text-slate-600'">
                                {{ isEn ? 'Athlete' : 'Atlet' }}
                            </span>
                        </div>
                        <div class="text-xs sm:text-sm text-slate-500 font-medium sm:mt-1 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {{ isEn ? 'Choose this mode to register yourself for individual categories and invite or register teammates for team events.' : 'Pilih mode ini untuk mendaftar kategori perorangan serta mengajak atau mendaftarkan rekan untuk kategori beregu.' }}
                        </div>
                    </div>
                </div>

                <div class="hidden sm:flex mt-4 pt-3 border-t border-slate-100 items-center justify-between text-xs sm:text-sm">
                    <span class="font-bold text-slate-400">{{ isEn ? 'Direct Entry' : 'Pendaftaran Langsung' }}</span>
                    <div class="size-6 rounded-full flex items-center justify-center transition-all"
                        :class="registrationMode === 'captain_team' ? 'bg-navy text-primary' : 'border-2 border-slate-300 text-transparent'">
                        <Icon icon="ph:check-bold" class="text-xs sm:text-sm font-black" />
                    </div>
                </div>

                <!-- Mobile Right Checkmark -->
                <div class="sm:hidden size-6 rounded-full flex items-center justify-center transition-all shrink-0 ml-1"
                    :class="registrationMode === 'captain_team' ? 'bg-navy text-primary' : 'border-2 border-slate-300 text-transparent'">
                    <Icon icon="ph:check-bold" class="text-xs font-black" />
                </div>
            </div>

            <!-- Option 2: Club Delegation / Representative -->
            <div
                @click="$emit('update:registrationMode', 'club_delegation')"
                class="p-4 sm:p-6 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-row sm:flex-col items-center sm:items-stretch justify-between gap-3.5 sm:gap-0 group select-none"
                :class="registrationMode === 'club_delegation' ? 'border-navy bg-navy/[0.03] shadow-xs ring-1 ring-navy/10' : 'border-slate-200 hover:border-slate-300 bg-white'">
                <div class="flex items-center sm:block gap-3.5 sm:gap-0 min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2 sm:mb-4 shrink-0 sm:shrink">
                        <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/15 border border-primary/30 group-hover:bg-primary group-hover:border-primary flex items-center justify-center text-navy group-hover:text-navy transition-all duration-300 shrink-0"
                            :class="registrationMode === 'club_delegation' ? 'bg-primary border-primary' : ''">
                            <Icon icon="ph:users-three-bold" class="text-xl" />
                        </div>
                        <span class="hidden sm:inline-block px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold"
                            :class="registrationMode === 'club_delegation' ? 'bg-navy text-primary' : 'bg-slate-100 text-slate-600'">
                            {{ isEn ? 'Collective / Official' : 'Kolektif / Official' }}
                        </span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-0.5 sm:mb-0">
                            <div class="font-black text-navy text-sm sm:text-lg leading-tight">
                                {{ isEn ? 'Club Delegation' : 'Delegasi Klub / Official' }}
                            </div>
                            <span class="sm:hidden px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0"
                                :class="registrationMode === 'club_delegation' ? 'bg-navy text-primary' : 'bg-slate-100 text-slate-600'">
                                {{ isEn ? 'Official' : 'Official' }}
                            </span>
                        </div>
                        <div class="text-xs sm:text-sm text-slate-500 font-medium sm:mt-1 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {{ isEn ? 'Choose this mode if you represent a club, school, or contingent registering multiple athletes together under one single invoice.' : 'Pilih mode ini jika Anda mewakili klub, sekolah, atau pengurus kontingen yang mendaftarkan banyak atlet sekaligus dalam satu tagihan.' }}
                        </div>
                    </div>
                </div>

                <div class="hidden sm:flex mt-4 pt-3 border-t border-slate-100 items-center justify-between text-xs sm:text-sm">
                    <span class="font-bold text-slate-400">{{ isEn ? 'Batch Entry & Quotas' : 'Banyak Atlet & Kuota' }}</span>
                    <div class="size-6 rounded-full flex items-center justify-center transition-all"
                        :class="registrationMode === 'club_delegation' ? 'bg-navy text-primary' : 'border-2 border-slate-300 text-transparent'">
                        <Icon icon="ph:check-bold" class="text-xs sm:text-sm font-black" />
                    </div>
                </div>

                <!-- Mobile Right Checkmark -->
                <div class="sm:hidden size-6 rounded-full flex items-center justify-center transition-all shrink-0 ml-1"
                    :class="registrationMode === 'club_delegation' ? 'bg-navy text-primary' : 'border-2 border-slate-300 text-transparent'">
                    <Icon icon="ph:check-bold" class="text-xs font-black" />
                </div>
            </div>
        </div>

        <!-- MODE 1: UNIFIED ARCHER REGISTRATION FORM (Flat on mobile, bordered on desktop) -->
        <div v-if="registrationMode === 'captain_team'" class="rounded-2xl border-0 sm:border border-slate-200/90 bg-transparent sm:bg-slate-50/50 p-0 sm:p-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div class="flex items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
                <div>
                    <h3 class="text-sm sm:text-base font-black text-navy">
                        {{ isEn ? 'Archer Registration Form' : 'Formulir Pendaftaran Atlet' }}
                    </h3>
                    <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                        {{ isEn ? 'Fill in the official participant information and tournament requirements.' : 'Lengkapi data identitas pemanah dan persyaratan resmi turnamen.' }}
                    </div>
                </div>
                <span class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs sm:text-sm font-bold shrink-0 hidden sm:inline-block">
                    {{ isEn ? 'Step 1: Archer Data' : 'Langkah 1: Data Atlet' }}
                </span>
            </div>

            <!-- Core System Fields -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BaseInput
                    v-model="profileForm.full_name"
                    :label="isEn ? 'Full Name' : 'Nama Lengkap Atlet'"
                    :placeholder="isEn ? 'Official archer name' : 'Nama lengkap atlet'"
                    icon="ph:user-bold"
                    required />

                <!-- Gender Toggle -->
                <div class="space-y-1.5">
                    <label class="text-navy text-xs sm:text-sm font-bold block">
                        {{ isEn ? 'Gender' : 'Jenis Kelamin' }} <span class="text-red-500">*</span>
                    </label>
                    <div class="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            @click="profileForm.gender = 'male'"
                            class="h-11 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                            :class="profileForm.gender === 'male' ? 'border-navy bg-navy text-primary shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'">
                            <Icon icon="ph:gender-male-bold" class="text-base" />
                            <span>{{ isEn ? 'Male' : 'Laki-laki' }}</span>
                        </button>
                        <button
                            type="button"
                            @click="profileForm.gender = 'female'"
                            class="h-11 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                            :class="profileForm.gender === 'female' ? 'border-navy bg-navy text-primary shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'">
                            <Icon icon="ph:gender-female-bold" class="text-base" />
                            <span>{{ isEn ? 'Female' : 'Perempuan' }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <ClubSelector
                    v-model="profileForm.club_id"
                    v-model:newClubName="profileForm.club_name"
                    :label="isEn ? 'Club / Contingent / School' : 'Klub / Asal Kontingen / Sekolah'"
                    :placeholder="isEn ? 'Select or search club...' : 'Pilih atau cari klub...'" />
            </div>

            <!-- DYNAMIC CUSTOM FIELDS (Flows seamlessly as part of unified form) -->
            <div v-if="customFields && customFields.length > 0" class="pt-2">
                <DynamicCustomFieldsRenderer
                    :fields="customFields"
                    :modelValue="customFieldAnswers"
                    @update:modelValue="$emit('update:customFieldAnswers', $event)"
                    :category-ids="selectedIndividualCategoryIds"
                />
            </div>
        </div>

        <!-- Step 1 Footer Action -->
        <div class="pt-6 border-t border-slate-100 flex justify-end">
            <BaseButton
                @click="$emit('goToStep', 2)"
                :disabled="!isStep1Valid"
                variant="navy"
                size="md"
                icon-right="ph:arrow-right-bold"
                class="text-sm sm:text-base">
                {{ isEn ? 'Continue to Categories' : 'Lanjut ke Kategori' }}
            </BaseButton>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import RegistrationModeSelector from '~/components/tournament/register/RegistrationModeSelector.vue'
const props = defineProps({
    registrationMode: {
        type: String,
        default: 'captain_team'
    },
    profileForm: {
        type: Object,
        required: true
    },
    customFields: {
        type: Array,
        default: () => []
    },
    customFieldAnswers: {
        type: Object,
        default: () => ({})
    },
    selectedIndividualCategoryIds: {
        type: Array,
        default: () => []
    },
    isStep1Valid: {
        type: Boolean,
        default: true
    },
    isEn: {
        type: Boolean,
        default: false
    }
})

defineEmits(['update:registrationMode', 'update:customFieldAnswers', 'goToStep'])
</script>
