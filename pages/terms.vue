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
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
        <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed space-y-6">
          <p>
            welcome to archeris. these terms and conditions govern your use of the archeris website (the "service"), including all features for tournament organizers, athletes, and scorekeepers.
          </p>
          <p>
            by registering an account, organizing a tournament, or submitting scores on the site, you agree to be bound by these terms. if you do not agree with any part of these terms, you are prohibited from using the service.
          </p>

          <h3 class="text-lg md:text-xl font-black text-navy dark:text-white mt-8 mb-4">1. Account Types and Responsibilities</h3>
          <p>
            we offer distinct account types with specific capabilities and operational guidelines:
          </p>
          <ul class="list-disc pl-6 space-y-2 marker:text-primary">
            <li><strong>athletes:</strong> responsible for providing accurate profile information (name, gender, age category, bow type) and maintaining sportsmanship.</li>
            <li><strong>organizers:</strong> responsible for configuring tournament details, setting up target assignments, defining qualification/elimination rules, and resolving participant disputes.</li>
            <li><strong>scorekeepers:</strong> appointed by organizers to record arrow points. scorekeepers must enter points honestly and conform to tournament rules.</li>
          </ul>

          <h3 class="text-lg md:text-xl font-black text-navy dark:text-white mt-8 mb-4">2. Subscriptions and Financial Transactions</h3>
          <p>
            organizers require an active subscription to access specific limits (e.g. creating unlimited tournaments, adding scorekeepers, and exporting registration sheets):
          </p>
          <ul class="list-disc pl-6 space-y-2 marker:text-primary">
            <li><strong>plans & billing:</strong> subscriptions and quotas are processed securely via mayar. billing cycles recur monthly, annually, or per-event quota packages.</li>
            <li><strong>expired subscriptions:</strong> if a subscription expires, organizers can still log in, view existing tournament lists, detail pages, and browse sidebar routes. however, form actions to add, edit, or delete event details, categories, targets, or withdraw balances will be locked until the subscription is renewed.</li>
            <li><strong>invoice processing:</strong> entry fee collections from athletes are processed using mayar instant invoices. payouts to organizers are disbursed after deducting administrative commissions.</li>
          </ul>

          <h3 class="text-lg md:text-xl font-black text-navy dark:text-white mt-8 mb-4">3. Scoring Integrity and Tournament Results</h3>
          <p>
            all tournament scores (qualification sets, match eliminations, and bracket outcomes) entered into the service are considered official record logs:
          </p>
          <ol class="list-decimal pl-6 space-y-2 marker:text-navy marker:font-bold">
            <li>organizers must ensure that categories, gender divisions, and age groupings comply with national or international archery standards.</li>
            <li>any attempt to falsify score logs, double-entry points, or manipulate brackets will result in the immediate suspension of the offending accounts and nullification of the event results.</li>
          </ol>

          <h3 class="text-lg md:text-xl font-black text-navy dark:text-white mt-8 mb-4">4. Termination and Limitations</h3>
          <p>
            we reserve the right to suspend or terminate your account at any time, without prior notice, if you violate these terms, act fraudulently, or engage in behavior that compromises the security and accuracy of active tournaments.
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
