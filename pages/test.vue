<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center text-white p-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <h1 class="text-4xl font-bold tracking-tight text-blue-400">Deploy Test Page</h1>
      <p class="text-lg text-slate-300">
        If you can see this page, the Nuxt application has been successfully deployed.
      </p>
      <div class="p-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
        <p class="text-sm font-mono text-slate-400">Timestamp: {{ new Date().toLocaleString() }}</p>
        <p class="mt-2 text-green-400 font-semibold">Deployment Status: Verified</p>
      </div>
      <NuxtLink to="/" class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium">
        Back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'blank'
})
</script>
