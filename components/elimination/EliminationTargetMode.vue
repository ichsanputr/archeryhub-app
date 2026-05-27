<template>
    <div class="space-y-8 pb-32">
        <!-- New Header Style -->
        <div class="flex items-center gap-4 p-6 bg-navy/5 rounded-3xl border border-navy/5">
            <div class="size-12 rounded-2xl bg-navy flex items-center justify-center text-primary shrink-0 shadow-lg">
                <Icon icon="ph:target-bold" class="text-2xl" />
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="text-lg font-black text-navy leading-tight">{{ $t('event_elimination.target_allocation') }}</h3>
                <div class="text-xs text-navy/50 font-medium">{{ $t('event_elimination.target_allocation_desc') }}</div>
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
                class="group bg-white rounded-3xl border-t-4 border-x border-b transition-all duration-500 overflow-hidden flex flex-col"
                :class="[
                    match.winner_entry_id 
                        ? 'border-t-green-500 border-x-navy/10 border-b-navy/10 bg-green-50/5' 
                        : (match.target_name ? 'border-t-primary border-x-navy/10 border-b-navy/10' : 'border-t-navy/20 border-x-navy/10 border-b-navy/10')
                ]">

                <!-- Header: Match Info -->
                <div class="px-6 py-4 bg-navy/5 border-b border-navy/10 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div
                            class="size-8 rounded-xl bg-navy text-white flex items-center justify-center font-black text-xs">
                            {{ match.match_no }}
                        </div>
                        <div>
                            <div class="text-[9px] font-black text-navy/30 tracking-[0.2em] leading-none mb-0.5">
                                {{ $t('event_elimination.match') }}</div>
                            <div class="text-xs font-black text-navy/80 ">Match {{ match.match_no }}</div>
                        </div>
                    </div>

                    <div v-if="match.winner_entry_id"
                        class="size-7 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Icon icon="ph:check-bold" class="text-sm" />
                    </div>
                    <div v-else-if="match.target_name"
                        class="px-2.5 py-0.5 bg-primary/20 rounded-full border border-primary/30">
                        <span class="text-[9px] font-black text-navy tracking-widest ">{{ $t('event_elimination.plotted') }}</span>
                    </div>
                </div>

                <!-- Body: Participants -->
                <div class="p-5 flex-1 space-y-3">
                    <div v-for="side in ['a', 'b']" :key="side"
                        class="flex items-center justify-between p-3 rounded-xl border transition-all" :class="[
                            match[`entry_${side}_name`] 
                                ? 'bg-navy/[0.02] border-navy/10' 
                                : 'bg-navy/[0.01] border-dashed border-navy/5 opacity-60'
                        ]">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="relative shrink-0">
                                <img :src="getAvatarUrl(match[`entry_${side}_name`])"
                                    class="size-9 rounded-xl border-2 border-white object-cover" />
                                <div v-if="match[`entry_${side}_seed`]"
                                    class="absolute -top-1 -left-1 size-4.5 rounded bg-navy text-primary text-[8px] font-black flex items-center justify-center border border-white">
                                    {{ match[`entry_${side}_seed`] }}
                                </div>
                            </div>
                            <div class="min-w-0">
                                <div class="text-[9px] font-black text-navy/40 tracking-wider mb-0.5">
                                    SIDE {{ side.toUpperCase() }}
                                </div>
                                <div class="text-xs font-bold text-navy truncate">
                                    {{ match[`entry_${side}_name`] || (match.is_bye && side === 'b' ? 'BYE' : 'TBD') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer: Target Selection -->
                <div class="p-5 pt-0 mt-auto">
                    <div
                        class="p-2.5 px-4 bg-navy/[0.03] rounded-2xl border border-navy/5 group/sel focus-within:bg-white focus-within:border-primary/50 transition-all">
                        <div class="flex items-center justify-between mb-1">
                            <label class="text-[9px] font-black text-navy/40 tracking-widest block">{{ $t('event_elimination.target_line') }}</label>
                            <span v-if="match.board_code"
                                class="text-[8px] font-black bg-navy text-primary px-1.5 py-0.5 rounded">{{
                                    match.board_code }}</span>
                        </div>
                        <select :value="match.target_id"
                            class="w-full bg-transparent border-none focus:ring-0 text-xs font-black text-navy outline-none py-1 cursor-pointer"
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
