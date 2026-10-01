<template>
    <Teleport to="body">
        <div
            v-if="show"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in"
            @click.self="$emit('close')">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
                <!-- Header -->
                <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div class="flex items-center gap-2.5">
                        <div class="size-9 rounded-xl bg-navy text-primary flex items-center justify-center shadow-2xs">
                            <Icon icon="ph:tag-bold" class="text-lg" />
                        </div>
                        <div>
                            <h4 class="text-sm sm:text-base font-black text-navy">{{ isEn ? 'Bulk Assign Category' : 'Tetapkan Kategori Massal' }}</h4>
                            <div class="text-xs sm:text-sm text-slate-500">{{ isEn ? `Apply category to ${selectedAthletes.length} selected archers` : `Terapkan ke ${selectedAthletes.length} atlet terpilih` }}</div>
                        </div>
                    </div>
                    <button type="button" @click="$emit('close')" class="size-8 rounded-lg text-slate-400 hover:text-navy flex items-center justify-center cursor-pointer">
                        <Icon icon="ph:x-bold" class="text-sm" />
                    </button>
                </div>

                <!-- Selected Archers Summary Bar with Gender Badges -->
                <div class="p-3 bg-slate-50/90 border-b border-slate-100 space-y-1.5">
                    <div class="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500">
                        <span class="flex items-center gap-1">
                            <Icon icon="ph:users-three-bold" class="text-xs sm:text-sm text-navy" />
                            <span>{{ isEn ? 'Selected Archers & Gender' : 'Atlet Terpilih & Gender' }}</span>
                        </span>
                        <span class="text-slate-400">{{ selectedAthletes.length }} {{ isEn ? 'archers' : 'atlet' }}</span>
                    </div>
                    <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                        <div
                            v-for="ath in selectedAthletes"
                            :key="ath.email || ath.full_name"
                            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-bold text-navy shadow-2xs">
                            <span class="truncate max-w-[130px]">{{ ath.full_name }}</span>
                            <span
                                class="px-1.5 py-0.5 rounded text-xs font-black inline-flex items-center gap-0.5"
                                :class="ath.gender?.toLowerCase() === 'female' || ath.gender?.toLowerCase() === 'women' || ath.gender?.toLowerCase() === 'f'
                                    ? 'bg-rose-50 text-rose-700'
                                    : 'bg-sky-50 text-sky-700'">
                                <Icon
                                    :icon="ath.gender?.toLowerCase() === 'female' || ath.gender?.toLowerCase() === 'women' || ath.gender?.toLowerCase() === 'f'
                                        ? 'ph:gender-female-bold'
                                        : 'ph:gender-male-bold'"
                                    class="text-xs" />
                                {{ ath.gender?.toLowerCase() === 'female' || ath.gender?.toLowerCase() === 'women' || ath.gender?.toLowerCase() === 'f' ? (isEn ? 'Female' : 'Putri') : (isEn ? 'Male' : 'Putra') }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Categories List -->
                <div class="p-3 space-y-2 overflow-y-auto flex-1 max-h-[380px]">
                    <div
                        v-for="cat in individualCategories"
                        :key="cat.id"
                        @click="!getMatchStats(cat).noneMatched && $emit('apply', cat.id)"
                        :class="[
                            'flex items-center justify-between p-3.5 rounded-2xl border transition-all select-none',
                            getMatchStats(cat).noneMatched
                                ? 'border-slate-200/80 bg-slate-50/70 opacity-50 cursor-not-allowed'
                                : 'border-slate-200 bg-white hover:border-navy hover:bg-slate-50 shadow-2xs cursor-pointer group'
                        ]">
                        <div class="min-w-0 pr-3 space-y-1">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-xs sm:text-sm font-black text-navy truncate">{{ getCategoryFullName(cat) }}</span>
                                <!-- Gender Chip -->
                                <span
                                    :class="[
                                        'px-2 py-0.5 rounded-md text-xs font-black border inline-flex items-center gap-1',
                                        cat.gender_division_name?.toLowerCase().includes('putri') || cat.gender_division_name?.toLowerCase().includes('women') || cat.gender_division_name?.toLowerCase().includes('female')
                                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                                            : cat.gender_division_name?.toLowerCase().includes('putra') || cat.gender_division_name?.toLowerCase().includes('men') || cat.gender_division_name?.toLowerCase().includes('male')
                                                ? 'bg-sky-50 text-sky-700 border-sky-200'
                                                : 'bg-slate-100 text-slate-700 border-slate-200'
                                    ]">
                                    <Icon
                                        :icon="
                                            cat.gender_division_name?.toLowerCase().includes('putri') || cat.gender_division_name?.toLowerCase().includes('women') || cat.gender_division_name?.toLowerCase().includes('female')
                                                ? 'ph:gender-female-bold'
                                                : cat.gender_division_name?.toLowerCase().includes('putra') || cat.gender_division_name?.toLowerCase().includes('men') || cat.gender_division_name?.toLowerCase().includes('male')
                                                    ? 'ph:gender-male-bold'
                                                    : 'ph:users-bold'
                                        "
                                        class="text-xs" />
                                    <span>{{ cat.gender_division_name || 'Open' }}</span>
                                </span>
                            </div>
                            
                            <!-- Compatibility Status -->
                            <div class="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                                <span v-if="getMatchStats(cat).allMatched" class="text-emerald-600 font-bold flex items-center gap-1">
                                    <Icon icon="ph:check-circle-bold" class="text-xs sm:text-sm" />
                                    <span>{{ isEn ? `Compatible with all ${selectedAthletes.length} selected archers` : `Kompatibel untuk semua ${selectedAthletes.length} atlet terpilih` }}</span>
                                </span>
                                <span v-else-if="getMatchStats(cat).partial" class="text-amber-600 font-bold flex items-center gap-1">
                                    <Icon icon="ph:warning-circle-bold" class="text-xs sm:text-sm" />
                                    <span>{{ isEn ? `Compatible with ${getMatchStats(cat).matched} of ${selectedAthletes.length} archers (Partial)` : `Hanya kompatibel untuk ${getMatchStats(cat).matched} dari ${selectedAthletes.length} atlet` }}</span>
                                </span>
                                <span v-else class="text-rose-500 font-bold flex items-center gap-1">
                                    <Icon icon="ph:prohibit-bold" class="text-xs sm:text-sm" />
                                    <span>{{ isEn ? 'Gender incompatible with selected archer(s)' : 'Gender tidak cocok dengan atlet terpilih' }}</span>
                                </span>
                            </div>
                        </div>
                        <div class="text-right shrink-0">
                            <span class="text-xs sm:text-sm font-black text-navy whitespace-nowrap block">{{ formatPriceValue(getFeeForCategory(cat.id)) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    selectedAthletes: {
        type: Array,
        default: () => []
    },
    categories: {
        type: Array,
        default: () => []
    },
    isEn: {
        type: Boolean,
        default: false
    },
    getCategoryType: {
        type: Function,
        default: (c) => c?.event_type_name?.toLowerCase()?.includes('team') || c?.event_type_name?.toLowerCase()?.includes('beregu') ? 'team' : 'individual'
    },
    getCategoryFullName: {
        type: Function,
        default: (c) => [c?.division_name, c?.category_name, c?.gender_division_name, c?.event_type_name].filter(Boolean).join(' ')
    },
    getFeeForCategory: {
        type: Function,
        default: () => 0
    },
    formatPrice: {
        type: Function,
        default: null
    }
})

defineEmits(['close', 'apply'])

const individualCategories = computed(() => {
    return props.categories.filter(c => props.getCategoryType(c) === 'individual')
})

const getMatchStats = (category) => {
    if (!props.selectedAthletes || props.selectedAthletes.length === 0) {
        return { allMatched: false, matched: 0, partial: false, noneMatched: true }
    }
    const catGender = (category.gender_division_name || category.gender || '').toLowerCase()
    let matchedCount = 0
    props.selectedAthletes.forEach(ath => {
        const athGender = (ath.gender || '').toLowerCase()
        if (catGender.includes('mix') || catGender.includes('open') || !catGender) {
            matchedCount++
        } else if (catGender.includes('putri') || catGender.includes('women') || catGender.includes('female')) {
            if (athGender === 'female' || athGender === 'women' || athGender === 'f') matchedCount++
        } else if (catGender.includes('putra') || catGender.includes('men') || catGender.includes('male')) {
            if (athGender === 'male' || athGender === 'men' || athGender === 'm') matchedCount++
        }
    })
    const total = props.selectedAthletes.length
    return {
        allMatched: matchedCount === total,
        matched: matchedCount,
        partial: matchedCount > 0 && matchedCount < total,
        noneMatched: matchedCount === 0
    }
}

const formatPriceValue = (val) => {
    if (props.formatPrice) return props.formatPrice(val)
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}
</script>
