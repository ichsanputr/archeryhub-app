<template>
    <div class="fixed top-5 right-5 !z-[99999999] flex flex-col gap-3 pointer-events-none min-w-[320px] max-w-md">
        <TransitionGroup enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform translate-x-full opacity-0" enter-to-class="transform translate-x-0 opacity-100"
            leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform translate-x-full opacity-0">
            <div v-for="toast in toasts" :key="toast.id"
                class="pointer-events-auto flex items-center p-4 rounded-xl shadow-2xl border backdrop-blur-md"
                :class="toastClasses[toast.type]">
                <div class="mr-3 shrink-0">
                    <Icon :icon="icons[toast.type]" class="text-2xl" />
                </div>
                <div class="flex-grow">
                    <p class="text-sm font-bold">{{ toast.message }}</p>
                </div>
                <button @click="removeToast(toast.id)" class="ml-4 p-1 hover:bg-black/5 rounded-full transition-colors">
                    <Icon icon="ph:x" class="text-lg" />
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useToast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()

const toastClasses = {
    success: 'bg-green-50/90 border-green-200 text-green-800',
    error: 'bg-red-50/90 border-red-200 text-red-800',
    warning: 'bg-amber-50/90 border-amber-200 text-amber-800',
    info: 'bg-blue-50/90 border-blue-200 text-blue-800'
}

const icons = {
    success: 'ph:check-circle-fill',
    error: 'ph:warning-circle-fill',
    warning: 'ph:warning-fill',
    info: 'ph:info-fill'
}
</script>
