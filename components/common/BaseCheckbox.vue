<template>
    <div class="flex flex-col gap-1">
        <label class="relative flex items-center gap-3 cursor-pointer group select-none">
            <input 
                type="checkbox" 
                :checked="modelValue" 
                @change="handleChange"
                :required="required"
                class="peer sr-only" 
                :disabled="disabled" 
            />

            <div 
                class="w-5 h-5 rounded-md border-2 transition-all 
                   peer-focus:ring-4 peer-focus:ring-primary/20
                   peer-focus-visible:outline-none
                   group-hover:border-primary/50
                   flex items-center justify-center shrink-0
                   peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" 
                :class="[
                    modelValue ? 'bg-primary border-primary' : 'bg-white border-gray-200',
                    error ? 'border-red-500' : ''
                ]"
            >
                <Icon 
                    v-if="modelValue"
                    icon="ph:check-bold"
                    class="text-sm text-white font-black" 
                    style="font-size: 14px;"
                />
            </div>

            <span class="text-sm font-semibold text-navy group-hover:text-primary-dark transition-colors flex-1">
                <slot>{{ label }}</slot>
            </span>
        </label>

        <p v-if="error" class="text-red-500 text-[11px] font-bold ml-8">
            {{ error }}
        </p>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    label: String,
    error: String,
    disabled: Boolean,
    required: Boolean
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (event) => {
    emit('update:modelValue', event.target.checked)
}
</script>
