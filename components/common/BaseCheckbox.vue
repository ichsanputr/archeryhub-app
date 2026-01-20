<template>
    <div class="flex flex-col gap-1">
        <label class="relative flex items-center gap-3 cursor-pointer group select-none">
            <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)"
                class="peer sr-only" :disabled="disabled" />

            <div class="size-5 rounded-md border-2 border-gray-200 bg-white transition-all 
               peer-checked:bg-primary peer-checked:border-primary
               peer-focus:ring-4 peer-focus:ring-primary/20
               group-hover:border-primary/50
               flex items-center justify-center shrink-0" :class="error ? 'border-red-500' : ''">
                <span
                    class="material-symbols-outlined text-[16px] text-navy font-black scale-0 peer-checked:scale-100 transition-transform">
                    check
                </span>
            </div>

            <span class="text-sm font-semibold text-navy group-hover:text-primary-dark transition-colors">
                <slot>{{ label }}</slot>
            </span>
        </label>

        <p v-if="error" class="text-red-500 text-[11px] font-bold ml-8">
            {{ error }}
        </p>
    </div>
</template>

<script setup>
defineProps({
    modelValue: Boolean,
    label: String,
    error: String,
    disabled: Boolean
})

defineEmits(['update:modelValue'])
</script>
