<template>
    <div class="min-h-screen flex flex-col">
        <!-- Hero Section -->
        <div class="bg-navy pt-12 pb-16 relative overflow-hidden">
            <div class="absolute inset-0 z-0 opacity-10">
                <div class="absolute right-0 top-0 -mr-20 -mt-20 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20">
                </div>
                <div
                    class="absolute left-0 bottom-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20">
                </div>
            </div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="max-w-3xl">
                    <div class="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider mb-3">
                        <Icon icon="ph:warning" class="text-lg" />
                        Legal
                    </div>
                    <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                        Disclaimer
                    </h1>
                    <p class="text-slate-300 text-lg leading-relaxed max-w-2xl">
                        Informational platform notice and professional disclaimer.
                    </p>
                    <p class="text-slate-400 text-sm mt-6">
                        Last updated: October 24, 2024
                    </p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-8 mb-20 relative z-20">
            <div
                class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
                <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-8">
                    <p class="text-yellow-800 dark:text-yellow-200 font-medium italic">
                        "Archery involves the use of equipment that can be dangerous if mishandled. Archery Hub
                        is an informational platform and is not responsible for any injuries or accidents that
                        occur at listed clubs or events."
                    </p>
                </div>
                <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                    <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">1. General Information</h3>
                    <p class="mb-4">
                        The information provided by Archery Hub Indonesia on this website is for general
                        informational purposes only. All information on the Site is provided in good faith,
                        however we make no representation or warranty of any kind, express or implied, regarding
                        the accuracy, adequacy, validity, reliability, availability or completeness of any
                        information on the Site.
                    </p>
                    <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">2. Professional Disclaimer</h3>
                    <p class="mb-4">
                        The Site cannot and does not contain professional sports advice. The archery information
                        is provided for general informational and educational purposes only and is not a
                        substitute for professional advice. Accordingly, before taking any actions based upon
                        such information, we encourage you to consult with the appropriate professionals.
                    </p>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
definePageMeta({
    layout: 'landing'
})

useHead({
    title: 'Disclaimer - Archeryhub.id'
})
</script>
