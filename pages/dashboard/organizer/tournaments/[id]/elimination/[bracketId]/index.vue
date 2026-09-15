<script setup>
import { defineAsyncComponent } from 'vue'
const EliminationBracketManager = defineAsyncComponent(() => import('~/components/elimination/EliminationBracketManager.vue'))

useHead({
  title: 'Bagan Eliminasi - Archeris Dashboard'
})

definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <EliminationBracketManager />
</template>
