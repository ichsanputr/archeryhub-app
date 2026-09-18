<template>
    <Teleport to="body">
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modelValue"
                class="fixed inset-0 z-[200] flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4"
                @click.self="handleClose">
                <Transition enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 scale-95 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-95 translate-y-4">
                    <div v-if="modelValue"
                        class="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl mx-auto relative flex flex-col overflow-hidden"
                        style="max-height: 90vh;">
                        <!-- Header -->
                        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0 bg-white">
                            <h2 class="text-lg sm:text-xl font-black text-navy tracking-tight">
                                <slot name="header">{{ header }}</slot>
                            </h2>
                            <button @click="handleClose"
                                class="size-8 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors flex items-center justify-center shrink-0">
                                <Icon icon="ph:x-bold" class="text-base" />
                            </button>
                        </div>

                        <!-- Scrollable Content -->
                        <div class="flex-1 overflow-y-auto px-6 py-6 relative" style="max-height: calc(90vh - 140px);">
                            <slot></slot>
                        </div>

                        <!-- Footer Actions -->
                        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
                            <slot name="action">
                                <BaseButton variant="white" @click="handleClose">{{ t('common.cancel') }}</BaseButton>
                            </slot>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    header: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'close'])

const handleClose = () => {
    emit('update:modelValue', false)
    emit('close')
}
</script>

<style scoped>
/* Custom scrollbar for the content area */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>
