<template>
    <div class="space-y-4">
        <!-- Team Status Header -->
        <div class="flex flex-wrap items-center justify-between gap-2 pb-1">
            <div class="text-sm font-bold text-slate-600">
                {{ isMixedTeam ? 'Mixed Team (1 Male + 1 Female)' : 'Team (3 Archers of same division)' }}
            </div>
        </div>

        <!-- Slots Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <!-- Slot 1: Registrant (Locked to User) -->
            <div class="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between min-h-[150px] relative">
                <div class="flex items-start justify-between gap-2 mb-2">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy text-primary text-xs font-bold tracking-wide">
                        <Icon icon="ph:user-bold" class="text-xs" />
                        Registrant (You)
                    </span>
                    <span v-if="captainGender" class="text-slate-500 text-xs sm:text-sm flex items-center gap-1 font-bold">
                        <Icon :icon="captainGender === 'female' ? 'ph:gender-female-bold' : 'ph:gender-male-bold'" />
                        {{ captainGender === 'female' ? 'Female' : 'Male' }}
                    </span>
                </div>

                <div class="flex items-center gap-3 my-auto">
                    <img
                        :src="useImageOrDefault(captainAvatar, captainName)"
                        class="size-12 rounded-full object-cover shrink-0 border border-slate-200" />
                    <div class="min-w-0 flex-1">
                        <div class="text-sm sm:text-base font-black text-navy truncate">{{ captainName || 'Registrant' }}</div>
                        <div class="text-xs sm:text-sm text-slate-500 font-medium truncate">{{ captainClub || 'Independent' }}</div>
                    </div>
                </div>

                <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-700">
                    <span class="inline-flex items-center gap-1">
                        <Icon icon="ph:check-bold" />
                        Already Registered
                    </span>
                    <span class="font-black text-sm">Rp 0</span>
                </div>
            </div>

            <!-- Additional Member Slots -->
            <template v-for="(slotNum, index) in requiredTeammateCount" :key="index">
                <!-- If Teammate is Assigned -->
                <div
                    v-if="partners[index]"
                    class="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between min-h-[150px] relative transition-all">
                    <div class="flex items-start justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-navy text-xs font-bold tracking-wide">
                            <Icon icon="ph:user-bold" class="text-xs" />
                            Archer {{ index + 2 }}
                        </span>
                        <button
                            type="button"
                            @click="$emit('remove-partner', index)"
                            class="size-7 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer">
                            <Icon icon="ph:x-bold" class="text-sm" />
                        </button>
                    </div>

                    <div class="flex items-center gap-3 my-auto">
                        <img
                            :src="useImageOrDefault(partners[index].avatar_url, partners[index].full_name)"
                            class="size-12 rounded-full object-cover shrink-0 border border-slate-200" />
                        <div class="min-w-0 flex-1">
                            <div class="text-sm sm:text-base font-black text-navy truncate">{{ partners[index].full_name }}</div>
                            <div class="text-xs sm:text-sm text-slate-500 font-medium truncate">{{ partners[index].club_name || 'Independent' }}</div>
                        </div>
                    </div>

                    <!-- Financial Status for this Partner -->
                    <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold"
                        :class="partners[index].is_already_registered_individual ? 'text-emerald-700' : 'text-navy'">
                        <span class="inline-flex items-center gap-1">
                            <Icon :icon="partners[index].is_already_registered_individual ? 'ph:check-circle-bold' : 'ph:info-bold'" class="text-xs" />
                            {{ partners[index].is_already_registered_individual ? 'Individual Fee Paid' : 'Included in Invoice' }}
                        </span>
                        <span class="font-black text-sm">{{ partners[index].is_already_registered_individual ? formatPrice(0) : `+${formatPrice(partners[index].individual_fee || defaultSingleFee)}` }}</span>
                    </div>
                </div>

                <!-- Empty Dashed Slot -->
                <button
                    v-else
                    type="button"
                    @click="$emit('open-search', { index, isMixedTeam, requiredGender: getRequiredGenderForSlot(index) })"
                    class="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-navy bg-white hover:bg-slate-50/70 flex flex-col items-center justify-center gap-2.5 min-h-[150px] text-center transition-all cursor-pointer group shadow-2xs">
                    <div class="size-10 rounded-full bg-slate-100 group-hover:bg-navy group-hover:text-primary flex items-center justify-center text-slate-500 transition-colors shadow-2xs">
                        <Icon icon="ph:plus-bold" class="text-base font-bold" />
                    </div>
                    <div>
                        <div class="text-sm sm:text-base font-black text-navy group-hover:underline">
                            {{ isMixedTeam ? (captainGender === 'female' ? '+ Add Male Archer (Optional)' : '+ Add Female Archer (Optional)') : `+ Add Archer ${index + 2} (Optional)` }}
                        </div>
                        <div class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                            {{ isMixedTeam ? (captainGender === 'female' ? 'Optional • 1 Male Archer' : 'Optional • 1 Female Archer') : 'Optional • Search or Add Archer' }}
                        </div>
                    </div>
                </button>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { formatMoney } from '~/composables/useCurrency'

const props = defineProps({
    categoryName: {
        type: String,
        default: ''
    },
    categoryId: {
        type: String,
        required: true
    },
    captainName: {
        type: String,
        default: 'Registrant'
    },
    captainClub: {
        type: String,
        default: ''
    },
    captainGender: {
        type: String,
        default: 'male'
    },
    captainAvatar: {
        type: String,
        default: ''
    },
    isMixedTeam: {
        type: Boolean,
        default: false
    },
    teamSize: {
        type: Number,
        default: 3
    },
    partners: {
        type: Array,
        default: () => []
    },
    defaultSingleFee: {
        type: Number,
        default: 150000
    },
    currency: {
        type: String,
        default: 'IDR'
    }
})

defineEmits(['open-search', 'remove-partner'])

const requiredSize = computed(() => (props.isMixedTeam ? 2 : (props.teamSize || 3)))
const requiredTeammateCount = computed(() => (props.isMixedTeam ? 1 : (props.teamSize ? props.teamSize - 1 : 2)))
const currentMemberCount = computed(() => 1 + (props.partners ? props.partners.length : 0))
const isComplete = computed(() => currentMemberCount.value >= requiredSize.value)

const defaultTeamNamePlaceholder = computed(() => {
    const club = props.captainClub && props.captainClub !== 'Independent' ? props.captainClub : 'Archeris'
    return `${club} Team`
})

const getRequiredGenderForSlot = (index) => {
    if (!props.isMixedTeam) return props.captainGender
    return props.captainGender === 'female' ? 'male' : 'female'
}

const formatPrice = (val) => {
    return formatMoney(val, props.currency)
}
</script>
