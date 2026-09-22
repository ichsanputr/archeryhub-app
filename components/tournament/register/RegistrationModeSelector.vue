<template>
    <div class="p-4 sm:p-5 bg-gradient-to-r from-slate-50/70 to-white border-b border-slate-100">
        <div class="bg-slate-100/90 p-1.5 rounded-2xl flex gap-2 border border-slate-200/80">
            <!-- Mode 1: Individual / Team -->
            <button
                type="button"
                @click="selectMode('captain_team')"
                :class="modelValue !== 'club_delegation'
                    ? 'bg-white text-navy font-black shadow-xs ring-1 ring-slate-200/80'
                    : 'text-slate-600 hover:text-navy font-bold'"
                class="flex-1 py-3 px-3 sm:px-5 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 cursor-pointer">
                <div class="size-8 rounded-lg flex items-center justify-center transition-colors"
                    :class="modelValue !== 'captain_team' ? 'bg-navy text-primary shadow-xs' : 'bg-slate-200 text-slate-600'">
                    <Icon icon="ph:user-bold" class="text-sm sm:text-base" />
                </div>
                <span class="truncate">Self & Teammates</span>
            </button>

            <!-- Mode 2: Representative -->
            <button
                type="button"
                @click="selectMode('club_delegation')"
                :class="modelValue === 'club_delegation'
                    ? 'bg-white text-navy font-black shadow-xs ring-1 ring-slate-200/80'
                    : 'text-slate-600 hover:text-navy font-bold'"
                class="flex-1 py-3 px-3 sm:px-5 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 cursor-pointer">
                <div class="size-8 rounded-lg flex items-center justify-center transition-colors"
                    :class="modelValue === 'club_delegation' ? 'bg-navy text-primary shadow-xs' : 'bg-slate-200 text-slate-600'">
                    <Icon icon="ph:users-three-bold" class="text-sm sm:text-base" />
                </div>
                <span class="truncate">Club Representative</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: 'captain_team'
    }
})

const emit = defineEmits(['update:modelValue'])

const selectMode = (mode) => {
    emit('update:modelValue', mode)
}
</script>
