<template>
    <Teleport to="body">
        <div
            v-if="athlete"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in"
            @click.self="$emit('close')">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200/90 flex flex-col max-h-[88vh]">
                <!-- Header -->
                <div class="px-5 py-3.5 sm:px-6 sm:py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="size-9 rounded-xl bg-primary/15 border border-primary/30 text-navy flex items-center justify-center shadow-2xs shrink-0">
                            <Icon icon="ph:user-bold" class="text-base text-navy" />
                        </div>
                        <div>
                            <h3 class="text-sm sm:text-base font-black text-navy leading-snug">
                                {{ isEn ? 'Athlete Details' : 'Detail Data Atlet' }}
                            </h3>
                            <div class="text-xs text-slate-500">
                                {{ isEn ? 'Complete profile and tournament form data.' : 'Profil lengkap atlet dan data formulir turnamen.' }}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        @click="$emit('close')"
                        class="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-navy hover:bg-slate-200 transition-colors cursor-pointer shrink-0">
                        <Icon icon="ph:x-bold" class="text-sm" />
                    </button>
                </div>

                <!-- Body -->
                <div class="p-5 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1">
                    <!-- Profile Card -->
                    <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
                        <div class="flex items-center gap-3.5 min-w-0">
                            <img
                                :src="getImage(athlete.avatar_url, athlete.full_name)"
                                class="size-12 rounded-full object-cover border border-slate-200 shrink-0" />
                            <div class="min-w-0">
                                <div class="font-black text-navy text-base truncate">
                                    {{ athlete.full_name }}
                                </div>
                                <div class="text-xs text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1.5">
                                    <Icon icon="ph:shield-bold" class="text-xs text-slate-400" />
                                    <span>{{ athlete.club_name || delegationClubName || (isEn ? 'Independent' : 'Independen') }}</span>
                                </div>
                            </div>
                        </div>

                        <span
                            class="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border"
                            :class="athlete.gender === 'female' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-sky-50 text-sky-700 border-sky-200'">
                            {{ athlete.gender === 'female' ? (isEn ? 'Female' : 'Putri') : (isEn ? 'Male' : 'Putra') }}
                        </span>
                    </div>

                    <!-- Credentials Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                        <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-0.5">
                            <div class="text-[11px] font-bold text-slate-400">Email</div>
                            <div class="font-bold text-navy truncate">{{ athlete.email || '-' }}</div>
                        </div>
                        <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-0.5">
                            <div class="text-[11px] font-bold text-slate-400">{{ isEn ? 'Phone / WhatsApp' : 'No. Telepon / WA' }}</div>
                            <div class="font-bold text-navy truncate">{{ athlete.phone || '-' }}</div>
                        </div>
                        <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-0.5">
                            <div class="text-[11px] font-bold text-slate-400">{{ isEn ? 'Date of Birth' : 'Tanggal Lahir' }}</div>
                            <div class="font-bold text-navy">{{ athlete.date_of_birth || '-' }}</div>
                        </div>
                        <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-0.5">
                            <div class="text-[11px] font-bold text-slate-400">{{ isEn ? 'Account Status' : 'Status Akun' }}</div>
                            <div class="font-bold text-navy flex items-center gap-1">
                                <Icon :icon="athlete.is_new_account ? 'ph:user-plus-bold' : 'ph:user-check-bold'" class="text-xs" :class="athlete.is_new_account ? 'text-emerald-600' : 'text-navy'" />
                                <span>{{ athlete.is_new_account ? (isEn ? 'New Account' : 'Akun Baru') : (isEn ? 'Registered Archer' : 'Akun Terdaftar') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Selected Categories -->
                    <div class="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                        <div class="text-xs font-bold text-navy flex items-center justify-between">
                            <span>{{ isEn ? 'Selected Categories' : 'Kategori yang Diikuti' }}</span>
                            <span class="font-black text-navy">{{ formatPriceValue(getArcherTotalFee(athlete)) }}</span>
                        </div>
                        <div v-if="getArcherCategoryIds(athlete).length > 0" class="flex flex-wrap gap-1.5">
                            <span
                                v-for="catId in getArcherCategoryIds(athlete)"
                                :key="catId"
                                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy/5 border border-navy/20 text-navy text-xs font-bold">
                                <Icon icon="ph:check-bold" class="text-xs text-emerald-600" />
                                <span>{{ getCategoryFullName(categories.find(c => c.id === catId)) }}</span>
                            </span>
                        </div>
                        <div v-else class="text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                            <Icon icon="ph:warning-circle-bold" class="text-xs shrink-0" />
                            <span>{{ isEn ? 'No category selected yet' : 'Belum memilih kategori lomba' }}</span>
                        </div>
                    </div>

                    <!-- Dynamic Custom Fields Answers -->
                    <div v-if="customFields && customFields.length > 0" class="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                        <div class="text-xs font-bold text-navy">
                            {{ isEn ? 'Tournament Custom Fields' : 'Formulir Turnamen' }}
                        </div>
                        <div class="space-y-1.5">
                            <div
                                v-for="cf in customFields.filter(f => !['heading', 'divider', 'spacer', 'notice'].includes(f.element_type))"
                                :key="cf.field_key || cf.uuid"
                                class="flex items-center justify-between py-1 border-b border-slate-100 last:border-0 text-xs">
                                <span class="text-slate-500 font-medium">{{ cf.label_id || cf.label_en || cf.field_key }}</span>
                                <span class="font-bold text-navy text-right">
                                    {{ athlete.custom_fields?.[cf.field_key] || athlete.custom_fields?.[cf.uuid] || '-' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Action -->
                <div class="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
                    <button
                        type="button"
                        @click="$emit('close')"
                        class="px-4 py-2 rounded-xl border border-slate-200 text-navy font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer">
                        {{ isEn ? 'Close' : 'Tutup' }}
                    </button>
                    <BaseButton
                        type="button"
                        variant="navy"
                        size="sm"
                        icon="ph:pencil-simple-bold"
                        @click="$emit('edit', athlete)"
                        class="font-bold text-xs">
                        {{ isEn ? 'Edit Athlete Data' : 'Edit Data Atlet' }}
                    </BaseButton>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const props = defineProps({
    athlete: {
        type: Object,
        default: null
    },
    customFields: {
        type: Array,
        default: () => []
    },
    categories: {
        type: Array,
        default: () => []
    },
    delegationClubName: {
        type: String,
        default: ''
    },
    isEn: {
        type: Boolean,
        default: false
    },
    getArcherTotalFee: {
        type: Function,
        default: () => 0
    },
    getArcherCategoryIds: {
        type: Function,
        default: () => []
    },
    getCategoryFullName: {
        type: Function,
        default: () => ''
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

defineEmits(['close', 'edit'])

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
