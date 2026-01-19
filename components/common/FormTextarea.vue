<template>
    <div class="flex flex-col gap-2">
        <label v-if="label" class="text-navy text-sm font-semibold">{{ label }}</label>
        <textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="placeholder" :required="required"
            class="form-textarea w-full rounded-lg text-navy focus:outline-0 focus:ring-2 focus:ring-primary focus:border-primary border border-gray-200 bg-gray-50 min-h-[140px] placeholder:text-gray-400 p-4 text-base transition-all resize-y shadow-sm"></textarea>
        <div v-if="hint" class="flex justify-end">
            <span class="text-xs text-gray-500 font-medium">{{ hint }}</span>
        </div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: String,
    label: String,
    placeholder: String,
    hint: String,
    required: Boolean
})

defineEmits(['update:modelValue'])
</script>
