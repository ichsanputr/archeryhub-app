<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="flex flex-col items-center gap-3">
      <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin" />
      <div class="text-slate-500 font-bold text-sm">Mengalihkan ke detail pembayaran...</div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

definePageMeta({
  middleware: [
    (to) => {
      const reference = to.params.reference
      if (reference) {
        return navigateTo(`/dashboard/archer/payments/${reference}`, { replace: true })
      }
      return navigateTo('/dashboard/archer/payments', { replace: true })
    }
  ]
})

const route = useRoute()
const reference = route.params.reference

onMounted(() => {
  if (reference) {
    navigateTo(`/dashboard/archer/payments/${reference}`, { replace: true })
  } else {
    navigateTo('/dashboard/archer/payments', { replace: true })
  }
})
</script>
