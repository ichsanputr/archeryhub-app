<template>
    <div class="flex flex-col gap-1">
        <label class="relative flex items-center gap-3 cursor-pointer group select-none">
            <input type="checkbox" :checked="modelValue" @change="handleChange" :required="required"
                class="peer sr-only" :disabled="disabled" />

            <div class="w-5 h-5 rounded-md border-2 transition-all 
                   peer-focus:ring-4 peer-focus:ring-primary/20
                   peer-focus-visible:outline-none
                   group-hover:border-primary/50
                   flex items-center justify-center shrink-0
                   peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" :class="[
                    modelValue ? 'bg-primary border-primary' : 'bg-white border-gray-200',
                    error ? 'border-red-500' : ''
                ]">
                <svg v-if="modelValue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
                    class="w-3.5 h-3.5 text-white" fill="currentColor">
                    <path
                        d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
                </svg>
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
