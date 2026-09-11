<script setup>
import EliminationBracketManager from '~/components/elimination/EliminationBracketManager.vue'

useHead({
  title: 'Babak Eliminasi - Archeris Dashboard'
})

definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <EliminationBracketManager />
</template>
