<template>
    <label class="base-checkbox" :class="{ 'base-checkbox--disabled': disabled }">
        <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)"
            :disabled="disabled" class="base-checkbox__input" />
        <span class="base-checkbox__box">
            <Icon v-if="modelValue" icon="ph:check-bold" class="base-checkbox__icon" />
        </span>
        <span v-if="label || $slots.default" class="base-checkbox__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.base-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    user-select: none;
}

.base-checkbox--disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.base-checkbox__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.base-checkbox__box {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 0.375rem;
    border: 2px solid #d1d5db;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    flex-shrink: 0;
}

.base-checkbox__input:checked+.base-checkbox__box {
    background: #0f172a;
    border-color: #0f172a;
}

.base-checkbox__input:focus+.base-checkbox__box {
    box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.2);
    border-color: #0f172a;
}

.base-checkbox__icon {
    font-size: 0.75rem;
    color: white;
}

.base-checkbox__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #0f172a;
}

.base-checkbox--disabled .base-checkbox__label {
    color: #9ca3af;
}
</style>
