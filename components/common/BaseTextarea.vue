<template>
    <div class="flex flex-col gap-1.5 w-full">
        <label v-if="label" class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <div class="relative group">
            <div v-if="icon"
                class="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors">
                <Icon :icon="icon.includes(':') ? icon : `material-symbols:${icon}`" class="text-[20px]" />
            </div>

            <textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                :placeholder="placeholder" :disabled="disabled" :rows="rows" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-navy text-sm font-medium transition-all
               placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none
               disabled:opacity-50 disabled:cursor-not-allowed resize-y" :class="[
                icon ? 'pl-11' : 'pl-4',
                error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
            ]" />
        </div>

        <p v-if="error" class="text-red-500 text-[11px] font-bold ml-1 animate-in fade-in slide-in-from-top-1">
            {{ error }}
        </p>
        <p v-else-if="hint" class="text-gray-400 text-[11px] ml-1">
            {{ hint }}
        </p>
    </div>
</template>

<script setup>


const props = defineProps({
    modelValue: String,
    label: String,
    placeholder: String,
    icon: String,
    required: Boolean,
    error: String,
    hint: String,
    disabled: Boolean,
    rows: {
        type: Number,
        default: 4
    }
})

const emit = defineEmits(['update:modelValue'])
</script>
