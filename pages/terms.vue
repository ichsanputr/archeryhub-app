<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <div class="bg-navy pt-12 pb-16 relative overflow-hidden">
      <div class="absolute inset-0 z-0 opacity-10">
        <div class="absolute right-0 top-0 -mr-20 -mt-20 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20">
        </div>
        <div class="absolute left-0 bottom-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20">
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-3xl">
          <div class="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider mb-3">
            <Icon icon="ph:gavel" class="text-lg" />
            Legal
          </div>
          <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Terms of Service
          </h1>
          <p class="text-slate-300 text-lg leading-relaxed max-w-2xl">
            Please read these Terms of Service carefully before using our platform.
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
        <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p class="mb-6 leading-relaxed">
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using
            the Archery Hub website (the "Service") operated by Archery Hub Indonesia ("us", "we",
            or "our").
          </p>
          <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">1. Acceptance of Terms</h3>
          <p class="mb-4">
            By accessing or using the Service you agree to be bound by these Terms. If you disagree
            with any part of the terms then you may not access the Service.
          </p>
          <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">2. Club Directory & Verification</h3>
          <p class="mb-4">
            Archery Hub provides a directory of archery clubs in Indonesia. While we strive to
            verify clubs, we cannot guarantee the complete accuracy
            of all club details, including training schedules and fees.
          </p>
          <ol class="list-decimal pl-6 space-y-2 mb-6 marker:text-navy marker:font-bold">
            <li><strong>Club Information:</strong> Information about clubs is provided for informational purposes.</li>
            <li><strong>Member Reviews:</strong> Users are responsible for the content of their
              reviews. We reserve the right to remove reviews that violate our community
              guidelines.</li>
            <li><strong>Disputes:</strong> Any disputes between a user and a club found through our
              platform must be resolved directly between the parties. Archery Hub is not liable
              for club operations.</li>
          </ol>
          <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">3. Termination</h3>
          <p class="mb-4">
            We may terminate or suspend access to our Service immediately, without prior notice or
            liability, for any reason whatsoever, including without limitation if you breach the
            Terms.
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
  title: 'Terms of Service - Archeryhub.id'
})
</script>