<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-navy pt-32 pb-20 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img src="/hero-homepage.jpeg" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
      </div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div>
          <div class="flex items-center gap-2 text-primary text-[10px] sm:text-sm font-bold tracking-wider mb-3">
            <Icon icon="ph:warning-circle" class="text-base sm:text-lg" />
            Legal
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Disclaimer
          </h1>
          <p class="text-slate-300 text-sm md:text-lg leading-relaxed">
            Important information regarding the use of services, tournament scoring, and e-commerce listings on Archeris.
          </p>
          <p class="text-slate-400 text-sm mt-6">
            Last updated: May 24, 2026
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 mb-20 relative z-20">
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
        <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed space-y-6">
          <h3 class="text-lg md:text-xl font-black text-navy dark:text-white mt-8 mb-4">1. Accuracy of Scores and Rankings</h3>
          <p>
            archeris provides digital scoring logs, qualification tables, and elimination bracket maps. all scores are entered directly by the event organizers, appointed scorekeepers, or athletes. we do not physically audit tournament targets or verify arrow entries on site.
          </p>
          <p>
            therefore, we make no warranties regarding the absolute correctness, validity, or authenticity of any scores, statistics, or rankings published on the site. organizers are solely responsible for ensuring scorekeeping integrity.
          </p>

          <h3 class="text-lg md:text-xl font-black text-navy dark:text-white mt-8 mb-4">2. Match Operations and Service Uptime</h3>
          <p>
            while we strive to maintain high availability and real-time synchronization during active tournaments, we do not guarantee uninterrupted access to the platform. internet connectivity issues at target lines, browser malfunctions, or server latency may impact scoring.
          </p>
          <p>
            organizers are strongly advised to maintain paper fallback scorecards at each target board. archeris will not be held liable for match delays, scoring disputes, or tournament scheduling conflicts caused by platform downtime.
          </p>

          <h3 class="text-lg md:text-xl font-black text-navy dark:text-white mt-8 mb-4">3. Payment Processing</h3>
          <p>
            all checkout payments, registrations, and invoices are handled by third-party processor (mayar.id). we do not store full payment credential details. any transaction failures, merchant account freezes, or payout delays are subject to the terms of the payment processor.
          </p>

          <h3 class="text-lg md:text-xl font-black text-navy dark:text-white mt-8 mb-4">4. Consent</h3>
          <p>
            by registering and using the platform, you acknowledge and agree that you access all tournament data and scoring tools at your own risk.
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
  title: 'Disclaimer - Archeris',
  link: [
    { rel: 'canonical', href: useRequestURL().href }
  ]
})

useSeoMeta({
  title: 'Disclaimer - Archeris',
  description: 'Archeris disclaimer regarding tournament score accuracy, match operations, scorekeeping integrity, and payment processing.',
  ogTitle: 'Disclaimer - Archeris',
  ogDescription: 'Archeris disclaimer regarding tournament score accuracy, match operations, scorekeeping integrity, and payment processing.',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useHead({
  title: 'Disclaimer - Archeris',
  link: [
    { rel: 'canonical', href: useRequestURL().href }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://archeris.net/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Disclaimer',
            'item': 'https://archeris.net/disclaimer'
          }
        ]
      })
    }
  ]
})

</script>
