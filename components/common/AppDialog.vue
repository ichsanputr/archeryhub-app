<template>
    <ClientOnly>
        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <!-- Backdrop -->
                    <div @click="handleCancel" class="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm">
                    </div>

                    <!-- Dialog Card -->
                    <Transition
                        enter-active-class="transition duration-300 ease-out"
                        enter-from-class="opacity-0 scale-95 translate-y-4"
                        enter-to-class="opacity-100 scale-100 translate-y-0"
                        leave-active-class="transition duration-200 ease-in"
                        leave-from-class="opacity-100 scale-100 translate-y-0"
                        leave-to-class="opacity-0 scale-95 translate-y-4"
                        appear
                    >
                        <div v-if="show"
                            class="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden border border-gray-100 z-10">
                            <!-- Decorative Border Top -->
                            <div :class="type === 'danger' ? 'bg-red-500' : 'bg-primary'" class="h-1.5 w-full"></div>

                            <div class="p-8">
                                <!-- Icon & Header -->
                                <div class="flex items-start gap-4 mb-6">
                                    <div :class="type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-primary-hover'"
                                        class="p-3 rounded-xl shrink-0">
                                        <Icon
                                            :icon="icon && icon.includes(':') ? icon : (type === 'danger' ? 'ph:warning-circle' : 'ph:info')"
                                            class="text-3xl" />
                                    </div>
                                    <div>
                                        <h3 class="text-navy-dark text-xl font-black tracking-tight mb-2">{{ title }}
                                        </h3>
                                        <p class="text-text-secondary text-sm font-medium leading-relaxed">{{ message
                                        }}</p>
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="flex flex-col sm:flex-row gap-3">
                                    <button @click="handleCancel"
                                        class="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-text-secondary font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
                                        {{ cancelText || t('common.cancel') }}
                                    </button>
                                    <button @click="handleConfirm"
                                        :class="type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white' : 'bg-primary text-btn-text hover:bg-primary-hover shadow-primary/10'"
                                        class="flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg">
                                        {{ confirmText || t('common.confirm') }}
                                    </button>
                                </div>
                            </div>

                            <!-- Background Ornament -->
                            <div class="absolute top-0 right-0 -mr-12 -mt-12 size-32 bg-gray-50 rounded-full -z-10 blur-2xl">
                            </div>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </Teleport>
    </ClientOnly>
</template>


<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
    show: Boolean,
    title: String,
    message: String,
    confirmText: String,
    cancelText: String,
    icon: String,
    type: {
        type: String,
        default: 'primary' // 'primary', 'danger'
    }
})

const emit = defineEmits(['update:show', 'confirm', 'cancel'])

const handleConfirm = () => {
    emit('confirm')
    emit('update:show', false)
}

const handleCancel = () => {
    emit('cancel')
    emit('update:show', false)
}
</script>
