<template>
    <div class="flex flex-col gap-1.5 w-full">
        <label v-if="label" class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <div class="relative group">
            <div v-if="icon"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <span class="material-symbols-outlined text-[20px]">{{ icon }}</span>
            </div>

            <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :type="inputType"
                :placeholder="placeholder" :disabled="disabled" class="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-navy text-sm font-medium transition-all
               placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none
               disabled:opacity-50 disabled:cursor-not-allowed" :class="[
                icon ? 'pl-11' : 'pl-4',
                error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
            ]" />

            <button v-if="type === 'password'" type="button" @click="isPasswordVisible = !isPasswordVisible"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors">
                <span class="material-symbols-outlined text-[20px]">
                    {{ isPasswordVisible ? 'visibility_off' : 'visibility' }}
                </span>
            </button>
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
import { ref, computed } from 'vue'

const props = defineProps({
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    type: {
        type: String,
        default: 'text'
    },
    icon: String,
    required: Boolean,
    error: String,
    hint: String,
    disabled: Boolean
})

const emit = defineEmits(['update:modelValue'])

const isPasswordVisible = ref(false)

const inputType = computed(() => {
    if (props.type === 'password') {
        return isPasswordVisible.value ? 'text' : 'password'
    }
    return props.type
})
</script>
