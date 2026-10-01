<template>
    <Teleport to="body">
        <div
            v-if="athlete"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in"
            @click.self="$emit('cancel')">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200/90 flex flex-col">
                <!-- Header -->
                <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-red-50/50 shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="size-9 rounded-xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shadow-2xs shrink-0">
                            <Icon icon="ph:trash-bold" class="text-base" />
                        </div>
                        <div>
                            <h3 class="text-sm sm:text-base font-black text-navy leading-snug">
                                {{ isEn ? 'Remove Athlete' : 'Hapus Atlet dari Daftar' }}
                            </h3>
                            <div class="text-xs text-slate-500">
                                {{ isEn ? 'Confirm removing athlete from roster' : 'Konfirmasi hapus atlet dari kontingen' }}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        @click="$emit('cancel')"
                        class="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer shrink-0">
                        <Icon icon="ph:x-bold" class="text-sm" />
                    </button>
                </div>

                <!-- Body -->
                <div class="p-5 space-y-3.5">
                    <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                        <img
                            :src="getImage(athlete.avatar_url, athlete.full_name)"
                            :alt="athlete.full_name"
                            class="size-11 rounded-full object-cover border border-slate-200 shrink-0" />
                        <div class="min-w-0 flex-1">
                            <div class="font-bold text-navy text-sm sm:text-base truncate">{{ athlete.full_name }}</div>
                            <div class="text-xs text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1.5">
                                <Icon icon="ph:shield-bold" class="text-xs text-slate-400 shrink-0" />
                                <span>{{ athlete.club_name || delegationClubName || (isEn ? 'Independent' : 'Independen') }}</span>
                                <span class="text-slate-300">•</span>
                                <span>{{ athlete.gender === 'female' ? (isEn ? 'Female' : 'Putri') : (isEn ? 'Male' : 'Putra') }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="text-xs text-slate-500 leading-relaxed font-medium">
                        {{ isEn 
                            ? 'Are you sure you want to remove this athlete? Any selected category entries for this archer will be discarded.' 
                            : 'Apakah Anda yakin ingin menghapus atlet ini dari daftar? Pilihan kategori pertandingan untuk atlet ini juga akan dihapus.' 
                        }}
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-5 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2.5 shrink-0">
                    <button
                        type="button"
                        @click="$emit('cancel')"
                        class="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer">
                        {{ isEn ? 'Cancel' : 'Batal' }}
                    </button>
                    <button
                        type="button"
                        @click="$emit('confirm')"
                        class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer">
                        <Icon icon="ph:trash-bold" class="text-sm" />
                        <span>{{ isEn ? 'Yes, Remove' : 'Ya, Hapus Atlet' }}</span>
                    </button>
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
    delegationClubName: {
        type: String,
        default: ''
    },
    isEn: {
        type: Boolean,
        default: false
    },
    useImageOrDefault: {
        type: Function,
        default: null
    }
})

defineEmits(['cancel', 'confirm'])

const getImage = (url, name) => {
    if (props.useImageOrDefault) {
        return props.useImageOrDefault(url, name)
    }
    return url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Archer')}&background=0A192F&color=E2F163`
}
</script>
