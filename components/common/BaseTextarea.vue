<template>
    <div class="flex flex-col gap-1.5 w-full">
        <label v-if="label" class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <div class="relative group">
            <textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                :placeholder="placeholder" :disabled="disabled" :rows="rows" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-navy text-sm font-medium transition-all
               placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none
               resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                :class="error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''"></textarea>
        </div>

        <p v-if="error" class="text-red-500 text-[11px] font-bold ml-1">
            {{ error }}
        </p>
        <p v-else-if="hint" class="text-gray-400 text-[11px] ml-1">
            {{ hint }}
        </p>
    </div>
</template>

<script setup>
defineProps({
    modelValue: String,
    label: String,
    placeholder: String,
    required: Boolean,
    error: String,
    hint: String,
    disabled: Boolean,
    rows: {
        type: [Number, String],
        default: 4
    }
})

defineEmits(['update:modelValue'])
</script>
