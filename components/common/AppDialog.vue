<template>
    <Teleport to="body">
        <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div ref="backdrop" @click="handleCancel" class="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm"></div>

            <!-- Dialog Card -->
            <div ref="dialog"
                class="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden border border-gray-100">
                <!-- Decorative Border Top -->
                <div :class="type === 'danger' ? 'bg-red-500' : 'bg-primary'" class="h-1.5 w-full"></div>

                <div class="p-8">
                    <!-- Icon & Header -->
                    <div class="flex items-start gap-4 mb-6">
                        <div :class="type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-primary-hover'"
                            class="p-3 rounded-xl shrink-0">
                            <span class="material-symbols-outlined text-3xl">{{ icon || (type === 'danger' ? 'warning' :
                                'info') }}</span>
                        </div>
                        <div>
                            <h3 class="text-navy-dark text-xl font-black tracking-tight mb-2">{{ title }}</h3>
                            <p class="text-text-secondary text-sm font-medium leading-relaxed">{{ message }}</p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button @click="handleCancel"
                            class="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-text-secondary font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
                            {{ cancelText || 'Batal' }}
                        </button>
                        <button @click="handleConfirm"
                            :class="type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-navy-dark hover:bg-navy-light shadow-navy-dark/10'"
                            class="flex-1 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg">
                            {{ confirmText || 'Ya, Lanjutkan' }}
                        </button>
                    </div>
                </div>

                <!-- Background Ornament -->
                <div class="absolute top-0 right-0 -mr-12 -mt-12 size-32 bg-gray-50 rounded-full -z-10 blur-2xl"></div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { gsap } from 'gsap'

const props = defineProps({
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

const backdrop = ref(null)
const dialog = ref(null)

const handleConfirm = () => {
    emit('confirm')
    close()
}

const handleCancel = () => {
    emit('cancel')
    close()
}

const close = () => {
    if (!backdrop.value || !dialog.value) {
        emit('update:show', false)
        return
    }

    const tl = gsap.timeline({
        onComplete: () => emit('update:show', false)
    })

    tl.to(dialog.value, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in'
    })
    tl.to(backdrop.value, {
        opacity: 0,
        duration: 0.2
    }, '<')
}

watch(() => props.show, (newVal) => {
    if (newVal) {
        nextTick(() => {
            if (!backdrop.value || !dialog.value) return

            gsap.fromTo(backdrop.value,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            )
            gsap.fromTo(dialog.value,
                { opacity: 0, scale: 0.9, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
            )
        })
    }
})

</script>
