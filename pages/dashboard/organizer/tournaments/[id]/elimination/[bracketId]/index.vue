<script setup>
import EliminationBracketManager from '~/components/elimination/EliminationBracketManager.vue'

useHead({
  title: 'Bagan Eliminasi - Archeris Dashboard'
})

definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <NuxtErrorBoundary>
    <EliminationBracketManager :key="`bracket-${$route.params.id}-${$route.params.bracketId}`" />
    <template #error="{ error, clearError }">
      <div class="bg-white rounded-3xl p-8 border border-red-100 shadow-sm text-center space-y-4 max-w-xl mx-auto my-12">
        <div class="size-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl font-black">
          <Icon icon="ph:warning-circle-bold" />
        </div>
        <h3 class="text-xl font-black text-navy">Gagal Memuat Bagan Eliminasi</h3>
        <div class="text-xs text-slate-500 font-mono bg-slate-50 p-3 rounded-xl break-words text-left">{{ error }}</div>
        <div class="flex gap-3 justify-center pt-2">
          <button @click="clearError()" class="px-6 py-2.5 rounded-xl bg-navy text-primary font-black text-xs hover:bg-slate-900 cursor-pointer">
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>
