<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-navy pt-32 pb-20 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img src="/hero-homepage.jpeg" alt="Archeris Legal Disclaimer" class="w-full h-full object-cover" />
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
        class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-14">
        <div class="space-y-8 text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-relaxed">
          <h3 class="text-xl sm:text-2xl font-black text-navy dark:text-white pt-4 pb-2 border-b border-slate-100 dark:border-slate-700">1. Scoring and Ranking Accuracy</h3>
          <p class="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            Archeris provides tools for live mobile scoring, qualification tables, and elimination brackets. All scores, arrow points, and rankings are recorded directly by event organizers, appointed scorekeepers, or archers.
          </p>
          <p class="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            While Archeris provides reliable software, tournament organizers are responsible for verifying on-field arrow values and resolving scoring disputes in accordance with official competition rules.
          </p>

          <h3 class="text-xl sm:text-2xl font-black text-navy dark:text-white pt-4 pb-2 border-b border-slate-100 dark:border-slate-700">2. Match Operations and Internet Reliability</h3>
          <p class="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            We strive to maintain continuous availability and real-time syncing during events. However, outdoor archery venues may experience cellular or Wi-Fi interruptions.
          </p>
          <p class="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            Tournament organizers are advised to follow standard practice and keep paper backup scorecards at target lines during critical matches. Archeris is not liable for match delays caused by third-party network or hardware failures.
          </p>

          <h3 class="text-xl sm:text-2xl font-black text-navy dark:text-white pt-4 pb-2 border-b border-slate-100 dark:border-slate-700">3. Payment Processing</h3>
          <p class="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            All payment transactions, entry fee checkouts, and organizer payouts are handled by certified third-party payment gateways (such as Mayar). Any payment processor outages, banking settlement delays, or charge disputes are subject to the terms of the payment provider.
          </p>

          <h3 class="text-xl sm:text-2xl font-black text-navy dark:text-white pt-4 pb-2 border-b border-slate-100 dark:border-slate-700">4. Agreement</h3>
          <p class="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            By using Archeris, you acknowledge that you understand and agree to these terms.
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
