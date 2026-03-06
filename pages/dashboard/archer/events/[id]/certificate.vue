<template>
    <div class="flex flex-col gap-8 pb-16">
        <!-- Breadcrumbs & Header Actions -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <nav class="flex text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 items-center gap-2">
                    <NuxtLink :to="`/dashboard/events/${eventId}`" class="hover:text-primary transition-colors">Event
                    </NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                    <span class="text-slate-600 dark:text-slate-300">Sertifikat</span>
                </nav>
                <div class="flex items-center gap-4">
                    <button @click="handleBack"
                        class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-all text-navy dark:text-white">
                        <Icon icon="ph:arrow-left-bold" />
                    </button>
                    <h2 class="text-3xl font-black text-navy dark:text-white tracking-tight">E-Sertifikat</h2>
                </div>
            </div>
        </div>

        <div
            class="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-xl p-12 text-center max-w-4xl mx-auto w-full">
            <div class="size-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
                <Icon icon="ph:certificate-bold" class="text-5xl" />
            </div>
            <h3 class="text-2xl font-black text-navy dark:text-white mb-4">Sertifikat Belum Tersedia</h3>
            <p class="text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-md mx-auto mb-10">
                Sertifikat elektronik akan diterbitkan secara otomatis setelah turnamen resmi berakhir dan semua hasil
                telah divalidasi oleh panitia.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm mx-auto">
                <div
                    class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <p class="text-sm font-bold text-navy dark:text-white">Dalam Proses</p>
                </div>
                <div
                    class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tipe</p>
                    <p class="text-sm font-bold text-navy dark:text-white">E-Certificate</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const router = useRouter()
const route = useRoute()
const eventId = route.params.id

definePageMeta({
    layout: 'dashboard'
})

const handleBack = () => router.back()
</script>
