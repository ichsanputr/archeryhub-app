<template>
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-500 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="loading"
            class="fixed inset-0 z-[10000] bg-navy flex flex-col items-center justify-center overflow-hidden">
            <!-- Decorative background -->
            <div class="absolute inset-0 opacity-10"
                style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(217, 255, 0, 0.1) 10px, rgba(217, 255, 0, 0.1) 20px);">
            </div>

            <div class="absolute h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] -top-48 -left-48"></div>
            <div class="absolute h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] -bottom-48 -right-48"></div>

            <!-- Main Content -->
            <div class="relative flex flex-col items-center">
                <!-- Animated Logo Container -->
                <div class="relative mb-8">
                    <div class="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
                    <div
                        class="relative size-24 sm:size-32 bg-navy rounded-[32px] border-2 border-primary/30 flex items-center justify-center shadow-2xl overflow-hidden group">
                        <img src="/logo.png" alt="Archeris" class="w-16 h-16 sm:w-20 sm:h-20 object-contain" />

                        <!-- Scanning Line Effect -->
                        <div
                            class="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_rgba(217,255,0,0.8)] animate-scan">
                        </div>
                    </div>
                </div>

                <!-- Text and Progress -->
                <div class="text-center space-y-4">
                    <div class="flex flex-col gap-1">
                        <h2 class="text-white text-2xl font-black tracking-[0.2em] uppercase">Archeris</h2>
                        <p class="text-primary/60 text-[10px] font-bold tracking-[0.4em]">Menyiapkan Aplikasi
                        </p>
                    </div>

                    <!-- Custom Loading Bar -->
                    <div class="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
                        <div
                            class="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_#D9FF00] animate-loading-bar">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
@keyframes scan {
    0% {
        top: -10%;
        opacity: 0;
    }

    20% {
        opacity: 1;
    }

    80% {
        opacity: 1;
    }

    100% {
        top: 110%;
        opacity: 0;
    }
}

@keyframes loading-bar {
    0% {
        width: 0%;
        left: 0%;
    }

    50% {
        width: 40%;
    }

    100% {
        width: 0%;
        left: 100%;
    }
}

.animate-scan {
    animation: scan 2s linear infinite;
}

.animate-loading-bar {
    animation: loading-bar 1.5s ease-in-out infinite;
}

.bg-navy {
    background-color: #0f172a;
}

.text-primary {
    color: #D9FF00;
}

.bg-primary {
    background-color: #D9FF00;
}

.border-primary\/30 {
    border-color: rgba(217, 255, 0, 0.3);
}

.bg-primary\/5 {
    background-color: rgba(217, 255, 0, 0.05);
}

.bg-primary\/20 {
    background-color: rgba(217, 255, 0, 0.2);
}
</style>
