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
                        <h1 class="text-2xl font-black tracking-tight mb-1 capitalize">{{ t('event_printout.participants.title') }}</h1>
                        <p class="text-slate-300 text-sm">{{ t('event_printout.participants.page_desc') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <!-- Options Group 1 -->
            <div class="space-y-6">
                <div
                    class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm h-full flex flex-col justify-between items-start">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon icon="ph:file-pdf-bold" class="text-2xl text-navy" />
                        </div>
                        <h2 class="text-lg font-black text-navy">{{ t('event_printout.participants.by_alphabet') }}</h2>
                    </div>

                    <p class="text-gray-500 text-sm mb-8 leading-relaxed">{{ t('event_printout.participants.by_alphabet_desc') }}</p>

                    <div class="flex flex-wrap gap-4">
                        <button @click="printList('alphabetical')"
                            class="px-6 py-3 bg-navy text-white rounded-xl font-black text-xs tracking-widest hover:bg-primary transition-colors flex items-center gap-2">
                            <Icon icon="ph:file-pdf-bold" class="text-lg" />
                            {{ t('event_printout.print_pdf') }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Options Group 2 -->
            <div class="space-y-6">
                <div
                    class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm h-full flex flex-col justify-between items-start">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="h-12 w-12 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                            <Icon icon="ph:file-pdf-bold" class="text-2xl text-navy" />
                        </div>
                        <h2 class="text-lg font-black text-navy">{{ t('event_printout.participants.by_club') }}</h2>
                    </div>

                    <p class="text-gray-500 text-sm mb-8 leading-relaxed">{{ t('event_printout.participants.by_club_desc') }}</p>

                    <div class="flex flex-wrap gap-4">
                        <button @click="printList('by-club')"
                            class="px-6 py-3 bg-navy text-white rounded-xl font-black text-xs tracking-widest hover:bg-primary transition-colors flex items-center gap-2">
                            <Icon icon="ph:file-pdf-bold" class="text-lg" />
                            {{ t('event_printout.print_pdf') }}
                        </button>
                    </div>
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
    title: t('event_printout.participants.page_title')
})

const printList = (type, preview = false) => {
    const baseUrl = useRuntimeConfig().public.apiBase || 'http://localhost:8001/api/v1'
    const url = `${baseUrl}/events/${eventId}/participants/printout?type=${type}${preview ? '' : '&autoprint=1'}`
    window.open(url, '_blank')
}
</script>
