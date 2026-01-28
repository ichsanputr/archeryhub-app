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
            <Icon icon="ph:shield-check" class="text-lg" />
            Legal
          </div>
          <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Privacy Policy
          </h1>
          <p class="text-slate-300 text-lg leading-relaxed max-w-2xl">
            At Archery Hub Indonesia, we take your privacy seriously.
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
            This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit
            our
            website including any other media form, media channel, mobile website, or mobile
            application related or connected thereto.
          </p>
          <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">1. Collection of Your Information</h3>
          <p class="mb-4">We may collect information about you in a variety of ways. The information
            we may collect on the Site includes:</p>
          <ul class="list-disc pl-6 space-y-2 mb-6 marker:text-primary">
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your
              name, shipping address, email address, and telephone number, and demographic
              information.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when
              you access the Site, such as your IP address, your browser type, your operating
              system, your access times, and the pages you have viewed directly before and after
              accessing the Site.</li>
            <li><strong>Financial Data:</strong> Financial information, such as data related to your
              payment method (e.g. valid credit card number, card brand, expiration date) that we
              may collect when you purchase, order, return, exchange, or request information about
              our services from the Site.</li>
          </ul>
          <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">2. Use of Your Information</h3>
          <p class="mb-4">Having accurate information about you permits us to provide you with a
            smooth, efficient, and customized experience. Specifically, we may use information
            collected about you via the Site to:</p>
          <ol class="list-decimal pl-6 space-y-2 mb-6 marker:text-navy marker:font-bold">
            <li>Create and manage your account.</li>
            <li>Process your subscription to club memberships and tournament registrations.</li>
            <li>Email you regarding your account or order.</li>
            <li>Enable user-to-user communications.</li>
            <li>Fulfill and manage purchases, orders, payments, and other transactions related to
              the Site.</li>
          </ol>
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
  title: 'Privacy Policy - Archeryhub.id'
})
</script>
