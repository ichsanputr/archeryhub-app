<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-navy pt-32 pb-20 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img src="/hero-homepage.jpeg" alt="Archeris Terms of Service" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
      </div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div>
          <div class="flex items-center gap-2 text-primary text-[10px] sm:text-sm font-bold tracking-wider mb-3">
            <Icon icon="ph:gavel" class="text-base sm:text-lg" />
            Legal
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Terms & Conditions
          </h1>
          <p class="text-slate-300 text-sm md:text-lg leading-relaxed">
            Please read these Terms and Conditions carefully before using our platform.
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
          <p class="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            Welcome to Archeris. These Terms and Conditions govern your use of the Archeris platform, including all features for tournament organizers, archers, and scorekeepers.
          </p>
          <p class="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            By creating an account, registering for an event, or submitting scores, you agree to these terms.
          </p>

          <h3 class="text-xl sm:text-2xl font-black text-navy dark:text-white pt-4 pb-2 border-b border-slate-100 dark:border-slate-700">1. User Roles and Responsibilities</h3>
          <p class="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            We support three primary user roles with specific guidelines:
          </p>
          <ul class="list-disc pl-6 space-y-2.5 text-base sm:text-lg marker:text-primary">
            <li><strong>Archers:</strong> Responsible for providing accurate personal information (name, gender, age category, bow type) and practicing good sportsmanship.</li>
            <li><strong>Organizers:</strong> Responsible for setting up event details, target assignments, category rules, and resolving participant inquiries fairly.</li>
            <li><strong>Scorekeepers:</strong> Appointed by organizers to record arrow scores honestly and in line with tournament rules.</li>
          </ul>

          <h3 class="text-xl sm:text-2xl font-black text-navy dark:text-white pt-4 pb-2 border-b border-slate-100 dark:border-slate-700">2. Subscriptions and Payments</h3>
          <p class="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            Organizers may choose subscription plans or event packages to unlock additional capabilities (e.g. unlimited events, custom score sheets, and multi-day brackets):
          </p>
          <ul class="list-disc pl-6 space-y-2.5 text-base sm:text-lg marker:text-primary">
            <li><strong>Plans & Invoicing:</strong> Subscriptions and quota packages are billed securely through our payment partner (Mayar).</li>
            <li><strong>Subscription Expiry:</strong> When a subscription ends, organizers can still log in, review past events, and view all records. However, creating or publishing new tournaments requires an active plan.</li>
            <li><strong>Entry Fee Collection:</strong> Registration fees collected from archers are processed securely, with payouts disbursed to organizers after standard processing fees.</li>
          </ul>

          <h3 class="text-xl sm:text-2xl font-black text-navy dark:text-white pt-4 pb-2 border-b border-slate-100 dark:border-slate-700">3. Scoring Integrity and Fair Play</h3>
          <p class="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            All arrow scores, qualification totals, and elimination bracket results entered into Archeris form the official event record:
          </p>
          <ol class="list-decimal pl-6 space-y-2.5 text-base sm:text-lg marker:text-navy marker:font-bold">
            <li>Organizers must ensure competition categories and target distances comply with standard archery rules.</li>
            <li>Any intentional score tampering, falsification, or bracket manipulation will lead to immediate account suspension and cancellation of event results.</li>
          </ol>

          <h3 class="text-xl sm:text-2xl font-black text-navy dark:text-white pt-4 pb-2 border-b border-slate-100 dark:border-slate-700">4. Account Termination</h3>
          <p class="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            We reserve the right to suspend or terminate accounts that violate these terms, attempt fraud, or disrupt scoring operations.
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
  title: 'Terms and Conditions - Archeris',
  link: [
    { rel: 'canonical', href: useRequestURL().href }
  ]
})

useSeoMeta({
  title: 'Terms and Conditions - Archeris',
  description: 'Terms and Conditions for using Archeris archery scoring system, tournament management, and athlete services.',
  ogTitle: 'Terms and Conditions - Archeris',
  ogDescription: 'Terms and Conditions for using Archeris archery scoring system, tournament management, and athlete services.',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useHead({
  title: 'Terms of Service - Archeris',
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
            'name': 'Terms of Service',
            'item': 'https://archeris.net/terms'
          }
        ]
      })
    }
  ]
})

</script>
