<template>
    <div class="flex flex-col gap-2">
        <label v-if="label" class="text-navy text-sm font-semibold">{{ label }}</label>
        <div class="relative">
            <span v-if="icon"
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{{
                icon }}</span>
            <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :type="type"
                :placeholder="placeholder" :required="required" :class="icon ? 'pl-12' : 'px-4'"
                class="form-input w-full rounded-lg text-navy focus:outline-0 focus:ring-2 focus:ring-primary focus:border-primary border border-gray-200 bg-gray-50 h-12 placeholder:text-gray-400 pr-4 text-base transition-all shadow-sm" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    type: { type: String, default: 'text' },
    icon: String,
    required: Boolean
})

defineEmits(['update:modelValue'])
</script>
