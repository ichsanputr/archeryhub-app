<template>
  <div class="p-6 text-sm text-gray-500">Mengalihkan ke halaman Finance...</div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })
await navigateTo('/dashboard/seller/finance/transactions', { replace: true })
</script>
