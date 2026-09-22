<script setup>
const route = useRoute()
const eventId = route.params.id
const bracketId = route.params.bracketId
const round = route.params.round
const mode = route.query.mode || 'scoring'

// Seamlessly redirect slash-number route to clean single-page query param path
await navigateTo({
  path: `/dashboard/organizer/tournaments/${eventId}/elimination/${bracketId}`,
  query: {
    round: String(round),
    mode: String(mode)
  }
}, { replace: true })
</script>

<template>
  <div class="p-8 text-center text-slate-400 font-bold text-sm animate-pulse">
    Mengalihkan ke halaman eliminasi...
  </div>
</template>
