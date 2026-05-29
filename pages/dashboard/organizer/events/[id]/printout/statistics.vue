<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <div class="relative p-6 sm:p-8">
                <div class="flex items-center gap-4">
                    <NuxtLink :to="`/dashboard/organizer/events/${eventId}/printout`"
                        class="h-10 w-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                        <Icon icon="ph:arrow-left" class="text-xl" />
                    </NuxtLink>
                    <div>
                        <h1 class="text-2xl font-black tracking-tight mb-1 capitalize">{{ t('event_printout.statistics.title') }}</h1>
                        <p class="text-slate-300 text-sm">{{ t('event_printout.statistics.page_desc') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <!-- Classes and Divisions Stats Card -->
            <div
                class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:border-primary/40 transition-all flex flex-col">
                <div class="flex items-center gap-4 mb-6">
                    <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon icon="ph:chart-bar-bold" class="text-2xl text-navy" />
                    </div>
                    <h2 class="text-lg font-black text-navy">{{ t('event_printout.statistics.classes_title') }}</h2>
                </div>

                <p class="text-gray-500 text-sm mb-8 leading-relaxed flex-1">{{ t('event_printout.statistics.classes_desc') }}</p>

                <div class="flex flex-wrap gap-4 mt-auto">
                    <button @click="printStat('classes')"
                        class="px-6 py-3 bg-navy text-white rounded-xl font-black text-xs tracking-widest hover:bg-primary transition-colors flex items-center gap-2">
                        <Icon icon="ph:file-pdf-bold" class="text-lg" />
                        {{ t('event_printout.print_pdf') }}
                    </button>
                </div>
            </div>

            <!-- Club Stats Card -->
            <div
                class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:border-primary/40 transition-all flex flex-col">
                <div class="flex items-center gap-4 mb-6">
                    <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon icon="ph:castle-turret-bold" class="text-2xl text-navy" />
                    </div>
                    <h2 class="text-lg font-black text-navy">{{ t('event_printout.statistics.clubs_title') }}</h2>
                </div>

                <p class="text-gray-500 text-sm mb-8 leading-relaxed flex-1">{{ t('event_printout.statistics.clubs_desc') }}</p>

                <div class="flex flex-wrap gap-4 mt-auto">
                    <button @click="printStat('clubs')"
                        class="px-6 py-3 bg-navy text-white rounded-xl font-black text-xs tracking-widest hover:bg-primary transition-colors flex items-center gap-2">
                        <Icon icon="ph:file-pdf-bold" class="text-lg" />
                        {{ t('event_printout.print_pdf') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const eventId = route.params.id

definePageMeta({
    layout: 'dashboard'
})

const { t } = useI18n()

useHead({
    title: t('event_printout.statistics.page_title')
})

const printStat = (type) => {
    const baseUrl = useRuntimeConfig().public.apiBase || 'http://localhost:8001/api/v1'
    const url = `${baseUrl}/events/${eventId}/participants/statistics-${type}`
    window.open(url, '_blank')
}
</script>
