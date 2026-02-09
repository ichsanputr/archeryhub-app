<template>
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm relative">
        <div class="p-6 md:p-8">
            <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                <div>
                    <h2 class="text-xl font-black text-navy tracking-tight">Penempatan Target</h2>
                    <p class="text-sm text-gray-500 mt-1">Alokasikan target (bantalan) untuk setiap pertandingan di
                        babak ini</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-32">
                <div v-for="match in roundMatches" :key="match.id"
                    class="bg-gray-50/50 rounded-3xl border border-gray-100 p-6 hover:bg-white hover:shadow-navy/5 transition-all group relative hover:z-20 focus-within:z-50">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-3">
                            <div
                                class="size-10 rounded-2xl bg-navy text-primary flex items-center justify-center text-xs font-black shadow-sm shadow-navy/20">
                                M{{ match.match_no }}
                            </div>
                            <span class="text-[10px] font-black text-gray-400 tracking-widest uppercase">Match
                                Detail</span>
                        </div>
                        <div v-if="match.winner_entry_id"
                            class="size-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                            <Icon icon="ph:check-bold" class="text-xs" />
                        </div>
                    </div>

                    <div class="space-y-3 mb-6">
                        <div
                            class="flex items-center justify-between bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
                            <div class="flex items-center gap-3">
                                <div class="relative shrink-0">
                                    <img :src="getAvatarUrl(match.entry_a_name)"
                                        class="size-9 rounded-full border-2 border-white shadow-sm" />
                                    <div v-if="match.entry_a_seed"
                                        class="absolute -top-1 -left-1 size-5 z-10 rounded-full bg-navy text-primary text-[8px] font-black flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-navy/10">
                                        {{ match.entry_a_seed }}
                                    </div>
                                </div>
                                <div class="min-w-0">
                                    <span class="text-xs font-bold text-navy truncate block">{{ match.entry_a_name ||
                                        (match.is_bye ? 'BYE' : 'TBD') }}</span>
                                </div>
                            </div>
                            <span class="text-[9px] font-black text-gray-300 tracking-tighter shrink-0 ml-2">SIDE
                                A</span>
                        </div>
                        <div
                            class="flex items-center justify-between bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
                            <div class="flex items-center gap-3">
                                <div class="relative shrink-0">
                                    <img :src="getAvatarUrl(match.entry_b_name)"
                                        class="size-9 rounded-full border-2 border-white shadow-sm" />
                                    <div v-if="match.entry_b_seed"
                                        class="absolute -top-1 -left-1 size-5 rounded-full z-10 bg-navy text-primary text-[8px] font-black flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-navy/10">
                                        {{ match.entry_b_seed }}
                                    </div>
                                </div>
                                <div class="min-w-0">
                                    <span class="text-xs font-bold text-navy truncate block">{{ match.entry_b_name ||
                                        'TBD'
                                    }}</span>
                                </div>
                            </div>
                            <span class="text-[9px] font-black text-gray-300 tracking-tighter shrink-0 ml-2">SIDE
                                B</span>
                        </div>
                    </div>

                    <div>
                        <label
                            class="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-2 block ml-1">Alokasi
                            Target</label>
                        <div class="group/select">
                            <BaseSelect :model-value="match.target_id" :items="getFilteredOptions(match.id)"
                                item-title="displayName" item-value="id" placeholder="-- Pilih Target --"
                                @update:modelValue="val => { match.target_id = val; $emit('update-target', match) }" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    roundMatches: { type: Array, required: true },
    targetOptions: { type: Array, required: true }
})

defineEmits(['update-target'])

const getFilteredOptions = (currentMatchId) => {
    // Get all assigned target IDs except for the current match
    const assignedIds = props.roundMatches
        .filter(m => m.id !== currentMatchId && m.target_id)
        .map(m => m.target_id)

    // Remove targets that are already assigned to other matches
    return props.targetOptions.filter(option => !assignedIds.includes(option.id))
}

const getAvatarUrl = (name) => {
    if (!name) return `https://ui-avatars.com/api/?name=TBD&background=f1f5f9&color=94a3b8&font-size=0.45`
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&font-size=0.45`
}
</script>
