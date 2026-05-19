<template>
    <div class="space-y-8 pb-32">
        <!-- New Header Style -->
        <div class="flex items-center gap-4 p-6 bg-navy/5 rounded-3xl border border-navy/5">
            <div class="size-12 rounded-2xl bg-navy flex items-center justify-center text-primary shrink-0 shadow-lg">
                <Icon icon="ph:target-bold" class="text-2xl" />
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="text-lg font-black text-navy leading-tight">{{ $t('event_elimination.target_allocation') }}</h3>
                <p class="text-xs text-navy/50 font-medium">{{ $t('event_elimination.target_allocation_desc') }}</p>
            </div>
            <BaseButton variant="primary" icon="ph:magic-wand-bold" :loading="isAutoAssigning"
                @click="$emit('auto-assign')" class="hidden sm:flex shadow-sm shadow-primary/20 !rounded-2xl">
                <span class="text-[10px] font-black tracking-widest ">Auto Assign</span>
            </BaseButton>
        </div>

        <!-- Mobile Auto Assign -->
        <div class="sm:hidden">
            <BaseButton variant="primary" icon="ph:magic-wand-bold" :loading="isAutoAssigning"
                @click="$emit('auto-assign')" block class="shadow-xl shadow-primary/20 !rounded-2xl">
                <span class="text-[10px] font-black tracking-widest ">Auto Assign</span>
            </BaseButton>
        </div>

        <!-- Grid Matches -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="match in roundMatches" :key="match.id"
                class="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md hover:shadow-navy/5 transition-all duration-500 overflow-hidden flex flex-col">

                <!-- Header: Match Info -->
                <div class="px-6 py-5 bg-navy/[0.02] border-b border-gray-50 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div
                            class="size-9 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-navy font-black text-xs">
                            {{ match.match_no }}
                        </div>
                        <div>
                            <div class="text-[10px] font-black text-navy/30 tracking-[0.2em] leading-none mb-1">
                                {{ $t('event_elimination.match') }}</div>
                            <div class="text-xs font-black text-navy/80 ">Match {{ match.match_no }}</div>
                        </div>
                    </div>

                    <div v-if="match.winner_entry_id"
                        class="size-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                        <Icon icon="ph:check-circle-fill" class="text-xl" />
                    </div>
                    <div v-else-if="match.target_name"
                        class="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                        <span class="text-[10px] font-black text-primary-hover tracking-widest ">{{ $t('event_elimination.plotted') }}</span>
                    </div>
                </div>

                <!-- Body: Participants -->
                <div class="p-6 flex-1 space-y-4">
                    <div v-for="side in ['a', 'b']" :key="side"
                        class="flex items-center justify-between p-3 rounded-2xl border transition-all" :class="[
                            match[`entry_${side}_name`] ? 'bg-gray-50/50 border-gray-100' : 'bg-slate-50 border-dashed border-gray-200 opacity-60'
                        ]">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="relative shrink-0">
                                <img :src="getAvatarUrl(match[`entry_${side}_name`])"
                                    class="size-10 rounded-xl border-2 border-white shadow-sm object-cover" />
                                <div v-if="match[`entry_${side}_seed`]"
                                    class="absolute -top-1.5 -left-1.5 size-5 rounded-lg bg-navy text-primary text-[8px] font-black flex items-center justify-center shadow-lg border-2 border-white">
                                    {{ match[`entry_${side}_seed`] }}
                                </div>
                            </div>
                            <div class="min-w-0">
                                <p class="text-[10px] font-black text-gray-400 tracking-tighter mb-0.5">
                                    Side {{ side.toUpperCase() }}
                                </p>
                                <p class="text-xs font-black text-navy truncate">
                                    {{ match[`entry_${side}_name`] || (match.is_bye && side === 'b' ? 'BYE' : 'TBD') }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer: Target Selection -->
                <div class="p-6 pt-0 mt-auto">
                    <div
                        class="p-1 px-3 bg-navy/5 rounded-2xl border border-navy/5 group/sel focus-within:bg-white focus-within:border-primary/30 transition-all">
                        <div class="flex items-center justify-between mb-1 mt-1">
                            <label class="text-[9px] font-black text-navy/30 tracking-widest block">{{ $t('event_elimination.target_line') }}</label>
                            <span v-if="match.board_code"
                                class="text-[8px] font-black bg-navy text-primary px-1.5 py-0.5 rounded shadow-sm">{{
                                    match.board_code }}</span>
                        </div>
                        <select :value="match.target_id"
                            class="w-full bg-transparent border-none focus:ring-0 text-sm font-black text-navy outline-none py-1.5 cursor-pointer"
                            @change="e => { match.target_id = e.target.value; $emit('update-target', match) }">
                            <option value="">-- {{ $t('event_elimination.select_target_option') }} --</option>
                            <option v-for="opt in getFilteredOptions(match.id)" :key="opt.id" :value="opt.id">
                                {{ opt.displayName || opt.name }} {{ opt.board_code ? `(${opt.board_code})` : '' }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
    roundMatches: { type: Array, required: true },
    targetOptions: { type: Array, required: true },
    isAutoAssigning: { type: Boolean, default: false }
})

defineEmits(['update-target', 'auto-assign'])

const { t } = useI18n()

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
